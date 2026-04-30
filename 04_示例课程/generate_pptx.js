const path = require('path');
const PptxGenJS = require('pptxgenjs');

const pptx = new PptxGenJS();
pptx.layout = "LAYOUT_WIDE"; // 13.333 x 7.5 in
pptx.title = "M6-3 OpenClaw 完全实操（一）";
pptx.author = "AI Course Author";
pptx.company = "《AI 跟上时代》线下精品班";

// ----- color palette: Midnight Executive -----
const C = {
  navy: "1E2761",
  ice: "CADCFC",
  white: "FFFFFF",
  gold: "F4B400",
  red: "D32F2F",
  green: "0F9D58",
  charcoal: "212121",
  gray: "595959",
  lightgray: "BDBDBD",
  bg: "F8F9FB",
  code: "F2F2F2",
};

const FONT_HEAD = "微软雅黑";
const FONT_BODY = "微软雅黑";
const FONT_CODE = "Consolas";

// ----- helpers -----
function addBg(slide, color = C.bg) {
  slide.background = { color };
}
function addAccent(slide) {
  // top corner navy block — visual motif
  slide.addShape("rect", { x: 0, y: 0, w: 13.333, h: 0.45, fill: { color: C.navy }, line: { color: C.navy, width: 0 } });
  slide.addShape("rect", { x: 0, y: 7.05, w: 13.333, h: 0.45, fill: { color: C.navy }, line: { color: C.navy, width: 0 } });
  slide.addText("《AI 跟上时代》· M6-3 OpenClaw 完全实操（一）", {
    x: 0.4, y: 0.05, w: 9, h: 0.35, fontFace: FONT_HEAD, fontSize: 11, color: C.white, italic: true, valign: "middle"
  });
  slide.addText("90 分钟课 · v3 干净版", {
    x: 9.4, y: 0.05, w: 3.6, h: 0.35, fontFace: FONT_HEAD, fontSize: 11, color: C.white, italic: true, valign: "middle", align: "right"
  });
}
function addPageNum(slide, n, total) {
  slide.addText(`${n} / ${total}`, {
    x: 12.4, y: 7.1, w: 0.7, h: 0.35, fontFace: FONT_HEAD, fontSize: 11, color: C.white, align: "right", valign: "middle"
  });
}
function addTitle(slide, title, subtitle) {
  slide.addText(title, {
    x: 0.5, y: 0.7, w: 12.3, h: 0.7, fontFace: FONT_HEAD, fontSize: 32, bold: true, color: C.navy, valign: "middle"
  });
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.5, y: 1.4, w: 12.3, h: 0.4, fontFace: FONT_BODY, fontSize: 16, color: C.gray, italic: true, valign: "middle"
    });
  }
  // accent line — 6pt navy line
  slide.addShape("line", { x: 0.5, y: 1.85, w: 12.3, h: 0,
    line: { color: C.navy, width: 1.5 } });
}

const slides = [];

// ====== Slide 1 — Cover ======
slides.push({ build: (s) => {
  s.background = { color: C.navy };
  // Big accent block
  s.addShape("rect", { x: 0, y: 5.0, w: 13.333, h: 2.5, fill: { color: C.gold }, line: { color: C.gold, width: 0 } });
  s.addText("M6-3", { x: 0.5, y: 0.8, w: 12.3, h: 0.8, fontFace: FONT_HEAD, fontSize: 28, color: C.gold, bold: true });
  s.addText("OpenClaw 完全实操（一）", { x: 0.5, y: 1.7, w: 12.3, h: 1.3, fontFace: FONT_HEAD, fontSize: 56, color: C.white, bold: true });
  s.addText("从 0 跑起来 · 当场让你拥有一个 24×7 替你干活的私人 Agent", {
    x: 0.5, y: 3.1, w: 12.3, h: 0.8, fontFace: FONT_BODY, fontSize: 24, color: C.ice, italic: true
  });
  s.addText("90 分钟", { x: 0.7, y: 5.3, w: 3.5, h: 0.6, fontFace: FONT_HEAD, fontSize: 28, color: C.navy, bold: true });
  s.addText("课时", { x: 0.7, y: 5.85, w: 3.5, h: 0.4, fontFace: FONT_BODY, fontSize: 16, color: C.charcoal });
  s.addText("🌿 进阶", { x: 4.7, y: 5.3, w: 3.5, h: 0.6, fontFace: FONT_HEAD, fontSize: 28, color: C.navy, bold: true });
  s.addText("难度（前置 M0+M1+M2-1~2）", { x: 4.7, y: 5.85, w: 4, h: 0.4, fontFace: FONT_BODY, fontSize: 16, color: C.charcoal });
  s.addText("当场可用的 Bot", { x: 9.0, y: 5.3, w: 4, h: 0.6, fontFace: FONT_HEAD, fontSize: 28, color: C.navy, bold: true });
  s.addText("学员交付（下课即可用）", { x: 9.0, y: 5.85, w: 4, h: 0.4, fontFace: FONT_BODY, fontSize: 16, color: C.charcoal });
  s.addText("讲师 ｜ 2026-04-30 ｜《AI 跟上时代》线下精品班", {
    x: 0.5, y: 6.7, w: 12.3, h: 0.4, fontFace: FONT_BODY, fontSize: 14, color: C.navy
  });
}});

