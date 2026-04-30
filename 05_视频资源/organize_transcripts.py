#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
把 yt-dlp 下的 .vtt + .info.json 整理成结构化文件夹:
  05_视频资源/<topic>/<slug>__<id>/
    ├── transcript.en.txt   (纯文本)
    ├── transcript.zh.txt   (如有)
    ├── transcript.en.vtt   (原始 VTT)
    ├── transcript.zh.vtt   (如有)
    ├── meta.json           (整理后的元数据)
    └── notes.md            (可填的摘要模板)
并产出:
  提取报告.md  (清单)
"""
import json
import re
import shutil
from pathlib import Path

OUT = Path(__file__).resolve().parent

# (video_id, topic, slug, channel)
META = {
    "wJ42uIVGFA4": ("M0_AI工作站", "github-repo-tutorial", "Community"),
    "T9aRN5JkmL8": ("M0_AI工作站", "anthropic-prompt-engineering-deep-dive", "Anthropic"),
    "AMdG7IjgSPM": ("M0_AI工作站", "fireship-uv-package-manager", "Fireship"),
    "LCEmiRjPEtQ": ("M1_AI底层逻辑", "karpathy-software-changing-again", "Y Combinator (Karpathy)"),
    "1WImBwiA7RA": ("M1_AI底层逻辑", "ai-jason-claude-skills-sop", "AI Jason"),
    "HyzlYwjoXOQ": ("M1_AI底层逻辑", "fireship-mcp-test", "Fireship"),
    "GuTcle5edjk": ("M1_AI底层逻辑", "matthew-berman-mcp", "Matthew Berman"),
    "UAxr6bWonFs": ("M2_对话式AI", "matthew-berman-cursor-vs-claude-code", "Matthew Berman"),
    "Wjrdr0NU4Sk": ("M2_对话式AI", "networkchuck-ollama-local-ai", "NetworkChuck"),
    "rK8_EKgoBzg": ("M2_对话式AI", "anythingllm-rag-local", "Community"),
    "NHujwKyk9Kk": ("M3_图像", "matt-wolfe-mj-v7-editor", "Matt Wolfe"),
    "P5_oOykSjHY": ("M3_图像", "matt-wolfe-mj-v7-consistency", "Matt Wolfe"),
    "6dXpgL1-YdM": ("M3_图像", "comfyui-20-min-beginner", "Community"),
    "PObU8mK1vBw": ("M4_视频", "capcut-ai-video-2026", "Community"),
    "6JaW8si98q8": ("M4_视频", "heygen-avatar-v-tutorial", "Community"),
    "sQcrZHvrEnU": ("M5_空间AI", "gaussian-splatting-explained", "Community"),
    "YcNTv4OrDYg": ("M5_空间AI", "polycam-3d-scan-tutorial", "Community"),
    "wVvfXZm4Lvg": ("M6_Agent", "matthew-berman-manus", "Matthew Berman"),
    "D6jxT0E7tzU": ("M6_Agent", "wes-roth-manus-out-of-control", "Wes Roth"),
    "rEVL_KR_yNY": ("M6_Agent", "openclaw-build-247-ai-assistant", "Community"),
    "96jN2OCOfLs": ("M7_VibeCoding", "karpathy-vibe-to-agentic", "Karpathy talk"),
    "x2WtHZciC74": ("M7_VibeCoding", "fireship-claude-3.7-programmers", "Fireship"),
    "tCy5cJRErTg": ("M7_VibeCoding", "claude-code-vs-cursor-debate", "Community"),
    "faezjTHA5SU": ("M7_VibeCoding", "riley-brown-cursor-non-coders", "Riley Brown"),
    "UPOMkutdGqs": ("M8_综合", "ai-jason-personal-ai-agent", "AI Jason"),
}

def vtt_to_plain(path: Path) -> str:
    """VTT → 纯文本 (移除时间戳 + WEBVTT 头 + 重复行)。"""
    text = path.read_text(encoding='utf-8', errors='replace')
    lines = text.splitlines()
    out = []
    seen = set()
    for line in lines:
        line = line.strip()
        if not line:
            continue
        if line.startswith('WEBVTT'):
            continue
        if line.startswith('Kind:') or line.startswith('Language:'):
            continue
        # 时间戳 (00:00:00.000 --> 00:00:05.000)
        if re.match(r'^\d{2}:\d{2}:\d{2}\.\d+\s*-->', line):
            continue
        # NOTE / STYLE / cue settings
        if line.startswith('NOTE') or line.startswith('STYLE'):
            continue
        # 数字 cue id 行
        if line.isdigit():
            continue
        # cue settings (align:start position:0%)
        if 'align:' in line and 'position:' in line:
            continue
        # 移除内联标签 <c>...</c> <00:00:00.000>...
        line = re.sub(r'<[^>]+>', '', line)
        line = line.strip()
        if not line:
            continue
        # 去重 (yt-dlp 自动字幕常常重复)
        if line in seen:
            continue
        seen.add(line)
        out.append(line)
    return "\n".join(out)

def safe_name(s: str, n: int = 80) -> str:
    s = re.sub(r'[\\/:*?"<>|]', '_', s)
    return re.sub(r'\s+', ' ', s).strip()[:n]

def find_files(vid: str):
    """找属于该 video_id 的 vtt + json 文件."""
    files = list(OUT.glob(f"*{vid}*"))
    return {
        'en_vtt': next((f for f in files if f.name.endswith(f"{vid}.en.vtt")), None),
        'zh_vtt': next((f for f in files if f.name.endswith(f"{vid}.zh-Hans.vtt") or f.name.endswith(f"{vid}.zh.vtt")), None),
        'info_json': next((f for f in files if f.name.endswith(f"{vid}.info.json")), None),
    }

def main():
    summary = []
    for vid, (topic, slug, channel) in META.items():
        files = find_files(vid)
        info = {}
        if files['info_json']:
            try:
                info = json.loads(files['info_json'].read_text(encoding='utf-8'))
            except Exception:
                pass
        title = info.get('title', '')
        duration = info.get('duration', 0)
        upload_date = info.get('upload_date', '')
        uploader = info.get('uploader', channel)

        out_dir = OUT / safe_name(topic) / safe_name(f"{slug}__{vid}")
        out_dir.mkdir(parents=True, exist_ok=True)

        en_lines = zh_lines = 0
        if files['en_vtt']:
            en_text = vtt_to_plain(files['en_vtt'])
            (out_dir / 'transcript.en.txt').write_text(en_text, encoding='utf-8')
            shutil.copy(files['en_vtt'], out_dir / 'transcript.en.vtt')
            en_lines = en_text.count('\n') + 1
        if files['zh_vtt']:
            zh_text = vtt_to_plain(files['zh_vtt'])
            (out_dir / 'transcript.zh.txt').write_text(zh_text, encoding='utf-8')
            shutil.copy(files['zh_vtt'], out_dir / 'transcript.zh.vtt')
            zh_lines = zh_text.count('\n') + 1

        meta = {
            'video_id': vid,
            'url': f'https://www.youtube.com/watch?v={vid}',
            'title': title,
            'channel': uploader,
            'duration_sec': duration,
            'upload_date': upload_date,
            'topic': topic,
            'slug': slug,
            'transcripts': {
                'en_lines': en_lines,
                'zh_lines': zh_lines,
            }
        }
        (out_dir / 'meta.json').write_text(
            json.dumps(meta, ensure_ascii=False, indent=2), encoding='utf-8'
        )
        notes = f"""---
