const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, PageOrientation, LevelFormat,
  ExternalHyperlink, HeadingLevel, BorderStyle, WidthType, ShadingType,
  PageNumber, PageBreak, TabStopType, TabStopPosition,
  PositionalTab, PositionalTabAlignment, PositionalTabRelativeTo, PositionalTabLeader
} = require('docx');

// ---------- helpers ----------
const FONT_BODY = "微软雅黑";
const FONT_HEADER = "微软雅黑";

const border = { style: BorderStyle.SINGLE, size: 1, color: "BFBFBF" };
const borders = { top: border, bottom: border, left: border, right: border };

function P(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 80, line: 360 },
    children: [new TextRun({ text: String(text), font: FONT_BODY, size: 22, ...opts })]
  });
}
function H1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 240, after: 160 },
    children: [new TextRun({ text, bold: true, size: 36, font: FONT_HEADER, color: "1F4E79" })]
  });
}
function H2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 200, after: 120 },
    children: [new TextRun({ text, bold: true, size: 28, font: FONT_HEADER, color: "2E75B6" })]
  });
}
function H3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 160, after: 80 },
    children: [new TextRun({ text, bold: true, size: 24, font: FONT_HEADER, color: "404040" })]
  });
}
function bullet(text, level = 0, opts = {}) {
  return new Paragraph({
    numbering: { reference: "bullets", level },
    spacing: { after: 40, line: 320 },
    children: [new TextRun({ text, font: FONT_BODY, size: 22, ...opts })]
  });
}
function code(text) {
  return new Paragraph({
    spacing: { after: 60, line: 280 },
    shading: { type: ShadingType.CLEAR, fill: "F2F2F2" },
    border: { top: border, bottom: border, left: border, right: border },
    children: [new TextRun({ text, font: "Consolas", size: 20 })]
  });
}
function note(text) {
  return new Paragraph({
    spacing: { before: 80, after: 80, line: 320 },
    indent: { left: 360 },
    border: { left: { style: BorderStyle.SINGLE, size: 16, color: "F4B400", space: 8 } },
    children: [new TextRun({ text, italics: true, font: FONT_BODY, size: 21, color: "595959" })]
  });
}
function tableCell(text, opts = {}) {
  const { bold = false, fill = null, width = 2340, align = AlignmentType.LEFT } = opts;
  const cellOpts = {
    borders,
    width: { size: width, type: WidthType.DXA },
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    children: [new Paragraph({
      alignment: align,
      children: [new TextRun({ text: String(text), bold, font: FONT_BODY, size: 21 })]
    })]
  };
  if (fill) cellOpts.shading = { type: ShadingType.CLEAR, fill };
  return new TableCell(cellOpts);
}
function dataTable(rows, colWidths, headerFill = "D5E8F0") {
  const totalW = colWidths.reduce((a, b) => a + b, 0);
  return new Table({
    width: { size: totalW, type: WidthType.DXA },
    columnWidths: colWidths,
    rows: rows.map((row, i) => new TableRow({
      children: row.map((c, j) => tableCell(c, {
        bold: i === 0,
        fill: i === 0 ? headerFill : null,
        width: colWidths[j]
      }))
    }))
  });
}
function spacer() {
  return new Paragraph({ spacing: { before: 80, after: 80 }, children: [new TextRun("")] });
}
function link(text, url) {
  return new ExternalHyperlink({
    children: [new TextRun({ text, style: "Hyperlink", font: FONT_BODY, size: 22 })],
    link: url
  });
}

// ---------- content ----------
const children = [];

