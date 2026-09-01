/**
 * Domeintipes vir Bediening Opsporing.
 *
 * Spieël supabase/migrations/013–016 presies — as een van die twee verander,
 * verander albei. Bron: docs/base44-reference/bediening-opsporing.md.
 */

/** Die tien aktiwiteitstipes, in die volgorde van die kalender se legende. */
export type BedieningTipe =
  | "tuisbesoek"
  | "hospitaalbesoek"
  | "begrafnis"
  | "vergadering"
  | "preek"
  | "berading"
  | "doop"
  | "troue"
  | "bybelstudie"
  | "ander";

/**
 * "Lidmaat Tipe" in die vorm — was dit 'n bestaande lidmaat of 'n nuwe kontak?
 *
 * NIE dieselfde as `Lid["tipe"]` (belydend | doop) nie. Dieselfde woord, twee
 * betekenisse; moenie die twee meng nie.
 */
export type BedieningLidmaatTipe = "bestaande" | "nuwe";

export type AfspraakStatus =
  | "hangend"
  | "goedgekeur"
  | "herskeduleer"
  | "afgekeur"
  | "voltooi"
  | "nie_opgedaag";

export type BedieningAktiwiteit = {
  id: string;
  titel: string;
  tipe: BedieningTipe;
  lidmaat_tipe: BedieningLidmaatTipe | null;
  datum: string;
  begin_tyd: string | null;
  eind_tyd: string | null;
  plek_naam: string | null;
  adres: string | null;
  /** Opsionele skakel na 'n regte lidmaat — vrye teks werk vir 'n nie-lidmaat. */
  lid_id: string | null;
  aantekeninge: string | null;
  /**
   * Bereken uit begin_tyd/eind_tyd. In Postgres is dit 'n gegenereerde kolom,
   * daarom is dit hier ook afgelei en nooit met die hand gestel nie.
   */
  ure: number | null;
};

export type Afspraak = {
  id: string;
  titel: string;
  beskrywing: string | null;
  persoon_naam: string | null;
  persoon_selfoon: string | null;
  persoon_epos: string | null;
  lid_id: string | null;
  datum: string;
  begin_tyd: string | null;
  eind_tyd: string | null;
  plek_naam: string | null;
  adres: string | null;
  status: AfspraakStatus;
  herskeduleer_na: string | null;
  aantekeninge: string | null;
};