title: {title or vid}
url: https://www.youtube.com/watch?v={vid}
channel: {uploader}
duration_min: {duration // 60 if duration else '?'}
topic: {topic}
---

# {title or vid}

> 频道：{uploader} ｜ {duration // 60 if duration else '?'} 分钟

## 一句话摘要
（待 AI 摘要：跑 `claude` 读 transcript.en.txt 后填）

## 关键要点（3-5 条）
-
-
-

## 与课程的串联
- 关联模块：{topic}

## 完整字幕
- 英文：transcript.en.txt（{en_lines} 行）
- 中文（自动翻译）：transcript.zh.txt（{zh_lines} 行）
"""
        (out_dir / 'notes.md').write_text(notes, encoding='utf-8')
        summary.append({
            'topic': topic,
            'title': title or vid,
            'vid': vid,
            'duration': duration,
            'en': en_lines,
            'zh': zh_lines,
            'has_transcript': en_lines > 0,
        })

    # 写报告
    report = ['# YouTube 字幕提取报告（成功版）',
              f'\n> 生成时间：{__import__("datetime").datetime.now():%Y-%m-%d %H:%M}',
              f'\n> 共 {len(summary)} 个视频，成功 {sum(1 for s in summary if s["has_transcript"])} 个',
              '',
              '| 模块 | 标题 | 时长(分) | 英文行数 | 中文行数 | URL |',
              '|---|---|---|---|---|---|']
    for s in summary:
        url = f'https://www.youtube.com/watch?v={s["vid"]}'
        flag = '✅' if s['has_transcript'] else '⏳'
        dur = s['duration'] // 60 if s['duration'] else '?'
        title_short = (s['title'][:50] + '…') if len(s['title']) > 50 else s['title']
        report.append(f'| {flag} {s["topic"]} | {title_short} | {dur} | {s["en"]} | {s["zh"]} | {url} |')

    (OUT / '提取报告.md').write_text('\n'.join(report), encoding='utf-8')
    ok = sum(1 for s in summary if s['has_transcript'])
    print(f"OK 整理完成. 报告: {OUT / '提取报告.md'}")
    print(f"   视频文件夹: {ok} 个有字幕 / 共 {len(summary)} 个")

if __name__ == '__main__':
    main()
