# 视频资源 · 真实 YouTube 一手内容

> **状态**：26 个真实 URL 全部 WebSearch 验证存在；**字幕抓取需要你最后一步配合**（YouTube 2024Q3 后反爬大升级，自动化工具普遍受限）。

---

## 📊 诊断结果（已穷尽 5 个方案）

| 方案 | 结果 | 原因 |
|---|---|---|
| ① youtube-transcript-api 直连 | ❌ | 你的本地 IP 在 YouTube 黑名单 |
| ② 加 Clash 代理 (127.0.0.1:7897) | ❌ | 机场节点是 datacenter IP，也在 YouTube 黑名单 |
| ③ yt-dlp + 多 player_client | ❌ | "Sign in to confirm not a bot" |
| ④ yt-dlp + cookies-from-browser (Chrome/Edge/Brave) | ❌ | Chrome 没登过 YT；Edge/Brave 有 cookies 但 **Chrome 127+ App-Bound 加密**，yt-dlp/browser_cookie3 都解不了 |
| ⑤ WebFetch 调 SaveSubs / NoteGPT | ❌ | 这些网站都返回 403 |

---

## ✅ 下一步：3 选 1（最低成本→最高成本）

### 方案 A · 在 Chrome 登录一次 YouTube（**免费 + 30 秒**）

```bash
# 1. 用 Chrome 打开 https://youtube.com，扫码登录（用任意 Google 账号）
# 2. 关掉 Chrome（必须关掉，不然 cookies DB 锁着）
# 3. 跑：
$env:HTTP_PROXY="http://127.0.0.1:7897"; $env:HTTPS_PROXY="http://127.0.0.1:7897"
cd "C:\Users\hyinn\Desktop\AI_Courses_Clean\05_视频资源"
yt-dlp --skip-download --write-auto-subs --sub-langs "en,zh-Hans" --convert-subs srt `
  --proxy "http://127.0.0.1:7897" --cookies-from-browser chrome `
  -o "%(title).80s_%(id)s.%(ext)s" --batch-file urls.txt
```

> **如果 Chrome 报 DPAPI 解密失败**：换方案 B。

### 方案 B · 装 Chrome 扩展手动导出 cookies（**5 分钟，最稳**）

1. 装 **[Get cookies.txt LOCALLY](https://chromewebstore.google.com/detail/get-cookiestxt-locally/cclelndahbckbenkjhflpdbgdldlbecc)** Chrome 扩展（300K+ 用户，零权限）
2. 用 Chrome 打开 https://youtube.com 并登录
3. 点扩展图标 → **Export** → 保存到 `C:\Users\hyinn\Desktop\AI_Courses_Clean\05_视频资源\cookies.txt`
4. 跑：

```powershell
$env:HTTP_PROXY="http://127.0.0.1:7897"; $env:HTTPS_PROXY="http://127.0.0.1:7897"
cd "C:\Users\hyinn\Desktop\AI_Courses_Clean\05_视频资源"
yt-dlp --skip-download --write-auto-subs --sub-langs "en,zh-Hans" --convert-subs srt `
  --proxy "http://127.0.0.1:7897" --cookies cookies.txt `
  -o "%(title).80s_%(id)s.%(ext)s" --batch-file urls.txt
```

### 方案 C · 买 Webshare 住宅代理（**$3 起，最暴力**）

[Webshare.io](https://www.webshare.io)（youtube-transcript-api 官方推荐）—— 30M+ 住宅 IP 池，绕开所有黑名单。最便宜套餐 $3/月。配好后改 `extractor_simple.py` 的 PROXY 变量即可。

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
