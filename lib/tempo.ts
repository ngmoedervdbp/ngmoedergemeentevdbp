/**
 * Tempobeperking vir die publieke registrasieroete.
 *
 * ⚠ WAT DIT IS EN NIE IS NIE
 *
 * Dit is 'n in-geheue venster per bedienerinstansie. Op Vercel loop elke
 * lambda-instansie sy eie kopie, en instansies word gereeld herwin — 'n
 * vasberade aanvaller wat instansies rondspring kry dus meer deur as die
 * limiet hieronder suggereer.
 *
 * Dit is doelbewus so: dit stop die werklike bedreiging (een blaaier of skrip
 * wat die vorm honderde kere indien) sonder om 'n databasis of Redis by te
 * sleep vir 'n gemeente se registrasievorm.
 *
 * Wanneer dit opgegradeer moet word: sodra daar werklike misbruik is, of
 * sodra die gemeente 'n Upstash/Redis-instansie het. Vervang dan net die
 * binnekant van `tempoKontrole` — die oproepplek bly dieselfde.
 *
 * Die eerste egte laag bly die heuningpot in die vorm; dit vang bots wat nie
 * eens JavaScript loop nie.
 */

type Venster = { tel: number; verval: number };

const VENSTER_MS = 10 * 60 * 1000; // 10 minute
const MAKS_PER_VENSTER = 3;

/**
 * Module-vlak, dus per instansie. `globalThis` sodat dit 'n hermontering in
 * ontwikkeling oorleef — anders begin die telling by elke wysiging oor.
 */
const winkel: Map<string, Venster> =
  (globalThis as { __tempo?: Map<string, Venster> }).__tempo ??
  ((globalThis as { __tempo?: Map<string, Venster> }).__tempo = new Map());

/** Gooi verlopte inskrywings weg sodat die kaart nie onbeperk groei nie. */
function ruimOp(nou: number) {
  for (const [sleutel, v] of winkel) {
    if (v.verval <= nou) winkel.delete(sleutel);
  }
}

export type TempoUitslag = {
  toegelaat: boolean;
  /** Sekondes tot die venster oopgaan — vir die boodskap aan die gebruiker. */
  wagSekondes: number;
};

export function tempoKontrole(sleutel: string): TempoUitslag {
  const nou = Date.now();

  // Goedkoop genoeg om by elke oproep te doen; die kaart bly klein.
  if (winkel.size > 500) ruimOp(nou);

  const bestaande = winkel.get(sleutel);

  if (!bestaande || bestaande.verval <= nou) {
    winkel.set(sleutel, { tel: 1, verval: nou + VENSTER_MS });
    return { toegelaat: true, wagSekondes: 0 };
  }

  if (bestaande.tel >= MAKS_PER_VENSTER) {
    return {
      toegelaat: false,
      wagSekondes: Math.ceil((bestaande.verval - nou) / 1000),
    };
  }

  bestaande.tel += 1;
  return { toegelaat: true, wagSekondes: 0 };
}

/**
 * Die kliënt se IP uit die proxy-koppe.
 *
 * Op Vercel is `x-forwarded-for` 'n lys waar die EERSTE inskrywing die
 * werklike kliënt is; die res is proxies. Vertrou nooit die hele string nie.
 */
export function klientIP(koppe: Headers): string {
  // Naam is ASCII (nie `kliëntIP` nie): 'n nie-ASCII uitvoernaam het al
  // moduleresolusie gebreek. Afrikaans bly in kommentaar en UI-teks.
  const xff = koppe.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return koppe.get("x-real-ip")?.trim() || "onbekend";
}
