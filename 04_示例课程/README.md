# 示例课程 · M6-3 OpenClaw 完全实操（一）

> 作为 72 节课中**最有"完整数字员工出片感"**的一节，被选作课件示例。

## 三件套

| 文件 | 用途 | 谁用 |
|---|---|---|
| [示例课程_M6-3_OpenClaw实操.md](示例课程_M6-3_OpenClaw实操.md) | 完整 90 分钟剧本 + 讲师 Checklist | 讲师备课 |
| [M6-3_OpenClaw实操_学员讲义.docx](M6-3_OpenClaw实操_学员讲义.docx) | Word 学员讲义（A4 排版 + 页眉页脚 + 大标题） | 印发给学员 |
| [M6-3_OpenClaw实操_课件.pptx](M6-3_OpenClaw实操_课件.pptx) | 18 页投影 PPT（Midnight Executive 配色） | 投到主屏 |

## 重新生成（修改后）

```bash
# 修改 generate_word.js 或 generate_pptx.js 后
node generate_word.js   # 重生成 docx
node generate_pptx.js   # 重生成 pptx
```

## PPT 配色

**Midnight Executive** 色板（取自 docx-skill / pptx-skill 推荐组合）：
- 主色：Navy `1E2761`（标题 / 强调）
- 辅色：Ice `CADCFC`（高亮区 / 背景）
- 强调色：Gold `F4B400`（行动召唤）
- 警示色：Red `D32F2F`（API Key / 隐私）
- 成功色：Green `0F9D58`（实测 OK）

## 18 页 PPT 内容索引

1. 封面 · 90 分钟课
2. 一个真实场景（飞书 23:00 自动汇总邮件）
3. OpenClaw 是什么 / 不是什么（三栏对比）
4. 四大组件深拆（架构图）
5. Checkpoint #1（学员画图）
6. 实操 Step 1 · 全局安装（含坑点）
7. 实操 Step 2 · 初始化 .claw/ 目录
8. 实操 Step 3 · 配 Channel（Telegram vs 飞书并列）
9. Skill 1 · email-triage（60min → 0min）
10. Skill 2 · calendar-conflict-fixer（实测对话）
11. Skill 3 · weekly-report-bot（数据流图）
12. 答疑 · 4 个常见问题（2×2 网格）
13. Checkpoint #3 · 全员 Demo
14. 课后任务 3 件（必交）
15. ⚠️ 风险提示两条（API Key 是钱 + 别误发邮件）
16. 关键资源 · 官方 / 社区 / YouTube
17. 课前 / 课后对比（学员视角升级）
18. 下节预告 + Q&A

## 后续增量制作

按这套模板，下面 71 节课的 Word + PPT 由助教按顺序产出：每节课只需要把 markdown 剧本喂给同样的 generate_word.js / generate_pptx.js 工具链。