// ====== Slide 2 — Real Story ======
slides.push({ build: (s) => {
  addBg(s); addAccent(s);
  addTitle(s, "一个真实场景", "上周一早上 8 点，我洗漱中收到飞书弹窗 ↓");
  // Big quote box
  s.addShape("rect", { x: 1.0, y: 2.2, w: 11.3, h: 3.4, fill: { color: C.white }, line: { color: C.gold, width: 4 } });
  s.addText("\"昨日 32 封邮件已分类：\n5 封需你亲自回（已草拟）/ 12 封已代回 / 15 封归档。\n下面是 5 封需要你看的摘要……\"", {
    x: 1.4, y: 2.5, w: 10.5, h: 2.6, fontFace: FONT_BODY, fontSize: 26, color: C.charcoal, italic: true, valign: "middle"
  });
  s.addText("— 不是真人助理。是 OpenClaw 在前一晚 23:00 自动跑出来的 —", {
    x: 1.4, y: 5.05, w: 10.5, h: 0.4, fontFace: FONT_BODY, fontSize: 16, color: C.gold, bold: true
  });
  // Bottom callout
  s.addText("这堂课结束时，你也会有一个。", {
    x: 0.5, y: 6.0, w: 12.3, h: 0.7, fontFace: FONT_HEAD, fontSize: 28, color: C.navy, bold: true, align: "center"
  });
}});

// ====== Slide 3 — What is OpenClaw ======
slides.push({ build: (s) => {
  addBg(s); addAccent(s);
  addTitle(s, "OpenClaw 是什么 / 不是什么", "用一个比喻搞清楚它的位置");
  // 3 column comparison
  const cols = [
    { color: C.lightgray, title: "ChatGPT / Claude", what: "你的助理", when: "只在你打开 App 时存在" },
    { color: C.lightgray, title: "Cursor / Claude Code", what: "你的程序员同事", when: "专做编程" },
    { color: C.gold, title: "OpenClaw", what: "你的 24×7 数字员工", when: "有人格 / 记忆 / 定时跑活 / 多渠道" },
  ];
  cols.forEach((col, i) => {
    const x = 0.6 + i * 4.2;
    s.addShape("rect", { x, y: 2.2, w: 4.0, h: 4.4, fill: { color: C.white }, line: { color: col.color, width: 4 } });
    s.addText(col.title, { x: x + 0.2, y: 2.4, w: 3.6, h: 0.7, fontFace: FONT_HEAD, fontSize: 22, bold: true, color: C.navy, align: "center" });
    s.addText(col.what, { x: x + 0.2, y: 3.3, w: 3.6, h: 0.7, fontFace: FONT_BODY, fontSize: 28, bold: true, color: col.color === C.gold ? C.gold : C.gray, align: "center" });
    s.addText(col.when, { x: x + 0.2, y: 4.4, w: 3.6, h: 1.5, fontFace: FONT_BODY, fontSize: 16, color: C.charcoal, align: "center", valign: "top" });
  });
  // bottom takeaway
  s.addText("OpenClaw 不是新模型。它调用 Claude / GPT / DeepSeek。它是把人格 / 记忆 / 工具 / 定时 / 多渠道打包好的工程脚手架。", {
    x: 0.5, y: 6.5, w: 12.3, h: 0.5, fontFace: FONT_BODY, fontSize: 14, color: C.gray, align: "center", italic: true
  });
}});

