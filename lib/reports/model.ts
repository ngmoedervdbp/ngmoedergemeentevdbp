import type { Lid, Wyk } from "@/lib/tipes/gemeente";
import type { BedieningAktiwiteit } from "@/lib/tipes/bediening";
import { berekenOuderdom, fmtDatum, fmtDatumKort, fmtGetal, fmtTydreeks, OUDERDOMSGROEPE } from "@/lib/format";
import { bedieningOorsig, tellingPerTipe } from "@/lib/data/bediening-afleidings";
import { BEDIENING_TIPES } from "@/lib/bediening";

export const REPORT_FORMATS = ["pdf", "xlsx", "csv", "docx", "print"] as const;
export type ReportFormat = (typeof REPORT_FORMATS)[number];
export type ReportKind = "lidmate" | "bediening" | "wyke";
export type ReportPeriod = "vandag" | "week" | "maand" | "dae30";
export type ReportValue = string | number | Date | null;
export type ReportSection = {
  title: string;
  columns: { label: string; type?: "date" | "number"; width?: number }[];
  rows: ReportValue[][];
};
export type Report = {
  title: string;
  subtitle: string;
  filename: string;
  generatedAt: Date;
  author: string;
  metrics: { label: string; value: number }[];
  note: string;
  sections: ReportSection[];
};

/** Calendar boundaries are identical in the browser and on the server. */
export function reportDate(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Johannesburg", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(date);
  return ["year", "month", "day"].map((type) => parts.find((p) => p.type === type)!.value).join("-");
}

export function reportRange(period: ReportPeriod, now = new Date()) {
  const to = reportDate(now);
  const start = new Date(`${to}T12:00:00Z`);
  if (period === "week") start.setUTCDate(start.getUTCDate() - ((start.getUTCDay() + 6) % 7));
  if (period === "maand") start.setUTCDate(1);
  if (period === "dae30") start.setUTCDate(start.getUTCDate() - 29);
  return { from: reportDate(start), to };
}

export function filterActivities(items: BedieningAktiwiteit[], period: ReportPeriod, now = new Date()) {
  const { from, to } = reportRange(period, now);
  return items.filter((a) => a.datum >= from && a.datum <= to);
}

export function displayValue(value: ReportValue) {
  if (value === null) return "-";
  if (value instanceof Date) return fmtDatumKort(value);
  return typeof value === "number" ? fmtGetal(value) : value;
}

const dateValue = (value: string | null) => value ? new Date(`${value.slice(0, 10)}T00:00:00Z`) : null;
const label = (value: string | null) => value ? value[0].toUpperCase() + value.slice(1) : null;

export function memberReport(members: Lid[], wards: Wyk[], author: string, all = false, now = new Date()): Report {
  const active = members.filter((l) => l.status === "aktief");
  const selected = (all ? members : active).toSorted((a, b) => `${a.last_name} ${a.first_name}`.localeCompare(`${b.last_name} ${b.first_name}`, "af"));
  const ages = active.map((l) => berekenOuderdom(l.date_of_birth, now));
  const columns: ReportSection["columns"] = [
    { label: "Naam", width: 28 }, { label: "Geboortedatum", type: "date", width: 18 },
    { label: "Ouderdom", type: "number", width: 12 }, { label: "Geslag", width: 13 },
    { label: "Wyk", width: 15 }, { label: "Selfoon", width: 19 }, { label: "E-pos", width: 32 },
  ];
  if (all) columns.push({ label: "Status", width: 16 });
  const rows = selected.map((l) => {
    const row: ReportValue[] = [`${l.first_name} ${l.last_name}`, dateValue(l.date_of_birth), berekenOuderdom(l.date_of_birth, now), label(l.geslag), wards.find((w) => w.id === l.wyk_id)?.naam ?? null, l.selfoon, l.epos];
    if (all) row.push(label(l.status));
    return row;
  });
  return {
    title: "Lidmateverslag", subtitle: all ? "Volledige lidmaatregister · Alle statusse" : "Gemeente-oorsig · Aktiewe lidmate",
    filename: `lidmateverslag-${reportDate(now)}`, generatedAt: now, author,
    metrics: [
      { label: "Aktiewe lidmate", value: active.length },
      { label: "Volwassenes (18+)", value: ages.filter((a) => a !== null && a >= 18).length },
      { label: "Kinders onder 18", value: ages.filter((a) => a !== null && a < 18).length },
      { label: "Geen geboortedatum", value: ages.filter((a) => a === null).length },
    ],
    note: "Ouderdomstatistieke sluit slegs aktiewe lidmate met 'n bekende geboortedatum in. Ontbrekende datums word nie as nul getel nie.",
    sections: [
      { title: "Ouderdomsverspreiding", columns: [{ label: "Ouderdomsgroep", width: 32 }, { label: "Lidmate", type: "number", width: 16 }], rows: OUDERDOMSGROEPE.map((g) => [g.etiket, ages.filter((a) => a !== null && a >= g.min && a <= g.maks).length]) },
      { title: "Geslagsverspreiding", columns: [{ label: "Geslag", width: 32 }, { label: "Lidmate", type: "number", width: 16 }], rows: ["manlik", "vroulik"].map((g) => [label(g), active.filter((l) => l.geslag === g).length]) },
      { title: "Lidmate per wyk", columns: [{ label: "Wyk", width: 32 }, { label: "Lidmate", type: "number", width: 16 }], rows: [...wards.map((w): ReportValue[] => [w.naam, active.filter((l) => l.wyk_id === w.id).length]), ["Geen wyk toegeken", active.filter((l) => !wards.some((w) => w.id === l.wyk_id)).length]] },
      { title: all ? "Volledige lidmaatregister" : "Aktiewe lidmaatregister", columns, rows },
    ],
  };
}

