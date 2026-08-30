/** Domeintipes. Spieël wat die Supabase-skema gaan wees — sien CLAUDE.md. */

export type Status = "aktief" | "onaktief" | "oorgeplaas" | "oorlede";
export type Geslag = "manlik" | "vroulik";
export type FamilyRole = "man" | "vrou" | "kind";
export type LidmaatTipe = "belydend" | "doop";

export type Wyk = {
  id: string;
  /** Nommer is 'n STRING — "30 A", "38 A" bestaan regtig. */
  nommer: string;
  naam: string;
  ouderling: string | null;
  kapasiteit: number;
};

export type Family = {
  id: string;
  naam: string;
  adres: string;
  stad: string;
  wyk_id: string | null;
};

export type Lid = {
  id: string;
  first_name: string;
  last_name: string;
  /** Nullable — party rekords het geen geboortedatum nie. Hanteer dit altyd. */
  date_of_birth: string | null;
  geslag: Geslag;
  status: Status;
  tipe: LidmaatTipe;
  selfoon: string | null;
  epos: string | null;
  wyk_id: string | null;
  family_id: string | null;
  family_role: FamilyRole | null;
  lid_sedert: string;
  aantekeninge: string | null;
  foto: string | null;
};

export type GebeurtenisKategorie =
  | "algemeen"
  | "jeug"
  | "seniors"
  | "spesiaal";

export type Gebeurtenis = {
  id: string;
  titel: string;
  datum: string;
  tyd: string | null;
  plek: string | null;
  kategorie: GebeurtenisKategorie;
  beskrywing: string | null;
};

export type KategeseGroep = {
  id: string;
  naam: string;
  ouderdomsgroep: string;
  onderwyser: string;
  lokaal: string;
  dag: string;
  tyd: string;
  lid_ids: string[];
};

export type Dokument = {
  id: string;
  titel: string;
  beskrywing: string;
  sleutel: "lidmaatskapvorm" | "grondwet" | "bankbesonderhede" | "welkombrief" | null;
  lêernaam: string | null;
  grootte: string | null;
  opgelaai: string | null;
};

export type Registrasie = {
  id: string;
  first_name: string;
  last_name: string;
  selfoon: string | null;
  epos: string | null;
  adres: string | null;
  ontvang: string;
};
