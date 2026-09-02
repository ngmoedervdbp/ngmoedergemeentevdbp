"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Aanteken.
 *
 * Dit MOET 'n Server Action wees, nie 'n blaaier-oproep nie: die sessiekoekie
 * moet bedienerkant gestel word sodat proxy.ts dit op die volgende versoek
 * sien. 'n Kliëntkant `signInWithPassword` stel die koekie in die blaaier en
 * die proxy weet steeds van niks.
 */

export type TekenInUitslag = { fout: string } | null;

export async function tekenIn(
  _vorige: TekenInUitslag,
  data: FormData,
): Promise<TekenInUitslag> {
  const epos = String(data.get("epos") ?? "").trim();
  const wagwoord = String(data.get("wagwoord") ?? "");
  const volgende = String(data.get("volgende") ?? "/dashboard");

  if (!epos || !wagwoord) {
    return { fout: "Vul asseblief albei velde in." };
  }

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return {
      fout: "Supabase is nog nie gekoppel nie — hierdie is 'n demo sonder databasis.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: epos,
    password: wagwoord,
  });

  if (error) {
    // Doelbewus vaag: moenie verklap of die e-pos bestaan nie. Toegang is
    // uitnodiging-alleen, so wie 'n rekening het, is self inligting.
    return { fout: "Die e-pos of wagwoord is verkeerd." };
  }

  // Slegs plaaslike paaie — 'n oop herleiding laat 'n aanvaller iemand ná
  // aanmelding na sy eie werf stuur.
  const bestemming = volgende.startsWith("/") && !volgende.startsWith("//")
    ? volgende
    : "/dashboard";

  redirect(bestemming);
}