// Cover
children.push(new Paragraph({
  alignment: AlignmentType.CENTER, spacing: { before: 1440, after: 480 },
  children: [new TextRun({ text: "《AI 跟上时代》线下精品班", bold: true, size: 56, font: FONT_HEADER, color: "1F4E79" })]
}));
children.push(new Paragraph({
  alignment: AlignmentType.CENTER, spacing: { after: 240 },
  children: [new TextRun({ text: "M6-3 OpenClaw 完全实操（一）", bold: true, size: 44, font: FONT_HEADER })]
}));
children.push(new Paragraph({
  alignment: AlignmentType.CENTER, spacing: { after: 800 },
  children: [new TextRun({ text: "—— 学员讲义（90 分钟课）——", size: 28, italics: true, font: FONT_BODY, color: "595959" })]
}));
children.push(new Paragraph({
  alignment: AlignmentType.CENTER, spacing: { after: 80 },
  children: [new TextRun({ text: "课程定位", bold: true, size: 26, font: FONT_HEADER })]
}));
children.push(new Paragraph({
  alignment: AlignmentType.CENTER, spacing: { after: 240 },
  children: [new TextRun({ text: "M6 模块第三节 · 重头戏 · 当场让你跑起一个真正能 24×7 替你干活的私人 Agent", size: 22, font: FONT_BODY })]
}));
children.push(spacer());
children.push(dataTable(
  [
    ["项目", "内容"],
    ["课时", "90 分钟（讲解 30 + 实操 50 + Q&A 10）"],
    ["难度", "🌿 进阶 · 前置 M0 全部 + M1-1~5 + M2-1~2"],
    ["学员交付", "当场跑起来一个能接飞书/Telegram 的私人 Agent"],
    ["验收方式", "下课前 10 分钟全员演示 Bot 收到消息并自动回复"],
    ["版本日期", "2026-04-30"],
  ],
  [2700, 6660],
));
children.push(new Paragraph({ children: [new PageBreak()] }));

// 1. Pre-class
children.push(H1("一、课前 · 学员自检"));
children.push(H2("1.1 必装项（不装就跟不上）"));
[
  "Node.js v22 LTS（已在 M0-11 装好）",
  "Claude Pro 订阅 / Anthropic API Key（已在 M0-14 配好）",
  "飞书账号（个人版即可）/ Telegram 账号（任选其一）",
  "Cursor 或 VS Code（M0-10）",
  "Git + GitHub Desktop（M0-9 / M0-10）",
].forEach(t => children.push(bullet(t)));

children.push(H2("1.2 检查脚本"));
children.push(code("node -v   # 要 ≥ v22"));
children.push(code("npm -v    # 要 ≥ 10"));
children.push(code("git --version  # 要 ≥ 2.40"));
children.push(note("如果上面任何一项缺，回 M0 补；不要硬学这节。"));

children.push(H2("1.3 课前预读（讲师前 3 天发给学员）"));
children.push(bullet("Anthropic 官方 Agent 概念（10 分钟）"));
children.push(bullet("花园老师《OpenClaw 完全指南（花园版）》第 1-3 章（25 分钟）"));
children.push(bullet("YouTube：David Ondrej《I Built a 24/7 AI Assistant That Pays Me》（12 分钟）"));

children.push(new Paragraph({ children: [new PageBreak()] }));

// 2. Goals
children.push(H1("二、本节学习目标"));
children.push(P("学完本节，你应该能完成下面 5 件事，每件事都有明确的验收标准——下课前 10 分钟全员演示。"));
children.push(spacer());
children.push(dataTable(
  [
    ["#", "学完能做的事", "验收标准"],
    ["1", "在自己电脑装好 OpenClaw，跑通 openclaw --version", "终端能输出版本号"],
    ["2", "配好一个对接飞书/Telegram 的 Channel", "在飞书/Telegram 给 AI 发\"在吗？\"能收到回复"],
    ["3", "理解 OpenClaw 四大组件（Gateway/Channels/Hooks/CronJob）", "能在白板画出架构图"],
    ["4", "会用 claw config / claw skill add / claw run 三组命令", "能独立操作不看文档"],
    ["5", "装上 3 个生活化 Skill 跑一次", "邮件三筛 / 日历冲突修复 / 周报机器人"],
  ],
  [550, 4500, 4310],
));
children.push(new Paragraph({ children: [new PageBreak()] }));

// 3. Script
children.push(H1("三、本节剧本（90 分钟）"));