export function ministryReport(items: BedieningAktiwiteit[], author: string, period: ReportPeriod, now = new Date()): Report {
  const selected = filterActivities(items, period, now).toSorted((a, b) => a.datum.localeCompare(b.datum));
  const range = reportRange(period, now);
  const summary = bedieningOorsig(selected);
  return {
    title: "Bedieningsverslag", subtitle: `${fmtDatum(range.from)} tot ${fmtDatum(range.to)}`,
    filename: `bedieningsverslag-${range.from}-${range.to}`, generatedAt: now, author,
    metrics: [{ label: "Aktiwiteite", value: summary.totaal }, { label: "Totale ure", value: summary.totaleUre }, { label: "Liggings", value: summary.liggings }, { label: "Per week (gem.)", value: summary.perWeek }],
    note: "Ure kom uit aangetekende begin- en eindtye. Aktiwiteite sonder 'n tydsduur tel by aktiwiteite, maar dra geen ure by nie.",
    sections: [
      { title: "Aktiwiteite per tipe", columns: [{ label: "Tipe", width: 28 }, { label: "Aantal", type: "number", width: 14 }, { label: "Persentasie (%)", type: "number", width: 20 }], rows: tellingPerTipe(selected).map((r) => [BEDIENING_TIPES[r.tipe].etiket, r.aantal, r.persentasie]) },
      { title: "Aktiwiteitsregister", columns: [{ label: "Datum", type: "date", width: 16 }, { label: "Aktiwiteit", width: 38 }, { label: "Tipe", width: 22 }, { label: "Tyd", width: 22 }, { label: "Ure", type: "number", width: 12 }, { label: "Plek", width: 30 }], rows: selected.map((a) => [dateValue(a.datum), a.titel, BEDIENING_TIPES[a.tipe].etiket, fmtTydreeks(a.begin_tyd, a.eind_tyd), a.ure, a.plek_naam]) },
    ],
  };
}

export function wardReport(members: Lid[], wards: Wyk[], author: string, now = new Date()): Report {
  const active = members.filter((l) => l.status === "aktief");
  const unassigned = active.filter((l) => !wards.some((w) => w.id === l.wyk_id));
  const groups = [...wards.map((w) => ({ title: `${w.naam}${w.ouderling ? ` · ${w.ouderling}` : ""}`, members: active.filter((l) => l.wyk_id === w.id) })), ...(unassigned.length ? [{ title: "Geen wyk toegeken", members: unassigned }] : [])];
  return {
    title: "Wyklys", subtitle: "Aktiewe lidmate en wyksouderlinge", filename: `wyklys-${reportDate(now)}`, generatedAt: now, author,
    metrics: [{ label: "Wyke", value: wards.length }, { label: "Aktiewe lidmate", value: active.length }, { label: "Sonder wyk", value: unassigned.length }],
    note: "Slegs aktiewe lidmate word in hierdie wyklys ingesluit.",
    sections: groups.map((g) => ({ title: g.title, columns: [{ label: "Naam", width: 36 }, { label: "Selfoon", width: 22 }, { label: "E-pos", width: 38 }], rows: g.members.map((l) => [`${l.first_name} ${l.last_name}`, l.selfoon, l.epos]) })),
  };
}
