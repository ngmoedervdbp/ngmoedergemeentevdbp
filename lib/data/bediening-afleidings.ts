import type {
  Afspraak,
  AfspraakStatus,
  BedieningAktiwiteit,
  BedieningTipe,
} from "@/lib/tipes/bediening";

/**
 * Afleidings oor die bedieningsdata.
 *
 * Dieselfde berekeninge as voorheen; die rye word nou ingegee in plaas van uit
 * 'n module-vlak skikking gelees te word.
 */

export function isoDatum(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function aktiwiteiteTussen(
  lys: BedieningAktiwiteit[],
  van: string,
  tot: string,
) {
  return lys.filter((a) => a.datum >= van && a.datum <= tot);
}

/** Hoeveel aktiwiteite in die huidige week — die syfer onder die bladsykop. */
export function aktiwiteiteHierdieWeek(
  lys: BedieningAktiwiteit[],
  vandag = new Date(),
) {
  const dag = vandag.getDay();
  // Maandag as eerste dag; Sondag (0) tel by die week wat verby is.
  const naMaandag = dag === 0 ? 6 : dag - 1;
  const begin = new Date(vandag);
  begin.setDate(vandag.getDate() - naMaandag);
  const einde = new Date(begin);
  einde.setDate(begin.getDate() + 6);
  return aktiwiteiteTussen(lys, isoDatum(begin), isoDatum(einde));
}

/**
 * Die vier stat-teëls op Verslae.
 *
 * `ure` is in Postgres 'n gegenereerde kolom, so hierdie som is die enigste
 * plek waar dit opgetel word — die app bereken nooit sy eie duur nie.
 */
export function bedieningOorsig(lys: BedieningAktiwiteit[]) {
  const totaleUre = lys.reduce((som, a) => som + (a.ure ?? 0), 0);
  const liggings = new Set(
    lys.map((a) => a.plek_naam?.trim().toLowerCase()).filter(Boolean),
  );

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
export function tellingPerTipe(lys: BedieningAktiwiteit[]) {
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

export function afsprakeMetStatus(
  lys: Afspraak[],
  statusse: readonly AfspraakStatus[],
) {
  return lys.filter((a) => statusse.includes(a.status));
}
