/**
 * Die publieke kalender — gesinkroniseer uit die stelsel se gebeurtenisse.
 *
 * Een bron van waarheid: die kerkkantoor voer 'n gebeurtenis EEN keer in
 * Kalender in, en dit verskyn hier. Geen tweede lys om te onderhou nie.
 *
 * ⚠ MAAR NIE ALLES GAAN PUBLIEK NIE. 'n Kerkraadsvergadering, 'n
 * beradingsafspraak of 'n gesinsbyeenkoms is nie die gemeenskap se sake nie.
 * Die filter hieronder is die hek, en dit is 'n TOELAATLYS, nie 'n bloklys —
 * 'n nuwe kategorie is standaard privaat totdat iemand besluit dit is publiek.
 *
 * Wanneer Supabase inkom, word dit 'n `events.publiek boolean not null default
 * false`-kolom en die kerkkantoor merk dit self per gebeurtenis. Die
 * verstek-vals is die punt: vergeet iemand, lek niks.
 */

import { GEBEURTENISSE, type Gebeurtenis } from "@/lib/mock";
import type { GebeurtenisKategorie } from "@/lib/mock/tipes";

/** Kategorieë wat op die publieke werf gewys mag word. */
const PUBLIEKE_KATEGORIEE: GebeurtenisKategorie[] = [
  "algemeen",
  "jeug",
  "seniors",
  "spesiaal",
];

/**
 * Titels wat nooit publiek word nie, ongeag kategorie.
 *
 * "Kerkraadsvergadering" is 'algemeen' maar is 'n interne vergadering. Tot die
 * `publiek`-kolom bestaan, hou hierdie lys dit uit.
 */
const PRIVAAT_PATRONE = [
  /kerkraad/i,
  /vergadering/i,
  /berading/i,
  /kommissie/i,
];

export type PubliekeGebeurtenis = Gebeurtenis;

function isPubliek(g: Gebeurtenis) {
  if (!PUBLIEKE_KATEGORIEE.includes(g.kategorie)) return false;
  return !PRIVAAT_PATRONE.some((p) => p.test(g.titel));
}

/**
 * Komende publieke gebeurtenisse, vroegste eerste.
 *
 * `vandag` is inspuitbaar sodat dit toetsbaar is en nie op die bediener se
 * klok staatmaak nie.
 */
export function komendePubliek(
  aantal = 6,
  vandag = new Date(),
): PubliekeGebeurtenis[] {
  const vandagISO = vandag.toISOString().slice(0, 10);

  return GEBEURTENISSE.filter(isPubliek)
    .filter((g) => g.datum >= vandagISO)
    .sort((a, b) => a.datum.localeCompare(b.datum) || (a.tyd ?? "").localeCompare(b.tyd ?? ""))
    .slice(0, aantal);
}

/** Alle publieke gebeurtenisse in 'n gegewe maand, vir die maandaansig. */
export function publiekInMaand(jaar: number, maand: number) {
  const voorvoegsel = `${jaar}-${String(maand + 1).padStart(2, "0")}`;
  return GEBEURTENISSE.filter(isPubliek)
    .filter((g) => g.datum.startsWith(voorvoegsel))
    .sort((a, b) => a.datum.localeCompare(b.datum) || (a.tyd ?? "").localeCompare(b.tyd ?? ""));
}

/** Hoeveel gebeurtenisse die filter weggehou het — nuttig om te sien dit werk. */
export function privaatGetel() {
  return GEBEURTENISSE.length - GEBEURTENISSE.filter(isPubliek).length;
}