// ====== Slide 4 — Architecture ======
slides.push({ build: (s) => {
  addBg(s); addAccent(s);
  addTitle(s, "四大组件深拆", "Gateway · Channels · Hooks · CronJob");
  // Center Gateway
  s.addShape("roundRect", { x: 5.0, y: 2.4, w: 3.3, h: 1.0, fill: { color: C.navy }, line: { color: C.navy, width: 0 } });
  s.addText("Gateway 中央调度", { x: 5.0, y: 2.4, w: 3.3, h: 1.0, fontFace: FONT_HEAD, fontSize: 18, bold: true, color: C.white, align: "center", valign: "middle" });
  s.addText("（主控 LLM 在这里思考）", { x: 5.0, y: 3.45, w: 3.3, h: 0.3, fontFace: FONT_BODY, fontSize: 11, color: C.gray, align: "center", italic: true });

  // Three children boxes
  const children = [
    { title: "Channels", note: "嘴和耳朵\n飞书 / Telegram / WhatsApp\n邮件 / Webhook", x: 0.6 },
    { title: "Hooks", note: "反射神经\nPreToolUse / PostToolUse\nStop / Notification", x: 5.0 },
    { title: "CronJob", note: "生物钟\n每天 23:00 跑邮件\n每周五 16:00 出周报", x: 9.4 },
  ];
  children.forEach(({ title, note, x }) => {
    s.addShape("rect", { x, y: 4.6, w: 3.3, h: 1.6, fill: { color: C.white }, line: { color: C.gold, width: 3 } });
    s.addText(title, { x, y: 4.7, w: 3.3, h: 0.5, fontFace: FONT_HEAD, fontSize: 18, bold: true, color: C.navy, align: "center" });
    s.addText(note, { x: x + 0.1, y: 5.2, w: 3.1, h: 1.0, fontFace: FONT_BODY, fontSize: 12, color: C.charcoal, align: "center" });
  });
  // Lines connecting Gateway → 3 children
  [2.25, 6.65, 11.05].forEach(cx => {
    s.addShape("line", { x: 6.65, y: 3.4, w: cx - 6.65, h: 1.2, line: { color: C.lightgray, width: 1.5 } });
  });

  // Persistence row
  s.addShape("rect", { x: 0.6, y: 6.3, w: 12.1, h: 0.55, fill: { color: C.ice }, line: { color: C.ice, width: 0 } });
  s.addText("持久化：SOUL.md（人格） · USER.md（你的偏好） · MEMORY.md（长期记忆） · AGENTS.md（项目偏好）", {
    x: 0.7, y: 6.3, w: 11.9, h: 0.55, fontFace: FONT_BODY, fontSize: 13, color: C.navy, align: "center", valign: "middle", bold: true
  });
}});

// ====== Slide 5 — Checkpoint #1 ======
slides.push({ build: (s) => {
  addBg(s); addAccent(s);
  addTitle(s, "课中 Checkpoint #1", "5 分钟 · 别冲下一节");
  // Two big columns
  s.addShape("rect", { x: 0.7, y: 2.3, w: 5.9, h: 4.2, fill: { color: C.white }, line: { color: C.navy, width: 3 } });
  s.addText("全员", { x: 0.9, y: 2.5, w: 5.5, h: 0.6, fontFace: FONT_HEAD, fontSize: 22, bold: true, color: C.navy });
  s.addText("在自己的笔记上画一遍前一页的架构图。", {
    x: 0.9, y: 3.1, w: 5.5, h: 1.3, fontFace: FONT_BODY, fontSize: 18, color: C.charcoal
  });
  s.addText("画不出来 = 还没听懂\n画得乱 = 听到一半神游了\n画得整齐 = 可以进入实操", {
    x: 0.9, y: 4.5, w: 5.5, h: 1.5, fontFace: FONT_BODY, fontSize: 14, color: C.gray, italic: true
  });

  s.addShape("rect", { x: 6.9, y: 2.3, w: 5.7, h: 4.2, fill: { color: C.white }, line: { color: C.gold, width: 3 } });
  s.addText("讲师", { x: 7.1, y: 2.5, w: 5.3, h: 0.6, fontFace: FONT_HEAD, fontSize: 22, bold: true, color: C.gold });
  s.addText("随机抽 3 位学员讲解给同桌听。", {
    x: 7.1, y: 3.1, w: 5.3, h: 1.0, fontFace: FONT_BODY, fontSize: 18, color: C.charcoal
  });
  s.addText("如果 3 个里有 1 个讲不清——\n立刻补讲。\n不要硬冲下一节。", {
    x: 7.1, y: 4.3, w: 5.3, h: 1.8, fontFace: FONT_BODY, fontSize: 16, color: C.red, bold: true, italic: true
  });
}});

// ====== Slide 6 — Step 1 install ======
slides.push({ build: (s) => {
  addBg(s); addAccent(s);
  addTitle(s, "实操 Step 1 · 全局安装 OpenClaw", "5 分钟 · 一行命令搞定");
  // Code block
  s.addShape("rect", { x: 0.5, y: 2.2, w: 12.3, h: 2.3, fill: { color: C.charcoal }, line: { color: C.charcoal, width: 0 } });
  s.addText("# 推荐 nvm 隔离的 Node 22 环境\nnvm use 22\n\n# 全局装 OpenClaw\nnpm install -g openclaw\n\n# 验证\nopenclaw --version\n# 期望输出: openclaw v1.4.x", {
    x: 0.7, y: 2.3, w: 12.0, h: 2.1, fontFace: FONT_CODE, fontSize: 16, color: "00FF88", valign: "top"
  });
  // Pitfalls
  s.addText("常见坑点", { x: 0.5, y: 4.7, w: 12.3, h: 0.5, fontFace: FONT_HEAD, fontSize: 20, bold: true, color: C.red });
  const pits = [
    "Windows 报权限错误 → 用管理员 PowerShell 重开",
    "npm 报 ENOTFOUND → 代理没开 / 镜像源没切",
    "装完命令找不到 → npm config get prefix 看路径加到 PATH",
  ];
  pits.forEach((t, i) => {
    s.addShape("rect", { x: 0.5, y: 5.3 + i * 0.55, w: 0.1, h: 0.45, fill: { color: C.red }, line: { color: C.red, width: 0 } });
    s.addText(t, { x: 0.7, y: 5.3 + i * 0.55, w: 12.0, h: 0.45, fontFace: FONT_BODY, fontSize: 15, color: C.charcoal, valign: "middle" });
  });
}});

