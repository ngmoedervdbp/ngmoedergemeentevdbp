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

/**
 * `epos` kom saam terug sodat die vorm dit kan herstel ná 'n mislukking.
 * Om die e-pos te laat hertik omdat die WAGWOORD verkeerd was, is bloot
 * irriterend — en op 'n foon is dit die grootste deel van die werk.
 *
 * Die wagwoord kom doelbewus NIE terug nie: dit hoef nie deur die
 * antwoordliggaam te reis nie, en die blaaier se eie wagwoordbestuurder vul
 * dit in elk geval weer in.
 */
export type TekenInUitslag = { fout: string; epos: string } | null;

export async function tekenIn(
  _vorige: TekenInUitslag,
  data: FormData,
): Promise<TekenInUitslag> {
  const epos = String(data.get("epos") ?? "").trim();
  const wagwoord = String(data.get("wagwoord") ?? "");
  const volgende = String(data.get("volgende") ?? "/dashboard");

  if (!epos || !wagwoord) {
    return { fout: "Vul asseblief albei velde in.", epos };
  }

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return {
      fout: "Supabase is nog nie gekoppel nie — hierdie is 'n demo sonder databasis.",
      epos,
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
    return { fout: "Die e-pos of wagwoord is verkeerd.", epos };
  }

  // Slegs plaaslike paaie — 'n oop herleiding laat 'n aanvaller iemand ná
  // aanmelding na sy eie werf stuur.
  const bestemming = volgende.startsWith("/") && !volgende.startsWith("//")
    ? volgende
    : "/dashboard";

  redirect(bestemming);
}

/**
 * Vra 'n wagwoordherstel-skakel aan — die publieke "Wagwoord vergeet?"-vloei.
 *
 * Dit is DOELBEWUS apart van `stuurWagwoordHerstel()` in lib/data/aksies.ts:
 * daardie een is admin-alleen en verg 'n sessie, want dit is vir wanneer
 * iemand die kantoor bel. Hierdie een loop sonder sessie — die persoon kan per
 * definisie nie inteken nie.
 *
 * Die uitslag sê NOOIT of die adres bestaan nie, ook nie by 'n fout nie.
 * Toegang is uitnodiging-alleen, so "daar is 'n rekening vir hierdie adres" is
 * self inligting wat ons nie weggee nie.
 */
export type HerstelUitslag =
  | { ok: true }
  | { ok: false; fout: string; epos: string }
  | null;

export async function vraWagwoordHerstel(
  _vorige: HerstelUitslag,
  data: FormData,
): Promise<HerstelUitslag> {
  const epos = String(data.get("epos") ?? "")
    .trim()
    .toLowerCase();

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(epos)) {
    return { ok: false, fout: "Voer 'n geldige e-posadres in.", epos };
  }

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return {
      ok: false,
      fout: "Supabase is nog nie gekoppel nie — hierdie is 'n demo sonder databasis.",
      epos,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(epos, {
    redirectTo: `${werfURL()}/wagwoord-nuut`,
  });

  // Fout of nie: die antwoord lyk dieselfde. Ons teken dit bedienerkant aan
  // sodat 'n egte probleem (SMTP af, tempo-limiet) nie stilweg verdwyn nie.
  if (error) console.error("[vraWagwoordHerstel]", error.message);

  return { ok: true };
}

/**
 * Die werf se eie URL, vir die skakel in die e-pos.
 *
 * Vercel stel `VERCEL_PROJECT_PRODUCTION_URL` (sonder skema); plaaslik val ons
 * terug op die dev-bediener.
 */
function werfURL() {
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return process.env.NEXT_PUBLIC_WERF_URL ?? "http://localhost:3000";
}
