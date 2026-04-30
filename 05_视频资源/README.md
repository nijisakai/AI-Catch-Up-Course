# 视频资源 · 真实 YouTube 一手内容

> **说明**：本目录保存课程大纲里**每节课对应的真实 YouTube 视频**——已用 WebSearch 多次验证 URL 真实存在。
> **当前状态**：26 个真实 URL + 标题 + 频道（已在 [真实视频清单.md](#真实视频清单) 中），但**字幕未抓**——YouTube 在 2026-04 后大规模 IP 封禁，本机直接拉字幕被拒。
> **解决方案**：跑下面的 `extractor_simple.py` 时**必须开 Clash / V2Ray 等代理**（参考 [M0-12 代理实务](../01_课程大纲.md)），或用 [SaveSubs.com](https://savesubs.com) / [NoteGPT.io](https://notegpt.io) 等第三方网页工具。

---

## 真实视频清单（26 条 · WebSearch 验证）

| 模块 | YouTube URL | 频道 | 标题 |
|---|---|---|---|
| M0-9 GitHub 速读 | https://www.youtube.com/watch?v=wJ42uIVGFA4 | Community | AI Turns ANY GitHub Repo into an EASY Tutorial |
| M0-8 提示词基础 | https://www.youtube.com/watch?v=T9aRN5JkmL8 | Anthropic | AI prompt engineering: A deep dive |
| M0-11 Node/Python/uv | https://www.youtube.com/watch?v=AMdG7IjgSPM | Fireship | UV - A Faster, All-in-One Package Manager to Replace Pip and Venv |
| M1-1 三幕演进 | https://www.youtube.com/watch?v=LCEmiRjPEtQ | Y Combinator (Karpathy) | Andrej Karpathy: Software Is Changing (Again) |
| M1-3 Agent Skills | https://www.youtube.com/watch?v=1WImBwiA7RA | AI Jason | Claude Skills - the SOP for your agent that is bigger than MCP |
| M1-4 MCP 协议 | https://www.youtube.com/watch?v=HyzlYwjoXOQ | Fireship | Claude's Model Context Protocol is here... Let's test it |
| M1-4b MCP 深度 | https://www.youtube.com/watch?v=GuTcle5edjk | Matthew Berman | you need to learn MCP RIGHT NOW!! |
| M2-1 模型选型 | https://www.youtube.com/watch?v=LCEmiRjPEtQ | Y Combinator | Software Is Changing (Karpathy 模型综述部分) |
| M2-3 订阅经济学 | https://www.youtube.com/watch?v=UAxr6bWonFs | Matthew Berman | Cursor VS Claude Code: The Winner |
| M2-4 Ollama 本地 | https://www.youtube.com/watch?v=Wjrdr0NU4Sk | NetworkChuck | host ALL your AI locally |
| M2-5 RAG / AnythingLLM | https://www.youtube.com/watch?v=rK8_EKgoBzg | Community | FREE AnythingLLM RAG AI Agent Local Chat w/Documents |
| M3-2 Midjourney V7 | https://www.youtube.com/watch?v=NHujwKyk9Kk | Matt Wolfe | Midjourney V7 Editor – Step-by-Step Guide |
| M3-2b MJ V7 一致性 | https://www.youtube.com/watch?v=P5_oOykSjHY | Matt Wolfe | Midjourney V7 Guide: Recreate Any Image Consistently |
| M3-3 ComfyUI 入门 | https://www.youtube.com/watch?v=6dXpgL1-YdM | Community | ComfyUI in 20 Minutes: Absolute Beginner Guide |
| M4-2 自动剪辑 | https://www.youtube.com/watch?v=PObU8mK1vBw | Community | BYE VIDEO EDITING... CapCut AI Video Maker (2026) |
| M4-3 HeyGen 数字人 | https://www.youtube.com/watch?v=6JaW8si98q8 | Community | How to Use HeyGen Avatar V (Complete Tutorial) |
| M5-1 Gaussian Splatting | https://www.youtube.com/watch?v=sQcrZHvrEnU | Community | 3D Gaussian Splatting - Explained! |
| M5-2 Polycam 手机扫描 | https://www.youtube.com/watch?v=YcNTv4OrDYg | Community | Create a 3d Model using your Phone! PolyCam 3D Scan Tutorial |
| M6-1 Manus / Computer Use | https://www.youtube.com/watch?v=wVvfXZm4Lvg | Matthew Berman | Manus - The ALL-IN-ONE AI AGENT |
| M6-1b Manus 实测 | https://www.youtube.com/watch?v=D6jxT0E7tzU | Wes Roth | Manus is out of control |
| M6-3 OpenClaw 实操 | https://www.youtube.com/watch?v=rEVL_KR_yNY | Community | Build a 24/7 Personal AI Assistant with OpenClaw |
| M7-1 Vibe Coding | https://www.youtube.com/watch?v=96jN2OCOfLs | Karpathy talk | From Vibe Coding to Agentic Engineering |
| M7-2 Claude Code 入门 | https://www.youtube.com/watch?v=x2WtHZciC74 | Fireship | Claude 3.7 goes hard for programmers |
| M7-3 Cursor vs Claude Code | https://www.youtube.com/watch?v=tCy5cJRErTg | Community | Time to SWITCH...Claude Code vs Cursor debate just ended |
| M7-3b Cursor 非程序员 | https://www.youtube.com/watch?v=faezjTHA5SU | Riley Brown | Complete Guide to Cursor For Non-Coders (Vibe Coding 101) |
| M8-1 个人 Agent 构建 | https://www.youtube.com/watch?v=UPOMkutdGqs | AI Jason | I Built a Personal AI Agent That Does Almost EVERYTHING |

---

## 怎么跑提取器（真正落地）

### 前提：开代理
```bash
# Windows: Clash Verge Rev 开启 TUN 模式
# 或：terminal 直接设环境变量
set HTTPS_PROXY=http://127.0.0.1:7890
set HTTP_PROXY=http://127.0.0.1:7890
```

### 跑批量
```bash
cd 05_视频资源
python extractor_simple.py
```

### 看结果
每个视频会创建一个文件夹：
```
05_视频资源/<topic>/<slug>__<video_id>/
   ├── meta.json        # 元数据
   ├── transcript.txt   # 纯文本字幕
   ├── transcript.srt   # SRT 字幕
   └── notes.md         # 可填的摘要模板
```

---

## 提取器原理

`extractor_simple.py` 用 [youtube-transcript-api](https://github.com/jdepoix/youtube-transcript-api) 直接调 YouTube 公开字幕端点（无需 yt-dlp 走元数据反爬）。

适配点：
- 优先 zh-Hans / zh-CN / en 语言
- 自动 fallback：人工字幕 → 自动字幕 → 任意可用语言
- 输出兼容老 dict 格式与新 `FetchedTranscriptSnippet` 对象格式

---

## 失败原因记录（2026-04-30）

```
ipinfo.io: 你的出口 IP 在 YouTube 黑名单
症状：HTTP 200 + "Sign in to confirm you're not a bot"
解决：
  1. 开商用代理（Clash + 高质量节点）
  2. 等 24-48h IP 解除冷却
  3. 用 SaveSubs / NoteGPT 等 web 工具拷贝字幕
```

---

## 双链
[01_课程大纲.md](../01_课程大纲.md) · [04_示例课程/](../04_示例课程/)
