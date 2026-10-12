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
    python tools/afdian_sponsors.py --all-plans    # 不筛方案，主页上谁都拉
    python tools/afdian_sponsors.py --plan <ID>    # 只拉赞助过指定方案的人
    python tools/afdian_sponsors.py --all-dates    # 不按时间筛，多早的都要
    python tools/afdian_sponsors.py --since 2026-01-01   # 只留这天之后还在赞助的

两道筛选：

  1. 方案 —— 默认只拉赞助过「喜欢野火整合包的可以投喂一下」（¥10 月票）的人，
     外加走「自选方案」的人。这个爱发电主页下还挂着 SCM 光标软件的商品，不筛的话
     名单里会混进一百多个买软件的顾客。

  2. 时间 —— 默认只留「最近一次赞助」不早于 2026-09-01 的人。名单是给人看
     「最近谁在支持」的，早年打过钱、后来没再来的就不占位置了。

两个默认值都能用 --plan / --since 覆盖，或写进 tools/afdian.local.json 的
plan_id / since 字段。顺序按最近一次赞助从新到旧。

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

# 「喜欢野火整合包的可以投喂一下」这个方案的 plan_id（¥10/月的月票）。
# 同一个爱发电主页下还挂着 SCM 光标软件的商品，不按方案筛的话，名单里会混进
# 一百多个买软件的顾客。走「自选方案」的人也一并收（那类记录没有 plan_id）。
# 想换成别的方案用 --plan 覆盖，想完全不筛用 --all-plans。
DEFAULT_PLAN_ID = "3d264664bed611f18a505254001e7c00"

# 只留「最近一次赞助」不早于这一天的赞助者（北京时间），默认 2026-09-01 起 ——
# 名单是给人看「最近谁在支持」的，早年打过钱、后来没再来的就不占位置了。
# 想让名单回到全部历史，把它改成 ""，或跑的时候加 --all-dates。
DEFAULT_SINCE = "2026-09-01"


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


def _plan_ids_of(item):
    """这个人沾过的所有方案 id。

    sponsor_plans 是他赞助过的方案列表，current_plan 是当前挂着的那一个。
    接口偶尔只给其中一个（见过 current_plan 空、sponsor_plans 有值的情况），
    所以两边都看。空字符串代表「自选方案」—— 那条记录里 plan_id 就是空的。
    """
    ids = set()
    cur = item.get("current_plan") or {}
    if cur:
        ids.add((cur.get("plan_id") or "").strip())
    for p in item.get("sponsor_plans") or []:
        if p:
            ids.add((p.get("plan_id") or "").strip())
    return ids


def _keep_by_plan(item, plan_id):
    """这个人该不该进名单。两种人算：

      1. 赞助过 plan_id 这个方案，也就是野火月票；
      2. 走过「自选方案」—— 那类记录 plan_id 是空的，接口看不出钱是给哪个
         项目的，但野火的支持者多数走的是这条路，所以一并收进来。

    买 SCM 光标软件的人走的是有明确 plan_id 的商品方案，两种都不沾，会被滤掉。
    """
    ids = _plan_ids_of(item)
    if plan_id and plan_id in ids:
        return True
    return "" in ids


def _parse_day(text):
    """把 "2026-09-01" 解析成北京时间当天 00:00 的时间戳。"""
    try:
        d = datetime.strptime(str(text).strip(), "%Y-%m-%d")
    except ValueError:
        raise SystemExit("日期格式要是 YYYY-MM-DD，收到的是 %r" % (text,))
    return int(d.replace(tzinfo=TZ).timestamp())


