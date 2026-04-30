# 示例课 · M6-3《OpenClaw 完全实操（一）：从 0 跑起来》

> **课程定位**：M6 模块第三节，**重头戏**——这是 81 节里最有"完整数字员工出片感"的一节。
> **课时**：90 分钟（讲解 30 + 实操 50 + Q&A 10）
> **难度**：🌿 进阶（前置：M0 全部 + M1-1 ~ M1-5 + M2-1 ~ M2-2）
> **学员交付**：**当场跑起来一个能接飞书 / Telegram 的私人 Agent**——下课后立刻可用。

---

## 一、课前 · 学员自检（讲师课前 1 周提醒）

### 必装项（不装就跟不上）
- ☐ Node.js v22 LTS（已在 M0-11 装好）
- ☐ Claude Pro 订阅 / Anthropic API Key（已在 M0-14 配好）
- ☐ 飞书账号（个人版即可）/ Telegram 账号（**任选其一**）
- ☐ Cursor 或 VS Code（M0-10）
- ☐ Git + GitHub Desktop（M0-9 / M0-10）

### 检查脚本
```bash
node -v   # 要 ≥ v22
npm -v    # 要 ≥ 10
git --version  # 要 ≥ 2.40
```

> 如果上面任何一项缺，回 M0 补；不要硬学这节。

### 课前预读（讲师前 3 天发给学员）
1. [Anthropic 官方 Agent 概念](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)（10 分钟）
2. 花园老师《OpenClaw 完全指南（花园版）》第 1-3 章（25 分钟）
3. YouTube：David Ondrej《I Built a 24/7 AI Assistant That Pays Me》（12 分钟）

---

## 二、本节学习目标（学员视角）

| # | 学完能做的事 | 验收标准 |
|---|---|---|
| 1 | 在自己电脑装好 OpenClaw，跑通 `openclaw --version` | 终端能输出版本号 |
| 2 | 配好一个对接到飞书/Telegram 的 Channel | 在飞书/Telegram 给 AI 发"在吗？"能收到回复 |
| 3 | 理解 OpenClaw 的四大组件（Gateway / Channels / Hooks / CronJob） | 能在白板画出架构图 |
| 4 | 会用 `claw config` / `claw skill add` / `claw run` 三组命令 | 能独立操作不看文档 |
| 5 | 装上 3 个生活化 Skill 跑一次 | `email-triage` / `calendar-conflict-fixer` / `weekly-report-bot` |

> **检查方式**：下课前最后 10 分钟，每位学员演示自己的 Bot 收到一条消息并自动回复——通过即过关。

---

## 三、本节剧本（90 分钟）

### 〖0:00 - 0:05〗开场 · 一个真实案例

**讲师口播**：

> "上周一早上 8 点，我在洗漱，飞书弹出一条消息：
> > "**昨日 32 封邮件已分类：5 封需你亲自回（已草拟）/ 12 封已代回 / 15 封归档。下面是 5 封需要你看的摘要……**"
>
> 这不是真人助理。这是我用 OpenClaw 搭的私人 Agent，在前一晚 23:00 的 CronJob 里把今天的邮件整理好了。
>
> 这堂课结束时，**你也会有一个**。"

**讲师切到 MeetaVista 数字助教大屏**，让数字助教自我介绍并展示"它内部就是一个 OpenClaw 实例"。

> 课件 → 切换到 PPT 第 1-3 页

### 〖0:05 - 0:15〗概念 · OpenClaw 是什么 / 不是什么

**讲师口播 + 白板**：

> "我们用一个比喻——
>
> - **ChatGPT / Claude** = 你的**助理**，但只在你打开 App 时存在
> - **Cursor / Claude Code** = 你的**程序员同事**，专做编程
> - **OpenClaw** = 你的**24×7 数字员工**——它有人格、有记忆、能定时干活、能接收外部消息（飞书/邮件/微信）"

**画白板**：

