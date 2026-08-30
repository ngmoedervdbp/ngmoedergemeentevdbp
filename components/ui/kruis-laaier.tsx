type Variant = "trek" | "kring";
type Grootte = "sm" | "md" | "lg";

const groottes: Record<Grootte, number> = { sm: 16, md: 34, lg: 88 };

type Props = {
  variant?: Variant;
  size?: Grootte;
  /** Skermleser-etiket. Stel `decorative` waar die knoppie se eie teks reeds die boodskap dra. */
  label?: string;
  decorative?: boolean;
  className?: string;
};

/**
 * Kruis-laaier — die standaard laaitoestand.
 *
 * Wys dit eers na ~300 ms; enigiets vinniger flits net en laat die
 * koppelvlak rukkerig voel.
 */
export function KruisLaaier({
  variant = "kring",
  size = "md",
  label = "Laai tans",
  decorative = false,
  className,
}: Props) {
  const px = groottes[size];
  const stroke = size === "sm" ? 6 : size === "md" ? 5 : 4.5;

  const a11y = decorative
    ? ({ "aria-hidden": true } as const)
    : ({ role: "img", "aria-label": label } as const);

  if (variant === "trek") {
    return (
      <svg
        width={px}
        height={px}
        viewBox="0 0 64 64"
        fill="none"
        className={`kruis-trek text-brand ${className ?? ""}`}
        {...a11y}
      >
        <g stroke="currentColor" strokeWidth={stroke} strokeLinecap="round">
          <path className="stem" d="M32 6 L32 58" />
          <path className="arm-l" d="M32 24 L13 24" />
          <path className="arm-r" d="M32 24 L51 24" />
        </g>
      </svg>
    );
  }

  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 64 64"
      fill="none"
      className={`kruis-kring text-brand ${className ?? ""}`}
      {...a11y}
    >
      <circle
        className="ring"
        cx="32"
        cy="32"
        r="28"
        stroke="currentColor"
        strokeWidth={stroke - 1}
        strokeLinecap="round"
        opacity={0.9}
      />
      <g stroke="currentColor" strokeWidth={stroke} strokeLinecap="round">
        <path d="M32 17 L32 47" />
        <path d="M21 27 L43 27" />
      </g>
    </svg>
  );
}

/** Volblad-laaier vir roete-oorgange. Gebruik as `loading.tsx`. */
export function VolbladLaaier({ boodskap }: { boodskap?: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-5">
      <KruisLaaier variant="trek" size="lg" />
      {boodskap ? (
        <p className="font-display text-ink-muted text-lg">{boodskap}</p>
      ) : null}
    </div>
  );
}
