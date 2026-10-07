#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""把爱发电上的赞助者抓下来，写回 assets/js/config.js 里的 donate.sponsors。

数据来源（自动选择，优先官方）：

  1. 官方开放接口 —— 需要凭据（爱发电创作者中心 → 开发者 → API 里生成）。
     凭据写在 tools/afdian.local.json 里，或者设成环境变量
     AFDIAN_USER_ID 和 AFDIAN_TOKEN 也行。
     能拿到累计金额，连在页面上隐藏了赞助记录的人也算得进去。

  2. 公开页面接口 —— 不需要任何配置，按月份遍历爱发电的「感谢名单」。
     名字能拿全（含历史），但拿不到金额。

用法：

    python tools/afdian_sponsors.py                # 抓取并写回 config.js
    python tools/afdian_sponsors.py --dry-run      # 只打印，不改文件
    python tools/afdian_sponsors.py --verbose      # 打印每个月的扫描情况
    python tools/afdian_sponsors.py --auto-top 3   # 顺便把赞助榜前 3 名标成金色
    python tools/afdian_sponsors.py --slug other   # 临时换一个爱发电主页

想给谁加金色高亮，直接在 config.js 里给他加 top: true —— 脚本下次更新会保留。

安全阀：抓不到人、或者一次要删掉超过 --max-drop 位（默认 3 位）赞助者时，
只报错不写文件 —— 赞助者正常只增不减，掉太多基本是接口没抓全。
"""

import argparse
import hashlib
import json
import os
import re
import sys
import time
import urllib.parse
import urllib.request
from collections import OrderedDict
from datetime import datetime, timedelta, timezone

BASE = "https://afdian.com"
UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
)
TZ = timezone(timedelta(hours=8))  # 爱发电按北京时间分月
CONFIG_REL = os.path.join("assets", "js", "config.js")
REQUEST_GAP = 0.25  # 每次请求之间歇一下，别把人家接口打疼了


def _make_stdout_safe():
    """Windows 控制台默认是 GBK，碰到编不出来的字会直接抛异常，这里退化成替换。

    故意不改编码：GBK 本来就能显示中文，改成 UTF-8 反而会在老控制台里乱码。
    """
    for stream in (sys.stdout, sys.stderr):
        try:
            stream.reconfigure(errors="replace")
        except Exception:  # noqa: BLE001 - 老版本 Python 或被重定向时忽略
            pass


_make_stdout_safe()


# ---------------------------------------------------------------- 网络

def _request(url, data=None, timeout=25, retries=3):
    """发一个请求并把响应当 JSON 解析，失败重试几次。"""
    last = None
    for attempt in range(1, retries + 1):
        try:
            req = urllib.request.Request(url, data=data)
            req.add_header("User-Agent", UA)
            req.add_header("Accept", "application/json, text/plain, */*")
            req.add_header("Referer", BASE + "/")
            if data is not None:
                req.add_header("Content-Type", "application/x-www-form-urlencoded")
            with urllib.request.urlopen(req, timeout=timeout) as resp:
                raw = resp.read()
            return json.loads(raw.decode("utf-8"))
        except Exception as exc:  # noqa: BLE001 - 网络问题一律重试
            last = exc
            if attempt < retries:
                time.sleep(1.5 * attempt)
    raise RuntimeError("请求失败 %s：%s" % (url, last))


def api_get(path, params):
    url = BASE + path + "?" + urllib.parse.urlencode(params)
    return _request(url)


def open_api_post(path, user_id, token, params_dict):
    """爱发电开放接口：params 是 JSON 串，sign = md5(token+params+ts+user_id)。"""
    params = json.dumps(params_dict, ensure_ascii=False, separators=(",", ":"))
    ts = int(time.time())
    sign = hashlib.md5(
        (token + "params" + params + "ts" + str(ts) + "user_id" + user_id).encode("utf-8")
    ).hexdigest()
    body = urllib.parse.urlencode(
        {"user_id": user_id, "params": params, "ts": ts, "sign": sign}
    ).encode("utf-8")
    return _request(BASE + path, data=body)


# ---------------------------------------------------------------- 抓取

def beijing_month(ts):
    dt = datetime.fromtimestamp(int(ts), TZ)
    return dt.year, dt.month


def month_iter(start, end):
    y, m = start
    while (y, m) <= end:
        yield y, m
        m += 1
        if m > 12:
            y, m = y + 1, 1


def add_sponsor(bucket, user):
    """把一个赞助者塞进有序字典，同一人只留第一次出现的名字。"""
    if not isinstance(user, dict):
        return False
    name = (user.get("name") or "").strip()
    if not name:
        return False
    uid = user.get("user_id") or name
    if uid in bucket:
        return False
    bucket[uid] = {"name": name, "amount": None}
    return True


def fetch_profile(slug):
    res = api_get("/api/user/get-profile-by-slug", {"url_slug": slug})
    if res.get("ec") != 200:
        raise RuntimeError("查主页失败：ec=%s em=%s" % (res.get("ec"), res.get("em")))
    user = (res.get("data") or {}).get("user") or {}
    creator = user.get("creator") or {}  # 创作者信息嵌在 user 里面
    if not user.get("user_id"):
        raise RuntimeError("没拿到 user_id，slug 是不是写错了？")
    return user, creator


def _as_int(value):
    try:
        return int(value)
    except (TypeError, ValueError):
        return 0


def fetch_open_api(user_id, token, verbose=False):
    """官方开放接口：一次拿全，还带累计金额和首次赞助时间。"""
    found = {}
    page = 1
    while True:
        res = open_api_post("/api/open/query-sponsor", user_id, token, {"page": page})
        if res.get("ec") != 200:
            raise RuntimeError("官方接口返回 ec=%s em=%s" % (res.get("ec"), res.get("em")))
        data = res.get("data") or {}
        for item in data.get("list") or []:
            user = item.get("user") or {}
            name = (user.get("name") or "").strip()
            if not name:
                continue
            uid = user.get("user_id") or name
            found.setdefault(uid, {
                "name": name,
                "amount": item.get("all_sum_amount"),
                "first": _as_int(item.get("first_pay_time")),
            })
        total_page = int(data.get("total_page") or 1)
        if verbose:
            print("  官方接口 第 %d/%d 页，累计 %d 人" % (page, total_page, len(found)), flush=True)
        if page >= total_page or page >= 200:
            break
        page += 1
        time.sleep(REQUEST_GAP)

    # 接口按「最近赞助」倒序给，这里改成按首次赞助时间从早到晚 ——
    # 顺序稳定（谁再赞助一次不会跳到最前面），语义也和公开接口那套一致。
    bucket = OrderedDict()
    for uid, info in sorted(found.items(), key=lambda kv: (kv[1]["first"], kv[1]["name"])):
        bucket[uid] = info
    return bucket


def fetch_public(user_id, create_time, verbose=False):
    """公开接口：从创作者注册那个月一路扫到今天。"""
    end = beijing_month(time.time())
    if create_time:
        start = beijing_month(create_time)
    else:
        start = (end[0] - 3, end[1])
        print("  没拿到注册时间，就从 3 年前开始扫。")
    if start > end:
        start = end

    months = list(month_iter(start, end))
    print(
        "  扫描感谢名单 %04d-%02d ~ %04d-%02d，共 %d 个月…"
        % (start[0], start[1], end[0], end[1], len(months))
    )

    bucket = OrderedDict()
    for idx, (y, m) in enumerate(months, 1):
        month_names = []
        page = 1
        while True:
            res = api_get(
                "/api/creator/get-thank-sponsors",
                {"user_id": user_id, "year": y, "month": m, "page": page},
            )
            data = res.get("data") or {}
            for user in data.get("list") or []:
                name = (user.get("name") or "").strip() if isinstance(user, dict) else ""
                if name and name not in month_names:
                    month_names.append(name)
                add_sponsor(bucket, user)
            if not data.get("has_more") or page >= 100:
                break
            page += 1
            time.sleep(REQUEST_GAP)
        if verbose:
            print(
                "  [%2d/%2d] %04d-%02d  本月 %2d 人，累计 %d 人"
                % (idx, len(months), y, m, len(month_names), len(bucket)),
                flush=True,
            )
        time.sleep(REQUEST_GAP)

    # 赞助榜也并进来，偶尔有人只出现在榜上
    rank = fetch_top_sponsors(user_id, bucket)
    return bucket, rank


def fetch_top_sponsors(user_id, bucket=None):
    """公开的「赞助榜」，最多 10 个人，按金额排序。返回名字列表。"""
    res = api_get("/api/creator/get-top-sponsors", {"user_id": user_id})
    rank = []
    for user in (res.get("data") or {}).get("list") or []:
        name = (user.get("name") or "").strip()
        if name:
            rank.append(name)
        if bucket is not None:
            add_sponsor(bucket, user)
    return rank


# ---------------------------------------------------------------- config.js

def find_sponsors_array(text):
    """返回 config.js 里 sponsors 数组的 [ 和 ] 下标（会跳过字符串和注释）。"""
    m = re.search(r"\bsponsors\s*:\s*\[", text)
    if not m:
        raise SystemExit("在 %s 里找不到 sponsors: [...]" % CONFIG_REL)
    start = text.index("[", m.start())
    depth = 0
    i = start
    quote = None
    while i < len(text):
        ch = text[i]
        if quote:
            if ch == "\\":
                i += 2
                continue
            if ch == quote:
                quote = None
        elif ch in "\"'`":
            quote = ch
        elif ch == "/" and text[i + 1:i + 2] == "/":
            nl = text.find("\n", i)
            if nl < 0:
                break
            i = nl
        elif ch == "/" and text[i + 1:i + 2] == "*":
            end_c = text.find("*/", i + 2)
            if end_c < 0:
                break
            i = end_c + 1
        elif ch in "[{":
            depth += 1
        elif ch in "]}":
            depth -= 1
            if depth == 0:
                return start, i
        i += 1
    raise SystemExit("config.js 里 sponsors 数组的括号不配对")


def parse_entries(array_text):
    """把现有数组里每个人读出来，用来保留手工标的 top。"""
    entries = []
    for block in re.findall(r"\{[^{}]*\}", array_text):
        m = re.search(r'name\s*:\s*("(?:[^"\\]|\\.)*")', block)
        if not m:
            continue
        try:
            name = json.loads(m.group(1))
        except ValueError:
            continue
        entries.append((name, bool(re.search(r"top\s*:\s*true", block))))
    return entries


def render_array(items, indent):
    lines = ["["]
    lines.append(indent + "  // 这份名单由 tools/afdian_sponsors.py 自动生成，手改的名字会被覆盖。")
    lines.append(indent + "  // 想让谁金色高亮，就在他后面加 top: true —— 这一项脚本会保留。")
    for name, top in items:
        tail = ", top: true" if top else ""
        lines.append(indent + "  { name: %s%s }," % (json.dumps(name, ensure_ascii=False), tail))
    if items:
        lines[-1] = lines[-1].rstrip(",")
    lines.append(indent + "]")
    return "\n".join(lines)


def line_indent_of(text, pos):
    line_start = text.rfind("\n", 0, pos) + 1
    return re.match(r"[ \t]*", text[line_start:]).group(0)


# ---------------------------------------------------------------- 主流程

def parse_slug(text):
    m = re.search(r"afdian\.com/a/([A-Za-z0-9_\-]+)", text)
    if not m:
        raise SystemExit("在 config.js 里找不到爱发电主页地址（afdian.com/a/xxx）")
    return m.group(1)


def load_local_conf(root):
    """读 tools/afdian.local.json 里的本地凭据。没有或者读坏了就返回空字典。

    这个文件不进仓库，所以外面拿不到凭据时会安静地退回公开接口。
    """
    path = os.path.join(root, "tools", "afdian.local.json")
    try:
        with open(path, encoding="utf-8") as fh:
            data = json.load(fh)
    except (OSError, ValueError):
        return {}
    return data if isinstance(data, dict) else {}


def main():
    ap = argparse.ArgumentParser(description="同步爱发电赞助者名单到 config.js")
    ap.add_argument("--dry-run", action="store_true", help="只打印结果，不改文件")
    ap.add_argument("--verbose", action="store_true", help="打印每个月的扫描情况")
    ap.add_argument("--slug", help="覆盖 config.js 里的爱发电主页 slug")
    ap.add_argument("--auto-top", type=int, default=0, metavar="N",
                    help="把赞助榜前 N 名标成金色（默认不标，只保留手工标的）")
    ap.add_argument("--root", help="仓库根目录，默认按脚本位置推断")
    ap.add_argument("--max-drop", type=int, default=3, metavar="N",
                    help="一次最多允许少几位赞助者，超过就报错不写（默认 3）")
    args = ap.parse_args()

    root = args.root or os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    config_path = os.path.join(root, CONFIG_REL)
    if not os.path.isfile(config_path):
        raise SystemExit("找不到 %s" % config_path)

    with open(config_path, "r", encoding="utf-8", newline="") as fh:
        text = fh.read()

    start, end = find_sponsors_array(text)
    old_entries = parse_entries(text[start:end + 1])
    keep_top = {name for name, top in old_entries if top}

    slug = args.slug or parse_slug(text)
    print("爱发电主页：%s/a/%s" % (BASE, slug))

    user, creator = fetch_profile(slug)
    user_id = user["user_id"]
    print("创作者：%s（user_id=%s）" % (user.get("name") or "?", user_id))
    if creator.get("show_sponsor_list") == 0:
        print("  [!] 这个主页似乎关掉了「公开赞助名单」，可能抓不到人。")

    token = os.environ.get("AFDIAN_TOKEN", "").strip()
    env_uid = os.environ.get("AFDIAN_USER_ID", "").strip()
    if not token or not env_uid:
        # 没设环境变量就翻本地凭据文件，这样手动跑和后台跑用的是同一个来源
        conf = load_local_conf(root)
        token = token or str(conf.get("token") or "").strip()
        env_uid = env_uid or str(conf.get("user_id") or "").strip()
        if token:
            print("凭据来源：tools/afdian.local.json")
    env_uid = env_uid or user_id

    bucket = None
    rank = []
    used = ""
    if token:
        print("数据来源：官方开放接口")
        try:
            bucket = fetch_open_api(env_uid, token, args.verbose)
            used = "官方开放接口"
        except Exception as exc:  # noqa: BLE001 - 官方接口失败就退回公开接口
            print("  [!] 官方接口没用上（%s），改用公开接口。" % exc)
            bucket = None
    if bucket is None:
        print("数据来源：公开页面接口")
        bucket, rank = fetch_public(user_id, creator.get("create_time"), args.verbose)
        used = "公开页面接口"
    elif args.auto_top > 0:
        # 官方接口不给排名，要标金色就顺带问一下公开的赞助榜
        try:
            rank = fetch_top_sponsors(user_id)
        except Exception as exc:  # noqa: BLE001 - 排名拿不到就不标，不影响名单
            print("  [!] 赞助榜没问到（%s），这次不自动标金色。" % exc)

    if not bucket:
        if old_entries and old_entries[0][0] != "感谢名单待填写":
            print("[x] 一个人都没抓到，但 config.js 里本来是有名单的 —— 先不动它，请人工看一眼。")
            return 1
        print("这次没抓到赞助者（可能确实还没人赞助），config.js 保持不变。")
        return 0

    # 金色高亮：手工标的优先，其次是指定的赞助榜前 N 名
    auto_top = set(rank[:args.auto_top]) if args.auto_top > 0 else set()
    items = [
        (info["name"], info["name"] in keep_top or info["name"] in auto_top)
        for info in bucket.values()
    ]

    lines = render_array(items, line_indent_of(text, start))
    new_text = text[:start] + lines + text[end + 1:]

    old_names = [name for name, _ in old_entries]
    new_names = [name for name, _ in items]
    added = [n for n in new_names if n not in old_names]
    gone = [n for n in old_names if n not in new_names]

    print("来源：%s" % used)
    print("共 %d 位赞助者%s" % (len(items), "，其中 %d 位标了金色高亮" % sum(1 for _, t in items if t) if any(t for _, t in items) else ""))
    if added:
        print("新增 %d 位：%s" % (len(added), "、".join(added)))
    if gone:
        print("从爱发电名单上消失 %d 位：%s" % (len(gone), "、".join(gone)))

    # 安全阀：赞助者正常只增不减，一次掉太多八成是接口没抓全。
    if len(gone) > args.max_drop:
        print("[x] 这次要删掉 %d 位，超过上限 %d —— 像是接口没抓全，config.js 先不动。"
              % (len(gone), args.max_drop))
        print("    确认这些人确实该删，就加 --max-drop %d 再跑一次。" % len(gone))
        return 1

    if new_text == text:
        print("config.js 没有变化，不用改。")
        return 0

    if args.dry_run:
        print("\n--dry-run，下面是要写进 %s 的内容：\n" % CONFIG_REL)
        print(lines)
        return 0

    with open(config_path, "w", encoding="utf-8", newline="") as fh:
        fh.write(new_text)
    print("已写回 %s" % CONFIG_REL)
    return 0


if __name__ == "__main__":
    sys.exit(main())
