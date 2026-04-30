# 视频资源 · 真实 YouTube 一手内容（**字幕已成功抓取**）

> **状态**：✅ **25 个视频字幕全部抓到**（18,313 行英文 + 5,647 行中文，自动翻译）。
> **整理后路径**：`05_视频资源/<topic>/<slug>__<id>/{transcript.en.txt, transcript.zh.txt, meta.json, notes.md}`
> **完整报告**：见 [提取报告.md](提取报告.md)

---

## 📊 走通的方案（4 个关键技术点同时满足）

| # | 关键 | 配置 |
|---|---|---|
| 1 | **真实登录 cookies** | Chrome 登录 YT → Get cookies.txt LOCALLY 扩展导出 → cookies.txt（404 行 + 含 SAPISID/LOGIN_INFO/__Secure-1PSID）|
| 2 | **JS runtime 解 n-challenge** | `--js-runtimes node`（用本机 Node 24.11.0）|
| 3 | **远程 challenge solver** | `--remote-components "ejs:github"`（yt-dlp 自动从 GitHub 拉下解码脚本）|
| 4 | **代理绕 IP 黑名单** | `--proxy "http://127.0.0.1:7897"`（你提供的 Clash）|

> 任一项缺失，都会被 YouTube 反爬识破（错误信息会从「IP 黑名单」→「bot detection」→「n-challenge failed」→「Only images available」逐级倒退）。

---

## ✅ 跑通命令（已验证可用，复制即跑）

```powershell
$env:HTTP_PROXY="http://127.0.0.1:7897"
$env:HTTPS_PROXY="http://127.0.0.1:7897"
$env:Path = "C:\Users\hyinn\AppData\Local\nvm\v24.11.0;$env:Path"
cd "C:\Users\hyinn\Desktop\AI_Courses_Clean\05_视频资源"

& "C:\Users\hyinn\AppData\Roaming\Python\Python313\Scripts\yt-dlp.exe" `
  --skip-download --write-auto-subs --write-subs --sub-langs "en,zh-Hans" `
  --proxy "http://127.0.0.1:7897" --cookies cookies.txt `
  --js-runtimes node --remote-components "ejs:github" `
  --write-info-json --ignore-errors `
  -o "%(title).80s_%(id)s.%(ext)s" --batch-file urls.txt

# 整理到 per-video 文件夹
python organize_transcripts.py
python rebuild_report.py
```

## 拿到的字幕用来做什么

每个 per-video 文件夹（`05_视频资源/<topic>/<slug>__<id>/`）有：
- `transcript.en.txt` — 干净英文纯文本（去时间戳/去重）
- `transcript.zh.txt` — 中文自动翻译（9 个有，YouTube 自带翻译）
- `notes.md` — 待填的"摘要 / 关键 3-5 条 / 与课程串联"模板
- `meta.json` — 元数据（title / channel / topic / 字幕行数）

**下一步**：把每个 `transcript.en.txt` + `notes.md` 喂给 Claude/Cursor，让 AI 自动填好 `notes.md` 的摘要——这就是"花园老师 AI 教程资源合集"那种把 100+ 视频汇总进知识库的自动化路径。

---

## 📁 工具集

| 文件 | 用途 |
|---|---|
| [extractor_simple.py](extractor_simple.py) | youtube-transcript-api 字幕抓取（已支持代理） |
| [export_cookies.py](export_cookies.py) | 用 browser_cookie3 自动导出 cookies（DPAPI 受限时用方案 B） |
| [urls.txt](urls.txt) | 纯 URL 列表，喂给 yt-dlp `--batch-file` |
| [真实视频清单.md](#真实视频清单) | 26 个真实视频的元数据表 |
| [提取报告.md](提取报告.md) | 上次运行的诊断报告 |

---

## 真实视频清单（26 条 · 全部 WebSearch 验证）

| 模块 | YouTube URL | 频道 | 标题 |
|---|---|---|---|
| M0-9 GitHub 速读 | https://www.youtube.com/watch?v=wJ42uIVGFA4 | Community | AI Turns ANY GitHub Repo into an EASY Tutorial |
| M0-8 提示词基础 | https://www.youtube.com/watch?v=T9aRN5JkmL8 | Anthropic | AI prompt engineering: A deep dive |
| M0-11 Node/Python/uv | https://www.youtube.com/watch?v=AMdG7IjgSPM | Fireship | UV - A Faster, All-in-One Package Manager |
| M1-1 三幕演进 | https://www.youtube.com/watch?v=LCEmiRjPEtQ | Y Combinator (Karpathy) | Andrej Karpathy: Software Is Changing (Again) |
| M1-3 Agent Skills | https://www.youtube.com/watch?v=1WImBwiA7RA | AI Jason | Claude Skills - the SOP for your agent that is bigger than MCP |
| M1-4 MCP 协议 | https://www.youtube.com/watch?v=HyzlYwjoXOQ | Fireship | Claude's Model Context Protocol is here... Let's test it |
| M1-4b MCP 深度 | https://www.youtube.com/watch?v=GuTcle5edjk | Matthew Berman | you need to learn MCP RIGHT NOW!! |
| M2-1 模型选型 | https://www.youtube.com/watch?v=LCEmiRjPEtQ | Y Combinator | Software Is Changing |
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

## 跑通后字幕会落到哪里

```
05_视频资源/
├── Software Is Changing (Again)_LCEmiRjPEtQ.en.srt
├── Software Is Changing (Again)_LCEmiRjPEtQ.info.json
├── AI prompt engineering A deep dive_T9aRN5JkmL8.en.srt
├── AI prompt engineering A deep dive_T9aRN5JkmL8.info.json
└── ... 26 对文件
```

每对 .srt + .info.json 可以直接喂给 Claude/Cursor 让它填到课程大纲里。

---

## 双链
[01_课程大纲.md](../01_课程大纲.md) · [04_示例课程/](../04_示例课程/)
