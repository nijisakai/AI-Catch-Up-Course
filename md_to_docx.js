/**
 * Markdown → Word（专业排版版）
 * 用法: node md_to_docx.js <input.md> <output.docx> [--title "副标题"]
 *
 * 特性:
 *   - 封面页（大标题 + 副标题 + 装饰色块）
 *   - 自动目录（H1/H2，需 Word 打开后右键"更新域"）
 *   - 优雅原生表格（深蓝表头 + 隔行浅灰）
 *   - 三层标题（H1 大字深蓝 + 装饰色条 / H2 中蓝 / H3 深灰）
 *   - 代码块（Consolas + 浅灰底 + 细边框）
 *   - 引用块（左侧蓝色色条 + 灰色斜体）
 *   - 自动页眉（运行标题）+ 自动页脚（页码 + 总页数，封面/目录除外）
 *   - 行内链接 / 加粗 / 行内代码
 */

const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat, HeadingLevel,
  BorderStyle, WidthType, ShadingType, PageNumber, PageBreak,
  ExternalHyperlink, TableOfContents, SectionType, VerticalAlign,
} = require('docx');

const FONT = '微软雅黑';
const FONT_CODE = 'Consolas';

// 配色 · 一致的视觉语言
const C = {
  primary: '1F4E79',       // 标题深蓝
  secondary: '2E75B6',     // 副标题中蓝
  accent: 'C00000',        // 强调红（极少用）
  body: '262626',          // 正文深灰（替代纯黑）
  mute: '7F7F7F',           // 辅助灰
  rule: 'D9D9D9',          // 边框浅灰
  tableHead: '1F4E79',     // 表头深蓝
  tableHeadFg: 'FFFFFF',   // 表头白字
  tableAlt: 'F2F6FA',      // 表格隔行浅蓝
  codeBg: 'F4F4F4',        // 代码块底
  quoteBar: '2E75B6',      // 引用左色条
};

// ----- CLI -----
const inFile = process.argv[2];
const outFile = process.argv[3];
const subtitleArg = (process.argv.indexOf('--title') > 0)
  ? process.argv[process.argv.indexOf('--title') + 1]
  : null;
if (!inFile || !outFile) {
  console.error('用法: node md_to_docx.js <input.md> <output.docx> [--title "副标题"]');
  process.exit(1);
}
const md = fs.readFileSync(inFile, 'utf-8');

// ----- helpers -----
const thinBorder = { style: BorderStyle.SINGLE, size: 4, color: C.rule };
const tableBorders = { top: thinBorder, bottom: thinBorder, left: thinBorder, right: thinBorder, insideHorizontal: thinBorder, insideVertical: thinBorder };

