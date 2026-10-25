import { createClient } from "@/lib/supabase/server";
import { huidigeGebruiker, magBediening } from "@/lib/sessie";
import { memberReport, ministryReport, REPORT_FORMATS, wardReport, type ReportPeriod } from "@/lib/reports/model";
import type { Lid, Wyk } from "@/lib/tipes/gemeente";
import type { BedieningAktiwiteit } from "@/lib/tipes/bediening";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PRIVATE_HEADERS = { "Cache-Control": "private, no-store, max-age=0", "X-Content-Type-Options": "nosniff", Vary: "Cookie" };
const MIME = {
  pdf: "application/pdf",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  csv: "text/csv; charset=utf-8",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  print: "text/html; charset=utf-8",
};

export async function GET(request: Request) {
  const fail = (fout: string, status: number) => Response.json({ fout }, { status, headers: PRIVATE_HEADERS });
  try {
    // Do not fall back to the demo identity when producing personal-data files.
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return fail("Die databasis is nie gekoppel nie. Geen verslag is geskep nie.", 503);
    }
    const user = await huidigeGebruiker();
    if (!user) return fail("Jou sessie het verval. Teken asseblief weer in.", 401);
    const params = new URL(request.url).searchParams;
    const kind = params.get("verslag") ?? "lidmate";
    const format = params.get("formaat") ?? "pdf";
    const period = params.get("tydperk") ?? "dae30";
    const scope = params.get("omvang") ?? "aktief";
    if (!["lidmate", "bediening", "wyke"].includes(kind) || !REPORT_FORMATS.some((f) => f === format) || !["vandag", "week", "maand", "dae30"].includes(period) || !["aktief", "almal"].includes(scope)) {
      return fail("Kies asseblief 'n geldige verslag en formaat.", 400);
    }
    if (kind === "bediening" && !magBediening(user)) return fail("Jy het nie toegang tot bedieningsverslae nie.", 403);
    const supabase = await createClient();
    // A full export must not stop at Supabase's default 1,000-row limit.
    // Stable primary-key ordering prevents rows shifting between pages.
    async function readAll<T>(table: string, columns: string): Promise<T[]> {
      const rows: T[] = [];
      const size = 500;
      for (let offset = 0; ; offset += size) {
        const { data, error } = await supabase.from(table).select(columns).order("id").range(offset, offset + size - 1);
        if (error) throw new Error(`Verslagdata: ${table} (${error.code})`);
        rows.push(...(data ?? []) as T[]);
        if (!data || data.length < size) return rows;
      }
    }
    let report;
    if (kind === "bediening") {
      const items = await readAll<BedieningAktiwiteit>("bediening_aktiwiteite", "id,titel,tipe,datum,begin_tyd,eind_tyd,plek_naam,ure");
      report = ministryReport(items, user.naam, period as ReportPeriod);
    } else {
      const [members, wards] = await Promise.all([
        readAll<Lid>("lede", "id,first_name,last_name,date_of_birth,geslag,status,selfoon,epos,wyk_id"),
        readAll<Wyk>("wyke", "id,nommer,naam,ouderling,kapasiteit"),
      ]);
      wards.sort((a, b) => a.nommer.localeCompare(b.nommer, "af", { numeric: true }));
      report = kind === "wyke" ? wardReport(members, wards, user.naam) : memberReport(members, wards, user.naam, scope === "almal");
    }
    // Load the document libraries only after authentication and data fetching.
    const { renderPdf, renderXlsx, renderCsv, renderDocx, renderPrint } = await import("@/lib/reports/render");
    const body = format === "pdf" ? renderPdf(report) : format === "xlsx" ? await renderXlsx(report) : format === "csv" ? renderCsv(report) : format === "docx" ? await renderDocx(report) : renderPrint(report);
    return new Response(typeof body === "string" ? body : new Uint8Array(body), {
      headers: {
        ...PRIVATE_HEADERS,
        "Content-Type": MIME[format as keyof typeof MIME],
        "Content-Disposition": `${format === "print" ? "inline" : "attachment"}; filename="${report.filename}.${format === "print" ? "html" : format}"`,
      },
    });
  } catch (error) {
    console.error("[verslae] uitvoer misluk:", error instanceof Error ? error.message : "onbekende fout");
    return fail("Die verslag kon nie geskep word nie. Probeer asseblief weer. Geen lêer is uitgevoer nie.", 500);
  }
}