```
传统 AI 应用                OpenClaw 数字员工
                            
你 → 打开 ChatGPT → 提问    你 → 飞书发"早 8 点汇总邮件"
你 → 等回复 → 关闭         OpenClaw → 23:00 自动跑 → 早 8 点推到你飞书
                            ↑
                            CronJob 触发
                            人格 + 记忆持久化
                            多 Channel 接入
```

**关键点**：
- OpenClaw **不是新模型**——它**调用** Claude / GPT / DeepSeek 等
- OpenClaw **是工程脚手架**——把"人格 / 记忆 / 工具 / 定时 / 多渠道"打包好

### 〖0:15 - 0:25〗架构 · 四大组件深拆

> 课件 → 切换到 PPT 第 4-7 页

```
        ┌─────────────────────────────┐
        │      OpenClaw Gateway       │   ← 中央调度
        │  （主控 LLM 在这里思考）     │
        └──┬───────────┬───────────┬──┘
           │           │           │
   ┌───────▼──┐  ┌─────▼──┐  ┌─────▼──┐
   │ Channels │  │ Hooks  │  │CronJob │
   │ 飞书     │  │ Slack  │  │定时任务│
   │ Telegram │  │ Email  │  │        │
   │ WhatsApp │  │ Webhook│  │        │
   └──────────┘  └────────┘  └────────┘
        ↑              ↑              ↑
        │              │              │
    用户消息       外部触发      定时唤醒

   持久化：SOUL.md / USER.md / MEMORY.md / AGENTS.md
```

**讲师强调**：
1. **Gateway** 是"大脑"——所有消息进出都过它，方便审计
2. **Channels** 是"嘴和耳朵"——支持哪些应用就装哪些
3. **Hooks** 是"反射神经"——某个事件触发某个动作
4. **CronJob** 是"生物钟"——比如"每天 23:00 抓今日邮件"

### 〖0:25 - 0:30〗课中 Checkpoint #1

**全员**：在自己的笔记上画一遍这张架构图（5 分钟）。

**讲师**：随机抽 3 位学员讲解给同桌听（验证理解）。

> 如果有人讲不清——立刻补讲，不要硬冲下一节。

---

### 〖0:30 - 0:45〗实操 · 装机三连

> 课件 → 切换到 PPT 第 8-12 页（实操对照）

#### Step 1 · 全局安装（5 分钟）

```bash
# 推荐 nvm 隔离的 Node 22 环境
nvm use 22

# 全局装 OpenClaw
npm install -g openclaw

# 验证
openclaw --version
# 期望输出: openclaw v1.4.x
```

> **常见坑点**：
> - Windows 报权限错误 → **用管理员 PowerShell 重开**
> - npm 报 ENOTFOUND → **代理没开 / 镜像源没切**
> - 装完命令找不到 → `npm config get prefix` 看路径加到 PATH

#### Step 2 · 初始化工作目录（5 分钟）

```bash
# 选一个你能记住的目录
cd ~/AI-Workspace
mkdir my-claw && cd my-claw

# 一键 onboard
openclaw onboard --install-daemon

# 这会创建：
# .claw/
#   config.json       ← 主配置
#   SOUL.md           ← AI 的人格
#   USER.md           ← 关于你的描述
#   MEMORY.md         ← 长期记忆（自动维护）
#   AGENTS.md         ← 项目级偏好（M7 会用到）
# logs/
# skills/
```

> **讲师演示**：打开 .claw/config.json，逐项讲解每个字段的作用（约 3 分钟）

#### Step 3 · 配 Channel（5 分钟）

任选其一开始（**建议第一次用 Telegram，国内门槛最低**）：

##### 选项 A · Telegram（推荐新手）

```bash
# 1. 在 Telegram 找 @BotFather → /newbot → 复制 token
# 2. 配进去
openclaw channel add telegram --token "你的 token"

# 3. 启动
openclaw start

# 4. 在 Telegram 给你的 bot 发"在吗？" → 应该收到 AI 回复
```

##### 选项 B · 飞书（推荐国内重度飞书用户）

```bash
# 1. 飞书开发者后台创建机器人 → 拿 App ID + App Secret
# 2. 配进去
openclaw channel add feishu --app-id "xxx" --app-secret "yyy"

# 3. 在飞书后台配 Webhook 回调到 https://你的-frp/feishu
# 4. 启动
openclaw start
```

