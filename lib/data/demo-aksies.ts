"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { IS_DEMO } from "@/lib/demo";
import { huidigeGebruiker, ROL_ETIKET, type Rol } from "@/lib/sessie";
import type { AksieUitslag } from "@/lib/data/aksies";

/**
 * Aksies wat net in die demo bestaan.
 *
 * Elke aksie weier buite die demo, selfs al roep iemand dit direk aan. Op
 * produksie sou die databasis dit in elk geval keer — `bewaak_profiel()` in
 * migrasie 022 weier 'n eie rolverandering, en `maak_speelruimte_leeg()`
 * bestaan daar nie — maar 'n duidelike nee hier is beter.
 */

const NIE_DEMO: AksieUitslag = {
  ok: false,
  fout: "Dit is net in die demo beskikbaar.",
};

/** "Speel as" — wissel jou eie rol in jou eie speelruimte. */
export async function speelAsRol(rol: string): Promise<AksieUitslag> {
  if (!IS_DEMO) return NIE_DEMO;

  const gebruiker = await huidigeGebruiker();
  if (!gebruiker) {
    return { ok: false, fout: "Jou sessie het verval. Teken asseblief weer in." };
  }
  if (!(rol in ROL_ETIKET)) return { ok: false, fout: "Onbekende rol." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ rol: rol as Rol })
    .eq("id", gebruiker.id);

  if (error) {
    console.error("[speelAsRol]", error.code, error.message);
    return { ok: false, fout: "Kon nie die rol wissel nie. Probeer weer." };
  }

  // Die rol verander die navigasie in die uitleg, nie net hierdie bladsy nie.
  revalidatePath("/", "layout");
  return { ok: true };
}

/** Vee alles in jou speelruimte uit en maak jou weer admin. */
export async function maakSpeelruimteLeeg(): Promise<AksieUitslag> {
  if (!IS_DEMO) return NIE_DEMO;

  const gebruiker = await huidigeGebruiker();
  if (!gebruiker) {
    return { ok: false, fout: "Jou sessie het verval. Teken asseblief weer in." };
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("maak_speelruimte_leeg");

  if (error) {
    console.error("[maakSpeelruimteLeeg]", error.code, error.message);
    return { ok: false, fout: "Kon nie die speelruimte leegmaak nie. Probeer weer." };
  }

  revalidatePath("/", "layout");
  return { ok: true };
}
