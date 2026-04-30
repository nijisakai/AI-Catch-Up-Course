/**
 * Markdown → Word 通用转换器
 * 用法: node md_to_docx.js <input.md> <output.docx>
 *
 * 支持元素:
 *   # / ## / ### 标题
 *   段落 / 行内 **加粗** / `代码`
 *   - 项目符号
 *   1. 编号列表
 *   表格 (GFM)
 *   ``` 代码块
 *   > 引用
 *   --- 分页符
 */

const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat, HeadingLevel,
  BorderStyle, WidthType, ShadingType, PageNumber, PageBreak,
  ExternalHyperlink, PageOrientation,
} = require('docx');

const FONT = '微软雅黑';
const FONT_CODE = 'Consolas';

// CLI
const inFile = process.argv[2];
const outFile = process.argv[3];
if (!inFile || !outFile) {
  console.error('用法: node md_to_docx.js <input.md> <output.docx>');
  process.exit(1);
}
const md = fs.readFileSync(inFile, 'utf-8');

// ----- helpers -----
const border = { style: BorderStyle.SINGLE, size: 1, color: 'BFBFBF' };
const borders = { top: border, bottom: border, left: border, right: border };

// 解析行内: **加粗**, `代码`, [text](url)
function parseInline(text) {
  const runs = [];
  const tokenRe = /(\*\*([^*]+)\*\*|`([^`]+)`|\[([^\]]+)\]\(([^)]+)\))/g;
  let lastIdx = 0;
  let m;
  while ((m = tokenRe.exec(text)) !== null) {
    if (m.index > lastIdx) {
      runs.push(new TextRun({ text: text.slice(lastIdx, m.index), font: FONT, size: 22 }));
    }
    if (m[2] !== undefined) {
      runs.push(new TextRun({ text: m[2], bold: true, font: FONT, size: 22 }));
    } else if (m[3] !== undefined) {
      runs.push(new TextRun({ text: m[3], font: FONT_CODE, size: 20, shading: { type: ShadingType.CLEAR, fill: 'F2F2F2' } }));
    } else if (m[4] !== undefined) {
      runs.push(new ExternalHyperlink({
        children: [new TextRun({ text: m[4], style: 'Hyperlink', font: FONT, size: 22, color: '2E75B6', underline: {} })],
        link: m[5],
      }));
    }
    lastIdx = m.index + m[0].length;
  }
  if (lastIdx < text.length) {
    runs.push(new TextRun({ text: text.slice(lastIdx), font: FONT, size: 22 }));
  }
  if (runs.length === 0) {
    runs.push(new TextRun({ text: '', font: FONT, size: 22 }));
  }
  return runs;
}

function H1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 280, after: 180 },
    children: [new TextRun({ text, bold: true, size: 36, font: FONT, color: '1F4E79' })],
  });
}
function H2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 140 },
    children: [new TextRun({ text, bold: true, size: 28, font: FONT, color: '2E75B6' })],
  });
}
function H3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 100 },
    children: [new TextRun({ text, bold: true, size: 24, font: FONT, color: '404040' })],
  });
}

function P(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 80, line: 340 },
    children: parseInline(text),
    ...opts,
  });
}

function bullet(text, level = 0) {
  return new Paragraph({
    numbering: { reference: 'bullets', level },
    spacing: { after: 40, line: 320 },
    children: parseInline(text),
  });
}
function numbered(text) {
  return new Paragraph({
    numbering: { reference: 'numbers', level: 0 },
    spacing: { after: 40, line: 320 },
    children: parseInline(text),
  });
}
function quote(lines) {
  return lines.map(line => new Paragraph({
    spacing: { before: 60, after: 60, line: 320 },
    indent: { left: 360 },
    border: { left: { style: BorderStyle.SINGLE, size: 16, color: '2E75B6', space: 8 } },
    children: parseInline(line),
  }));
}
function code(text) {
  // text 可能多行
  const lines = text.split('\n');
  return lines.map(line => new Paragraph({
    spacing: { after: 20, line: 280 },
    shading: { type: ShadingType.CLEAR, fill: 'F2F2F2' },
    border: borders,
    children: [new TextRun({ text: line || ' ', font: FONT_CODE, size: 20 })],
  }));
}

function tableCell(text, opts = {}) {
  const { bold = false, fill = null, width = 2340, align = AlignmentType.LEFT } = opts;
  const cellOpts = {
    borders,
    width: { size: width, type: WidthType.DXA },
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    children: [new Paragraph({
      alignment: align,
      children: bold
        ? [new TextRun({ text, bold: true, font: FONT, size: 21 })]
        : parseInline(text).map(r => {
            // ensure the size is consistent
            if (r instanceof TextRun) {
              return new TextRun({ text: r.options?.text || '', bold: r.options?.bold, font: FONT, size: 21, color: r.options?.color });
            }
            return r;
          }),
    })],
  };
  if (fill) cellOpts.shading = { type: ShadingType.CLEAR, fill };
  return new TableCell(cellOpts);
}

function buildTable(headers, rows, colWidths) {
  if (!colWidths) {
    const totalW = 9360;
    colWidths = headers.map(() => Math.floor(totalW / headers.length));
  }
  const totalW = colWidths.reduce((a, b) => a + b, 0);
  return new Table({
    width: { size: totalW, type: WidthType.DXA },
    columnWidths: colWidths,
    rows: [
      new TableRow({
        children: headers.map((h, i) => tableCell(h, { bold: true, fill: 'D5E8F0', width: colWidths[i] })),
      }),
      ...rows.map(row => new TableRow({
        children: row.map((c, i) => tableCell(String(c), { width: colWidths[i] })),
      })),
    ],
  });
}

// ---------- 解析 markdown ----------
const lines = md.split('\n');
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

  // skip empty
  if (!trimmed) {
    i++;
    continue;
  }

  // 分隔线 → 跳过 (避免 PageBreak 干扰阅读流)
  if (/^[-*_]{3,}$/.test(trimmed)) {
    i++;
    continue;
  }

  // 标题
  if (/^#\s/.test(trimmed)) { children.push(H1(trimmed.replace(/^#\s+/, ''))); i++; continue; }
  if (/^##\s/.test(trimmed)) { children.push(H2(trimmed.replace(/^##\s+/, ''))); i++; continue; }
  if (/^###\s/.test(trimmed)) { children.push(H3(trimmed.replace(/^###\s+/, ''))); i++; continue; }

  // 代码块
  if (/^```/.test(trimmed)) {
    const buf = [];
    i++;
    while (i < lines.length && !/^```/.test(lines[i].trim())) {
      buf.push(lines[i]);
      i++;
    }
    i++; // skip closing ```
    children.push(...code(buf.join('\n')));
    continue;
  }

  // 引用
  if (/^>/.test(trimmed)) {
    const buf = [];
    while (i < lines.length && (/^>/.test(lines[i].trim()) || lines[i].trim() === '')) {
      const t = lines[i].trim();
      if (t.startsWith('>')) {
        buf.push(t.replace(/^>\s?/, ''));
      } else if (buf.length > 0) {
        // empty line within quote — flush as separate
        buf.push('');
      }
      i++;
      // 非引用行结束
      if (i < lines.length && !/^>/.test(lines[i].trim()) && lines[i].trim() !== '') break;
    }
    // 渲染引用块
    for (const q of buf) {
      if (q === '') {
        children.push(new Paragraph({ spacing: { before: 40 }, children: [new TextRun({ text: '', font: FONT, size: 18 })] }));
      } else {
        children.push(...quote([q]));
      }
    }
    continue;
  }

  // 表格 (GFM)
  if (/^\|/.test(trimmed) && i + 1 < lines.length && /^\|[\s:|-]+\|/.test(lines[i + 1].trim())) {
    const headerCells = trimmed.replace(/^\||\|$/g, '').split('|').map(s => s.trim());
    i += 2; // skip header + separator
    const rows = [];
    while (i < lines.length && /^\|/.test(lines[i].trim())) {
      const cells = lines[i].trim().replace(/^\||\|$/g, '').split('|').map(s => s.trim());
      rows.push(cells);
      i++;
    }
    const total = 9360;
    const widths = headerCells.map((_, idx) =>
      idx === 0 ? Math.min(800, Math.floor(total / headerCells.length)) :
                 Math.floor((total - 800) / Math.max(1, headerCells.length - 1))
    );
    children.push(buildTable(headerCells, rows, widths));
    children.push(new Paragraph({ spacing: { before: 80 }, children: [new TextRun({ text: '', font: FONT, size: 18 })] }));
    continue;
  }

  // 项目符号
  if (/^[-*]\s/.test(trimmed)) {
    while (i < lines.length && /^[-*]\s/.test(lines[i].trim())) {
      children.push(bullet(lines[i].trim().replace(/^[-*]\s+/, '')));
      i++;
    }
    continue;
  }

  // 编号列表
  if (/^\d+\.\s/.test(trimmed)) {
    while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
      children.push(numbered(lines[i].trim().replace(/^\d+\.\s+/, '')));
      i++;
    }
    continue;
  }

  // 普通段落
  const buf = [trimmed];
  i++;
  while (i < lines.length && lines[i].trim() && !/^(#|>|-|\*|\d+\.|```|\|)/.test(lines[i].trim())) {
    buf.push(lines[i].trim());
    i++;
  }
  flushParagraph(buf);
}

