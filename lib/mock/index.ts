import { berekenOuderdom, ouderdomsgroepVan, OUDERDOMSGROEPE } from "@/lib/format";
import { DOKUMENTE, FAMILIES, GEBEURTENISSE, KATEGESE_GROEPE, LEDE, REGISTRASIES, WYKE } from "./data";
import type { Lid, Status } from "./tipes";

export * from "./tipes";
export { DOKUMENTE, FAMILIES, GEBEURTENISSE, KATEGESE_GROEPE, LEDE, REGISTRASIES, WYKE };

/**
 * Navrae oor die spotdata. Hou hierdie handtekeninge naby aan wat 'n
 * Supabase-navraag sou teruggee — dan is die omruil later meganies.
 */

export const volleNaam = (l: Lid) => `${l.first_name} ${l.last_name}`;

export const voorletters = (l: Lid) =>
  `${l.first_name.charAt(0)}${l.last_name.charAt(0)}`.toUpperCase();

/** Argief = enigiets wat nie aktief is nie. Uitgesluit uit alle statistiek. */
export const isGeargiveer = (l: Lid) => l.status !== "aktief";

export const aktieweLede = () => LEDE.filter((l) => l.status === "aktief");
export const geargiveerdeLede = () => LEDE.filter(isGeargiveer);

export const lidPerId = (id: string) => LEDE.find((l) => l.id === id) ?? null;
export const wykPerId = (id: string | null) =>
  id ? (WYKE.find((w) => w.id === id) ?? null) : null;
export const familyPerId = (id: string | null) =>
  id ? (FAMILIES.find((f) => f.id === id) ?? null) : null;

export const ledeInWyk = (wyk_id: string) =>
  aktieweLede().filter((l) => l.wyk_id === wyk_id);

export const ledeInFamily = (family_id: string) =>
  LEDE.filter((l) => l.family_id === family_id && l.status === "aktief");

export const telPerStatus = (status: Status) =>
  LEDE.filter((l) => l.status === status).length;

/* ---------------------------------------------------------------
   Ouderdom — altyd bereken, nooit gestoor nie, en `null` tel apart.
   Base44 se Dashboard en Verslae stem nie ooreen nie omdat hulle dit
   nie doen nie. Een helper, oral gebruik.
   --------------------------------------------------------------- */

export function ouderdomsOorsig() {
  const aktief = aktieweLede();
  const metDatum = aktief.filter((l) => l.date_of_birth);
  const sonderDatum = aktief.length - metDatum.length;

  const ouderdomme = metDatum.map((l) => berekenOuderdom(l.date_of_birth)!);
  const kinders = ouderdomme.filter((o) => o < 18).length;
  const kindersOnder13 = ouderdomme.filter((o) => o < 13).length;
  const seniors = ouderdomme.filter((o) => o >= 60).length;

  return {
    totaalAktief: aktief.length,
    metDatum: metDatum.length,
    sonderDatum,
    kinders,
    kindersOnder13,
    volwassenes: ouderdomme.length - kinders,
    seniors,
  };
}

export function ouderdomsGroepTellings() {
  const tellings = new Map<string, number>(
    OUDERDOMSGROEPE.map((g) => [g.sleutel, 0]),
  );
  for (const l of aktieweLede()) {
    const groep = ouderdomsgroepVan(berekenOuderdom(l.date_of_birth));
    if (groep) tellings.set(groep, (tellings.get(groep) ?? 0) + 1);
  }
  return OUDERDOMSGROEPE.map((g) => ({
    naam: g.etiket,
    waarde: tellings.get(g.sleutel) ?? 0,
  }));
}

export function geslagsTellings() {
  const aktief = aktieweLede();
  return [
    { naam: "Manlik", waarde: aktief.filter((l) => l.geslag === "manlik").length },
    { naam: "Vroulik", waarde: aktief.filter((l) => l.geslag === "vroulik").length },
  ];
}

export function wykTellings() {
  return WYKE.map((w) => ({
    ...w,
    tel: ledeInWyk(w.id).length,
  }));
}

/** Verjaarsdae binne die volgende `dae` dae, dag-van-jaar gebaseer. */
export function komendeVerjaarsdae(dae = 30, vandag = new Date()) {
  const resultate = aktieweLede()
    .filter((l) => l.date_of_birth)
    .map((l) => {
      const dob = new Date(l.date_of_birth!);
      const volgende = new Date(vandag.getFullYear(), dob.getMonth(), dob.getDate());
      if (volgende < new Date(vandag.getFullYear(), vandag.getMonth(), vandag.getDate())) {
        volgende.setFullYear(vandag.getFullYear() + 1);
      }
      const oor = Math.round(
        (volgende.getTime() -
          new Date(vandag.getFullYear(), vandag.getMonth(), vandag.getDate()).getTime()) /
          86_400_000,
      );
      return { lid: l, datum: volgende, oor, word: berekenOuderdom(l.date_of_birth, volgende) };
    })
    .filter((r) => r.oor <= dae)
    .sort((a, b) => a.oor - b.oor);
  return resultate;
}

export function komendeGebeurtenisse(aantal = 5, vandag = new Date()) {
  const vandagMiddernag = new Date(
    vandag.getFullYear(), vandag.getMonth(), vandag.getDate(),
  );
  return GEBEURTENISSE.filter((g) => new Date(g.datum) >= vandagMiddernag)
    .sort((a, b) => a.datum.localeCompare(b.datum))
    .slice(0, aantal);
}

export function nuutsteLede(aantal = 6) {
  return [...aktieweLede()]
    .sort((a, b) => b.lid_sedert.localeCompare(a.lid_sedert))
    .slice(0, aantal);
}

/** Nuwe lidmate per maand oor die laaste 12 maande. */
export function groeiPerMaand(vandag = new Date()) {
  const maande: { naam: string; waarde: number }[] = [];
  const kort = new Intl.DateTimeFormat("af-ZA", { month: "short", timeZone: "Africa/Johannesburg" });
  for (let i = 11; i >= 0; i--) {
    const d = new Date(vandag.getFullYear(), vandag.getMonth() - i, 1);
    const sleutel = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    maande.push({
      naam: kort.format(d),
      waarde: LEDE.filter((l) => l.lid_sedert.startsWith(sleutel)).length,
    });
  }
  return maande;
}

export function kategeseKinders() {
  const ids = new Set(KATEGESE_GROEPE.flatMap((g) => g.lid_ids));
  const inGroep = [...ids].map(lidPerId).filter((l): l is Lid => l !== null);
  const alleKinders = aktieweLede().filter((l) => {
    const o = berekenOuderdom(l.date_of_birth);
    return o !== null && o < 18;
  });
  return {
    inGroep,
    sonderGroep: alleKinders.filter((l) => !ids.has(l.id)),
    alleKinders,
  };
}
