/**
 * Die lansetboog — ons handtekeningvorm.
 *
 * 'n Geteken kerkvenster, nie 'n gevulde ikoon nie: dun loodlyne, 'n baie
 * dowwe glastint, en die tracery self vorm die kruis. Dit erf `currentColor`,
 * so dit werk ewe goed wit op die donker sybalk as diep op 'n bleek bladsy.
 *
 * Gebruik dit spaarsaam — die logo, aanteken, en leë toestande.
 */
export function GlasBoog({
  width = 34,
  className,
  strokeWidth = 2.4,
}: {
  width?: number;
  className?: string;
  strokeWidth?: number;
}) {
  const height = Math.round((width / 48) * 64);

  // Buitelyn van die lanset: reguit kante, spits kruin.
  const boog = "M5 61 L5 24 Q5 5 24 2.5 Q43 5 43 24 L43 61 Z";

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 48 64"
      fill="none"
      aria-hidden
      className={className}
    >
      {/* Glas — net genoeg tint om nie 'n draadraam te wees nie. */}
      <path d={boog} fill="currentColor" fillOpacity="0.1" />

      {/* Tracery. Die vertikale styl en die dwarsbalk ís die kruis. */}
      <g
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={boog} />
        <path d="M24 8 L24 61" />
        <path d="M11 25 L37 25" />
      </g>
    </svg>
  );
}