// ====== Slide 7 — Step 2 onboard ======
slides.push({ build: (s) => {
  addBg(s); addAccent(s);
  addTitle(s, "实操 Step 2 · 初始化工作目录", "5 分钟 · 看清四个核心文件");
  // Code
  s.addShape("rect", { x: 0.5, y: 2.2, w: 7.5, h: 4.3, fill: { color: C.charcoal }, line: { color: C.charcoal, width: 0 } });
  s.addText("cd ~/AI-Workspace\nmkdir my-claw && cd my-claw\n\n# 一键 onboard\nopenclaw onboard --install-daemon\n\n# 创建出来：\n.claw/\n  config.json     # 主配置\n  SOUL.md         # AI 人格\n  USER.md         # 关于你\n  MEMORY.md       # 长期记忆（自动维护）\n  AGENTS.md       # 项目偏好（M7 用）\nlogs/\nskills/", {
    x: 0.7, y: 2.3, w: 7.2, h: 4.2, fontFace: FONT_CODE, fontSize: 14, color: "00FF88", valign: "top"
  });
  // Files explanation
  const expl = [
    ["config.json", "Channel / 模型 / 钥匙都配在这"],
    ["SOUL.md", "AI 的人格——严肃 partner？\n热情助理？这里写"],
    ["USER.md", "关于你——AI 用这份来了解你"],
    ["MEMORY.md", "长期记忆——AI 自己维护"],
    ["AGENTS.md", "项目级偏好——M7 才会用"],
  ];
  expl.forEach(([k, v], i) => {
    s.addText(k, { x: 8.3, y: 2.2 + i * 0.85, w: 4.5, h: 0.3, fontFace: FONT_HEAD, fontSize: 14, bold: true, color: C.gold });
    s.addText(v, { x: 8.3, y: 2.5 + i * 0.85, w: 4.5, h: 0.6, fontFace: FONT_BODY, fontSize: 12, color: C.charcoal, valign: "top" });
  });
}});

// ====== Slide 8 — Channel config ======
slides.push({ build: (s) => {
  addBg(s); addAccent(s);
  addTitle(s, "实操 Step 3 · 配 Channel", "5 分钟 · Telegram 推荐新手 / 飞书推荐国内重度用户");
  // Two columns side by side
  // Telegram side
  s.addShape("rect", { x: 0.5, y: 2.2, w: 6.0, h: 4.4, fill: { color: C.white }, line: { color: C.green, width: 3 } });
  s.addText("选项 A · Telegram（推荐新手）", { x: 0.7, y: 2.3, w: 5.8, h: 0.5, fontFace: FONT_HEAD, fontSize: 17, bold: true, color: C.green });
  s.addShape("rect", { x: 0.7, y: 2.85, w: 5.6, h: 3.5, fill: { color: C.charcoal }, line: { color: C.charcoal, width: 0 } });
  s.addText("# 1. 找 @BotFather → /newbot → token\n\n# 2. 配进去\nopenclaw channel add telegram \\\n  --token \"你的 token\"\n\n# 3. 启动\nopenclaw start\n\n# 4. 给你的 bot 发\"在吗？\"\n#    应该收到 AI 回复", {
    x: 0.85, y: 2.95, w: 5.3, h: 3.3, fontFace: FONT_CODE, fontSize: 11, color: "00FF88", valign: "top"
  });
  // Feishu side
  s.addShape("rect", { x: 6.8, y: 2.2, w: 6.0, h: 4.4, fill: { color: C.white }, line: { color: C.navy, width: 3 } });
  s.addText("选项 B · 飞书（推荐国内）", { x: 7.0, y: 2.3, w: 5.8, h: 0.5, fontFace: FONT_HEAD, fontSize: 17, bold: true, color: C.navy });
  s.addShape("rect", { x: 7.0, y: 2.85, w: 5.6, h: 3.5, fill: { color: C.charcoal }, line: { color: C.charcoal, width: 0 } });
  s.addText("# 1. 飞书开发者后台建机器人\n#    拿 App ID + App Secret\n\n# 2. 配进去\nopenclaw channel add feishu \\\n  --app-id \"xxx\" \\\n  --app-secret \"yyy\"\n\n# 3. 飞书后台配 Webhook\n#    回调到你的 frp/feishu\n\n# 4. 启动\nopenclaw start", {
    x: 7.15, y: 2.95, w: 5.3, h: 3.3, fontFace: FONT_CODE, fontSize: 11, color: "00FF88", valign: "top"
  });
}});

