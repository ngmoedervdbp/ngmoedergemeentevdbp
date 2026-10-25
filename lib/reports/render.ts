import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";
import ExcelJS from "exceljs";
import { AlignmentType, BorderStyle, Document, Footer, Header, HeadingLevel, Packer, PageNumber, Paragraph, ShadingType, Table, TableCell, TableLayoutType, TableRow, TextRun, WidthType } from "docx";
import { GEMEENTE } from "@/lib/gemeente";
import { displayValue, type Report, type ReportSection, type ReportValue } from "./model";
import { fmtDatum, fmtGetal, fmtTyd } from "@/lib/format";

const INK = "221F26";
const BRAND = "3D3B73";
const MUTED = "6B6570";
const PALE = "F4F2ED";
const GOLD = "A8752B";
const asciiDashes = (value: string) => value.replace(/[\u2010-\u2015\u2212]/g, "-");
const stamp = (report: Report) => `${fmtDatum(report.generatedAt)} om ${fmtTyd(report.generatedAt)}`;

/** Text and vector drawing only. Tables paginate and repeat their headings. */
export function renderPdf(report: Report) {
  const doc = new jsPDF({ unit: "mm", format: "a4", compress: true });
  doc.setProperties({ title: report.title, author: report.author, subject: GEMEENTE.naam, creator: "NG Moedergemeente · Lidmaatbestuur" });
  let width = doc.internal.pageSize.getWidth();
  doc.setFillColor(BRAND).rect(0, 0, width, 4, "F");
  doc.setTextColor(BRAND).setFont("helvetica", "bold").setFontSize(10).text(GEMEENTE.naam, 16, 18);
  doc.setTextColor(INK).setFontSize(29).text(report.title, 16, 37);
  doc.setFont("helvetica", "normal").setTextColor(MUTED).setFontSize(10).text(asciiDashes(report.subtitle), 16, 46);
  doc.setFontSize(8).text(`Opgestel deur ${asciiDashes(report.author)} | ${stamp(report)}`, 16, 53);
  const metricWidth = (width - 32 - (report.metrics.length - 1) * 3) / report.metrics.length;
  report.metrics.forEach((metric, i) => {
    const x = 16 + i * (metricWidth + 3);
    doc.setFillColor(PALE).roundedRect(x, 62, metricWidth, 25, 2, 2, "F");
    doc.setTextColor(BRAND).setFont("helvetica", "bold").setFontSize(21).text(fmtGetal(metric.value), x + 4, 73);
    doc.setTextColor(MUTED).setFont("helvetica", "normal").setFontSize(7).text(metric.label, x + 4, 81);
  });
  doc.setFontSize(8).setTextColor(MUTED);
  const note = doc.splitTextToSize(asciiDashes(report.note), width - 32);
  doc.text(note, 16, 95);
  let y = 100 + note.length * 3.5;
  for (const section of report.sections) {
    // Detailed registers have a dedicated landscape page with readable columns.
    if (section.columns.length > 4) {
      doc.addPage("a4", "landscape");
      y = 28;
    } else if (y > doc.internal.pageSize.getHeight() - 48) {
      doc.addPage();
      y = 28;
    }
    width = doc.internal.pageSize.getWidth();
    doc.setFont("helvetica", "bold").setFontSize(12).setTextColor(BRAND);
    const heading = doc.splitTextToSize(asciiDashes(section.title), width - 32);
    doc.text(heading, 16, y);
    y += heading.length * 5 + 3;
    autoTable(doc, {
      startY: y, margin: { left: 16, right: 16, top: 28, bottom: 18 },
      head: [section.columns.map((c) => c.label)],
      body: section.rows.length ? section.rows.map((row) => row.map((v) => asciiDashes(displayValue(v)))) : [[{ content: "Geen rekords vir hierdie verslag nie.", colSpan: section.columns.length }]],
      theme: "plain", rowPageBreak: "avoid", showHead: "everyPage",
      styles: { font: "helvetica", fontSize: 9, cellPadding: 2.2, textColor: INK, overflow: "linebreak", valign: "top", lineColor: "E1DCD2", lineWidth: { bottom: 0.15 } },
      headStyles: { fillColor: BRAND, textColor: "FFFFFF", fontStyle: "bold", fontSize: 8.5 },
      alternateRowStyles: { fillColor: "F7F6F2" },
      columnStyles: Object.fromEntries(section.columns.map((c, i) => [i, { halign: c.type === "number" ? "right" : "left", cellWidth: (width - 32) * ((c.width ?? 20) / section.columns.reduce((sum, col) => sum + (col.width ?? 20), 0)) }])),
      didDrawCell: (data) => {
        if (section.columns.length !== 2 || data.section !== "body" || data.column.index !== 1) return;
        const value = section.rows[data.row.index]?.[1];
        const max = Math.max(1, ...section.rows.map((row) => typeof row[1] === "number" ? row[1] : 0));
        if (typeof value === "number" && value > 0) {
          doc.setFillColor(BRAND).roundedRect(data.cell.x + 3, data.cell.y + data.cell.height / 2 - 0.7, (data.cell.width - 20) * value / max, 1.4, 0.7, 0.7, "F");
        }
      },
      didDrawPage: (data) => { y = data.cursor?.y ?? y; },
    });
    y += 13;
  }
  for (let page = 1; page <= doc.getNumberOfPages(); page++) {
    doc.setPage(page);
    width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();
    if (page > 1) {
      doc.setFillColor(BRAND).rect(0, 0, width, 3, "F");
      doc.setTextColor(BRAND).setFont("helvetica", "bold").setFontSize(9).text(`${GEMEENTE.kortNaam} | ${report.title}`, 16, 14);
      doc.setFont("helvetica", "normal").setTextColor(MUTED).setFontSize(7).text(asciiDashes(report.subtitle), 16, 20);
    }
    doc.setDrawColor("E1DCD2").line(16, height - 14, width - 16, height - 14);
    doc.setFont("helvetica", "normal").setTextColor(MUTED).setFontSize(7);
    doc.text("Vertroulik | Slegs vir gemagtigde gemeentegebruik", 16, height - 9);
    doc.text(`Bladsy ${page} van ${doc.getNumberOfPages()}`, width - 16, height - 9, { align: "right" });
  }
  return new Uint8Array(doc.output("arraybuffer"));
}

