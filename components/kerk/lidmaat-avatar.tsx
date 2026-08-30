import { cn } from "@/lib/utils";
import { voorletters, type Lid } from "@/lib/mock";

/**
 * Elke lidmaat 'n paneel in die venster.
 *
 * Die boogvorm is die handtekening — dit maak 'n andersins generiese
 * voorletter-sirkel onmiskenbaar hierdie app s'n. Die glastoon word uit die
 * naam afgelei sodat dieselfde persoon altyd dieselfde kleur kry.
 */

const TONE = [
  "bg-was-saffier text-glas-saffier",
  "bg-was-kobalt text-glas-kobalt",
  "bg-was-groen text-glas-groen",
  "bg-was-wyn text-glas-wyn",
  "bg-was-amber text-glas-amber",
  "bg-was-violet text-glas-violet",
] as const;

const GROOTTES = {
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-14 text-base",
  xl: "size-20 text-2xl",
} as const;

function toonVir(sleutel: string) {
  let som = 0;
  for (let i = 0; i < sleutel.length; i++) som = (som + sleutel.charCodeAt(i)) % 997;
  return TONE[som % TONE.length];
}

export function LidmaatAvatar({
  lid,
  grootte = "md",
  className,
}: {
  lid: Lid;
  grootte?: keyof typeof GROOTTES;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "boog-vorm ring-line flex shrink-0 items-center justify-center font-semibold ring-1 select-none",
        GROOTTES[grootte],
        toonVir(lid.id + lid.last_name),
        className,
      )}
    >
      {voorletters(lid)}
    </span>
  );
}