// ====== Slide 9 — Skill 1 email ======
slides.push({ build: (s) => {
  addBg(s); addAccent(s);
  addTitle(s, "Skill 1 · email-triage · 邮件三筛", "学员痛点：早上 200 封邮件，光分类就 1 小时");
  // Big stat
  s.addShape("rect", { x: 0.5, y: 2.1, w: 4.0, h: 4.6, fill: { color: C.gold }, line: { color: C.gold, width: 0 } });
  s.addText("60", { x: 0.5, y: 2.5, w: 4.0, h: 1.6, fontFace: FONT_HEAD, fontSize: 110, bold: true, color: C.navy, align: "center" });
  s.addText("分钟", { x: 0.5, y: 3.9, w: 4.0, h: 0.5, fontFace: FONT_HEAD, fontSize: 20, color: C.navy, align: "center" });
  s.addText("→ 0 分钟", { x: 0.5, y: 4.5, w: 4.0, h: 0.7, fontFace: FONT_HEAD, fontSize: 32, bold: true, color: C.charcoal, align: "center" });
  s.addText("AI 在 23:00 自动跑\n8 点你直接看摘要", { x: 0.5, y: 5.4, w: 4.0, h: 1.0, fontFace: FONT_BODY, fontSize: 14, color: C.charcoal, align: "center" });

  // Code
  s.addShape("rect", { x: 4.8, y: 2.1, w: 8.0, h: 4.6, fill: { color: C.charcoal }, line: { color: C.charcoal, width: 0 } });
  s.addText("openclaw skill add email-triage\n\n# 自动会问：\n邮箱协议（IMAP / Gmail / Outlook）：\n  > Gmail API\n\n你的\"必看\"标签是？：\n  > P0、客户、老板\n\n你想几点跑？：\n  > 23:00（昨天的）\n\n推到哪个 Channel？：\n  > Telegram", {
    x: 4.95, y: 2.25, w: 7.7, h: 4.4, fontFace: FONT_CODE, fontSize: 13, color: "00FF88", valign: "top"
  });
}});

// ====== Slide 10 — Skill 2 calendar ======
slides.push({ build: (s) => {
  addBg(s); addAccent(s);
  addTitle(s, "Skill 2 · calendar-conflict-fixer · 日历冲突修复", "学员痛点：跨时区找时间，邮件来回 5 轮");
  // Code on left
  s.addShape("rect", { x: 0.5, y: 2.1, w: 6.0, h: 3.0, fill: { color: C.charcoal }, line: { color: C.charcoal, width: 0 } });
  s.addText("openclaw skill add calendar-conflict-fixer\n\n# 配置：\n日历类型：> Google Calendar\n工作时间：> 9:30-19:00 北京\n常用收件人邮箱：\n  > 老板@公司.com\n  > 客户@xxx.com", {
    x: 0.65, y: 2.25, w: 5.7, h: 2.8, fontFace: FONT_CODE, fontSize: 13, color: "00FF88", valign: "top"
  });
  // Demo on right
  s.addShape("rect", { x: 6.8, y: 2.1, w: 6.0, h: 3.0, fill: { color: C.white }, line: { color: C.navy, width: 2 } });
  s.addText("当场实测", { x: 7.0, y: 2.2, w: 5.6, h: 0.4, fontFace: FONT_HEAD, fontSize: 16, bold: true, color: C.navy });
  s.addText("学员：@my-claw \"下周和 X 客户找一个 1 小时会\"", {
    x: 7.0, y: 2.65, w: 5.6, h: 0.6, fontFace: FONT_BODY, fontSize: 14, color: C.charcoal, italic: true
  });
  s.addText("AI：扫描双方日历 → \"建议周三 14:00-15:00 / 周四 10:00-11:00 / 周五 16:00-17:00 三个 slot，已起草邮件，要发吗？\"", {
    x: 7.0, y: 3.3, w: 5.6, h: 1.7, fontFace: FONT_BODY, fontSize: 14, color: C.green, valign: "top"
  });
  // Bottom takeaway
  s.addShape("rect", { x: 0.5, y: 5.4, w: 12.3, h: 1.3, fill: { color: C.ice }, line: { color: C.ice, width: 0 } });
  s.addText("✓ 不再被\"找时间\"邮件拖累 ｜ ✓ AI 直接给你三选一 ｜ ✓ 你只负责按 Y/N", {
    x: 0.5, y: 5.4, w: 12.3, h: 1.3, fontFace: FONT_HEAD, fontSize: 22, bold: true, color: C.navy, align: "center", valign: "middle"
  });
}});

