"use client";

import { useMemo, useState } from "react";
import { Download, FileText, Printer } from "lucide-react";
import { Knop, Paneel, PaneelKop } from "@/components/ui/basis";
import { useMelding } from "@/components/ui/melding";
import { BEDIENING_TIPES } from "@/lib/bediening";
import { GLAS } from "@/lib/glas";
import { fmtDatum, fmtGetal } from "@/lib/format";
import type { BedieningAktiwiteit, BedieningTipe } from "@/lib/tipes/bediening";
import { cn } from "@/lib/utils";

type Tydperk = "vandag" | "week" | "maand" | "dae30";

const TYDPERKE: { sleutel: Tydperk; etiket: string; dae: number }[] = [
  { sleutel: "vandag", etiket: "Vandag", dae: 0 },
  { sleutel: "week", etiket: "Hierdie week", dae: 7 },
  { sleutel: "maand", etiket: "Hierdie maand", dae: 30 },
  { sleutel: "dae30", etiket: "Laaste 30 dae", dae: 30 },
];

export function BedieningVerslae({
  aktiwiteite,
  perTipe,
  oorsig,
}: {
  aktiwiteite: BedieningAktiwiteit[];
  perTipe: { tipe: BedieningTipe; aantal: number; persentasie: number }[];
  oorsig: { totaal: number; totaleUre: number; liggings: number; perWeek: number };
}) {
  const [tydperk, setTydperk] = useState<Tydperk>("dae30");
  const { wys } = useMelding();

  const reeks = useMemo(() => {
    const datums = aktiwiteite.map((a) => a.datum).sort();
    return {
      van: datums[0] ?? null,
      tot: datums[datums.length - 1] ?? null,
    };
  }, [aktiwiteite]);

  return (
    <div className="flex flex-col gap-4">
      <Paneel>
        <PaneelKop titel="Verslae" />
        <div className="flex flex-col gap-4 p-4 sm:p-5">
          <div className="flex flex-wrap gap-2">
            <Knop
              soort="sekonder"
              grootte="sm"
              ikoon={Printer}
              onClick={() => wys("Druk is nog nie gebou nie.", "info")}
            >
              Druk
            </Knop>
            <Knop
              soort="sekonder"
              grootte="sm"
              ikoon={Download}
              onClick={() => wys("Word-uitvoer is nog nie gebou nie.", "info")}
            >
              Word
            </Knop>
            <Knop
              soort="sekonder"
              grootte="sm"
              ikoon={FileText}
              onClick={() => wys("PDF-uitvoer is nog nie gebou nie.", "info")}
            >
              PDF
            </Knop>
          </div>

          <div className="scrollbar-none -mx-1 flex gap-2 overflow-x-auto overflow-y-hidden px-1 pb-1">
            {TYDPERKE.map((t) => (
              <button
                key={t.sleutel}
                type="button"
                onClick={() => setTydperk(t.sleutel)}
                aria-pressed={tydperk === t.sleutel}
                className={cn(
                  "inline-flex shrink-0 items-center rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors",
                  tydperk === t.sleutel
                    ? "border-brand bg-brand text-white"
                    : "border-line bg-surface text-ink-muted hover:bg-stage hover:text-ink",
                )}
              >
                {t.etiket}
              </button>
            ))}
          </div>

          <p className="text-ink-muted text-sm">
            {reeks.van ? (
              <>
                {fmtDatum(reeks.van)} tot {fmtDatum(reeks.tot)} —{" "}
                <strong className="text-ink font-semibold">
                  {oorsig.totaal} aktiwiteite
                </strong>{" "}
                gevind
              </>
            ) : (
              "Geen aktiwiteite in hierdie tydperk nie."
            )}
          </p>
        </div>
      </Paneel>

      <div className="grid gap-4 lg:grid-cols-2">
        <Paneel>
          <PaneelKop titel="Aktiwiteite per tipe" />
          <div className="p-4 sm:p-5">
            <Staafdiagram data={perTipe} />
          </div>
        </Paneel>

        <Paneel>
          <PaneelKop titel="Uiteensetting per kategorie" />
          <ul className="flex flex-col gap-3 p-4 sm:p-5">
            {perTipe.map((r) => {
              const info = BEDIENING_TIPES[r.tipe];
              return (
                <li key={r.tipe} className="flex flex-col gap-1.5">
                  <div className="flex items-baseline justify-between gap-3 text-sm">
                    <span className="inline-flex items-center gap-2 font-medium">
                      <span
                        aria-hidden
                        className="size-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: GLAS[info.toon] }}
                      />
                      {info.etiket}
                    </span>
                    <span className="text-ink-muted tabular shrink-0">
                      <strong className="text-ink font-semibold">{r.aantal}</strong>{" "}
                      ({fmtGetal(r.persentasie)}%)
                    </span>
                  </div>
                  <div className="bg-stage h-1.5 overflow-hidden rounded-full">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${r.persentasie}%`,
                        backgroundColor: GLAS[info.toon],
                      }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </Paneel>
      </div>
    </div>
  );
}

/**
 * Plein SVG teen 'n vaste viewBox, geskaal met CSS — daar is niks om te meet
 * en niks om te faal nie. Sien CLAUDE.md: moenie 'n grafiekbiblioteek byvoeg
 * nie.
 */
function Staafdiagram({
  data,
}: {
  data: { tipe: BedieningTipe; aantal: number }[];
}) {
  if (data.length === 0) {
    return <p className="text-ink-muted py-6 text-center text-sm">Nog geen data nie.</p>;
  }

  const maks = Math.max(...data.map((d) => d.aantal));
  const B = 320;
  const H = 150;
  const onder = 26;
  const gaping = 6;
  const breedte = (B - gaping * (data.length - 1)) / data.length;

  return (
    <div className="flex flex-col gap-3">
      <svg
        viewBox={`0 0 ${B} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label="Aktiwiteite per tipe"
      >
        {data.map((d, i) => {
          const h = maks === 0 ? 0 : ((H - onder) * d.aantal) / maks;
          const x = i * (breedte + gaping);
          const y = H - onder - h;
          return (
            <g key={d.tipe}>
              <rect
                x={x}
                y={y}
                width={breedte}
                height={Math.max(h, 2)}
                rx={3}
                fill={GLAS[BEDIENING_TIPES[d.tipe].toon]}
              />
              <text
                x={x + breedte / 2}
                y={y - 4}
                textAnchor="middle"
                fontSize="10"
                fill="currentColor"
                className="text-ink-muted tabular"
              >
                {d.aantal}
              </text>
            </g>
          );
        })}
      </svg>

      <ul className="flex flex-wrap gap-x-3 gap-y-1.5">
        {data.map((d) => (
          <li
            key={d.tipe}
            className="text-ink-muted inline-flex items-center gap-1.5 text-xs"
          >
            <span
              aria-hidden
              className="size-2 rounded-full"
              style={{ backgroundColor: GLAS[BEDIENING_TIPES[d.tipe].toon] }}
            />
            {BEDIENING_TIPES[d.tipe].etiket}
          </li>
        ))}
      </ul>
    </div>
  );
}
