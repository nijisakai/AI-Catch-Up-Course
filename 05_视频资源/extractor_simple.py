#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
极简 YouTube 字幕提取器（绕开 yt-dlp 反爬）
=========================================
直接用 youtube-transcript-api 拿字幕 + 描述（不调用 ydl info 接口）。
"""
import json
import re
import sys
from pathlib import Path

from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import TranscriptsDisabled, NoTranscriptFound

OUT = Path(__file__).resolve().parent

VIDEOS = [
    # (video_id, topic, slug, channel, title)
    ("AMdG7IjgSPM", "M0_AI工作站", "fireship-uv-package-manager", "Fireship", "Python Tutorial: UV - A Faster, All-in-One Package Manager"),
    ("T9aRN5JkmL8", "M0_AI工作站", "anthropic-prompt-engineering-deep-dive", "Anthropic", "AI prompt engineering: A deep dive"),
    ("LCEmiRjPEtQ", "M1_AI底层逻辑", "karpathy-software-changing-again", "Y Combinator (Karpathy)", "Software Is Changing (Again)"),
    ("1WImBwiA7RA", "M1_AI底层逻辑", "ai-jason-claude-skills-sop", "AI Jason", "Claude Skills - the SOP for your agent that is bigger than MCP"),
    ("HyzlYwjoXOQ", "M1_AI底层逻辑", "fireship-mcp-test", "Fireship", "Claude's Model Context Protocol is here... Let's test it"),
    ("GuTcle5edjk", "M1_AI底层逻辑", "matthew-berman-mcp", "Matthew Berman", "you need to learn MCP RIGHT NOW!! (Model Context Protocol)"),
    ("UAxr6bWonFs", "M2_对话式AI", "matthew-berman-cursor-vs-claude-code", "Matthew Berman", "Cursor VS Claude Code: The Winner"),
    ("Wjrdr0NU4Sk", "M2_对话式AI", "networkchuck-ollama-local-ai", "NetworkChuck", "host ALL your AI locally"),
    ("wVvfXZm4Lvg", "M6_Agent", "matthew-berman-manus", "Matthew Berman", "Manus - The ALL-IN-ONE AI AGENT"),
    ("rEVL_KR_yNY", "M6_Agent", "openclaw-build-247-ai-assistant", "Community", "Build a 24/7 Personal AI Assistant with OpenClaw"),
    ("96jN2OCOfLs", "M7_VibeCoding", "karpathy-vibe-to-agentic", "Karpathy talk", "From Vibe Coding to Agentic Engineering"),
    ("faezjTHA5SU", "M7_VibeCoding", "riley-brown-cursor-non-coders", "Riley Brown", "Complete Guide to Cursor For Non-Coders (Vibe Coding 101)"),
    ("UPOMkutdGqs", "M8_综合", "ai-jason-personal-ai-agent", "AI Jason", "I Built a Personal AI Agent That Does Almost EVERYTHING"),
]

def safe_name(s, n=80):
    s = re.sub(r'[\\/:*?"<>|]', '_', s)
    return re.sub(r'\s+', ' ', s).strip()[:n]

def fetch(video_id):
    pref = ['en', 'en-US', 'en-GB', 'zh-Hans', 'zh-CN', 'zh']
    try:
        api = YouTubeTranscriptApi()
        tlist = api.list(video_id)
        for lang in pref:
            try:
                t = tlist.find_manually_created_transcript([lang])
                segs = t.fetch()
                return list(segs), lang, 'manual'
            except Exception:
                pass
        for lang in pref:
            try:
                t = tlist.find_generated_transcript([lang])
                segs = t.fetch()
                return list(segs), lang, 'auto'
            except Exception:
                pass
        for t in tlist:
            try:
                segs = t.fetch()
                return list(segs), t.language_code, 'fallback'
            except Exception:
                continue
    except (TranscriptsDisabled, NoTranscriptFound) as e:
        print(f"  [warn] {video_id} 无字幕: {e}")
    except Exception as e:
        print(f"  [error] {video_id} 抓取失败: {e}")
    return None

def to_plain(segs):
    if not segs:
        return ""
    parts = []
    for s in segs:
        # support both old dict format and new FetchedTranscriptSnippet object
        if hasattr(s, 'text'):
            txt = s.text
        elif isinstance(s, dict):
            txt = s.get('text', '')
        else:
            continue
        if txt and txt.strip():
            parts.append(txt.strip())
    return "\n".join(parts)

def to_srt(segs):
    if not segs:
        return ""
    def ts(t):
        h = int(t // 3600); m = int((t % 3600) // 60); s = t % 60
        return f"{h:02d}:{m:02d}:{s:06.3f}".replace('.', ',')
    out = []
    for i, s in enumerate(segs, 1):
        if hasattr(s, 'start'):
            start = s.start; dur = s.duration; text = s.text
        elif isinstance(s, dict):
            start = s.get('start', 0); dur = s.get('duration', 0); text = s.get('text', '')
        else:
            continue
        out += [str(i), f"{ts(start)} --> {ts(start + dur)}", text, ""]
    return "\n".join(out)

def main():
    OUT.mkdir(parents=True, exist_ok=True)
    summary = []
    ok = fail = 0
    for vid, topic, slug, channel, title in VIDEOS:
        url = f"https://www.youtube.com/watch?v={vid}"
        print(f"\n=== {url}  topic={topic}")
        result = fetch(vid)
        out_dir = OUT / safe_name(topic) / safe_name(f"{slug}__{vid}")
        out_dir.mkdir(parents=True, exist_ok=True)
        meta = {
            "video_id": vid, "url": url, "title": title,
            "channel": channel, "topic": topic, "slug": slug,
        }
        if result:
            segs, lang, source = result
            (out_dir / "transcript.txt").write_text(
                f"# language={lang} source={source}\n\n" + to_plain(segs) + "\n",
                encoding='utf-8'
            )
            (out_dir / "transcript.srt").write_text(to_srt(segs), encoding='utf-8')
            meta["transcript_lang"] = lang
            meta["transcript_source"] = source
            meta["transcript_lines"] = len(segs)
            ok += 1
            print(f"  [ok] {len(segs)} segments  lang={lang}")
            summary.append((True, topic, title, vid, len(segs), lang))
        else:
            fail += 1
            summary.append((False, topic, title, vid, 0, ""))
        (out_dir / "meta.json").write_text(
            json.dumps(meta, ensure_ascii=False, indent=2), encoding='utf-8'
        )
        notes = f"""---
