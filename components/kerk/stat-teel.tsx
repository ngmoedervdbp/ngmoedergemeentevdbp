import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * 'n Statistiek as 'n glaspaneel: bleek was van bo af, diep glastoon vir
 * die getal, loodlyn as rand. Geen helder gradiënte nie — sien
 * CLAUDE.md § Design.
 *
 * Klasse staan voluit sodat Tailwind hulle in die bronkode kan sien.
 */
const TINTE = {
  saffier: {
    paneel: "from-was-saffier",
    getal: "text-glas-saffier",
    chip: "text-glas-saffier",
  },
  kobalt: {
    paneel: "from-was-kobalt",
    getal: "text-glas-kobalt",
    chip: "text-glas-kobalt",
  },
  groen: {
    paneel: "from-was-groen",
    getal: "text-glas-groen",
    chip: "text-glas-groen",
  },
  wyn: {
    paneel: "from-was-wyn",
    getal: "text-glas-wyn",
    chip: "text-glas-wyn",
  },
  amber: {
    paneel: "from-was-amber",
    getal: "text-glas-amber",
    chip: "text-glas-amber",
  },
  violet: {
    paneel: "from-was-violet",
    getal: "text-glas-violet",
    chip: "text-glas-violet",
  },
} as const;

export type Tint = keyof typeof TINTE;

export function StatTeel({
  etiket,
  waarde,
  byskrif,
  ikoon: Ikoon,
  tint = "saffier",
}: {
  etiket: string;
  waarde: string | number;
  byskrif?: string;
  ikoon: LucideIcon;
  tint?: Tint;
}) {
  const t = TINTE[tint];

  return (
    <div
      className={cn(
        "border-line shadow-[0_1px_2px_rgba(34,31,38,0.05)] flex items-start justify-between gap-2 rounded-xl border bg-gradient-to-b via-white via-75% to-white px-3.5 py-3.5 sm:gap-3 sm:px-5 sm:py-4",
        t.paneel,
      )}
    >
      <div className="flex min-w-0 flex-col">
        <span className="text-ink-muted text-[0.68rem] font-semibold tracking-[0.09em] text-balance uppercase sm:text-xs sm:tracking-[0.11em]">
          {etiket}
        </span>
        <span
          className={cn(
            "font-display tabular mt-1 text-[2rem] leading-none font-semibold sm:text-4xl",
            t.getal,
          )}
        >
          {waarde}
        </span>
        {byskrif ? (
          <span className="text-ink-muted mt-1.5 text-xs">{byskrif}</span>
        ) : null}
      </div>
      <span
        className={cn(
          "boog-vorm ring-line flex size-8 shrink-0 items-center justify-center bg-white/80 ring-1 sm:size-9",
          t.chip,
        )}
      >
        <Ikoon size={16} strokeWidth={1.9} aria-hidden />
      </span>
    </div>
  );
}
