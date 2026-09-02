import {
  berekenOuderdom,
  ouderdomsgroepVan,
  OUDERDOMSGROEPE,
} from "@/lib/format";
import type {
  Gebeurtenis,
  KategeseGroep,
  Lid,
  Status,
  Wyk,
} from "@/lib/mock/tipes";

/**
 * Afleidings oor die gemeentedata — tellings, ouderdomsgroepe, verjaarsdae.
 *
 * Dit is woord-vir-woord dieselfde logika as die ou `lib/mock/index.ts`; die
 * enigste verskil is dat die rye ingegee word in plaas van uit 'n module-vlak
 * skikking gelees te word. Dít is hoekom die Supabase-omruil klein was: die
 * berekeninge het nooit oor die databron geweet nie.
 *
 * Geen `server-only` hier nie — dit is suiwer funksies en 'n Client Component
 * mag hulle gerus gebruik.
 */

export const volleNaam = (l: Lid) => `${l.first_name} ${l.last_name}`;

export const voorletters = (l: Lid) =>
  `${l.first_name.charAt(0)}${l.last_name.charAt(0)}`.toUpperCase();

/** Argief = enigiets wat nie aktief is nie. Uitgesluit uit alle statistiek. */
export const isGeargiveer = (l: Lid) => l.status !== "aktief";

export const aktieweLede = (lede: Lid[]) =>
  lede.filter((l) => l.status === "aktief");

export const geargiveerdeLede = (lede: Lid[]) => lede.filter(isGeargiveer);

export const lidPerId = (lede: Lid[], id: string) =>
  lede.find((l) => l.id === id) ?? null;

export const wykPerId = (wyke: Wyk[], id: string | null) =>
  id ? (wyke.find((w) => w.id === id) ?? null) : null;

export const ledeInWyk = (lede: Lid[], wyk_id: string) =>
  aktieweLede(lede).filter((l) => l.wyk_id === wyk_id);

export const ledeInFamily = (lede: Lid[], family_id: string) =>
  lede.filter((l) => l.family_id === family_id);

export const telPerStatus = (lede: Lid[], status: Status) =>
  lede.filter((l) => l.status === status).length;

/* ---------------------------------------------------------------
   Ouderdom — altyd bereken, nooit gestoor nie, en `null` tel apart.
   Base44 se Dashboard en Verslae stem nie ooreen nie omdat hulle dit
   nie doen nie. Een helper, oral gebruik.
   --------------------------------------------------------------- */

export function ouderdomsOorsig(lede: Lid[]) {
  const aktief = aktieweLede(lede);
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

export function ouderdomsGroepTellings(lede: Lid[]) {
  const tellings = new Map<string, number>(
    OUDERDOMSGROEPE.map((g) => [g.sleutel, 0]),
  );
  for (const l of aktieweLede(lede)) {
    const groep = ouderdomsgroepVan(berekenOuderdom(l.date_of_birth));
    if (groep) tellings.set(groep, (tellings.get(groep) ?? 0) + 1);
  }
  return OUDERDOMSGROEPE.map((g) => ({
    naam: g.etiket,
    waarde: tellings.get(g.sleutel) ?? 0,
  }));
}

export function geslagsTellings(lede: Lid[]) {
  const aktief = aktieweLede(lede);
  return [
    {
      naam: "Manlik",
      waarde: aktief.filter((l) => l.geslag === "manlik").length,
    },
    {
      naam: "Vroulik",
      waarde: aktief.filter((l) => l.geslag === "vroulik").length,
    },
  ];
}

export function wykTellings(wyke: Wyk[], lede: Lid[]) {
  return wyke.map((w) => ({ ...w, tel: ledeInWyk(lede, w.id).length }));
}

/** Verjaarsdae binne die volgende `dae` dae, dag-van-jaar gebaseer. */
export function komendeVerjaarsdae(lede: Lid[], dae = 30, vandag = new Date()) {
  const vandagMiddernag = new Date(
    vandag.getFullYear(),
    vandag.getMonth(),
    vandag.getDate(),
  );

  return aktieweLede(lede)
    .filter((l) => l.date_of_birth)
    .map((l) => {
      const dob = new Date(l.date_of_birth!);
      const volgende = new Date(
        vandag.getFullYear(),
        dob.getMonth(),
        dob.getDate(),
      );
      if (volgende < vandagMiddernag) {
        volgende.setFullYear(vandag.getFullYear() + 1);
      }
      const oor = Math.round(
        (volgende.getTime() - vandagMiddernag.getTime()) / 86_400_000,
      );
      return {
        lid: l,
        datum: volgende,
        oor,
        word: berekenOuderdom(l.date_of_birth, volgende),
      };
    })
    .filter((r) => r.oor <= dae)
    .sort((a, b) => a.oor - b.oor);
}

export function komendeGebeurtenisse(
  gebeurtenisse: Gebeurtenis[],
  aantal = 5,
  vandag = new Date(),
) {
  const vandagMiddernag = new Date(
    vandag.getFullYear(),
    vandag.getMonth(),
    vandag.getDate(),
  );
  return gebeurtenisse
    .filter((g) => new Date(g.datum) >= vandagMiddernag)
    .sort((a, b) => a.datum.localeCompare(b.datum))
    .slice(0, aantal);
}

export function nuutsteLede(lede: Lid[], aantal = 6) {
  return [...aktieweLede(lede)]
    .sort((a, b) => b.lid_sedert.localeCompare(a.lid_sedert))
    .slice(0, aantal);
}

/** Nuwe lidmate per maand oor die laaste 12 maande. */
export function groeiPerMaand(lede: Lid[], vandag = new Date()) {
  const maande: { naam: string; waarde: number }[] = [];
  const kort = new Intl.DateTimeFormat("af-ZA", {
    month: "short",
    timeZone: "Africa/Johannesburg",
  });
  for (let i = 11; i >= 0; i--) {
    const d = new Date(vandag.getFullYear(), vandag.getMonth() - i, 1);
    const sleutel = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    maande.push({
      naam: kort.format(d),
      waarde: lede.filter((l) => l.lid_sedert?.startsWith(sleutel)).length,
    });
  }
  return maande;
}

export function kategeseKinders(groepe: KategeseGroep[], lede: Lid[]) {
  const ids = new Set(groepe.flatMap((g) => g.lid_ids));
  const inGroep = [...ids]
    .map((id) => lidPerId(lede, id))
    .filter((l): l is Lid => l !== null);
  const alleKinders = aktieweLede(lede).filter((l) => {
    const o = berekenOuderdom(l.date_of_birth);
    return o !== null && o < 18;
  });
  return {
    inGroep,
    sonderGroep: alleKinders.filter((l) => !ids.has(l.id)),
    alleKinders,
  };
}