function inlineRuns(text, baseRun = {}) {
  const runs = [];
  const tokenRe = /(\*\*([^*]+)\*\*|`([^`]+)`|\[([^\]]+)\]\(([^)]+)\))/g;
  let lastIdx = 0;
  let m;
  while ((m = tokenRe.exec(text)) !== null) {
    if (m.index > lastIdx) {
      runs.push(new TextRun({ text: text.slice(lastIdx, m.index), font: FONT, size: 22, color: C.body, ...baseRun }));
    }
    if (m[2] !== undefined) {
      runs.push(new TextRun({ text: m[2], bold: true, font: FONT, size: 22, color: C.primary, ...baseRun }));
    } else if (m[3] !== undefined) {
      runs.push(new TextRun({ text: m[3], font: FONT_CODE, size: 20, color: C.accent, ...baseRun }));
    } else if (m[4] !== undefined) {
      runs.push(new ExternalHyperlink({
        children: [new TextRun({ text: m[4], style: 'Hyperlink', font: FONT, size: 22, color: C.secondary, underline: {} })],
        link: m[5],
      }));
    }
    lastIdx = m.index + m[0].length;
  }
  if (lastIdx < text.length) {
    runs.push(new TextRun({ text: text.slice(lastIdx), font: FONT, size: 22, color: C.body, ...baseRun }));
  }
  if (runs.length === 0) {
    runs.push(new TextRun({ text: '', font: FONT, size: 22, color: C.body, ...baseRun }));
  }
  return runs;
}

function H1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 480, after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 16, color: C.primary, space: 8 } },
    children: [new TextRun({ text, bold: true, size: 40, font: FONT, color: C.primary })],
  });
}
function H2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 320, after: 140 },
    children: [new TextRun({ text, bold: true, size: 30, font: FONT, color: C.secondary })],
  });
}
function H3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 240, after: 120 },
    children: [new TextRun({ text, bold: true, size: 25, font: FONT, color: C.body })],
  });
}

function P(text) {
  return new Paragraph({
    spacing: { after: 100, line: 360 },
    alignment: AlignmentType.JUSTIFIED,
    children: inlineRuns(text),
  });
}

function bullet(text, level = 0) {
  return new Paragraph({
    numbering: { reference: 'bullets', level },
    spacing: { after: 60, line: 340 },
    children: inlineRuns(text),
  });
}
function numbered(text) {
  return new Paragraph({
    numbering: { reference: 'numbers', level: 0 },
    spacing: { after: 60, line: 340 },
    children: inlineRuns(text),
  });
}
function quoteLine(line) {
  if (!line.trim()) {
    return new Paragraph({
      spacing: { after: 60 },
      indent: { left: 360 },
      border: { left: { style: BorderStyle.SINGLE, size: 24, color: C.quoteBar, space: 12 } },
      children: [new TextRun({ text: '', font: FONT, size: 18 })],
    });
  }
  return new Paragraph({
    spacing: { before: 60, after: 60, line: 340 },
    indent: { left: 360 },
    border: { left: { style: BorderStyle.SINGLE, size: 24, color: C.quoteBar, space: 12 } },
    shading: { type: ShadingType.CLEAR, fill: 'F8FAFD' },
    children: inlineRuns(line, { italics: true, color: C.body }),
  });
}
function codeLines(text) {
  const lines = text.split('\n');
  return lines.map((line, idx) => new Paragraph({
    spacing: { after: 0, line: 280 },
    shading: { type: ShadingType.CLEAR, fill: C.codeBg },
    border: {
      top: idx === 0 ? thinBorder : undefined,
      bottom: idx === lines.length - 1 ? thinBorder : undefined,
      left: thinBorder,
      right: thinBorder,
    },
    children: [new TextRun({ text: line || ' ', font: FONT_CODE, size: 19, color: C.body })],
  }));
}

function _cellInlineRuns(text, fg) {
  return inlineRuns(String(text)).map(r => {
    if (r instanceof TextRun) {
      return new TextRun({
        text: r.options?.text || '',
        bold: r.options?.bold,
        italics: r.options?.italics,
        font: r.options?.font || FONT,
        size: 20,
        color: r.options?.color || fg,
      });
    }
    return r;
  });
}

function tableCell(text, opts = {}) {
  const { isHeader = false, isAlt = false, width = 2340, align = AlignmentType.LEFT, verticalAlign = VerticalAlign.CENTER } = opts;
  const fill = isHeader ? C.tableHead : (isAlt ? C.tableAlt : null);
  const fg = isHeader ? C.tableHeadFg : C.body;

  // cell 内允许 <br> 拆多段；首段含 ➤ 时按要点列表渲染
  const segments = String(text).split(/<br\s*\/?>/i).map(s => s.trim()).filter(s => s.length > 0);
  const paragraphs = [];

  if (isHeader) {
    paragraphs.push(new Paragraph({
      alignment: align,
      spacing: { line: 320 },
      children: [new TextRun({ text, bold: true, font: FONT, size: 21, color: fg })],
    }));
  } else if (segments.length === 0) {
    paragraphs.push(new Paragraph({
      alignment: align,
      spacing: { line: 320 },
      children: [new TextRun({ text: '', font: FONT, size: 20, color: fg })],
    }));
  } else {
    segments.forEach((seg, idx) => {
      // 检测要点：以 ➤ ▸ ▶ ■ • - * 开头
      const bulletMatch = seg.match(/^([➤▸▶■•·]|-|\*)\s*(.+)$/);
      if (bulletMatch) {
        paragraphs.push(new Paragraph({
          alignment: AlignmentType.LEFT,
          spacing: { before: idx === 0 ? 0 : 40, after: 40, line: 320 },
          indent: { left: 240, hanging: 240 },
          children: [
            new TextRun({ text: '➤  ', font: FONT, size: 20, color: C.secondary, bold: true }),
            ..._cellInlineRuns(bulletMatch[2], fg),
          ],
        }));
      } else {
        paragraphs.push(new Paragraph({
          alignment: align,
          spacing: { before: idx === 0 ? 0 : 60, after: 40, line: 320 },
          children: _cellInlineRuns(seg, fg),
        }));
      }
    });
  }

  const cellOpts = {
    borders: tableBorders,
    width: { size: width, type: WidthType.DXA },
    margins: { top: 120, bottom: 120, left: 160, right: 160 },
    verticalAlign,
    children: paragraphs,
  };
  if (fill) cellOpts.shading = { type: ShadingType.CLEAR, fill };
  return new TableCell(cellOpts);
}

function buildTable(headers, rows, colWidths) {
  if (!colWidths) {
    const totalW = 9000;
    colWidths = headers.map(() => Math.floor(totalW / headers.length));
  }
  const totalW = colWidths.reduce((a, b) => a + b, 0);
  return new Table({
    width: { size: totalW, type: WidthType.DXA },
    columnWidths: colWidths,
    borders: tableBorders,
    rows: [
      new TableRow({
        tableHeader: true,
        children: headers.map((h, i) => tableCell(h, { isHeader: true, width: colWidths[i] })),
      }),
      ...rows.map((row, rIdx) => new TableRow({
        children: row.map((c, i) => tableCell(c, { isAlt: rIdx % 2 === 1, width: colWidths[i] })),
      })),
    ],
  });
}

// ---------- 解析 markdown ----------
const allLines = md.split('\n');

// 第一行 H1 作为文档标题
let docTitle = path.basename(inFile, '.md').replace(/_/g, ' ');
let firstH1Idx = -1;
for (let i = 0; i < allLines.length; i++) {
  if (/^#\s/.test(allLines[i].trim())) {
    docTitle = allLines[i].replace(/^#\s+/, '').trim();
    firstH1Idx = i;
    break;
  }
}

// 找到紧随 H1 的第一段 quote 作为副标题摘录
let coverSubtitleLines = [];
if (firstH1Idx >= 0) {
  for (let j = firstH1Idx + 1; j < allLines.length && j < firstH1Idx + 12; j++) {
    const t = allLines[j].trim();
    if (!t) continue;
    if (t.startsWith('>')) {
      coverSubtitleLines.push(t.replace(/^>\s?/, ''));
    } else if (coverSubtitleLines.length > 0) {
      break;
    } else {
      break;
    }
  }
}

const subtitleText = subtitleArg ||
  (coverSubtitleLines.length > 0 ? coverSubtitleLines.join('   ·   ').replace(/\*\*/g, '') : '');

// 跳过 H1 + 紧随其后的 quote 块（已搬到封面）
let skipUntil = firstH1Idx;
if (firstH1Idx >= 0) {
  let j = firstH1Idx + 1;
  while (j < allLines.length && (!allLines[j].trim() || allLines[j].trim().startsWith('>'))) {
    j++;
  }
  // 也吃掉紧跟的 ---
  while (j < allLines.length && (!allLines[j].trim() || /^[-*_]{3,}$/.test(allLines[j].trim()))) {
    j++;
  }
  skipUntil = j - 1;
}

const lines = allLines.slice(skipUntil + 1);
const children = [];
let i = 0;

function flushParagraph(buf) {
  if (buf.length === 0) return;
  const text = buf.join(' ').trim();
  if (text) children.push(P(text));
}

while (i < lines.length) {
  const line = lines[i];
  const trimmed = line.trim();
  if (!trimmed) { i++; continue; }
  if (/^[-*_]{3,}$/.test(trimmed)) { i++; continue; }
  if (/^#\s/.test(trimmed)) { children.push(H1(trimmed.replace(/^#\s+/, ''))); i++; continue; }
  if (/^##\s/.test(trimmed)) { children.push(H2(trimmed.replace(/^##\s+/, ''))); i++; continue; }
  if (/^###\s/.test(trimmed)) { children.push(H3(trimmed.replace(/^###\s+/, ''))); i++; continue; }
  if (/^```/.test(trimmed)) {
    const buf = [];
    i++;
    while (i < lines.length && !/^```/.test(lines[i].trim())) { buf.push(lines[i]); i++; }
    i++;
    children.push(...codeLines(buf.join('\n')));
    children.push(new Paragraph({ spacing: { before: 100 }, children: [new TextRun('')] }));
    continue;
  }
  if (/^>/.test(trimmed)) {
    while (i < lines.length && /^>/.test(lines[i].trim())) {
      const t = lines[i].trim().replace(/^>\s?/, '');
      children.push(quoteLine(t));
      i++;
    }
    children.push(new Paragraph({ spacing: { before: 80 }, children: [new TextRun('')] }));
    continue;
  }
  if (/^\|/.test(trimmed) && i + 1 < lines.length && /^\|[\s:|-]+\|/.test(lines[i + 1].trim())) {
    const headerCells = trimmed.replace(/^\||\|$/g, '').split('|').map(s => s.trim());
    i += 2;
    const rows = [];
    while (i < lines.length && /^\|/.test(lines[i].trim())) {
      const cells = lines[i].trim().replace(/^\||\|$/g, '').split('|').map(s => s.trim());
      rows.push(cells);
      i++;
    }
    // 智能列宽
    const total = 9000;
    const ncols = headerCells.length;
    let finalWidths;

    // 2 列表格特殊优化：右列含 <br> 要点列表 → 30/70；否则 35/65 或 50/50
    if (ncols === 2) {
      const rightHasList = rows.some(r => /<br\s*\/?>/i.test(r[1] || ''));
      if (rightHasList) {
        finalWidths = [2700, 6300]; // 30 / 70
      } else if (headerCells[0].length <= 4 && headerCells[1].length > 4) {
        finalWidths = [2200, 6800]; // 短表头 + 长内容
      } else {
        finalWidths = [3200, 5800]; // 35 / 65
      }
    } else if (ncols >= 3) {
      // 第一列窄（如果是序号 / 编号 / # / 模块）
      const firstHeader = headerCells[0].replace(/\s/g, '');
      const w0 = /^(#|序号|编号|项|类目|模块)/.test(firstHeader) ? 800 :
                 (headerCells[0].length <= 3 ? 1000 : Math.floor(total / ncols));
      const wRest = Math.floor((total - w0) / (ncols - 1));
      finalWidths = headerCells.map((_, idx) => idx === 0 ? w0 : wRest);
    } else {
      finalWidths = [total];
    }

    children.push(buildTable(headerCells, rows, finalWidths));
    children.push(new Paragraph({ spacing: { before: 120 }, children: [new TextRun('')] }));
    continue;
  }
  if (/^[-*]\s/.test(trimmed)) {
    while (i < lines.length && /^[-*]\s/.test(lines[i].trim())) {
      children.push(bullet(lines[i].trim().replace(/^[-*]\s+/, '')));
      i++;
    }
    continue;
  }
  if (/^\d+\.\s/.test(trimmed)) {
    while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
      children.push(numbered(lines[i].trim().replace(/^\d+\.\s+/, '')));
      i++;
    }
    continue;
  }
  const buf = [trimmed];
  i++;
  while (i < lines.length && lines[i].trim() && !/^(#|>|-|\*|\d+\.|```|\|)/.test(lines[i].trim())) {
    buf.push(lines[i].trim());
    i++;
  }
  flushParagraph(buf);
}