title: {title}
url: {url}
channel: {channel}
topic: {topic}
---

# {title}

> 频道：{channel}

## 一句话摘要
（待 AI 摘要：跑 `claude` 读 transcript.txt 后填）

## 关键要点（3-5 条）
-
-
-

## 与课程的串联
- 关联模块：{topic}
- 课程节：（待填）

## 完整字幕
见 `transcript.txt` / `transcript.srt`
"""
        (out_dir / "notes.md").write_text(notes, encoding='utf-8')

    # write summary
    sumf = OUT / "提取报告.md"
    lines = [
        "# 真实 YouTube 视频字幕提取报告",
        "",
        f"> 总计 {len(VIDEOS)} 个视频 · 成功 {ok} · 失败 {fail}",
        "",
        "| 状态 | 模块 | 标题 | URL | 字幕段数 | 语言 |",
        "|---|---|---|---|---|---|",
    ]
    for status, topic, title, vid, n, lang in summary:
        flag = "✅" if status else "❌"
        url = f"https://www.youtube.com/watch?v={vid}"
        lines.append(f"| {flag} | {topic} | {title[:50]} | {url} | {n} | {lang} |")
    sumf.write_text("\n".join(lines), encoding='utf-8')
    print(f"\n=== 完成 ok={ok} fail={fail} ===\n报告: {sumf}")

if __name__ == '__main__':
    main()
