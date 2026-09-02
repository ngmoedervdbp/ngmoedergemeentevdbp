import { GLAS } from "@/lib/glas";
import { cn } from "@/lib/utils";

/**
 * 'n Ry lansetvensters as agtergrond — die gebrandskilderde glas self, baie
 * dof, agter die teks.
 *
 * Waarom nie 'n foto nie: ons het geen regte foto van hierdie gemeente nie, en
 * 'n voorraadfoto van 'n ander kerk lieg. Die venster is boonop die vorm wat
 * die hele app dra, so dit hoort hier meer as enige foto sou.
 *
 * Plein SVG teen 'n vaste viewBox, geskaal met CSS — niks om te meet nie. Sien
 * CLAUDE.md: reik na 'n SVG-pad voor jy na 'n afhanklikheid reik.
 */
export function Vensterband({
  dowwer = false,
  className,
}: {
  /** Nog sagter, vir waar teks bo-oor lê. */
  dowwer?: boolean;
  className?: string;
}) {
  // Elke venster kry sy eie toon, in die volgorde van 'n regte glasry.
  const tone = [
    GLAS.saffier,
    GLAS.kobalt,
    GLAS.groen,
    GLAS.amber,
    GLAS.wyn,
    GLAS.violet,
    GLAS.see,
  ];

  const boog = "M5 61 L5 24 Q5 5 24 2.5 Q43 5 43 24 L43 61 Z";

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-x-0 top-0 flex justify-center overflow-hidden",
        dowwer ? "opacity-[0.07]" : "opacity-[0.13]",
        className,
      )}
    >
      <svg
        viewBox="0 0 392 64"
        className="h-40 w-full min-w-[900px] sm:h-52"
        fill="none"
        preserveAspectRatio="xMidYMin slice"
      >
        {tone.map((toon, i) => (
          <g key={i} transform={`translate(${i * 56} 0)`}>
            <path d={boog} fill={toon} fillOpacity="0.55" />
            <g
              stroke={toon}
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d={boog} />
              <path d="M24 8 L24 61" />
              <path d="M11 25 L37 25" />
            </g>
          </g>
        ))}
      </svg>
    </div>
  );
}