// ====== Slide 11 — Skill 3 weekly report ======
slides.push({ build: (s) => {
  addBg(s); addAccent(s);
  addTitle(s, "Skill 3 · weekly-report-bot · 周报机器人 ⭐⭐", "学员痛点：每周五憋周报 2 小时");
  // Visual flow
  const items = [
    { x: 0.5, t: "GitHub", sub: "commits" },
    { x: 3.0, t: "飞书", sub: "文档" },
    { x: 5.5, t: "Calendar", sub: "会议" },
    { x: 8.0, t: "Notion", sub: "项目板" },
  ];
  items.forEach(({ x, t, sub }) => {
    s.addShape("roundRect", { x, y: 2.2, w: 2.2, h: 1.0, fill: { color: C.white }, line: { color: C.navy, width: 2 } });
    s.addText(t, { x, y: 2.3, w: 2.2, h: 0.4, fontFace: FONT_HEAD, fontSize: 14, bold: true, color: C.navy, align: "center" });
    s.addText(sub, { x, y: 2.7, w: 2.2, h: 0.4, fontFace: FONT_BODY, fontSize: 11, color: C.gray, align: "center" });
  });
  // Arrow
  s.addShape("rightArrow", { x: 10.4, y: 2.4, w: 1.5, h: 0.6, fill: { color: C.gold }, line: { color: C.gold, width: 0 } });
  s.addText("AI", { x: 10.4, y: 2.4, w: 1.5, h: 0.6, fontFace: FONT_HEAD, fontSize: 18, bold: true, color: C.navy, align: "center", valign: "middle" });
  // Output box
  s.addShape("rect", { x: 0.5, y: 4.0, w: 12.3, h: 2.6, fill: { color: C.white }, line: { color: C.gold, width: 3 } });
  s.addText("周五 16:00 自动产出（推到飞书）", {
    x: 0.7, y: 4.1, w: 12.0, h: 0.4, fontFace: FONT_HEAD, fontSize: 14, bold: true, color: C.gold
  });
  s.addText("3 段叙事（本周做了什么 / 解决了什么 / 学到什么） + 关键产出（数据 / 文档 / 代码） + 下周计划（3 件事 + 风险点）", {
    x: 0.7, y: 4.55, w: 12.0, h: 2.0, fontFace: FONT_BODY, fontSize: 16, color: C.charcoal, valign: "top"
  });
  s.addText("讲师当场演示：写一个 5 行配置 → 下周五 4 点这个 Bot 自动出周报 → 直接交给老板。",
    { x: 0.7, y: 6.0, w: 12.0, h: 0.6, fontFace: FONT_BODY, fontSize: 13, color: C.green, italic: true, valign: "middle" });
}});

// ====== Slide 12 — Q&A common ======
slides.push({ build: (s) => {
  addBg(s); addAccent(s);
  addTitle(s, "答疑 · 4 个最常见问题", "10 分钟讲清最容易踩的坑");
  const qa = [
    { q: "Q1 · 装完跑不起来", a: "tail -f logs/claw.log\nopenclaw model test\ncurl https://api.anthropic.com" },
    { q: "Q2 · 怎么知道它没乱跑", a: ".claw/audit.log 全审计\nallowedSkills 白名单\nPreToolUse Hook 拦截" },
    { q: "Q3 · 会不会泄漏隐私", a: "默认数据只在本地\nClaude API 走 Anthropic\n敏感数据走本地 Ollama (M6-4)" },
    { q: "Q4 · 为啥不用 Manus / Devin", a: "他们是云端 Agent\nOpenClaw 是本地 Agent\n两者互补" },
  ];
  qa.forEach(({ q, a }, i) => {
    const x = 0.5 + (i % 2) * 6.2;
    const y = 2.2 + Math.floor(i / 2) * 2.4;
    s.addShape("rect", { x, y, w: 6.0, h: 2.2, fill: { color: C.white }, line: { color: C.navy, width: 2 } });
    s.addText(q, { x: x + 0.2, y: y + 0.1, w: 5.7, h: 0.5, fontFace: FONT_HEAD, fontSize: 16, bold: true, color: C.navy });
    s.addText(a, { x: x + 0.2, y: y + 0.7, w: 5.7, h: 1.4, fontFace: FONT_CODE, fontSize: 12, color: C.charcoal, valign: "top" });
  });
}});

// ====== Slide 13 — Final demo checkpoint ======
slides.push({ build: (s) => {
  addBg(s); addAccent(s);
  addTitle(s, "课中 Checkpoint #3 · 全员 Demo", "10 分钟 · 把\"装完\"变成\"做出来了\"");
  s.addShape("rect", { x: 0.5, y: 2.2, w: 12.3, h: 2.3, fill: { color: C.gold }, line: { color: C.gold, width: 0 } });
  s.addText("\"现在每位同学打开你的 Telegram / 飞书，给你的 Bot 发一条消息：\n\n'帮我看下我下周三下午的日历有没有空？'\"",
    { x: 0.7, y: 2.3, w: 11.9, h: 2.1, fontFace: FONT_BODY, fontSize: 22, color: C.navy, italic: true, valign: "middle", align: "center" });

  s.addShape("rect", { x: 0.5, y: 4.8, w: 12.3, h: 2.0, fill: { color: C.white }, line: { color: C.green, width: 3 } });
  s.addText("✅ Bot 回复成功的同学举手", { x: 0.7, y: 4.9, w: 11.9, h: 0.5, fontFace: FONT_HEAD, fontSize: 22, bold: true, color: C.green });
  s.addText("→ 我点你来后部直播位录一段 30 秒 Demo", { x: 0.7, y: 5.45, w: 11.9, h: 0.5, fontFace: FONT_BODY, fontSize: 18, color: C.charcoal });
  s.addText("→ 作为本节作业上交（飞书课程群）", { x: 0.7, y: 5.95, w: 11.9, h: 0.5, fontFace: FONT_BODY, fontSize: 18, color: C.charcoal });
  s.addText("→ 卡住的同学先标记，课后辅导", { x: 0.7, y: 6.4, w: 11.9, h: 0.4, fontFace: FONT_BODY, fontSize: 14, color: C.gray, italic: true });
}});