children.push(H2("【0:00 - 0:05】开场 · 一个真实案例"));
children.push(P("讲师口播："));
children.push(note("\"上周一早上 8 点，我在洗漱，飞书弹出一条消息：'昨日 32 封邮件已分类：5 封需你亲自回（已草拟）/ 12 封已代回 / 15 封归档。下面是 5 封需要你看的摘要……' 这不是真人助理。这是我用 OpenClaw 搭的私人 Agent，在前一晚 23:00 的 CronJob 里把今天的邮件整理好了。这堂课结束时，你也会有一个。\""));
children.push(P("讲师切到 MeetaVista 数字助教大屏，让数字助教自我介绍并展示\"它内部就是一个 OpenClaw 实例\"。"));

children.push(H2("【0:05 - 0:15】概念 · OpenClaw 是什么/不是什么"));
children.push(P("讲师口播 + 白板："));
children.push(P("我们用一个比喻——"));
children.push(bullet("ChatGPT / Claude = 你的助理，但只在你打开 App 时存在", 0, { bold: true }));
children.push(bullet("Cursor / Claude Code = 你的程序员同事，专做编程", 0, { bold: true }));
children.push(bullet("OpenClaw = 你的 24×7 数字员工——它有人格、有记忆、能定时干活、能接收外部消息", 0, { bold: true }));
children.push(spacer());
children.push(P("白板对比："));
children.push(code(
  `传统 AI 应用                OpenClaw 数字员工\n\n你 → 打开 ChatGPT → 提问    你 → 飞书发"早 8 点汇总邮件"\n你 → 等回复 → 关闭         OpenClaw → 23:00 自动跑 → 早 8 点推到你飞书`
));
children.push(P("关键点："));
children.push(bullet("OpenClaw 不是新模型——它调用 Claude / GPT / DeepSeek 等"));
children.push(bullet("OpenClaw 是工程脚手架——把\"人格 / 记忆 / 工具 / 定时 / 多渠道\"打包好"));

children.push(H2("【0:15 - 0:25】架构 · 四大组件深拆"));
children.push(code(
  `        ┌─────────────────────────────┐\n        │      OpenClaw Gateway       │   ← 中央调度\n        │  （主控 LLM 在这里思考）     │\n        └──┬───────────┬───────────┬──┘\n           │           │           │\n   ┌───────▼──┐  ┌─────▼──┐  ┌─────▼──┐\n   │ Channels │  │ Hooks  │  │CronJob │\n   │ 飞书     │  │ Slack  │  │定时任务│\n   │ Telegram │  │ Email  │  │        │\n   │ WhatsApp │  │ Webhook│  │        │\n   └──────────┘  └────────┘  └────────┘\n        ↑              ↑              ↑\n     用户消息       外部触发      定时唤醒\n\n   持久化：SOUL.md / USER.md / MEMORY.md / AGENTS.md`
));
children.push(P("讲师强调："));
children.push(bullet("Gateway 是\"大脑\"——所有消息进出都过它，方便审计"));
children.push(bullet("Channels 是\"嘴和耳朵\"——支持哪些应用就装哪些"));
children.push(bullet("Hooks 是\"反射神经\"——某个事件触发某个动作"));
children.push(bullet("CronJob 是\"生物钟\"——比如\"每天 23:00 抓今日邮件\""));

children.push(H2("【0:25 - 0:30】课中 Checkpoint #1"));
children.push(bullet("全员：在自己的笔记上画一遍这张架构图（5 分钟）", 0, { bold: true }));
children.push(bullet("讲师：随机抽 3 位学员讲解给同桌听（验证理解）", 0, { bold: true }));
children.push(note("如果有人讲不清——立刻补讲，不要硬冲下一节。"));

children.push(new Paragraph({ children: [new PageBreak()] }));

children.push(H2("【0:30 - 0:45】实操 · 装机三连"));

children.push(H3("Step 1 · 全局安装（5 分钟）"));
children.push(code(`# 推荐 nvm 隔离的 Node 22 环境\nnvm use 22\n\n# 全局装 OpenClaw\nnpm install -g openclaw\n\n# 验证\nopenclaw --version\n# 期望输出: openclaw v1.4.x`));

