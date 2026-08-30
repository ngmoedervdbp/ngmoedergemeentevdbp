/**
 * Alle datum- en getalformatering loop hierdeur. Moenie
 * `toLocaleDateString()` inlyn roep nie — sien CLAUDE.md § Language.
 */

const LOCALE = "af-ZA";
const TYDSONE = "Africa/Johannesburg";

const datumLank = new Intl.DateTimeFormat(LOCALE, {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: TYDSONE,
});

const datumKort = new Intl.DateTimeFormat(LOCALE, {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: TYDSONE,
});

const maandJaar = new Intl.DateTimeFormat(LOCALE, {
  month: "short",
  year: "numeric",
  timeZone: TYDSONE,
});

const tyd = new Intl.DateTimeFormat(LOCALE, {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: TYDSONE,
});

const getal = new Intl.NumberFormat(LOCALE);

function toDate(waarde: string | Date | null | undefined): Date | null {
  if (!waarde) return null;
  const d = waarde instanceof Date ? waarde : new Date(waarde);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** `1 Januarie 2026` */
export function fmtDatum(waarde: string | Date | null | undefined) {
  const d = toDate(waarde);
  return d ? datumLank.format(d) : "—";
}

/** `01/01/2026` — vir tabelle waar ruimte tel */
export function fmtDatumKort(waarde: string | Date | null | undefined) {
  const d = toDate(waarde);
  return d ? datumKort.format(d) : "—";
}

/** `Feb 2026` — soos "Lid sedert Feb 2026" */
export function fmtMaandJaar(waarde: string | Date | null | undefined) {
  const d = toDate(waarde);
  return d ? maandJaar.format(d) : "—";
}

/** `14:30` */
export function fmtTyd(waarde: string | Date | null | undefined) {
  const d = toDate(waarde);
  return d ? tyd.format(d) : "—";
}

export function fmtGetal(waarde: number | null | undefined) {
  return typeof waarde === "number" ? getal.format(waarde) : "—";
}

/* ---------------------------------------------------------------
   Ouderdom
   `date_of_birth` is nullable — 3 van 17 lewende rekords het geen
   geboortedatum nie. Elke telling moet dit hanteer, en die
   "geen geboortedatum"-telling moet gewys word. Base44 se Dashboard
   en Verslae stem nie ooreen nie juis omdat hulle dit nie doen nie.
   --------------------------------------------------------------- */

/** Ouderdom in vol jare, of `null` as daar geen geboortedatum is nie. */
export function berekenOuderdom(
  geboortedatum: string | Date | null | undefined,
  op: Date = new Date(),
): number | null {
  const d = toDate(geboortedatum);
  if (!d) return null;

  let ouderdom = op.getFullYear() - d.getFullYear();
  const maandVerskil = op.getMonth() - d.getMonth();
  if (maandVerskil < 0 || (maandVerskil === 0 && op.getDate() < d.getDate())) {
    ouderdom -= 1;
  }
  return ouderdom < 0 ? null : ouderdom;
}

export const OUDERDOMSGROEPE = [
  { sleutel: "0-5", etiket: "0 – 5 jaar", min: 0, maks: 5 },
  { sleutel: "6-12", etiket: "6 – 12 jaar", min: 6, maks: 12 },
  { sleutel: "13-17", etiket: "13 – 17 jaar", min: 13, maks: 17 },
  { sleutel: "18-35", etiket: "18 – 35 jaar", min: 18, maks: 35 },
  { sleutel: "36-59", etiket: "36 – 59 jaar", min: 36, maks: 59 },
  { sleutel: "60+", etiket: "60+ jaar", min: 60, maks: Infinity },
] as const;

export type Ouderdomsgroep = (typeof OUDERDOMSGROEPE)[number]["sleutel"];

export function ouderdomsgroepVan(ouderdom: number | null): Ouderdomsgroep | null {
  if (ouderdom === null) return null;
  return (
    OUDERDOMSGROEPE.find((g) => ouderdom >= g.min && ouderdom <= g.maks)
      ?.sleutel ?? null
  );
}

/** `12 jr`, of `—` waar geen geboortedatum is nie. */
export function fmtOuderdom(ouderdom: number | null) {
  return ouderdom === null ? "—" : `${ouderdom} jr`;
}