// ====== Slide 14 — Homework ======
slides.push({ build: (s) => {
  addBg(s); addAccent(s);
  addTitle(s, "课后任务 · 必交", "下节课开始前 1 小时截止 · 不交不让进 M6-4");
  const tasks = [
    { n: "01", t: "截图证据", d: "你的 Bot 回复任意一条消息（放课程飞书群）", color: C.green },
    { n: "02", t: "写 SOUL.md", d: "用 200 字描述\"我希望我的 AI 助理是什么样的人格\" → 交到 GitHub Private 仓库", color: C.gold },
    { n: "03", t: "Skill 实战 3 天", d: "挑 1 个 Skill 跑 3 天 → 写 100 字\"使用感受\"", color: C.navy },
  ];
  tasks.forEach(({ n, t, d, color }, i) => {
    const y = 2.2 + i * 1.5;
    s.addShape("rect", { x: 0.5, y, w: 1.4, h: 1.3, fill: { color }, line: { color, width: 0 } });
    s.addText(n, { x: 0.5, y, w: 1.4, h: 1.3, fontFace: FONT_HEAD, fontSize: 50, bold: true, color: C.white, align: "center", valign: "middle" });
    s.addShape("rect", { x: 1.9, y, w: 10.9, h: 1.3, fill: { color: C.white }, line: { color, width: 2 } });
    s.addText(t, { x: 2.2, y: y + 0.1, w: 10.5, h: 0.5, fontFace: FONT_HEAD, fontSize: 20, bold: true, color: color });
    s.addText(d, { x: 2.2, y: y + 0.6, w: 10.5, h: 0.7, fontFace: FONT_BODY, fontSize: 14, color: C.charcoal });
  });
}});

// ====== Slide 15 — Risk warning ======
slides.push({ build: (s) => {
  addBg(s); addAccent(s);
  addTitle(s, "⚠️ 两条必须念给学员的话", "讲师强制读出，学员复述");
  s.addShape("rect", { x: 0.5, y: 2.2, w: 12.3, h: 2.0, fill: { color: C.white }, line: { color: C.red, width: 4 } });
  s.addText("API Key 是钱", { x: 0.7, y: 2.3, w: 11.9, h: 0.5, fontFace: FONT_HEAD, fontSize: 22, bold: true, color: C.red });
  s.addText("OpenClaw 跑起来后会持续调用 LLM，忘记关 CronJob 一周可能花 ¥800。\n第一周跑务必看账单。",
    { x: 0.7, y: 2.85, w: 11.9, h: 1.3, fontFace: FONT_BODY, fontSize: 18, color: C.charcoal });

  s.addShape("rect", { x: 0.5, y: 4.5, w: 12.3, h: 2.0, fill: { color: C.white }, line: { color: C.red, width: 4 } });
  s.addText("它能操作你的飞书 / 邮件", { x: 0.7, y: 4.6, w: 11.9, h: 0.5, fontFace: FONT_HEAD, fontSize: 22, bold: true, color: C.red });
  s.addText("一个 bug 可能误发邮件 / 误删消息。\n初期一律开 Hook 人工确认。",
    { x: 0.7, y: 5.15, w: 11.9, h: 1.3, fontFace: FONT_BODY, fontSize: 18, color: C.charcoal });
}});

// ====== Slide 16 — Resources ======
slides.push({ build: (s) => {
  addBg(s); addAccent(s);
  addTitle(s, "本节关键资源", "学员手册必收藏");
  // Three columns
  const cols = [
    { title: "官方文档", color: C.navy, items: [
      "OpenClaw GitHub",
      "Anthropic Engineering Blog",
      "Claude API Docs",
      "飞书机器人开发指南",
      "Telegram BotFather",
    ]},
    { title: "社区", color: C.gold, items: [
      "花园老师 OpenClaw 完全指南",
      "awesome-claude-skills",
      "VoltAgent/awesome-agent-skills",
      "Composio 集成大全",
    ]},
    { title: "YouTube", color: C.green, items: [
      "David Ondrej · 24/7 AI Assistant",
      "AI Jason · Personal AI Agents 2026",
      "Matthew Berman · OpenClaw vs Manus",
      "Karpathy · Deep Dive into LLMs",
    ]},
  ];
  cols.forEach(({ title, color, items }, i) => {
    const x = 0.5 + i * 4.2;
    s.addShape("rect", { x, y: 2.2, w: 4.0, h: 4.6, fill: { color: C.white }, line: { color, width: 3 } });
    s.addText(title, { x, y: 2.3, w: 4.0, h: 0.6, fontFace: FONT_HEAD, fontSize: 22, bold: true, color, align: "center" });
    items.forEach((it, j) => {
      s.addShape("ellipse", { x: x + 0.2, y: 3.2 + j * 0.7 + 0.15, w: 0.2, h: 0.2, fill: { color }, line: { color, width: 0 } });
      s.addText(it, { x: x + 0.5, y: 3.2 + j * 0.7, w: 3.4, h: 0.5, fontFace: FONT_BODY, fontSize: 13, color: C.charcoal, valign: "middle" });
    });
  });
}});

