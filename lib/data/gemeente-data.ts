import "server-only";

import { createClient } from "@/lib/supabase/server";
import type {
  Dokument,
  Family,
  Gebeurtenis,
  KategeseGroep,
  Lid,
  Registrasie,
  Wyk,
} from "@/lib/tipes/gemeente";

/**
 * Die gemeentedata uit Supabase.
 *
 * ONTWERP: haal die rye een keer per bladsy, en hou die afleidings (tellings,
 * ouderdomsgroepe, verjaarsdae) suiwer funksies oor daardie rye — presies soos
 * `lib/mock/index.ts` dit gedoen het. Dit is hoekom die omruil klein is: die
 * berekeninge verander glad nie, net waar die rye vandaan kom.
 *
 * `server-only` sodat 'n toevallige invoer in 'n Client Component 'n bouftout
 * gee eerder as om die anon-sleutel se navrae na die blaaier te skuif.
 */

/** Sonder sleutels is daar niks om te haal nie — gee leë lyste terug. */
function heltSupabase() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

async function haal<T>(
  tabel: string,
  kolomme: string,
  volgorde?: { kolom: string; op?: boolean },
): Promise<T[]> {
  if (!heltSupabase()) return [];

  const supabase = await createClient();
  let q = supabase.from(tabel).select(kolomme);
  if (volgorde) q = q.order(volgorde.kolom, { ascending: volgorde.op ?? true });

  const { data, error } = await q;
  if (error) {
    // 'n Leë bladsy met 'n bedienerlog is beter as 'n foutskerm vir die
    // kerkraad. Die leë toestand verduidelik reeds dat daar niks is nie.
    console.error(`[data] ${tabel} laai misluk:`, error.code, error.message);
    return [];
  }
  return (data ?? []) as T[];
}

export const haalLede = () =>
  haal<Lid>(
    "lede",
    "id, first_name, last_name, date_of_birth, geslag, status, tipe, selfoon, epos, wyk_id, family_id, family_role, lid_sedert, aantekeninge, foto",
    { kolom: "last_name" },
  );

export const haalWyke = () =>
  haal<Wyk>("wyke", "id, nommer, naam, ouderling, kapasiteit", {
    kolom: "nommer",
  });

export const haalFamilies = () =>
  haal<Family>("families", "id, naam, adres, stad, wyk_id", { kolom: "naam" });

export const haalGebeurtenisse = () =>
  haal<Gebeurtenis>(
    "events",
    "id, titel, datum, tyd, plek, kategorie, beskrywing",
    { kolom: "datum" },
  );

export const haalDokumente = () =>
  haal<Dokument>(
    "documents",
    "id, titel, beskrywing, sleutel, lêernaam, grootte_grepe, opgelaai",
    { kolom: "titel" },
  );

export const haalRegistrasieRye = () =>
  haal<Registrasie>(
    "pending_registrations",
    "id, first_name, last_name, date_of_birth, geslag, huwelikstatus, selfoon, epos, adres, aantekeninge, status, ontvang",
    { kolom: "ontvang", op: false },
  );

/**
 * Kategesegroepe met hul lede.
 *
 * Die skakeltabel maak dit 'n join; ons plat dit na `lid_ids` af sodat die
 * bestaande komponente onveranderd bly.
 */
export async function haalKategeseGroepe(): Promise<KategeseGroep[]> {
  if (!heltSupabase()) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("kategese_groups")
    .select(
      "id, naam, ouderdomsgroep, onderwyser, lokaal, dag, tyd, kategese_group_lede(lid_id)",
    )
    .order("naam");

  if (error) {
    console.error("[data] kategese laai misluk:", error.code, error.message);
    return [];
  }

  return (data ?? []).map((g) => {
    const { kategese_group_lede, ...res } = g as typeof g & {
      kategese_group_lede: { lid_id: string }[] | null;
    };
    return {
      ...res,
      lid_ids: (kategese_group_lede ?? []).map((k) => k.lid_id),
    } as KategeseGroep;
  });
}
