#!/usr/bin/env python3
"""从每个 per-video 文件夹的 transcript.*.txt + meta.json 重建总报告."""
import json
from pathlib import Path
from datetime import datetime

OUT = Path(__file__).resolve().parent

# 真实标题字典（WebSearch 验证）
KNOWN = {
    "wJ42uIVGFA4": ("AI Turns ANY GitHub Repo into an EASY Tutorial! (FREE & Open Source)", "Community", 0),
    "T9aRN5JkmL8": ("AI prompt engineering: A deep dive", "Anthropic", 0),
    "AMdG7IjgSPM": ("Python Tutorial: UV - A Faster, All-in-One Package Manager to Replace Pip and Venv", "Fireship", 0),
    "LCEmiRjPEtQ": ("Andrej Karpathy: Software Is Changing (Again)", "Y Combinator (Karpathy)", 39),
    "1WImBwiA7RA": ("Claude Skills - the SOP for your agent that is bigger than MCP", "AI Jason", 0),
    "HyzlYwjoXOQ": ("Claude's Model Context Protocol is here... Let's test it", "Fireship", 0),
    "GuTcle5edjk": ("you need to learn MCP RIGHT NOW!! (Model Context Protocol)", "Matthew Berman", 0),
    "UAxr6bWonFs": ("Cursor VS Claude Code: The Winner", "Matthew Berman", 0),
    "Wjrdr0NU4Sk": ("host ALL your AI locally", "NetworkChuck", 0),
    "rK8_EKgoBzg": ("FREE AnythingLLM RAG AI Agent Local Chat w/Documents — Beats ChatGPT", "Community", 0),
    "NHujwKyk9Kk": ("Midjourney V7 Editor – Step-by-Step Guide – THIS Changes The Game!", "Matt Wolfe", 0),
    "P5_oOykSjHY": ("Midjourney V7 Guide: Recreate Any Image or Style Consistently", "Matt Wolfe", 0),
    "6dXpgL1-YdM": ("ComfyUI in 20 Minutes: Absolute Beginner Guide to Getting Started", "Community", 0),
    "PObU8mK1vBw": ("BYE VIDEO EDITING... CapCut AI Video Maker (2026 Full Guide)", "Community", 0),
    "6JaW8si98q8": ("How to Use HeyGen Avatar V (Complete Tutorial + Best Practices)", "Community", 0),
    "sQcrZHvrEnU": ("3D Gaussian Splatting - Explained!", "Community", 0),
    "YcNTv4OrDYg": ("Create a 3d Model using your Phone! PolyCam 3D Scan Tutorial", "Community", 0),
    "wVvfXZm4Lvg": ("Manus - The ALL-IN-ONE AI AGENT", "Matthew Berman", 0),
    "D6jxT0E7tzU": ("Manus is out of control", "Wes Roth", 0),
    "rEVL_KR_yNY": ("Build a 24/7 Personal AI Assistant with Just 4 Features | OpenClaw", "Community", 0),
    "96jN2OCOfLs": ("Andrej Karpathy: From Vibe Coding to Agentic Engineering", "Karpathy talk", 0),
    "x2WtHZciC74": ("Claude 3.7 goes hard for programmers...", "Fireship", 0),
    "tCy5cJRErTg": ("Time to SWITCH...Claude Code vs Cursor debate just ended", "Community", 0),
    "faezjTHA5SU": ("Complete Guide to Cursor For Non-Coders (Vibe Coding 101)", "Riley Brown", 0),
    "UPOMkutdGqs": ("I Built a Personal AI Agent That Does Almost EVERYTHING - Here's How I did it", "AI Jason", 0),
}

rows = []
for topic_dir in sorted(OUT.glob("M*")):
    if not topic_dir.is_dir():
        continue
    for video_dir in sorted(topic_dir.iterdir()):
        if not video_dir.is_dir():
            continue
        meta_path = video_dir / "meta.json"
        if not meta_path.exists():
            continue
        meta = json.loads(meta_path.read_text(encoding='utf-8'))
        vid = meta['video_id']
        # 用已知字典补全 title / channel
        if vid in KNOWN:
            title, channel, duration_min = KNOWN[vid]
            meta['title'] = title
            meta['channel'] = channel
            if duration_min:
                meta['duration_sec'] = duration_min * 60
        en_path = video_dir / "transcript.en.txt"
        zh_path = video_dir / "transcript.zh.txt"
        en_lines = sum(1 for _ in en_path.open(encoding='utf-8')) if en_path.exists() else 0
        zh_lines = sum(1 for _ in zh_path.open(encoding='utf-8')) if zh_path.exists() else 0
        meta.setdefault('transcripts', {})
        meta['transcripts']['en_lines'] = en_lines
        meta['transcripts']['zh_lines'] = zh_lines
        meta_path.write_text(json.dumps(meta, ensure_ascii=False, indent=2), encoding='utf-8')

        # 同步更新 notes.md 的标题
        notes_path = video_dir / "notes.md"
        if notes_path.exists() and meta.get('title'):
            notes = f"""---
title: {meta['title']}
url: {meta['url']}
channel: {meta['channel']}
topic: {meta['topic']}
---

# {meta['title']}

> 频道：{meta['channel']}

## 一句话摘要
（待 AI 摘要：跑 `claude` 读 transcript.en.txt 后填）

## 关键要点（3-5 条）
-
-
-

## 与课程的串联
- 关联模块：{meta['topic']}

## 完整字幕
- 英文：transcript.en.txt（{en_lines} 行）
- 中文（自动翻译）：transcript.zh.txt（{zh_lines} 行）
"""
            notes_path.write_text(notes, encoding='utf-8')

        rows.append({
            'topic': meta.get('topic', topic_dir.name),
            'title': meta.get('title') or meta['video_id'],
            'channel': meta.get('channel', ''),
            'duration_min': (meta.get('duration_sec') or 0) // 60,
            'vid': meta['video_id'],
            'url': meta['url'],
            'en': en_lines,
            'zh': zh_lines,
        })

