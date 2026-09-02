import type { Metadata } from "next";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import { PubliekKop } from "@/components/publiek/bladsy-kop";
import { komendePubliek } from "@/lib/publieke-kalender";
import { fmtDatum } from "@/lib/format";
import { GLAS } from "@/lib/glas";

export const metadata: Metadata = {
  title: "Kalender",
  description:
    "Eredienste, byeenkomste en spesiale geleenthede by die NG Moedergemeente Vanderbijlpark.",
};

/** 'n Toon per kategorie, sodat die lys op 'n oogopslag leesbaar is. */
const TOON: Record<string, { kleur: string; was: string; etiket: string }> = {
  // "algemeen" dek eredienste én Bybelstudie — 'n Bybelstudie 'n "Erediens"
  // noem is verkeerd, so die etiket bly neutraal.
  algemeen: { kleur: GLAS.saffier, was: "bg-was-saffier", etiket: "Gemeente" },
  jeug: { kleur: GLAS.kobalt, was: "bg-was-kobalt", etiket: "Jeug" },
  seniors: { kleur: GLAS.amber, was: "bg-was-amber", etiket: "Seniors" },
  spesiaal: { kleur: GLAS.wyn, was: "bg-was-wyn", etiket: "Spesiaal" },
};

export default async function KalenderBladsy() {
  // Gesinkroniseer uit die stelsel se gebeurtenisse — sien
  // lib/publieke-kalender.ts vir wat publiek word en wat nie.
  const komende = await komendePubliek(24);

  // Groepeer per maand, want 'n plat lys van 24 items lees soos 'n spreadsheet.
  const perMaand = new Map<string, typeof komende>();
  for (const g of komende) {
    const sleutel = g.datum.slice(0, 7);
    const bestaande = perMaand.get(sleutel);
    if (bestaande) bestaande.push(g);
    else perMaand.set(sleutel, [g]);
  }

  return (
    <>
      <PubliekKop
        oortitel="Kalender"
        titel="Wat by ons gebeur"
        leiding="Eredienste, byeenkomste en spesiale geleenthede. Almal is welkom — jy hoef nie te laat weet dat jy kom nie."
      />

      <section className="veilig-kant mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
        {komende.length === 0 ? (
          <div className="border-line glas-paneel rounded-[1.5rem] border p-10 text-center">
            <span
              aria-hidden
              className="boog-vorm bg-stage text-ink-muted ring-line mx-auto flex size-12 items-center justify-center ring-1"
            >
              <CalendarDays size={20} strokeWidth={1.7} />
            </span>
            <p className="font-display mt-4 text-lg font-semibold">
              Nog niks op die kalender nie
            </p>
            <p className="text-ink-muted mx-auto mt-2 max-w-sm text-sm text-pretty">
              Kyk gerus later weer, of volg ons op Facebook vir die jongste.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-12">
            {[...perMaand.entries()].map(([maand, items]) => (
              <div key={maand} className="onthul flex flex-col gap-4">
                <h2 className="font-display text-glas-saffier/50 text-[1.6rem] leading-none font-medium">
                  {new Date(`${maand}-01`).toLocaleDateString("af-ZA", {
                    month: "long",
                    year: "numeric",
                    timeZone: "Africa/Johannesburg",
                  })}
                </h2>

                <ul className="flex flex-col gap-3">
                  {items.map((g) => {
                    const t = TOON[g.kategorie] ?? TOON.algemeen;
                    return (
                      <li
                        key={g.id}
                        className="glas-kaart glas-paneel border-line flex gap-4 rounded-2xl border p-4 sm:gap-5 sm:p-5"
                      >
                        <span
                          aria-hidden
                          className={`boog-vorm ring-line flex size-14 shrink-0 flex-col items-center justify-center leading-none ring-1 ${t.was}`}
                          style={{ color: t.kleur }}
                        >
                          <span className="text-[0.62rem] font-semibold uppercase">
                            {new Date(g.datum).toLocaleDateString("af-ZA", {
                              weekday: "short",
                              timeZone: "Africa/Johannesburg",
                            })}
                          </span>
                          <span className="font-display text-xl font-semibold tabular">
                            {new Date(g.datum).getDate()}
                          </span>
                        </span>

                        <div className="flex min-w-0 flex-1 flex-col gap-1">
                          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                            <h3 className="font-display text-lg font-semibold">
                              {g.titel}
                            </h3>
                            <span
                              className="rounded-full px-2 py-0.5 text-[0.65rem] font-semibold"
                              style={{
                                color: t.kleur,
                                backgroundColor: `${t.kleur}14`,
                              }}
                            >
                              {t.etiket}
                            </span>
                          </div>

                          {g.beskrywing ? (
                            <p className="text-ink-muted text-sm text-pretty">
                              {g.beskrywing}
                            </p>
                          ) : null}

                          <p className="text-ink-muted flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                            <span className="inline-flex items-center gap-1.5">
                              <CalendarDays size={13} aria-hidden />
                              {fmtDatum(g.datum)}
                            </span>
                            {g.tyd ? (
                              <span className="inline-flex items-center gap-1.5">
                                <Clock size={13} aria-hidden />
                                <span className="tabular">{g.tyd}</span>
                              </span>
                            ) : null}
                            {g.plek ? (
                              <span className="inline-flex min-w-0 items-center gap-1.5">
                                <MapPin size={13} aria-hidden className="shrink-0" />
                                <span className="truncate">{g.plek}</span>
                              </span>
                            ) : null}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        )}

        <p className="text-ink-muted mt-10 text-center text-xs text-pretty">
          Hierdie kalender kom regstreeks uit die kerkkantoor se stelsel — wat
          hulle daar invoer, verskyn hier.
        </p>
      </section>
    </>
  );
}
