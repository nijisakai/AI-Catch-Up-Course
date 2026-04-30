#!/usr/bin/env python3
"""
导出浏览器 YouTube cookies 到 Netscape 格式文件 (yt-dlp 可读).
处理 Chrome 127+ DPAPI 加密 + App-Bound encryption 问题.
"""
import sys
import time
from pathlib import Path
import browser_cookie3

OUT = Path(__file__).resolve().parent / "youtube_cookies.txt"

def try_browser(name, fn):
    print(f"  试 {name}...", end=" ", flush=True)
    try:
        cj = fn(domain_name='youtube.com')
        cnt = sum(1 for _ in cj)
        print(f"OK ({cnt} cookies)")
        return cj
    except Exception as e:
        print(f"失败: {type(e).__name__}: {str(e)[:80]}")
        return None

def to_netscape(cj, path):
    lines = ["# Netscape HTTP Cookie File", ""]
    for c in cj:
        # name domain include_subdomain path secure expiry name value
        domain = c.domain
        flag = "TRUE" if domain.startswith(".") else "FALSE"
        path_ = c.path
        secure = "TRUE" if c.secure else "FALSE"
        expiry = str(int(c.expires)) if c.expires else "0"
        name = c.name
        value = c.value
        lines.append(f"{domain}\t{flag}\t{path_}\t{secure}\t{expiry}\t{name}\t{value}")
    path.write_text("\n".join(lines) + "\n", encoding='utf-8')

def main():
    print("尝试从浏览器读 YouTube cookies...")
    candidates = [
        ("Edge", browser_cookie3.edge),
        ("Chrome", browser_cookie3.chrome),
        ("Brave", browser_cookie3.brave),
        ("Firefox", browser_cookie3.firefox),
    ]
    for name, fn in candidates:
        cj = try_browser(name, fn)
        if cj is None:
            continue
        cnt = sum(1 for _ in cj)
        if cnt == 0:
            print(f"  ({name} 没有 youtube.com 的 cookies — 你登录过了吗？)")
            continue
        to_netscape(cj, OUT)
        print(f"\n✓ 已写: {OUT}")
        print(f"  来源: {name}, {cnt} 个 cookies")
        return 0
    print("\n✗ 所有浏览器都失败。请确保:")
    print("  1. 你至少登录过 YouTube 一次（任意浏览器）")
    print("  2. 当前用户和浏览器同账号")
    print("  3. Chrome/Edge/Brave 在 v127+ 需要先关闭浏览器再跑")
    return 1

if __name__ == '__main__':
    sys.exit(main())