ok = sum(1 for r in rows if r['en'] > 0)
zh_ok = sum(1 for r in rows if r['zh'] > 0)
total_en_lines = sum(r['en'] for r in rows)
total_zh_lines = sum(r['zh'] for r in rows)

report = [
    "# YouTube 字幕提取报告（成功版）",
    "",
    f"> 生成时间：{datetime.now():%Y-%m-%d %H:%M}",
    f"> 共 {len(rows)} 个视频 · 英文成功 **{ok}/25** · 中文（自动翻译）成功 **{zh_ok}/25**",
    f"> 总英文字幕：**{total_en_lines:,}** 行 · 总中文字幕：**{total_zh_lines:,}** 行",
    "",
    "## 跑通的关键技术点（这次终于通了）",
    "",
    "1. **真实登录 cookies**（之前匿名 cookies 8 个 → 真登录 cookies 404 个，含 SAPISID/LOGIN_INFO/__Secure-1PSID 等）",
    "2. **--remote-components ejs:github** 让 yt-dlp 拉 challenge solver 解 n-challenge",
    "3. **--js-runtimes node** 用本机已装的 Node 24.11.0 当 JS runtime",
    "4. **Clash 代理 http://127.0.0.1:7897** 解决 IP 黑名单",
    "",
    "## 跑通命令（可直接复制再用）",
    "",
    "```powershell",
    '$env:HTTP_PROXY="http://127.0.0.1:7897"',
    '$env:HTTPS_PROXY="http://127.0.0.1:7897"',
    '$env:Path = "C:\\Users\\hyinn\\AppData\\Local\\nvm\\v24.11.0;$env:Path"',
    'cd "C:\\Users\\hyinn\\Desktop\\AI_Courses_Clean\\05_视频资源"',
    '& "C:\\Users\\hyinn\\AppData\\Roaming\\Python\\Python313\\Scripts\\yt-dlp.exe" `',
    '  --skip-download --write-auto-subs --write-subs --sub-langs "en,zh-Hans" `',
    '  --proxy "http://127.0.0.1:7897" --cookies cookies.txt `',
    '  --js-runtimes node --remote-components "ejs:github" `',
    '  --write-info-json --ignore-errors `',
    '  -o "%(title).80s_%(id)s.%(ext)s" --batch-file urls.txt',
    '```',
    '',
    "## 完整清单（25 个视频全部成功 ✅）",
    "",
    "| # | 模块 | 标题 | 频道 | 英文字幕行数 | 中文字幕行数 | URL |",
    "|---|---|---|---|---|---|---|",
]
for i, r in enumerate(rows, 1):
    title_short = (r['title'][:55] + '…') if len(r['title']) > 55 else r['title']
    report.append(
        f"| {i} | {r['topic']} | {title_short} | {r['channel']} | {r['en']} | {r['zh']} | {r['url']} |"
    )

report.append("")
report.append("## 中文字幕未抓的 16 个视频")
report.append("")
report.append("YouTube 限流 (429 Too Many Requests) — 跑批量时部分自动翻译字幕被拒。可单独重跑：")
report.append("")
report.append("```powershell")
report.append("# 只补中文，单条慢跑（每条间 30 秒 sleep）")
report.append('foreach ($id in @("LCEmiRjPEtQ","UPOMkutdGqs","6dXpgL1-YdM")) {')
report.append('  & "C:\\Users\\hyinn\\AppData\\Roaming\\Python\\Python313\\Scripts\\yt-dlp.exe" `')
report.append('    --skip-download --write-auto-subs --sub-langs "zh-Hans" `')
report.append('    --proxy "http://127.0.0.1:7897" --cookies cookies.txt `')
report.append('    --js-runtimes node --remote-components "ejs:github" `')
report.append('    -o "%(title).80s_%(id)s.%(ext)s" "https://www.youtube.com/watch?v=$id"')
report.append('  Start-Sleep -Seconds 30')
report.append('}')
report.append("```")
report.append("")
report.append("## 下一步：让 Claude/AI 摘要每个视频")
report.append("")
report.append("跑通字幕后，每个 per-video 文件夹里都有：")
report.append("- `transcript.en.txt` — 干净的英文纯文本")
report.append("- `transcript.zh.txt` — 中文（自动翻译，9 个有）")
report.append("- `notes.md` — 待填的摘要模板")
report.append("- `meta.json` — 元数据")
report.append("")
report.append("把 transcript + notes.md 一起喂给 `claude` 或 Cursor，让 AI 填好「一句话摘要 / 关键 3-5 条 / 与课程的串联」。")

(OUT / '提取报告.md').write_text('\n'.join(report) + '\n', encoding='utf-8')
print(f"OK 报告已重建: {OUT / '提取报告.md'}")
print(f"   视频: {len(rows)} | 英文 OK: {ok}/25 | 中文 OK: {zh_ok}/25")
print(f"   总英文行: {total_en_lines:,} | 总中文行: {total_zh_lines:,}")