// ---------- 封面 ----------
const coverChildren = [
  new Paragraph({ spacing: { before: 2400 }, children: [new TextRun('')] }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 24, color: C.primary, space: 16 } },
    children: [new TextRun({ text: '《AI 跟上时代》', bold: true, size: 44, font: FONT, color: C.secondary })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 320, after: 160 },
    children: [new TextRun({ text: docTitle, bold: true, size: 64, font: FONT, color: C.primary })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 320, after: 800 },
    children: [new TextRun({ text: '———— 线下精品班 ————', size: 22, font: FONT, color: C.mute, italics: true })],
  }),
];

if (subtitleText) {
  for (const sub of coverSubtitleLines) {
    coverChildren.push(new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 80, after: 80, line: 360 },
      indent: { left: 720, right: 720 },
      children: inlineRuns(sub, { color: C.body, italics: true }),
    }));
  }
}

coverChildren.push(new Paragraph({ spacing: { before: 1600 }, children: [new TextRun('')] }));
coverChildren.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { before: 200 },
  children: [new TextRun({ text: '2026 · 内部资料', size: 18, font: FONT, color: C.mute })],
}));

// ---------- 目录 ----------
const tocChildren = [
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 720, after: 320 },
    children: [new TextRun({ text: '目  录', bold: true, size: 40, font: FONT, color: C.primary })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 480 },
    children: [new TextRun({ text: '（在 Word 中打开后，右键此页 → "更新域" 自动生成）', size: 18, font: FONT, color: C.mute, italics: true })],
  }),
  new TableOfContents('目录', {
    hyperlink: true,
    headingStyleRange: '1-3',
  }),
];

