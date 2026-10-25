import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import ExcelJS from "exceljs";
import { memberReport, ministryReport, wardReport, reportRange, filterActivities } from "../lib/reports/model";
import { renderCsv, renderDocx, renderPdf, renderPrint, renderXlsx } from "../lib/reports/render";
import { member, activity, wards } from "./fixtures";

const now = new Date("2026-10-25T10:00:00Z");
const members = [member(0), member(1), { ...member(2), date_of_birth: "2016-06-01" }, { ...member(3), status: "onaktief" as const }];

test("member totals reconcile with known ages, missing dates, status and unassigned wards", () => {
  const report = memberReport(members, wards, "Toetsgebruiker", false, now);
  assert.deepEqual(report.metrics.map((m) => m.value), [3, 1, 1, 1]);
  assert.equal(report.sections.at(-1)?.rows.length, 3);
  assert.equal(memberReport(members, wards, "Toets", true, now).sections.at(-1)?.rows.length, 4);
  assert.equal(report.sections.find((s) => s.title === "Lidmate per wyk")?.rows.reduce((n, row) => n + Number(row[1]), 0), 3);
  assert.equal(JSON.stringify(report).includes("PRIVATE_NOTES"), false);
});

test("period boundaries use Johannesburg days, Mondays, month starts and 30 inclusive days", () => {
  assert.deepEqual(reportRange("vandag", new Date("2026-10-24T22:15Z")), { from: "2026-10-25", to: "2026-10-25" });
  assert.deepEqual(reportRange("week", now), { from: "2026-10-19", to: "2026-10-25" });
  assert.deepEqual(reportRange("maand", now), { from: "2026-10-01", to: "2026-10-25" });
  assert.deepEqual(reportRange("dae30", now), { from: "2026-09-26", to: "2026-10-25" });
  const items = [activity("2026-09-25"), activity("2026-09-26"), activity("2026-10-25"), activity("2026-10-26")];
  assert.equal(filterActivities(items, "dae30", now).length, 2);
  assert.equal(ministryReport(items, "Toets", "dae30", now).metrics[1].value, 3);
});

test("xlsx round-trip preserves sortable dates, numbers, phone strings, filters and missing dates", async () => {
  const report = memberReport(members, wards, "Toets", true, now);
  const bytes = await renderXlsx(report);
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(bytes.buffer as ArrayBuffer);
  assert.equal(workbook.worksheets.length, 5);
  const sheet = workbook.worksheets.at(-1)!;
  assert.equal(sheet.rowCount, 9);
  assert.ok(sheet.autoFilter);
  assert.equal(sheet.views[0].state, "frozen");
  const rows = sheet.getRows(6, 4)!;
  const zoe = rows.find((r) => r.getCell(1).value === "Zoë Du Plessis")!;
  assert.equal(zoe.getCell(2).value, null);
  assert.equal(zoe.getCell(6).value, "+27821234567");
  const known = rows.find((r) => r.getCell(2).value instanceof Date)!;
  assert.equal(known.getCell(2).numFmt, "dd/mm/yyyy");
  assert.equal(typeof known.getCell(3).value, "number");
});

test("csv handles Unicode, quotes, commas, newlines and spreadsheet formula prefixes", () => {
  const report = memberReport([{ ...member(), first_name: '=HYPERLINK("test")', last_name: "Comma, line\nnext" }], wards, "Toets", true, now);
  const csv = new TextDecoder().decode(renderCsv(report));
  assert.match(csv, /"'=HYPERLINK\(""test""\)/);
  assert.match(csv, /Comma, line\nnext/);
  assert.match(csv, /"'\+27821234567"/);
  assert.ok(csv.endsWith("\r\n"));
});

test("Word is a real docx with repeated table headers and page fields", async () => {
  const dir = await mkdtemp(join(tmpdir(), "ng-docx-test-"));
  try {
    const path = join(dir, "report.docx");
    await writeFile(path, await renderDocx(memberReport(members, wards, "Toets", false, now)));
    const xml = execFileSync("unzip", ["-p", path, "word/document.xml"], { encoding: "utf8" });
    assert.match(xml, /Zoë Du Plessis/);
    assert.match(xml, /w:tblHeader/);
    assert.equal(xml.includes("PRIVATE_NOTES"), false);
    const footer = execFileSync("unzip", ["-p", path, "word/footer1.xml"], { encoding: "utf8" });
    assert.match(footer, /NUMPAGES/);
  } finally { await rm(dir, { recursive: true, force: true }); }
});

test("PDF, print, Excel, Word and CSV support every empty report without crashing", async () => {
  for (const report of [memberReport([], [], "Toets", false, now), ministryReport([], "Toets", "week", now), wardReport([], [], "Toets", now)]) {
    assert.equal(new TextDecoder().decode(renderPdf(report).slice(0, 5)), "%PDF-");
    assert.ok((await renderXlsx(report)).length > 1000);
    assert.ok((await renderDocx(report)).length > 1000);
    assert.ok(renderCsv(report).length > 10);
    assert.match(renderPrint(report), /<!doctype html>/);
  }
});

test("print report escapes untrusted names and exports no private notes", () => {
  const html = renderPrint(memberReport([{ ...member(), first_name: '<script>alert("x")</script>' }], wards, "Toets", false, now));
  assert.equal(html.includes('<script>'), false);
  assert.match(html, /&lt;script&gt;/);
  assert.equal(html.includes("PRIVATE_NOTES"), false);
});