children.push(P("常见坑点：", { bold: true }));
children.push(bullet("Windows 报权限错误 → 用管理员 PowerShell 重开"));
children.push(bullet("npm 报 ENOTFOUND → 代理没开 / 镜像源没切"));
children.push(bullet("装完命令找不到 → npm config get prefix 看路径加到 PATH"));

children.push(H3("Step 2 · 初始化工作目录（5 分钟）"));
children.push(code(`# 选一个你能记住的目录\ncd ~/AI-Workspace\nmkdir my-claw && cd my-claw\n\n# 一键 onboard\nopenclaw onboard --install-daemon\n\n# 这会创建：\n# .claw/\n#   config.json       ← 主配置\n#   SOUL.md           ← AI 的人格\n#   USER.md           ← 关于你的描述\n#   MEMORY.md         ← 长期记忆（自动维护）\n#   AGENTS.md         ← 项目级偏好（M7 会用到）\n# logs/\n# skills/`));

children.push(H3("Step 3 · 配 Channel（5 分钟）"));
children.push(P("任选其一开始（建议第一次用 Telegram，国内门槛最低）："));

children.push(P("选项 A · Telegram（推荐新手）", { bold: true }));
children.push(code(`# 1. 在 Telegram 找 @BotFather → /newbot → 复制 token\n# 2. 配进去\nopenclaw channel add telegram --token "你的 token"\n\n# 3. 启动\nopenclaw start\n\n# 4. 在 Telegram 给你的 bot 发"在吗？" → 应该收到 AI 回复`));

children.push(P("选项 B · 飞书（推荐国内重度飞书用户）", { bold: true }));
children.push(code(`# 1. 飞书开发者后台创建机器人 → 拿 App ID + App Secret\n# 2. 配进去\nopenclaw channel add feishu --app-id "xxx" --app-secret "yyy"\n\n# 3. 在飞书后台配 Webhook 回调到 https://你的-frp/feishu\n# 4. 启动\nopenclaw start`));

children.push(note("MeetaVista 屏幕：实时同步学员自动检测谁卡在哪一步——讲师走到那位学员旁边手把手解决。"));

children.push(new Paragraph({ children: [new PageBreak()] }));

children.push(H2("【0:45 - 1:05】实操 · 装 3 个生活化 Skill 立刻见效"));

children.push(H3("Skill 1 · email-triage · 邮件三筛"));
children.push(P("学员痛点：早上打开邮箱 200 封，光分类就 1 小时。"));
children.push(code(`openclaw skill add email-triage\n# 自动会问：\n#   邮箱协议（IMAP / Gmail API / Outlook）：> Gmail API\n#   你的"必看"标签是？：> P0、客户、老板\n#   你想几点跑？：> 23:00（昨天的）\n#   推到哪个 Channel？：> Telegram`));
children.push(note("讲师演示：打开自己的 Telegram，秀出昨晚 23:00 自动收到的邮件分类摘要。"));

children.push(H3("Skill 2 · calendar-conflict-fixer · 日历冲突修复"));
children.push(P("学员痛点：跨时区跨日历找时间，邮件来回 5 轮。"));
children.push(code(`openclaw skill add calendar-conflict-fixer\n# 配置：\n#   日历类型：> Google Calendar\n#   工作时间：> 9:30-19:00 北京\n#   常用收件人邮箱：> 老板@公司.com、客户@xxx.com`));
children.push(P("当场实测：", { bold: true }));
children.push(P('学员：@my-claw "下周和 X 客户找一个 1 小时会"'));
children.push(P('AI：扫描双方日历 → "建议周三 14:00-15:00 / 周四 10:00-11:00 / 周五 16:00-17:00 三个 slot，已起草邮件，要发吗？"'));

children.push(H3("Skill 3 · weekly-report-bot · 周报机器人"));
children.push(P("学员痛点：每周五憋周报 2 小时。"));
children.push(code(`openclaw skill add weekly-report-bot\n# 配置：\n#   接的数据源：> GitHub commits / 飞书文档 / Calendar / Notion\n#   推送时间：> 周五 16:00\n#   推到：> 飞书`));
children.push(P("讲师当场演示：写一个 5 行的\"配置文件\"，下周五 4 点这个 Bot 就把整周的工作整理成\"3 段叙事 + 关键产出 + 下周计划\"——交给老板。"));
children.push(note("课中 Checkpoint #2：每位学员至少装上其中 1 个 Skill 并在课中跑一次。"));