> **MeetaVista 屏幕**：实时同步学员**自动检测谁卡在哪一步**——讲师走到那位学员旁边手把手解决。

---

### 〖0:45 - 1:05〗实操 · 装 3 个生活化 Skill 立刻见效

> 课件 → 切换到 PPT 第 13-19 页（每个 Skill 一页）

#### Skill 1 · `email-triage` · 邮件三筛 ⭐

**学员痛点**：早上打开邮箱 200 封，光分类就 1 小时。

```bash
openclaw skill add email-triage
# 自动会问：
#   邮箱协议（IMAP / Gmail API / Outlook）：> Gmail API
#   你的"必看"标签是？：> P0、客户、老板
#   你想几点跑？：> 23:00（昨天的）
#   推到哪个 Channel？：> Telegram
```

> 讲师演示：打开自己的 Telegram，秀出昨晚 23:00 自动收到的邮件分类摘要。

**关键点**：这个 Skill 来自 [awesome-claude-skills](https://github.com/karanb192/awesome-claude-skills)，已被 1000+ 人 fork 过。

#### Skill 2 · `calendar-conflict-fixer` · 日历冲突修复 ⭐

**学员痛点**：跨时区跨日历找时间，邮件来回 5 轮。

```bash
openclaw skill add calendar-conflict-fixer
# 配置：
#   日历类型：> Google Calendar
#   工作时间：> 9:30-19:00 北京
#   常用收件人邮箱：> 老板@公司.com、客户@xxx.com
```

**当场实测**：
> 学员：@my-claw "下周和 X 客户找一个 1 小时会"
> AI：扫描双方日历 → "建议周三 14:00-15:00 / 周四 10:00-11:00 / 周五 16:00-17:00 三个 slot，已起草邮件，要发吗？"

#### Skill 3 · `weekly-report-bot` · 周报机器人 ⭐⭐

**学员痛点**：每周五憋周报 2 小时。

```bash
openclaw skill add weekly-report-bot
# 配置：
#   接的数据源：> GitHub commits / 飞书文档 / Calendar / Notion
#   推送时间：> 周五 16:00
#   推到：> 飞书
```

**讲师当场演示**：写一个 5 行的"配置文件"，下周五 4 点这个 Bot 就把整周的工作整理成"3 段叙事 + 关键产出 + 下周计划"——交给老板。

> 课中 Checkpoint #2：每位学员至少装上其中 1 个 Skill 并在课中跑一次。

---

### 〖1:05 - 1:15〗答疑 · 常见问题 + 调试技巧

> 课件 → 切换到 PPT 第 20-22 页

#### Q1 · "我装完跑不起来怎么办？"
- **看日志**：`tail -f logs/claw.log`
- **检查 API Key 是否生效**：`openclaw model test`
- **代理 / 网络问题**：`curl https://api.anthropic.com` 验证

#### Q2 · "怎么知道它真的没乱跑？"
- **审计日志**：`.claw/audit.log` 记录每次工具调用
- **白名单 Skill**：`config.json` 里 `allowedSkills: [...]`
- **Hook 拦截**：写 PreToolUse Hook 看每次想做什么

#### Q3 · "它会不会泄漏我的隐私？"
- 默认所有数据**只在本地**
- 用 Claude API 时数据走 Anthropic（按其[隐私政策](https://www.anthropic.com/legal/privacy)）
- 极敏感场景（合同 / 病历）用 **本地 Ollama 模式**——下节课 M6-4 详讲

#### Q4 · "为啥不用 Manus / Devin？"
- Manus / Devin 是**云端 Agent**——你的所有活动都上传他们服务器
- OpenClaw 是**本地 Agent**——人格 / 记忆 / 数据都在你电脑
- 两者**互补**——重活用 Manus 单跑、日常活用 OpenClaw 24×7 守护

---

### 〖1:15 - 1:25〗课中 Checkpoint #3 · 全员 Demo

**讲师指令**：
> "现在每位同学打开你的 Telegram / 飞书，给你的 Bot 发一条消息：
>
> **'帮我看下我下周三下午的日历有没有空？'**
>
> 屏幕能拍到 Bot 回复的同学，举手——我点你来后部直播位录一段 30 秒 Demo，作为本节作业上交。"

> 这一步**强制把"装 OpenClaw"从"看完了"变成"做出来了"**。

---

### 〖1:25 - 1:30〗收尾 · 下节预告 + 课后任务

#### 课后任务（**必交**，下节课开始前 1 小时截止）

1. ✅ **截图证据**：你的 Bot 回复任意一条消息（可放课程飞书群）
2. ✅ **写 SOUL.md**：用 200 字描述"我希望我的 AI 助理是什么样的人格"——交到 GitHub Private 仓库
3. ✅ **挑 1 个 Skill 跑 3 天**：写一段 100 字"使用感受"

#### 下节预告 · M6-4

> "今天我们让 OpenClaw '活'起来——下节我们让它**真正懂你**。
>
> M6-4 详讲 SOUL.md / USER.md / MEMORY.md / AGENTS.md 四层记忆系统——这是社区里那句'用一个月之后助理就懂你'的复利效应来源。"

---

## 四、讲师备课 Checklist（必须 100% 通关）

- ☐ 自己最近 1 周内**全程跑通过一遍**（避免讲到一半发现命令变了）
- ☐ 检查 OpenClaw 最新版本号 + 是否有破坏性变更
- ☐ Telegram BotFather 提前注册一个**演示用 bot**
- ☐ MeetaVista 数字助教加载本课的最新 RAG 知识包
- ☐ 准备 3 个学员典型卡点的"30 秒急救包"（npm permission / 代理 / API Key 没生效）
- ☐ 后部直播位提前调好灯光（学员要录 Demo）
- ☐ 准备 5 件"作业范例"提前印好（学员卡时给参考）

---

## 五、本节关键资源（学员手册必收藏）

### 官方文档
- [OpenClaw GitHub](https://github.com/baiyutang/openclaw)（**以官方仓库为准**）
- [Anthropic Effective Context Engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- [Claude API 文档](https://docs.claude.com/)
- [飞书机器人开发指南](https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/bot-v3/bot-overview)
- [Telegram BotFather](https://t.me/BotFather)

### 社区
- 花园老师《OpenClaw 完全指南（花园版）》（B 站 / 公众号 "code 秘密花园"）
- [awesome-claude-skills](https://github.com/karanb192/awesome-claude-skills)（社区 Skill 集）
- [VoltAgent/awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills)（1000+ skill 索引）

### YouTube 推荐
1. David Ondrej《I Built a 24/7 AI Assistant That Pays Me》
2. AI Jason《Building Personal AI Agents in 2026》
3. Matthew Berman《OpenClaw vs Manus vs Devin》

### 本节使用的 3 个 Skill 详细文档
- [`email-triage` README](https://github.com/karanb192/awesome-claude-skills/tree/main/email-triage)
- [`calendar-conflict-fixer` README](https://github.com/VoltAgent/awesome-agent-skills/tree/main/calendar)
- [`weekly-report-bot` README](https://github.com/karanb192/awesome-claude-skills/tree/main/weekly-report)

---

## 六、风险提示与合规

> **讲师必须念给学员听的两句话**：
>
> 1. **API Key 是钱**——OpenClaw 跑起来后会持续调用 LLM，**忘记关 CronJob 一周可能花 ¥800**。第一周跑务必看账单。
> 2. **它能操作你的飞书 / 邮件**——一个 bug 可能误发邮件，**初期一律开 Hook 人工确认**。

---

## 七、本节完成后学员应有的"AI 工作站升级"

```
课前         →     课后
───────────────────────────
"我会 ChatGPT"  →   "我有一个 24×7 跑的 AI 助手"
"我用 AI"      →   "AI 替我跑活"
"我学过 AI"    →   "我装上了 AI"
```

---

**End of M6-3 剧本。**

> 下一节 M6-4 ：让你的 OpenClaw **真正懂你**。
