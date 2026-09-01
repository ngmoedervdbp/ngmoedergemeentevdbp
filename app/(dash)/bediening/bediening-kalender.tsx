"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Paneel } from "@/components/ui/basis";
import { BEDIENING_TIPES, BEDIENING_TIPE_LYS } from "@/lib/bediening";
import { GLAS } from "@/lib/glas";
import { fmtDatum, fmtTydreeks } from "@/lib/format";
import { isoDatum } from "@/lib/mock/bediening";
import type { BedieningAktiwiteit } from "@/lib/mock/bediening";
import { cn } from "@/lib/utils";

const DAE = ["Ma", "Di", "Wo", "Do", "Vr", "Sa", "So"];
const MAANDE = [
  "Januarie", "Februarie", "Maart", "April", "Mei", "Junie",
  "Julie", "Augustus", "September", "Oktober", "November", "Desember",
];

/**
 * Maandaansig. Begin Maandag — die Base44-demo begin Sondag, maar die res van
 * hierdie app (en die kerkraad se week) begin Maandag; twee kalenders wat
 * verskillend begin is 'n leesfout wat wag om te gebeur.
 */
export function BedieningKalender({
  aktiwiteite,
}: {
  aktiwiteite: BedieningAktiwiteit[];
}) {
  const [wysMaand, setWysMaand] = useState(() => {
    const laaste = aktiwiteite[0]?.datum;
    return laaste ? new Date(laaste) : new Date();
  });
  const [gekies, setGekies] = useState<string | null>(null);

  const perDag = useMemo(() => {
    const kaart = new Map<string, BedieningAktiwiteit[]>();
    for (const a of aktiwiteite) {
      const bestaande = kaart.get(a.datum);
      if (bestaande) bestaande.push(a);
      else kaart.set(a.datum, [a]);
    }
    return kaart;
  }, [aktiwiteite]);

  const jaar = wysMaand.getFullYear();
  const maand = wysMaand.getMonth();

  const selle = useMemo(() => {
    const eerste = new Date(jaar, maand, 1);
    // getDay(): 0 = Sondag. Ons wil Maandag = 0.
    const voor = (eerste.getDay() + 6) % 7;
    const daeInMaand = new Date(jaar, maand + 1, 0).getDate();

    const uit: (Date | null)[] = [];
    for (let i = 0; i < voor; i++) uit.push(null);
    for (let d = 1; d <= daeInMaand; d++) uit.push(new Date(jaar, maand, d));
    while (uit.length % 7 !== 0) uit.push(null);
    return uit;
  }, [jaar, maand]);

  const gekoseLys = gekies ? (perDag.get(gekies) ?? []) : [];

  function skuif(rigting: number) {
    setWysMaand(new Date(jaar, maand + rigting, 1));
    setGekies(null);
  }

  return (
    <div className="flex flex-col gap-4">
      <Paneel>
        <div className="border-line flex items-center justify-between gap-3 border-b px-4 py-3 sm:px-5">
          <button
            type="button"
            onClick={() => skuif(-1)}
            aria-label="Vorige maand"
            className="hover:bg-stage focus-visible:outline-accent flex size-11 min-w-[44px] items-center justify-center rounded-lg transition-colors focus-visible:outline-2"
          >
            <ChevronLeft size={18} aria-hidden />
          </button>
          <h2 className="font-display text-lg font-semibold">
            {MAANDE[maand]} {jaar}
          </h2>
          <button
            type="button"
            onClick={() => skuif(1)}
            aria-label="Volgende maand"
            className="hover:bg-stage focus-visible:outline-accent flex size-11 min-w-[44px] items-center justify-center rounded-lg transition-colors focus-visible:outline-2"
          >
            <ChevronRight size={18} aria-hidden />
          </button>
        </div>

        <div className="p-2 sm:p-3">
          <div className="grid grid-cols-7 gap-1">
            {DAE.map((d) => (
              <div
                key={d}
                className="text-ink-muted py-1.5 text-center text-xs font-semibold"
              >
                {d}
              </div>
            ))}

            {selle.map((d, i) => {
              if (!d) return <div key={`leeg-${i}`} />;
              const sleutel = isoDatum(d);
              const lys = perDag.get(sleutel) ?? [];
              const isGekies = gekies === sleutel;

              return (
                <button
                  key={sleutel}
                  type="button"
                  onClick={() => setGekies(isGekies ? null : sleutel)}
                  aria-pressed={isGekies}
                  className={cn(
                    "focus-visible:outline-accent flex min-h-[3.25rem] flex-col items-center gap-1 rounded-lg p-1.5 transition-colors focus-visible:outline-2",
                    isGekies ? "bg-brand text-white" : "hover:bg-stage",
                    lys.length === 0 && "cursor-default",
                  )}
                >
                  <span
                    className={cn(
                      "tabular text-sm",
                      isGekies ? "font-semibold" : "text-ink-muted",
                    )}
                  >
                    {d.getDate()}
                  </span>

                  {lys.length > 0 ? (
                    <span className="flex flex-wrap justify-center gap-0.5">
                      {lys.slice(0, 3).map((a) => (
                        <span
                          key={a.id}
                          aria-hidden
                          className="size-1.5 rounded-full"
                          style={{
                            backgroundColor: isGekies
                              ? "rgba(255,255,255,0.85)"
                              : GLAS[BEDIENING_TIPES[a.tipe].toon],
                          }}
                        />
                      ))}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        {/* Legende */}
        <div className="border-line flex flex-wrap gap-x-3 gap-y-1.5 border-t px-4 py-3 sm:px-5">
          {BEDIENING_TIPE_LYS.map((t) => (
            <span
              key={t.sleutel}
              className="text-ink-muted inline-flex items-center gap-1.5 text-xs"
            >
              <span
                aria-hidden
                className="size-2 rounded-full"
                style={{ backgroundColor: GLAS[t.toon] }}
              />
              {t.etiket}
            </span>
          ))}
        </div>
      </Paneel>

      {gekies ? (
        <Paneel>
          <div className="border-line border-b px-4 py-3 sm:px-5">
            <h3 className="font-display font-semibold">{fmtDatum(gekies)}</h3>
          </div>
          {gekoseLys.length === 0 ? (
            <p className="text-ink-muted px-4 py-6 text-center text-sm sm:px-5">
              Niks aangeteken op hierdie dag nie.
            </p>
          ) : (
            <ul className="divide-line divide-y">
              {gekoseLys.map((a) => (
                <li key={a.id} className="flex items-center gap-3 px-4 py-3 sm:px-5">
                  <span
                    aria-hidden
                    className="size-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: GLAS[BEDIENING_TIPES[a.tipe].toon] }}
                  />
                  <span className="min-w-0 flex-1 truncate font-medium">
                    {a.titel}
                  </span>
                  <span className="text-ink-muted tabular shrink-0 text-sm">
                    {fmtTydreeks(a.begin_tyd, a.eind_tyd)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Paneel>
      ) : null}
    </div>
  );
}