// ---------- 组装文档 ----------
const docTitle = path.basename(inFile, '.md').replace(/_/g, ' ');

const doc = new Document({
  creator: '《AI 跟上时代》',
  title: docTitle,
  styles: {
    default: { document: { run: { font: FONT, size: 22 } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 36, bold: true, font: FONT, color: '1F4E79' },
        paragraph: { spacing: { before: 280, after: 180 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 28, bold: true, font: FONT, color: '2E75B6' },
        paragraph: { spacing: { before: 240, after: 140 }, outlineLevel: 1 } },
      { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 24, bold: true, font: FONT, color: '404040' },
        paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 2 } },
    ],
  },
  numbering: {
    config: [
      { reference: 'bullets', levels: [
        { level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
        { level: 1, format: LevelFormat.BULLET, text: '◦', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 1080, hanging: 360 } } } },
      ]},
      { reference: 'numbers', levels: [
        { level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
      ]},
    ],
  },
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 }, // A4
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
      },
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [new TextRun({ text: docTitle, italics: true, color: '8E8E8E', size: 18, font: FONT })],
        })],
      }),
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: '第 ', size: 18, color: '8E8E8E', font: FONT }),
            new TextRun({ children: [PageNumber.CURRENT], size: 18, color: '8E8E8E', font: FONT }),
            new TextRun({ text: ' 页 / 共 ', size: 18, color: '8E8E8E', font: FONT }),
            new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 18, color: '8E8E8E', font: FONT }),
            new TextRun({ text: ' 页', size: 18, color: '8E8E8E', font: FONT }),
          ],
        })],
      }),
    },
    children,
  }],
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(outFile, buf);
  console.log(`✓ Written: ${outFile} (${buf.length} bytes, ${children.length} blocks)`);
});
