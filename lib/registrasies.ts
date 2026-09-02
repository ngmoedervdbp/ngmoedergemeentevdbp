import { createClient } from "@/lib/supabase/server";
import type { Registrasie } from "@/lib/tipes/gemeente";

/**
 * Registrasies vir die kerkraad se moderasietou.
 *
 * Die publiek mag in hierdie tabel INSERT en niks anders nie (migrasie 011);
 * hierdie is die enigste plek waar dit gelees word.
 *
 * Terwyl daar geen Supabase-sleutels is nie, val dit terug op die spotdata
 * sodat die bladsy op 'n demo-ontplooiing steeds iets wys. Sodra die sleutels
 * daar is, kom die data uit die databasis en die spotdata word nooit weer
 * aangeraak nie. Verwyder die terugval sodra `lib/mock/` weg is.
 */

function heltSupabase() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export type RegistrasieBron = "supabase" | "spotdata";

export async function haalRegistrasies(): Promise<{
  registrasies: Registrasie[];
  bron: RegistrasieBron;
}> {
  // Geen terugval na spotdata meer nie: elke ander bladsy lees nou uit
  // Supabase, en 'n enkele bladsy met versinde rye is meer verwarrend as 'n
  // leë lys.
  if (!heltSupabase()) {
    return { registrasies: [], bron: "spotdata" };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pending_registrations")
    .select(
      "id, first_name, last_name, date_of_birth, geslag, huwelikstatus, selfoon, epos, adres, aantekeninge, status, ontvang",
    )
    .order("ontvang", { ascending: false });

  if (error) {
    // Moenie die bladsy laat val nie — 'n leë lys met 'n bedienerlog is beter
    // as 'n foutskerm vir die kerkraad.
    console.error("[registrasies] laai misluk:", error.code, error.message);
    return { registrasies: [], bron: "supabase" };
  }

  return { registrasies: (data ?? []) as Registrasie[], bron: "supabase" };
}
