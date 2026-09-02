import { BEDIENING_TIPES } from "@/lib/bediening";
import type { BedieningTipe } from "@/lib/tipes/bediening";
import { cn } from "@/lib/utils";

/**
 * Die ikoonruit langs elke aktiwiteit: 'n boogvorm in die tipe se glastoon.
 *
 * Klasse staan voluit sodat Tailwind hulle in die bronkode kan sien — 'n
 * saamgestelde string soos `bg-was-${toon}` word weggesnoei.
 */
const TOON = {
  saffier: "bg-was-saffier text-glas-saffier",
  kobalt: "bg-was-kobalt text-glas-kobalt",
  groen: "bg-was-groen text-glas-groen",
  wyn: "bg-was-wyn text-glas-wyn",
  amber: "bg-was-amber text-glas-amber",
  violet: "bg-was-violet text-glas-violet",
  terra: "bg-was-terra text-glas-terra",
  see: "bg-was-see text-glas-see",
  roos: "bg-was-roos text-glas-roos",
  olyf: "bg-was-olyf text-glas-olyf",
} as const;

const GROOTTES = {
  sm: { boks: "size-9", ikoon: 16 },
  md: { boks: "size-11", ikoon: 19 },
} as const;

export function BedieningChip({
  tipe,
  grootte = "md",
  className,
}: {
  tipe: BedieningTipe;
  grootte?: keyof typeof GROOTTES;
  className?: string;
}) {
  const info = BEDIENING_TIPES[tipe];
  const { boks, ikoon } = GROOTTES[grootte];
  const Ikoon = info.ikoon;

  return (
    <span
      aria-hidden
      className={cn(
        "boog-vorm ring-line flex shrink-0 items-center justify-center ring-1",
        boks,
        TOON[info.toon],
        className,
      )}
    >
      <Ikoon size={ikoon} strokeWidth={1.9} />
    </span>
  );
}

/** Die toonklasse, vir plekke wat self 'n element kleur (legendes, stippels). */
export const BEDIENING_TOON = TOON;
