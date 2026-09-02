import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Rol } from "@/lib/sessie";

/**
 * Die kerkraad se gebruikers, uit `profiles`.
 *
 * RLS (migrasie 011) laat 'n aangetekende gebruiker sy eie profiel lees en 'n
 * admin almal s'n. 'n Nie-admin sien dus net homself in hierdie lys, en dit is
 * die bedoeling — die databasis besluit, nie hierdie kode nie.
 */

export type KerkraadLid = {
  id: string;
  naam: string;
  epos: string;
  rol: Rol;
};

export async function haalKerkraad(): Promise<KerkraadLid[]> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return [];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, first_name, last_name, epos, rol")
    .order("rol")
    .order("last_name");

  if (error) {
    console.error("[gebruikers] laai misluk:", error.code, error.message);
    return [];
  }

  return (data ?? []).map((p) => ({
    id: p.id,
    naam:
      [p.first_name, p.last_name].filter(Boolean).join(" ") ||
      (p.epos ?? "Naamloos"),
    epos: p.epos ?? "",
    rol: p.rol as Rol,
  }));
}
