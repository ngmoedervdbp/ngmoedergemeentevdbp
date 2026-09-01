/**
 * Navrae oor die bedieningspotdata. Hou die handtekeninge naby aan wat 'n
 * Supabase-navraag sou teruggee — dan is die omruil later meganies.
 */

import { AFSPRAKE, BEDIENING_AKTIWITEITE } from "./bediening-data";
import type {
  Afspraak,
  AfspraakStatus,
  BedieningAktiwiteit,
  BedieningTipe,
} from "./bediening-tipes";

export * from "./bediening-tipes";
export { AFSPRAKE, BEDIENING_AKTIWITEITE };

/** Nuutste eerste — die volgorde waarin die Dominee sy werk lees. */
export const aktiwiteite = () =>
  [...BEDIENING_AKTIWITEITE].sort((a, b) => b.datum.localeCompare(a.datum));

export const aktiwiteitPerId = (id: string) =>
  BEDIENING_AKTIWITEITE.find((a) => a.id === id) ?? null;

/**
 * Aktiwiteite binne 'n datumreeks, insluitend albei eindpunte.
 * Datums is ISO-snare, so 'n string-vergelyking is korrek en goedkoop.
 */
export function aktiwiteiteTussen(van: string, tot: string) {
  return aktiwiteite().filter((a) => a.datum >= van && a.datum <= tot);
}

/** Hoeveel aktiwiteite in die huidige week — die syfer onder die bladsykop. */
export function aktiwiteiteHierdieWeek(vandag = new Date()) {
  const dag = vandag.getDay();
  // Maandag as eerste dag; Sondag (0) tel by die week wat verby is.
  const naMaandag = dag === 0 ? 6 : dag - 1;
  const begin = new Date(vandag);
  begin.setDate(vandag.getDate() - naMaandag);
  const einde = new Date(begin);
  einde.setDate(begin.getDate() + 6);
  return aktiwiteiteTussen(isoDatum(begin), isoDatum(einde));
}

export function isoDatum(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/**
 * Die vier stat-teëls op Verslae.
 *
 * `ure` is in Postgres 'n gegenereerde kolom, so hierdie som is die enigste
 * plek waar dit opgetel word — die app bereken nooit sy eie duur nie.
 */
export function bedieningOorsig(lys: BedieningAktiwiteit[] = aktiwiteite()) {
  const totaleUre = lys.reduce((som, a) => som + (a.ure ?? 0), 0);
  const liggings = new Set(
    lys.map((a) => a.plek_naam?.trim().toLowerCase()).filter(Boolean),
  );

  // Gemiddeld per week oor die tydperk wat die rekords dek.
  const datums = lys.map((a) => a.datum).sort();
  const dae =
    datums.length > 1
      ? Math.max(
          1,
          Math.round(
            (new Date(datums[datums.length - 1]).getTime() -
              new Date(datums[0]).getTime()) /
              86_400_000,
          ),
        )
      : 7;
  const weke = Math.max(1, dae / 7);

  return {
    totaal: lys.length,
    totaleUre: Math.round(totaleUre * 10) / 10,
    liggings: liggings.size,
    perWeek: Math.round((lys.length / weke) * 10) / 10,
  };
}

/** Tellings per tipe, grootste eerste — voed die staaf- en sirkeldiagram. */
export function tellingPerTipe(lys: BedieningAktiwiteit[] = aktiwiteite()) {
  const tel = new Map<BedieningTipe, number>();
  for (const a of lys) tel.set(a.tipe, (tel.get(a.tipe) ?? 0) + 1);

  const totaal = lys.length || 1;
  return [...tel.entries()]
    .map(([tipe, aantal]) => ({
      tipe,
      aantal,
      persentasie: Math.round((aantal / totaal) * 1000) / 10,
    }))
    .sort((a, b) => b.aantal - a.aantal);
}

/** Aktiwiteite gegroepeer per dag, vir die kalenderaansig. */
export function aktiwiteitePerDag(lys: BedieningAktiwiteit[] = aktiwiteite()) {
  const kaart = new Map<string, BedieningAktiwiteit[]>();
  for (const a of lys) {
    const bestaande = kaart.get(a.datum);
    if (bestaande) bestaande.push(a);
    else kaart.set(a.datum, [a]);
  }
  return kaart;
}

// ------------------------------------------------------------------ afsprake

export const afsprake = () =>
  [...AFSPRAKE].sort((a, b) => a.datum.localeCompare(b.datum));

export const afspraakPerId = (id: string) =>
  AFSPRAKE.find((a) => a.id === id) ?? null;

export function afsprakeMetStatus(statusse: readonly AfspraakStatus[]) {
  return afsprake().filter((a) => statusse.includes(a.status));
}

export function telAfsprakePerStatus() {
  const tel = new Map<AfspraakStatus, number>();
  for (const a of AFSPRAKE) tel.set(a.status, (tel.get(a.status) ?? 0) + 1);
  return tel;
}

export type { Afspraak, BedieningAktiwiteit };