export async function renderXlsx(report: Report) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = report.author;
  workbook.created = report.generatedAt;
  workbook.title = report.title;
  const summary: ReportSection = { title: "Oorsig", columns: [{ label: "Maatstaf", width: 32 }, { label: "Waarde", type: "number", width: 20 }], rows: report.metrics.map((m) => [m.label, m.value]) };
  [summary, ...report.sections].forEach((section, index) => {
    const name = section.title.replace(/[\\/*?:\[\]]/g, "").slice(0, 27);
    const sheet = workbook.addWorksheet(`${index + 1} ${name}`.slice(0, 31), { views: [{ state: "frozen", ySplit: 5 }], pageSetup: { paperSize: 9, orientation: section.columns.length > 4 ? "landscape" : "portrait", fitToPage: true, fitToWidth: 1, fitToHeight: 0 } });
    sheet.columns = section.columns.map((c) => ({ width: c.width ?? 22 }));
    const end = Math.max(section.columns.length, 2);
    sheet.mergeCells(1, 1, 1, end);
    sheet.getCell(1, 1).value = `${report.title} | ${GEMEENTE.kortNaam}`;
    sheet.getCell(1, 1).font = { name: "Calibri", size: 18, bold: true, color: { argb: BRAND } };
    sheet.getRow(1).height = 34;
    sheet.mergeCells(2, 1, 2, end);
    sheet.getCell(2, 1).value = report.subtitle;
    sheet.mergeCells(3, 1, 3, end);
    sheet.getCell(3, 1).value = `${section.title} | ${report.author} | ${stamp(report)}`;
    sheet.getRow(3).height = 32;
    sheet.getCell(3, 1).alignment = { wrapText: true, vertical: "middle" };
    const header = sheet.getRow(5);
    header.values = section.columns.map((c) => c.label);
    header.height = 30;
    header.eachCell((cell) => {
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: BRAND } };
      cell.font = { name: "Calibri", size: 11, bold: true, color: { argb: "FFFFFF" } };
      cell.alignment = { vertical: "middle", wrapText: true };
    });
    section.rows.forEach((values, rowIndex) => {
      const row = sheet.addRow(values);
      row.height = Math.max(28, ...values.map((value, i) => Math.ceil(displayValue(value).length / Math.max(8, (section.columns[i]?.width ?? 22) - 2)) * 15 + 10));
      row.eachCell({ includeEmpty: true }, (cell, i) => {
        cell.font = { name: "Calibri", size: 11, color: { argb: INK } };
        cell.alignment = { vertical: "top", wrapText: true };
        if (rowIndex % 2 === 0) cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: PALE } };
        if (section.columns[i - 1].type === "date") cell.numFmt = "dd/mm/yyyy";
        else if (section.columns[i - 1].type === "number") cell.numFmt = "#,##0.##";
        else cell.numFmt = "@"; // Phone numbers and formula-looking text stay literal.
      });
    });
    if (section.rows.length) sheet.autoFilter = { from: { row: 5, column: 1 }, to: { row: 5 + section.rows.length, column: section.columns.length } };
    if (!section.rows.length) sheet.getCell(6, 1).value = "Geen rekords vir hierdie verslag nie.";
    if (index === 0) {
      const noteRow = 7 + section.rows.length;
      sheet.mergeCells(noteRow, 1, noteRow, end);
      sheet.getCell(noteRow, 1).value = report.note;
      sheet.getCell(noteRow, 1).alignment = { wrapText: true, vertical: "top" };
      sheet.getRow(noteRow).height = 70;
    }
    sheet.headerFooter.oddFooter = "Vertroulik | Bladsy &P van &N";
    sheet.pageSetup.printTitlesRow = "1:5";
  });
  return new Uint8Array(await workbook.xlsx.writeBuffer());
}

/** CSV is a flat register; Excel, Word and PDF include the summary sections. */
export function renderCsv(report: Report) {
  const wardList = report.title === "Wyklys";
  const sections = wardList ? report.sections : report.sections.slice(-1);
  const section = sections[0];
  const quote = (value: ReportValue) => {
    let text = value instanceof Date ? value.toISOString().slice(0, 10) : value === null ? "" : String(value);
    if (/^[\s]*[=+@-]/.test(text) && typeof value !== "number") text = `'${text}`;
    return `"${text.replace(/"/g, '""')}"`;
  };
  const rows: ReportValue[][] = [
    [...(wardList ? ["Wyk"] : []), ...(section?.columns.map((c) => c.label) ?? ["Naam", "Selfoon", "E-pos"])],
    ...sections.flatMap((s) => s.rows.map((row) => [...(wardList ? [s.title] : []), ...row])),
  ];
  return new TextEncoder().encode("\uFEFF" + rows.map((row) => row.map(quote).join(",")).join("\r\n") + "\r\n");
}

export async function renderDocx(report: Report) {
  const text = (value: string, bold = false, color = INK) => new TextRun({ text: value, bold, color, font: "Arial", size: 20 });
  const children: (Paragraph | Table)[] = [
    new Paragraph({ heading: HeadingLevel.TITLE, children: [new TextRun({ text: report.title, size: 54, bold: true, color: BRAND })] }),
    new Paragraph({ children: [text(report.subtitle)], spacing: { after: 180 } }),
    new Paragraph({ children: [text(`Opgestel deur ${report.author} | ${stamp(report)}`, false, MUTED)], spacing: { after: 280 } }),
    ...report.metrics.map((m) => new Paragraph({ children: [text(`${m.label}: `, true), text(fmtGetal(m.value))], spacing: { after: 100 } })),
    new Paragraph({ children: [text(report.note, false, MUTED)], spacing: { before: 180, after: 240 } }),
  ];
  report.sections.forEach((section) => {
    children.push(new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: section.title, bold: true, size: 28, color: BRAND })], spacing: { before: 280, after: 160 }, keepNext: true }));
    const totalWidth = 14400;
    const columnWidths = section.columns.map((c) => Math.floor(totalWidth * ((c.width ?? 20) / section.columns.reduce((s, col) => s + (col.width ?? 20), 0))));
    columnWidths[columnWidths.length - 1] += totalWidth - columnWidths.reduce((a, b) => a + b, 0);
    const row = (values: string[], head: boolean, index: number) => new TableRow({
      tableHeader: head, cantSplit: true,
      children: values.map((value, i) => new TableCell({
        width: { size: columnWidths[i], type: WidthType.DXA },
        shading: { type: ShadingType.CLEAR, fill: head ? BRAND : index % 2 === 0 ? PALE : "FFFFFF" },
        margins: { top: 110, bottom: 110, left: 110, right: 110 },
        children: [new Paragraph({ children: [text(value, head, head ? "FFFFFF" : INK)] })],
      })),
    });
    const border = { style: BorderStyle.SINGLE, size: 4, color: "E1DCD2" };
    children.push(new Table({ width: { size: totalWidth, type: WidthType.DXA }, layout: TableLayoutType.FIXED, columnWidths, borders: { top: border, bottom: border, left: border, right: border, insideHorizontal: border, insideVertical: border }, rows: [row(section.columns.map((c) => c.label), true, 0), ...(section.rows.length ? section.rows.map((r, i) => row(r.map(displayValue), false, i)) : [row(section.columns.map((_, i) => i === 0 ? "Geen rekords vir hierdie verslag nie." : ""), false, 0)])] }));
  });
  const document = new Document({
    creator: report.author, title: report.title, description: GEMEENTE.naam,
    styles: { default: { document: { run: { font: "Arial", size: 20 }, paragraph: { spacing: { after: 80 } } } } },
    sections: [{
      properties: { page: { size: { width: 16838, height: 11906 }, margin: { top: 1000, bottom: 1000, left: 1219, right: 1219 } } },
      headers: { default: new Header({ children: [new Paragraph({ children: [text(GEMEENTE.naam, true, BRAND)], border: { bottom: { style: BorderStyle.SINGLE, color: GOLD, size: 8, space: 8 } } })] }) },
      footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [text("Vertroulik | Bladsy ", false, MUTED), new TextRun({ children: [PageNumber.CURRENT, " van ", PageNumber.TOTAL_PAGES], size: 18, color: MUTED })] })] }) },
      children,
    }],
  });
  return new Uint8Array(await Packer.toBuffer(document));
}

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export function renderPrint(report: Report) {
  const e = escapeHtml;
  return `<!doctype html><html lang="af"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${e(report.title)}</title><style>
  @page{size:A4 landscape;margin:15mm}*{box-sizing:border-box}body{font:11pt/1.5 Arial,sans-serif;color:#${INK};margin:32px auto;max-width:1100px;padding:0 20px}header{border-top:5px solid #${BRAND};padding-top:16px}h1{font-size:30pt;line-height:1.1;margin:12px 0;color:#${BRAND}}h2{font-size:15pt;margin:28px 0 12px;color:#${BRAND};break-after:avoid}p{color:#${MUTED}}.metrics{display:flex;gap:12px;margin:24px 0}.metric{flex:1;background:#${PALE};padding:14px}.metric strong{display:block;font-size:24pt;color:#${BRAND}}table{width:100%;border-collapse:collapse;table-layout:fixed;font-size:9pt}th,td{text-align:left;padding:9px;overflow-wrap:anywhere;border-bottom:1px solid #ddd;vertical-align:top}th{background:#${BRAND};color:white}tr:nth-child(even){background:#${PALE}}thead{display:table-header-group}tr{break-inside:avoid}.note{font-size:9pt}footer{border-top:1px solid #ddd;margin-top:28px;padding-top:10px;color:#${MUTED};font-size:9pt}.tools{display:flex;gap:12px;margin-bottom:20px}button{font:inherit;padding:10px 16px;cursor:pointer} @media print{body{margin:0;max-width:none;padding:0}.tools{display:none}*{print-color-adjust:exact;-webkit-print-color-adjust:exact}}@media(max-width:600px){.metrics{flex-wrap:wrap}.metric{flex-basis:40%}.table-wrap{overflow-x:auto}table{min-width:650px}}
  </style></head><body><div class="tools"><button onclick="window.print()">Druk verslag</button><button onclick="window.close()">Maak toe</button></div><header><strong>${e(GEMEENTE.naam)}</strong><h1>${e(report.title)}</h1><p>${e(report.subtitle)}<br>Opgestel deur ${e(report.author)} | ${e(stamp(report))}</p></header><div class="metrics">${report.metrics.map((m) => `<div class="metric"><strong>${e(fmtGetal(m.value))}</strong>${e(m.label)}</div>`).join("")}</div><p class="note">${e(report.note)}</p>${report.sections.map((s) => `<section><h2>${e(s.title)}</h2><div class="table-wrap"><table><thead><tr>${s.columns.map((c) => `<th>${e(c.label)}</th>`).join("")}</tr></thead><tbody>${s.rows.length ? s.rows.map((row) => `<tr>${row.map((v) => `<td>${e(displayValue(v))}</td>`).join("")}</tr>`).join("") : `<tr><td colspan="${s.columns.length}">Geen rekords vir hierdie verslag nie.</td></tr>`}</tbody></table></div></section>`).join("")}<footer>Vertroulik | Slegs vir gemagtigde gemeentegebruik</footer></body></html>`;
}
