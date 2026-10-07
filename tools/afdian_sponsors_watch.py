#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""本地常驻：每天自动抓一次爱发电赞助者，有变化就提交并推送。

这个脚本自己不做抓取，抓取仍然交给 tools/afdian_sponsors.py，
这样两边的逻辑只有一份，改规则只用改一个地方。

它做的事：

  1. 启动后立刻跑一轮，之后每天固定时间再跑（默认凌晨 4 点，北京时间）；
  2. 电脑睡着错过了时间也没关系 —— 醒来后只要过了点就补跑；
  3. 名单没变化就不提交，不会天天攒出一堆空提交；
  4. 提交推送前先 git pull --rebase，免得远端有新东西时推不上去。

启动：双击 tools/start-sponsor-sync.bat（无窗口后台运行）
停止：双击 tools/stop-sponsor-sync.bat
日志：tools/afdian-sponsors.log

想改时间，把 tools/afdian.local.json 里的 "hour" 改成 0-23 就行。
"""

import argparse
import atexit
import json
import os
import subprocess
import sys
import time
from datetime import datetime, timedelta, timezone

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HERE = os.path.join(ROOT, "tools")
FETCHER = os.path.join(HERE, "afdian_sponsors.py")
LOCAL_CONF = os.path.join(HERE, "afdian.local.json")
LOG_PATH = os.path.join(HERE, "afdian-sponsors.log")
PID_PATH = os.path.join(HERE, "afdian-sync.pid")

CONFIG_REL = os.path.join("assets", "js", "config.js")

TZ = timezone(timedelta(hours=8))
DEFAULT_HOUR = 4
POLL_SECONDS = 60
LOG_MAX_BYTES = 512 * 1024
NO_WINDOW = 0x08000000 if os.name == "nt" else 0


# ---------------------------------------------------------------- 日志

def _now():
    return datetime.now(TZ)


def log(message):
    """同时写日志文件和标准输出（前台跑的时候能直接看到）。"""
    line = "[%s] %s" % (_now().strftime("%Y-%m-%d %H:%M:%S"), message)
    try:
        print(line, flush=True)
    except Exception:
        pass
    try:
        with open(LOG_PATH, "a", encoding="utf-8", newline="") as fh:
            fh.write(line + "\n")
    except OSError:
        pass


def rotate_log():
    """日志超过 512KB 就留一份旧的，别让它无限长下去。"""
    try:
        if os.path.getsize(LOG_PATH) > LOG_MAX_BYTES:
            os.replace(LOG_PATH, LOG_PATH + ".1")
    except OSError:
        pass


def _brief(text, limit=800):
    text = (text or "").strip()
    if len(text) <= limit:
        return text
    return text[:limit] + " ……"


# ---------------------------------------------------------------- 配置

def load_conf():
    """凭据优先取环境变量，其次取 tools/afdian.local.json。

    返回 (user_id, token, hour, 来源说明)。
    """
    uid = os.environ.get("AFDIAN_USER_ID", "").strip()
    token = os.environ.get("AFDIAN_TOKEN", "").strip()
    hour = DEFAULT_HOUR
    source = "环境变量"

    if os.path.isfile(LOCAL_CONF):
        data = {}
        try:
            with open(LOCAL_CONF, encoding="utf-8") as fh:
                data = json.load(fh)
        except (OSError, ValueError) as exc:
            log("[!] 读不了 %s：%s" % (LOCAL_CONF, exc))
        if isinstance(data, dict):
            if not uid or not token:
                source = LOCAL_CONF
            uid = uid or str(data.get("user_id") or "").strip()
            token = token or str(data.get("token") or "").strip()
            try:
                hour = int(data.get("hour", DEFAULT_HOUR))
            except (TypeError, ValueError):
                hour = DEFAULT_HOUR

    if not 0 <= hour <= 23:
        hour = DEFAULT_HOUR
    return uid, token, hour, source


def git_ignored(path):
    """问一句 git：这个文件被忽略了吗？"""
    try:
        done = subprocess.run(["git", "check-ignore", "-q", path], cwd=ROOT)
    except OSError:
        return False
    return done.returncode == 0


# ---------------------------------------------------------------- git

def git(*args):
    env = dict(os.environ)
    # 后台跑的时候没人能敲密码，问不到就直接失败，别挂在那里等。
    env["GIT_TERMINAL_PROMPT"] = "0"
    return subprocess.run(
        ["git"] + list(args),
        cwd=ROOT,
        env=env,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
        creationflags=NO_WINDOW,
    )


def config_dirty():
    done = git("status", "--porcelain", "--", CONFIG_REL)
    return bool(done.stdout.strip())


def ahead_count():
    """本地有没有还没推上去的提交。"""
    done = git("rev-list", "--count", "@{u}..HEAD")
    if done.returncode != 0:
        return 0
    try:
        return int(done.stdout.strip() or "0")
    except ValueError:
        return 0


# ---------------------------------------------------------------- 单实例

def _alive(pid):
    if os.name == "nt":
        try:
            done = subprocess.run(
                ["tasklist", "/FI", "PID eq %d" % pid, "/NH"],
                capture_output=True, text=True, creationflags=NO_WINDOW,
            )
        except OSError:
            return False
        return str(pid) in (done.stdout or "")
    try:
        os.kill(pid, 0)
    except OSError:
        return False
    return True


def other_instance():
    """已经有一个在跑就返回它的 PID，否则 None。"""
    try:
        with open(PID_PATH, encoding="ascii") as fh:
            pid = int(fh.read().strip())
    except (OSError, ValueError):
        return None
    if pid == os.getpid():
        return None
    return pid if _alive(pid) else None


def write_pid():
    try:
        with open(PID_PATH, "w", encoding="ascii") as fh:
            fh.write(str(os.getpid()))
    except OSError:
        pass


def remove_pid():
    try:
        os.remove(PID_PATH)
    except OSError:
        pass


# ---------------------------------------------------------------- 干活

def run_fetcher(uid, token):
    """跑一次抓取，输出直接追加进日志。返回退出码。"""
    env = dict(os.environ)
    env["AFDIAN_USER_ID"] = uid
    env["AFDIAN_TOKEN"] = token
    env["PYTHONIOENCODING"] = "utf-8"   # 日志统一 UTF-8，中文才不会变问号
    env["PYTHONUTF8"] = "1"
    with open(LOG_PATH, "a", encoding="utf-8", newline="") as fh:
        fh.write("\n" + "=" * 64 + "\n")
        fh.flush()
        done = subprocess.run(
            [sys.executable, FETCHER, "--verbose"],
            cwd=ROOT,
            env=env,
            stdout=fh,
            stderr=subprocess.STDOUT,
            creationflags=NO_WINDOW,
        )
    return done.returncode


def push_until_done():
    """推上去为止；被拒就先同步远端再试一次。返回是否成功。"""
    for attempt in (1, 2):
        done = git("push")
        if done.returncode == 0:
            log("已推送到 origin。")
            return True
        brief = _brief(done.stderr or done.stdout, 400)
        log("[!] 第 %d 次 push 没成功：%s" % (attempt, brief))
        if attempt == 2:
            break
        log("    先同步远端再试一次。")
        reb = git("pull", "--rebase", "--autostash")
        if reb.returncode != 0:
            # 别把仓库停在 rebase 半路上，后台进程卡在那儿没人管。
            git("rebase", "--abort")
            log("[x] 同步远端失败，改动先留在本地，下一轮再推。")
            log(_brief(reb.stderr or reb.stdout, 400))
            return False
    log("[x] 还是推不上去，改动留在本地了。")
    log("    多半是推送凭据没配好 —— 在命令行里手动 git push 一次，"
        "让 Windows 凭据管理器把密码记住就好了。")
    return False


def do_round(uid, token):
    rotate_log()
    log("--- 开始这一轮 ---")

    if config_dirty():
        log("[!] assets/js/config.js 有你还没提交的改动，这一轮先不动它，"
            "免得把你自己写的东西一起提交了。")
        log("    把它提交掉之后，下一轮会自动接上。")
        return

    # 先把远端同步下来，否则等下 push 会被拒。
    done = git("pull", "--rebase", "--autostash")
    if done.returncode != 0:
        git("rebase", "--abort")
        log("[x] git pull 失败，这一轮跳过。")
        log(_brief(done.stderr or done.stdout, 400))
        return

    code = run_fetcher(uid, token)
    if code != 0:
        log("[x] 抓取脚本返回 %d，这一轮不提交。原因见上面的输出。" % code)
        return

    if not config_dirty():
        log("名单没有变化，不用提交。")
        if ahead_count() > 0:
            log("本地还有没推上去的提交，补推一次。")
            push_until_done()
        return

    git("add", "--", CONFIG_REL)
    done = git("commit", "-m", "自动更新爱发电赞助名单")
    if done.returncode != 0:
        log("[x] git commit 失败：%s" % _brief(done.stderr or done.stdout, 400))
        return
    first_line = (done.stdout.strip().splitlines() or [""])[0]
    log("已提交：%s" % first_line)

    push_until_done()


def next_at_or_after(now, hour):
    """下一个 hour 点整；如果今天这个点已经过了，就是明天。"""
    due = now.replace(hour=hour, minute=0, second=0, microsecond=0)
    if due <= now:
        due += timedelta(days=1)
    return due


# ---------------------------------------------------------------- 入口

def main():
    parser = argparse.ArgumentParser(
        description="本地常驻，每天自动更新爱发电赞助名单")
    parser.add_argument("--once", action="store_true",
                        help="只跑一轮就退出，不常驻（调试用）")
    parser.add_argument("--hour", type=int, default=None,
                        help="每天几点跑，0-23；不填就读 afdian.local.json，默认 4")
    args = parser.parse_args()

    if os.name == "nt":
        try:
            sys.stdout.reconfigure(errors="replace")
        except Exception:
            pass

    uid, token, hour, source = load_conf()
    if args.hour is not None and 0 <= args.hour <= 23:
        hour = args.hour

    if not uid or not token:
        log("[x] 没拿到爱发电凭据。请在 tools/afdian.local.json 里填好 "
            "user_id 和 token，")
        log("    或者设好环境变量 AFDIAN_USER_ID / AFDIAN_TOKEN 再启动。")
        return 2

    # token 存在文件里，就必须确认这个文件被 git 忽略了。
    if os.path.isfile(LOCAL_CONF) and not git_ignored(LOCAL_CONF):
        log("[x] %s 没有被 .gitignore 忽略！" % LOCAL_CONF)
        log("    里面存着 token，这样会被提交到仓库里。"
            "先把它加进 .gitignore 再启动。")
        return 2

    if args.once:
        do_round(uid, token)
        return 0

    running = other_instance()
    if running:
        log("[!] 已经有一个同步在跑了（PID %d），这次不重复启动。" % running)
        return 0

    write_pid()
    atexit.register(remove_pid)
    log("启动。凭据来自 %s，每天 %02d:00（北京时间）跑一次，现在先跑一轮。"
        % (source, hour))

    due = _now()          # 启动后先跑一轮
    while True:
        try:
            if _now() >= due:
                do_round(uid, token)
                due = next_at_or_after(_now(), hour)
                log("下一轮：%s" % due.strftime("%Y-%m-%d %H:%M"))
                log("（这个进程要一直开着，关掉就不更新了。）")
        except Exception as exc:      # 半夜出岔子也不能让进程自己死掉
            log("[x] 这一轮出了预料之外的错，已经跳过：%r" % (exc,))
            due = next_at_or_after(_now(), hour)
        time.sleep(POLL_SECONDS)


if __name__ == "__main__":
    sys.exit(main())