// ====== Slide 17 — Before vs after ======
slides.push({ build: (s) => {
  addBg(s); addAccent(s);
  addTitle(s, "本节完成后 · 你的「AI 工作站」升级了", "课前 → 课后");
  // 3 rows
  const rows = [
    ["\"我会 ChatGPT\"", "→", "\"我有一个 24×7 跑的 AI 助手\""],
    ["\"我用 AI\"", "→", "\"AI 替我跑活\""],
    ["\"我学过 AI\"", "→", "\"我装上了 AI\""],
  ];
  rows.forEach(([a, arrow, b], i) => {
    const y = 2.4 + i * 1.4;
    s.addShape("rect", { x: 0.5, y, w: 5.8, h: 1.1, fill: { color: C.lightgray }, line: { color: C.lightgray, width: 0 } });
    s.addText(a, { x: 0.5, y, w: 5.8, h: 1.1, fontFace: FONT_HEAD, fontSize: 22, color: C.gray, align: "center", valign: "middle", italic: true });
    s.addText(arrow, { x: 6.3, y, w: 0.7, h: 1.1, fontFace: FONT_HEAD, fontSize: 32, bold: true, color: C.gold, align: "center", valign: "middle" });
    s.addShape("rect", { x: 7.0, y, w: 5.8, h: 1.1, fill: { color: C.gold }, line: { color: C.gold, width: 0 } });
    s.addText(b, { x: 7.0, y, w: 5.8, h: 1.1, fontFace: FONT_HEAD, fontSize: 22, bold: true, color: C.navy, align: "center", valign: "middle" });
  });
}});

// ====== Slide 18 — Next + Thanks ======
slides.push({ build: (s) => {
  s.background = { color: C.navy };
  s.addText("M6-4 预告", { x: 0.5, y: 0.6, w: 12.3, h: 0.6, fontFace: FONT_HEAD, fontSize: 20, color: C.gold, bold: true });
  s.addText("让你的 OpenClaw 真正懂你", {
    x: 0.5, y: 1.3, w: 12.3, h: 1.0, fontFace: FONT_HEAD, fontSize: 44, bold: true, color: C.white
  });
  s.addText("SOUL.md / USER.md / MEMORY.md / AGENTS.md 四层记忆系统",
    { x: 0.5, y: 2.4, w: 12.3, h: 0.6, fontFace: FONT_BODY, fontSize: 22, color: C.ice, italic: true });
  s.addShape("line", { x: 0.5, y: 3.2, w: 12.3, h: 0, line: { color: C.gold, width: 2 } });
  s.addText("「用一个月之后助理就懂你」的复利效应来源", {
    x: 0.5, y: 3.4, w: 12.3, h: 0.5, fontFace: FONT_BODY, fontSize: 18, color: C.ice
  });

  s.addText("课间走到后部全息体验区", { x: 0.5, y: 4.5, w: 12.3, h: 0.5, fontFace: FONT_HEAD, fontSize: 22, bold: true, color: C.gold });
  s.addText("Looking Glass · Vision Pro · Quest 3 · 国产 HOLOFY 任你摸 — 这是普通 AI 培训班没有的差异化", {
    x: 0.5, y: 5.05, w: 12.3, h: 0.7, fontFace: FONT_BODY, fontSize: 16, color: C.white
  });

  s.addShape("rect", { x: 0.5, y: 6.2, w: 12.3, h: 1.0, fill: { color: C.gold }, line: { color: C.gold, width: 0 } });
  s.addText("谢谢 · Q&A 时间", { x: 0.5, y: 6.2, w: 12.3, h: 1.0, fontFace: FONT_HEAD, fontSize: 32, bold: true, color: C.navy, align: "center", valign: "middle" });
}});

// ----- Build all slides -----
const total = slides.length;
slides.forEach((slDef, i) => {
  const sl = pptx.addSlide();
  slDef.build(sl);
  if (i > 0) addPageNum(sl, i + 1, total);
});

const out = path.join(__dirname, "M6-3_OpenClaw实操_课件.pptx");
pptx.writeFile({ fileName: out }).then(name => {
  console.log("✓ Written:", name);
});
