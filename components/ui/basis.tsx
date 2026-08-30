import type { ComponentProps, ReactNode } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------
   Knoppie
   --------------------------------------------------------------- */

const KNOP_BASIS =
  "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-[background-color,box-shadow,color] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-50";

const KNOP_SOORT = {
  primer:
    "bg-brand text-white shadow-[0_1px_2px_rgba(34,31,38,0.18)] hover:bg-[#33326a]",
  sekonder:
    "bg-surface text-ink border border-line shadow-[0_1px_2px_rgba(34,31,38,0.05)] hover:bg-stage",
  stil: "text-ink-muted hover:bg-stage hover:text-ink",
  gevaar:
    "bg-surface text-glas-wyn border border-line hover:bg-was-wyn",
} as const;

const KNOP_GROOTTE = {
  sm: "h-9 px-3 text-sm sm:h-8",
  md: "h-11 px-4 sm:h-10",
} as const;

type KnopSoort = keyof typeof KNOP_SOORT;
type KnopGrootte = keyof typeof KNOP_GROOTTE;

export function Knop({
  soort = "sekonder",
  grootte = "md",
  ikoon: Ikoon,
  className,
  children,
  ...res
}: ComponentProps<"button"> & {
  soort?: KnopSoort;
  grootte?: KnopGrootte;
  ikoon?: LucideIcon;
}) {
  return (
    <button
      className={cn(KNOP_BASIS, KNOP_SOORT[soort], KNOP_GROOTTE[grootte], className)}
      {...res}
    >
      {Ikoon ? <Ikoon size={grootte === "sm" ? 14 : 16} strokeWidth={2} aria-hidden /> : null}
      {children}
    </button>
  );
}

export function KnopSkakel({
  soort = "sekonder",
  grootte = "md",
  ikoon: Ikoon,
  className,
  children,
  ...res
}: ComponentProps<typeof Link> & {
  soort?: KnopSoort;
  grootte?: KnopGrootte;
  ikoon?: LucideIcon;
}) {
  return (
    <Link
      className={cn(KNOP_BASIS, KNOP_SOORT[soort], KNOP_GROOTTE[grootte], className)}
      {...res}
    >
      {Ikoon ? <Ikoon size={grootte === "sm" ? 14 : 16} strokeWidth={2} aria-hidden /> : null}
      {children}
    </Link>
  );
}

/* ---------------------------------------------------------------
   Kennetekens — statuspille
   --------------------------------------------------------------- */

const KENTEKEN = {
  aktief: "bg-was-groen text-glas-groen ring-glas-groen/15",
  onaktief: "bg-stage text-ink-muted ring-line",
  oorgeplaas: "bg-was-amber text-glas-amber ring-glas-amber/15",
  oorlede: "bg-was-wyn text-glas-wyn ring-glas-wyn/15",
  saffier: "bg-was-saffier text-glas-saffier ring-glas-saffier/15",
  kobalt: "bg-was-kobalt text-glas-kobalt ring-glas-kobalt/15",
  violet: "bg-was-violet text-glas-violet ring-glas-violet/15",
  wyn: "bg-was-wyn text-glas-wyn ring-glas-wyn/15",
  groen: "bg-was-groen text-glas-groen ring-glas-groen/15",
  amber: "bg-was-amber text-glas-amber ring-glas-amber/15",
  neutraal: "bg-stage text-ink-muted ring-line",
} as const;

export type KentekenToon = keyof typeof KENTEKEN;

export function Kenteken({
  toon = "neutraal",
  ikoon: Ikoon,
  children,
  className,
}: {
  toon?: KentekenToon;
  ikoon?: LucideIcon;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
        KENTEKEN[toon],
        className,
      )}
    >
      {Ikoon ? <Ikoon size={12} strokeWidth={2.4} aria-hidden /> : null}
      {children}
    </span>
  );
}

/* ---------------------------------------------------------------
   Paneel — die standaard kaart
   --------------------------------------------------------------- */

export function Paneel({
  className,
  children,
  ...res
}: ComponentProps<"section">) {
  return (
    <section
      className={cn(
        "border-line bg-surface rounded-xl border shadow-[0_1px_2px_rgba(34,31,38,0.04)]",
        className,
      )}
      {...res}
    >
      {children}
    </section>
  );
}

export function PaneelKop({
  titel,
  byskrif,
  aksie,
}: {
  titel: string;
  byskrif?: string;
  aksie?: ReactNode;
}) {
  return (
    <div className="border-line flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b px-4 py-3 sm:px-5 sm:py-3.5">
      <div className="min-w-0 flex-1">
        <h2 className="font-display text-lg leading-snug font-semibold">
          {titel}
        </h2>
        {byskrif ? (
          <p className="text-ink-muted mt-0.5 text-xs">{byskrif}</p>
        ) : null}
      </div>
      {aksie}
    </div>
  );
}

/* ---------------------------------------------------------------
   Leë toestand
   --------------------------------------------------------------- */

export function Leeg({
  ikoon: Ikoon,
  titel,
  beskrywing,
  aksie,
}: {
  ikoon: LucideIcon;
  titel: string;
  beskrywing?: string;
  aksie?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2.5 px-5 py-10 text-center sm:px-6 sm:py-14">
      <span className="boog-vorm bg-stage text-ink-muted ring-line flex size-11 items-center justify-center ring-1">
        <Ikoon size={19} strokeWidth={1.7} aria-hidden />
      </span>
      <p className="font-display text-lg font-semibold">{titel}</p>
      {beskrywing ? (
        <p className="text-ink-muted max-w-sm text-sm text-balance">
          {beskrywing}
        </p>
      ) : null}
      {aksie ? <div className="mt-1.5">{aksie}</div> : null}
    </div>
  );
}

/* ---------------------------------------------------------------
   Vorderingsbalk — wykkapasiteit
   --------------------------------------------------------------- */

export function Vordering({
  waarde,
  maks,
  toon = "saffier",
}: {
  waarde: number;
  maks: number;
  toon?: "saffier" | "groen" | "amber";
}) {
  const persentasie = maks > 0 ? Math.min(100, (waarde / maks) * 100) : 0;
  const kleur =
    toon === "groen"
      ? "bg-glas-groen"
      : toon === "amber"
        ? "bg-glas-amber"
        : "bg-glas-saffier";
  return (
    <div
      className="bg-stage h-1.5 w-full overflow-hidden rounded-full"
      role="progressbar"
      aria-valuenow={waarde}
      aria-valuemin={0}
      aria-valuemax={maks}
    >
      <div
        className={cn("h-full rounded-full transition-[width]", kleur)}
        style={{ width: `${persentasie}%` }}
      />
    </div>
  );
}