children.push(new Paragraph({ children: [new PageBreak()] }));

children.push(H2("【1:05 - 1:15】答疑 · 常见问题 + 调试技巧"));

children.push(H3("Q1 · 我装完跑不起来怎么办？"));
children.push(bullet("看日志：tail -f logs/claw.log"));
children.push(bullet("检查 API Key 是否生效：openclaw model test"));
children.push(bullet("代理 / 网络问题：curl https://api.anthropic.com 验证"));

children.push(H3("Q2 · 怎么知道它真的没乱跑？"));
children.push(bullet("审计日志：.claw/audit.log 记录每次工具调用"));
children.push(bullet("白名单 Skill：config.json 里 allowedSkills: [...]"));
children.push(bullet("Hook 拦截：写 PreToolUse Hook 看每次想做什么"));

children.push(H3("Q3 · 它会不会泄漏我的隐私？"));
children.push(bullet("默认所有数据只在本地"));
children.push(bullet("用 Claude API 时数据走 Anthropic（按其隐私政策）"));
children.push(bullet("极敏感场景（合同 / 病历）用本地 Ollama 模式——下节课 M6-4 详讲"));

children.push(H3("Q4 · 为啥不用 Manus / Devin？"));
children.push(bullet("Manus / Devin 是云端 Agent——你的所有活动都上传他们服务器"));
children.push(bullet("OpenClaw 是本地 Agent——人格 / 记忆 / 数据都在你电脑"));
children.push(bullet("两者互补——重活用 Manus 单跑、日常活用 OpenClaw 24×7 守护"));

children.push(H2("【1:15 - 1:25】课中 Checkpoint #3 · 全员 Demo"));
children.push(P("讲师指令：", { bold: true }));
children.push(note("\"现在每位同学打开你的 Telegram / 飞书，给你的 Bot 发一条消息：'帮我看下我下周三下午的日历有没有空？' 屏幕能拍到 Bot 回复的同学，举手——我点你来后部直播位录一段 30 秒 Demo，作为本节作业上交。\""));
children.push(P("这一步强制把\"装 OpenClaw\"从\"看完了\"变成\"做出来了\"。", { bold: true }));

children.push(H2("【1:25 - 1:30】收尾 · 下节预告 + 课后任务"));
children.push(H3("课后任务（必交，下节课开始前 1 小时截止）"));
children.push(bullet("截图证据：你的 Bot 回复任意一条消息（可放课程飞书群）"));
children.push(bullet("写 SOUL.md：用 200 字描述\"我希望我的 AI 助理是什么样的人格\"——交到 GitHub Private 仓库"));
children.push(bullet("挑 1 个 Skill 跑 3 天：写一段 100 字\"使用感受\""));

children.push(H3("下节预告 · M6-4"));
children.push(P("\"今天我们让 OpenClaw '活'起来——下节我们让它真正懂你。M6-4 详讲 SOUL.md / USER.md / MEMORY.md / AGENTS.md 四层记忆系统——这是社区里那句'用一个月之后助理就懂你'的复利效应来源。\""));

children.push(new Paragraph({ children: [new PageBreak()] }));

// 4. Teacher checklist
children.push(H1("四、讲师备课 Checklist（必须 100% 通关）"));
[
  "自己最近 1 周内全程跑通过一遍（避免讲到一半发现命令变了）",
  "检查 OpenClaw 最新版本号 + 是否有破坏性变更",
  "Telegram BotFather 提前注册一个演示用 bot",
  "MeetaVista 数字助教加载本课的最新 RAG 知识包",
  "准备 3 个学员典型卡点的\"30 秒急救包\"（npm permission / 代理 / API Key 没生效）",
  "后部直播位提前调好灯光（学员要录 Demo）",
  "准备 5 件\"作业范例\"提前印好（学员卡时给参考）",
].forEach(t => children.push(bullet("☐ " + t)));

