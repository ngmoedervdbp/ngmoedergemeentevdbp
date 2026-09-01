/**
 * Die woordeskat van Bediening Opsporing: etiket, ikoon en glastoon per
 * aktiwiteitstipe en afspraakstatus.
 *
 * Dit MOET 'n gewone module bly, nie 'n "use client"-lêer nie — Server
 * Components voer dit in, en 'n konstante uit 'n kliëntmodule kom as 'n proxy
 * terug waar elke veld `undefined` lees. Sien CLAUDE.md.
 */

import {
  BookOpen,
  Building2,
  Church,
  CircleEllipsis,
  Cross,
  Droplets,
  HeartHandshake,
  Home,
  Gem,
  Users,
  type LucideIcon,
} from "lucide-react";
import type {
  AfspraakStatus,
  BedieningLidmaatTipe,
  BedieningTipe,
} from "@/lib/mock/bediening-tipes";
import type { GlasToon } from "@/lib/glas";

type TipeInfo = {
  etiket: string;
  ikoon: LucideIcon;
  toon: GlasToon;
};

/**
 * Volgorde volg die kalenderlegende in die Base44-demo, sodat die Dominee
 * dieselfde lys op dieselfde plek sien.
 *
 * Die tone is gekies vir betekenis, nie dekorasie nie: hospitaalbesoek en
 * begrafnis kry die ernstigste tone (wyn, lood-agtige violet), 'n troue die
 * warmste (roos), en 'n gewone tuisbesoek die rustigste (saffier).
 */
export const BEDIENING_TIPES: Record<BedieningTipe, TipeInfo> = {
  tuisbesoek: { etiket: "Tuisbesoek", ikoon: Home, toon: "saffier" },
  hospitaalbesoek: { etiket: "Hospitaalbesoek", ikoon: Building2, toon: "wyn" },
  begrafnis: { etiket: "Begrafnis", ikoon: Cross, toon: "violet" },
  vergadering: { etiket: "Vergadering", ikoon: Users, toon: "kobalt" },
  preek: { etiket: "Preek", ikoon: Church, toon: "amber" },
  berading: { etiket: "Berading", ikoon: HeartHandshake, toon: "see" },
  doop: { etiket: "Doop", ikoon: Droplets, toon: "kobalt" },
  troue: { etiket: "Troue", ikoon: Gem, toon: "roos" },
  bybelstudie: { etiket: "Bybelstudie", ikoon: BookOpen, toon: "groen" },
  ander: { etiket: "Ander", ikoon: CircleEllipsis, toon: "olyf" },
};

/** Die tipes as 'n lys, vir keuselyste en legendes. */
export const BEDIENING_TIPE_LYS = Object.entries(BEDIENING_TIPES).map(
  ([sleutel, info]) => ({ sleutel: sleutel as BedieningTipe, ...info }),
);

export const LIDMAAT_TIPES: Record<BedieningLidmaatTipe, string> = {
  bestaande: "Bestaande lidmaat",
  nuwe: "Nuwe lidmaat",
};

type StatusInfo = {
  etiket: string;
  toon: GlasToon;
};

/**
 * Ses statusse word gestoor; die UI wys vier filters. Sien
 * `AFSPRAAK_FILTERS` hieronder — uit "aktief" alleen kan jy nie aflei of iets
 * goedgekeur of herskeduleer is nie, daarom stoor ons die fyner waarde.
 */
export const AFSPRAAK_STATUSSE: Record<AfspraakStatus, StatusInfo> = {
  hangend: { etiket: "Hangend", toon: "amber" },
  goedgekeur: { etiket: "Goedgekeur", toon: "groen" },
  herskeduleer: { etiket: "Herskeduleer", toon: "kobalt" },
  afgekeur: { etiket: "Afgekeur", toon: "wyn" },
  voltooi: { etiket: "Voltooi", toon: "saffier" },
  nie_opgedaag: { etiket: "Nie opgedaag", toon: "terra" },
};

/** Die vier filter-oortjies uit die demo, en watter statusse elk dek. */
export const AFSPRAAK_FILTERS = [
  { sleutel: "hangend", etiket: "Hangend", dek: ["hangend"] },
  { sleutel: "aktief", etiket: "Aktief", dek: ["goedgekeur", "herskeduleer"] },
  { sleutel: "voltooi", etiket: "Voltooi", dek: ["voltooi", "nie_opgedaag"] },
  { sleutel: "afgekeur", etiket: "Afgekeur", dek: ["afgekeur"] },
] as const satisfies ReadonlyArray<{
  sleutel: string;
  etiket: string;
  dek: readonly AfspraakStatus[];
}>;

export type AfspraakFilter = (typeof AFSPRAAK_FILTERS)[number]["sleutel"];
