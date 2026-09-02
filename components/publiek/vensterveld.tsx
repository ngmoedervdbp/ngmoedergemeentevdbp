import { GLAS } from "@/lib/glas";
import { cn } from "@/lib/utils";

/**
 * 'n Volskerm-veld van lansetvensters — die aanteken- en herstelblaaie se
 * agtergrond.
 *
 * Anders as `Vensterband` (een ry bo-aan) vul hierdie die hele skerm, soos 'n
 * kerkmuur wat in alle rigtings verder gaan as wat jy kan sien.
 *
 * Twee dinge maak dit lewendig eerder as 'n plat patroon:
 *   1. rye is verspring — elke tweede ry skuif 'n halwe venster op, so die oog
 *      kry nie 'n rooster om aan vas te haak nie;
 *   2. rye ver agter is kleiner en dowwer, wat diepte gee.
 *
 * Een `<pattern>` sou goedkoper wees, maar dan is elke venster identies en dit
 * lees onmiddellik as behangsel. Die verspringing is die punt.
 */

const BOOG = "M5 61 L5 24 Q5 5 24 2.5 Q43 5 43 24 L43 61 Z";

/** Tone in 'n vaste siklus — 'n regte glasry herhaal ook. */
const TONE = [
  GLAS.saffier,
  GLAS.kobalt,
  GLAS.see,
  GLAS.groen,
  GLAS.amber,
  GLAS.wyn,
  GLAS.roos,
  GLAS.violet,
];

/** Vensters is 48×64 in hul eie stelsel; hier is die roostergrootte. */
const W = 62;
const H = 84;
const KOLOMME = 14;
const RYE = 7;

export function Vensterveld({ className }: { className?: string }) {
  const vensters: {
    x: number;
    y: number;
    /** Indeks in TONE — nie die hex nie, want `indexOf` op 'n `as const`-lys
        verwerp 'n verbreedde string. */
    toon: number;
    skaal: number;
    dof: number;
  }[] = [];

  for (let ry = 0; ry < RYE; ry++) {
    // Elke tweede ry skuif 'n halwe venster — dit breek die rooster.
    const skuif = ry % 2 === 0 ? 0 : W / 2;
    // Rye bo is "verder weg": kleiner en dowwer.
    const naby = ry / (RYE - 1);
    const skaal = 0.72 + naby * 0.38;
    const dof = 0.55 + naby * 0.45;

    for (let kol = 0; kol < KOLOMME; kol++) {
      vensters.push({
        x: kol * W + skuif,
        y: ry * H,
        toon: (ry * 3 + kol) % TONE.length,
        skaal,
        dof,
      });
    }
  }

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
    >
      <svg
        viewBox={`0 0 ${KOLOMME * W} ${RYE * H}`}
        preserveAspectRatio="xMidYMid slice"
        className="glas-glans h-full w-full"
        fill="none"
      >
        <defs>
          {/* Elke venster verdof na onder toe, soos lig wat deur glas val. */}
          {TONE.map((t, i) => (
            <linearGradient key={i} id={`veld-${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={t} stopOpacity="1" />
              <stop offset="100%" stopColor={t} stopOpacity="0.35" />
            </linearGradient>
          ))}

          {/* Die veld verdwyn na die rande toe, sodat die paneel in die
              middel die aandag hou en niks hard afsny nie. */}
          <radialGradient id="veld-masker" cx="50%" cy="46%" r="72%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="62%" stopColor="white" stopOpacity="0.85" />
            <stop offset="100%" stopColor="white" stopOpacity="0.15" />
          </radialGradient>
          <mask id="veld-mask">
            <rect
              width={KOLOMME * W}
              height={RYE * H}
              fill="url(#veld-masker)"
            />
          </mask>
        </defs>

        <g mask="url(#veld-mask)">
          {vensters.map((v, i) => {
            const kleur = TONE[v.toon];
            return (
              <g
                key={i}
                transform={`translate(${v.x} ${v.y}) scale(${v.skaal})`}
                opacity={v.dof}
              >
                <path d={BOOG} fill={`url(#veld-${v.toon})`} />
                <g
                  stroke={kleur}
                  strokeOpacity="0.95"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                >
                  <path d={BOOG} />
                  {/* Die tracery vorm die kruis. */}
                  <path d="M24 8 L24 61" />
                  <path d="M11 25 L37 25" />
                </g>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