// 5. Resources
children.push(H1("五、本节关键资源"));
children.push(H2("官方文档"));
[
  ["OpenClaw GitHub", "https://github.com/baiyutang/openclaw"],
  ["Anthropic Effective Context Engineering", "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents"],
  ["Claude API 文档", "https://docs.claude.com/"],
  ["飞书机器人开发指南", "https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/bot-v3/bot-overview"],
  ["Telegram BotFather", "https://t.me/BotFather"],
].forEach(([name, url]) => {
  children.push(new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { after: 40 },
    children: [link(name + " — " + url, url)]
  }));
});

children.push(H2("社区"));
[
  ["awesome-claude-skills", "https://github.com/karanb192/awesome-claude-skills"],
  ["VoltAgent/awesome-agent-skills（1000+ skills）", "https://github.com/VoltAgent/awesome-agent-skills"],
  ["花园老师 OpenClaw 完全指南", "https://github.com/baiyutang/openclaw"],
].forEach(([name, url]) => {
  children.push(new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { after: 40 },
    children: [link(name + " — " + url, url)]
  }));
});

children.push(H2("YouTube 推荐"));
children.push(bullet("David Ondrej《I Built a 24/7 AI Assistant That Pays Me》"));
children.push(bullet("AI Jason《Building Personal AI Agents in 2026》"));
children.push(bullet("Matthew Berman《OpenClaw vs Manus vs Devin》"));

// 6. Risks
children.push(H1("六、风险提示与合规"));
children.push(P("讲师必须念给学员听的两句话：", { bold: true }));
children.push(note("API Key 是钱——OpenClaw 跑起来后会持续调用 LLM，忘记关 CronJob 一周可能花 ¥800。第一周跑务必看账单。"));
children.push(note("它能操作你的飞书 / 邮件——一个 bug 可能误发邮件，初期一律开 Hook 人工确认。"));

// 7. Final reflection
children.push(H1("七、本节完成后学员应有的『AI 工作站升级』"));
children.push(spacer());
children.push(dataTable(
  [
    ["课前", "课后"],
    ["\"我会 ChatGPT\"", "\"我有一个 24×7 跑的 AI 助手\""],
    ["\"我用 AI\"", "\"AI 替我跑活\""],
    ["\"我学过 AI\"", "\"我装上了 AI\""],
  ],
  [4680, 4680],
));

children.push(spacer());
children.push(P("End of M6-3 学员讲义。下一节 M6-4 ：让你的 OpenClaw 真正懂你。", { italics: true }));

// ---------- assemble ----------
const doc = new Document({
  creator: "AI Course Author",
  title: "M6-3 OpenClaw 完全实操（一）学员讲义",
  styles: {
    default: { document: { run: { font: FONT_BODY, size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, font: FONT_HEADER, color: "1F4E79" },
        paragraph: { spacing: { before: 240, after: 160 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: FONT_HEADER, color: "2E75B6" },
        paragraph: { spacing: { before: 200, after: 120 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: FONT_HEADER, color: "404040" },
        paragraph: { spacing: { before: 160, after: 80 }, outlineLevel: 2 } },
    ]
  },
  numbering: {
    config: [
      { reference: "bullets", levels: [
        { level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
        { level: 1, format: LevelFormat.BULLET, text: "◦", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 1080, hanging: 360 } } } },
      ]},
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 },  // A4
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
      }
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [new TextRun({ text: "《AI 跟上时代》· M6-3 学员讲义", italics: true, color: "8E8E8E", size: 18, font: FONT_BODY })]
        })]
      })
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "Page ", size: 18, color: "8E8E8E", font: FONT_BODY }),
            new TextRun({ children: [PageNumber.CURRENT], size: 18, color: "8E8E8E", font: FONT_BODY }),
            new TextRun({ text: " / ", size: 18, color: "8E8E8E", font: FONT_BODY }),
            new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 18, color: "8E8E8E", font: FONT_BODY }),
          ]
        })]
      })
    },
    children
  }]
});

const out = path.join(__dirname, "M6-3_OpenClaw实操_学员讲义.docx");
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(out, buf);
  console.log("✓ Written:", out, "(" + buf.length + " bytes)");
});
