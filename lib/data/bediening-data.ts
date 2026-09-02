import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Afspraak, BedieningAktiwiteit } from "@/lib/tipes/bediening";

/**
 * Die Dominee se bedieningsdata uit Supabase.
 *
 * RLS (migrasie 017) is eienaar-alleen, so hierdie navrae filter nie self op
 * `dominee_id` nie — die databasis doen dit. Dit is die belangrike deel: selfs
 * as hierdie kode 'n fout het, kry niemand iemand anders se pastorale werk nie.
 */

function heltSupabase() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export async function haalAktiwiteite(): Promise<BedieningAktiwiteit[]> {
  if (!heltSupabase()) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bediening_aktiwiteite")
    .select(
      "id, titel, tipe, lidmaat_tipe, datum, begin_tyd, eind_tyd, plek_naam, adres, lid_id, aantekeninge, ure",
    )
    .order("datum", { ascending: false });

  if (error) {
    console.error("[bediening] aktiwiteite:", error.code, error.message);
    return [];
  }
  return (data ?? []) as BedieningAktiwiteit[];
}

export async function haalAfsprake(): Promise<Afspraak[]> {
  if (!heltSupabase()) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("afsprake")
    .select(
      "id, titel, beskrywing, persoon_naam, persoon_selfoon, persoon_epos, lid_id, datum, begin_tyd, eind_tyd, plek_naam, adres, status, herskeduleer_na, aantekeninge",
    )
    .order("datum", { ascending: true });

  if (error) {
    console.error("[bediening] afsprake:", error.code, error.message);
    return [];
  }
  return (data ?? []) as Afspraak[];
}