// ---------- 装文档 ----------
const doc = new Document({
  creator: '《AI 跟上时代》',
  title: docTitle,
  description: '由《AI 跟上时代》课程组出品',
  styles: {
    default: { document: { run: { font: FONT, size: 22, color: C.body } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 40, bold: true, font: FONT, color: C.primary },
        paragraph: { spacing: { before: 480, after: 200 }, outlineLevel: 0,
          border: { bottom: { style: BorderStyle.SINGLE, size: 16, color: C.primary, space: 8 } } } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 30, bold: true, font: FONT, color: C.secondary },
        paragraph: { spacing: { before: 320, after: 140 }, outlineLevel: 1 } },
      { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 25, bold: true, font: FONT, color: C.body },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 2 } },
    ],
  },
  numbering: {
    config: [
      { reference: 'bullets', levels: [
        { level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } },
                   run: { font: FONT, color: C.secondary } } },
        { level: 1, format: LevelFormat.BULLET, text: '◦', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 1080, hanging: 360 } } } },
      ]},
      { reference: 'numbers', levels: [
        { level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } },
                   run: { bold: true, color: C.secondary } } },
      ]},
    ],
  },
  sections: [
    // —— 封面（无页眉页脚）
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        },
        titlePage: true,
      },
      headers: {},
      footers: {},
      children: coverChildren,
    },
    // —— 目录（无页眉页脚）
    {
      properties: {
        type: SectionType.NEXT_PAGE,
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        },
      },
      headers: {},
      footers: {},
      children: tocChildren,
    },
    // —— 正文（带页眉页脚）
    {
      properties: {
        type: SectionType.NEXT_PAGE,
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
          pageNumbers: { start: 1 },
        },
      },
      headers: {
        default: new Header({
          children: [new Paragraph({
            alignment: AlignmentType.RIGHT,
            border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: C.rule, space: 4 } },
            children: [new TextRun({ text: docTitle, italics: true, color: C.mute, size: 18, font: FONT })],
          })],
        }),
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            border: { top: { style: BorderStyle.SINGLE, size: 6, color: C.rule, space: 4 } },
            children: [
              new TextRun({ text: '— ', size: 18, color: C.mute, font: FONT }),
              new TextRun({ children: [PageNumber.CURRENT], size: 18, color: C.body, font: FONT, bold: true }),
              new TextRun({ text: ' / ', size: 18, color: C.mute, font: FONT }),
              new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 18, color: C.mute, font: FONT }),
              new TextRun({ text: ' —', size: 18, color: C.mute, font: FONT }),
            ],
          })],
        }),
      },
      children,
    },
  ],
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(outFile, buf);
  console.log(`OK: ${outFile} (${(buf.length/1024).toFixed(1)} KB, ${children.length} blocks)`);
});