def fetch_open_api(user_id, token, verbose=False, plan_id=None, since_ts=None):
    """官方开放接口：一次拿全，还带累计金额和首次/最近赞助时间。

    plan_id  不为空时，只保留赞助过该方案的人。
    since_ts 不为空时，只保留「最近一次赞助」不早于它的人。

    顺序按最近一次赞助从新到旧 —— 最新在支持的人排最前面。
    """
    found = {}
    skipped_plan = 0
    skipped_old = 0
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
            if plan_id and not _keep_by_plan(item, plan_id):
                skipped_plan += 1
                continue
            last = _as_int(item.get("last_pay_time"))
            # last 是 0 说明接口没给时间，这种不筛掉 —— 宁可多留一个，别误删
            if since_ts and last and last < since_ts:
                skipped_old += 1
                continue
            uid = user.get("user_id") or name
            found.setdefault(uid, {
                "name": name,
                "amount": item.get("all_sum_amount"),
                "first": _as_int(item.get("first_pay_time")),
                "last": last,
            })
        total_page = int(data.get("total_page") or 1)
        if verbose:
            print("  官方接口 第 %d/%d 页，累计 %d 人" % (page, total_page, len(found)), flush=True)
        if page >= total_page or page >= 200:
            break
        page += 1
        time.sleep(REQUEST_GAP)

    if verbose and (plan_id or since_ts):
        bits = []
        if plan_id:
            bits.append("方案滤掉 %d 人" % skipped_plan)
        if since_ts:
            bits.append("时间滤掉 %d 人" % skipped_old)
        print("  筛选：%s，留下 %d 人" % ("，".join(bits), len(found)), flush=True)

    # 最近一次赞助从新到旧。时间一样时再看首次时间、最后看名字，
    # 保证顺序完全确定，不会因为排序抖动产生假 diff。
    bucket = OrderedDict()
    for uid, info in sorted(
        found.items(),
        key=lambda kv: (-kv[1]["last"], kv[1]["first"], kv[1]["name"]),
    ):
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
    ap.add_argument("--plan", metavar="ID",
                    help="只保留赞助过这个方案的人（默认用野火月票那个方案）")
    ap.add_argument("--all-plans", action="store_true",
                    help="不做方案筛选，把主页上所有赞助者都拉进来")
    ap.add_argument("--since", metavar="YYYY-MM-DD",
                    help="只保留最近一次赞助不早于这天的人（默认 2026-09-01）")
    ap.add_argument("--all-dates", action="store_true",
                    help="不按时间筛，多早的赞助者都留")
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

    conf = load_local_conf(root)
    token = os.environ.get("AFDIAN_TOKEN", "").strip()
    env_uid = os.environ.get("AFDIAN_USER_ID", "").strip()
    if not token or not env_uid:
        # 没设环境变量就翻本地凭据文件，这样手动跑和后台跑用的是同一个来源
        token = token or str(conf.get("token") or "").strip()
        env_uid = env_uid or str(conf.get("user_id") or "").strip()
        if token:
            print("凭据来源：tools/afdian.local.json")
    env_uid = env_uid or user_id

    # 方案筛选。这是一个「只支持野火的人」名单，主页上买光标软件的人不该混进来。
    # 优先级：--all-plans > --plan > 本地配置的 plan_id > 内置的野火月票方案。
    if args.all_plans:
        plan_id = ""
    elif args.plan:
        plan_id = args.plan.strip()
    else:
        plan_id = str(conf.get("plan_id") or "").strip() or DEFAULT_PLAN_ID

    # 时间筛选：只留「最近一次赞助」不早于这天的人。
    # 优先级：--all-dates > --since > 本地配置的 since > 内置的 2026-09-01。
    if args.all_dates:
        since_text = ""
    else:
        since_text = (args.since or str(conf.get("since") or "").strip()
                      or DEFAULT_SINCE).strip()
    since_ts = _parse_day(since_text) if since_text else None

    if plan_id:
        print("只看方案：%s" % plan_id)
    if since_text:
        print("只看 %s 之后（含）还在赞助的人" % since_text)

    if not token and (plan_id or since_ts):
        # 没有凭据就只剩公开接口，而公开接口既不返回方案、也不返回时间 ——
        # 硬跑会把一百多个买软件的顾客、还有早年打过钱就没再来的人全拉进名单。
        print("[x] 没有可用凭据，只有公开接口，而它分不出方案也拿不到时间，这次先不更新。")
        print("    检查一下 tools/afdian.local.json 里的 token 和 user_id。")
        return 1

    bucket = None
    rank = []
    used = ""
    if token:
        print("数据来源：官方开放接口")
        try:
            bucket = fetch_open_api(env_uid, token, args.verbose, plan_id, since_ts)
            used = "官方开放接口"
        except Exception as exc:  # noqa: BLE001 - 官方接口失败就退回公开接口
            if plan_id or since_ts:
                # 退回去两道筛选就全丢了，名单会突然涨回去，直接不更新
                print("[x] 官方接口没用上（%s），而公开接口分不出方案也算不出时间。" % exc)
                print("    这次先不更新，免得混进光标软件的买家和早就没再赞助的人。")
                return 1
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
