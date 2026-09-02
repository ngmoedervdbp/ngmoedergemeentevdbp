"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { leesVorm } from "@/lib/registrasie-skema";
import { klientIP, tempoKontrole } from "@/lib/tempo";

/**
 * Die app se enigste publieke skryfaksie.
 *
 * Volgorde is doelbewus: heuningpot → tempo → validering → invoeg. Elke stap
 * is goedkoper as die volgende, so 'n bot betaal so min moontlik van ons
 * hulpbronne.
 *
 * Dit lees NOOIT data terug nie. Die `insert` het geen `.select()` nie — dit
 * is nie 'n optimalisasie nie, dit is die punt: die publieke rol mag nie
 * SELECT op hierdie tabel doen nie (sien migrasie 011), en 'n select-terug
 * sou die skryf laat misluk.
 */

export type RegistrasieUitslag =
  | { ok: true }
  | { ok: false; boodskap: string; velde?: Record<string, string> };

export async function stuurRegistrasie(
  _vorige: RegistrasieUitslag | null,
  data: FormData,
): Promise<RegistrasieUitslag> {
  // 1. Heuningpot. 'n Mens sien hierdie veld nooit; 'n bot vul dit in.
  //    Ons gee `ok` terug sodat die bot dink dit het gewerk en nie weer probeer
  //    nie.
  if (data.get("webwerf")) {
    return { ok: true };
  }

  // 2. Tempo, per IP.
  const koppe = await headers();
  const tempo = tempoKontrole(`registreer:${klientIP(koppe)}`);
  if (!tempo.toegelaat) {
    const minute = Math.ceil(tempo.wagSekondes / 60);
    return {
      ok: false,
      boodskap: `Jy het reeds 'n paar keer ingedien. Probeer weer oor ${minute} ${
        minute === 1 ? "minuut" : "minute"
      }.`,
    };
  }

  // 3. Validering. Die blaaier se `required` is gerief; dit is die hek.
  const uitslag = leesVorm(data);
  if (!uitslag.success) {
    const velde: Record<string, string> = {};
    for (const kwessie of uitslag.error.issues) {
      const veld = kwessie.path[0];
      if (typeof veld === "string" && !velde[veld]) {
        velde[veld] = kwessie.message;
      }
    }
    return {
      ok: false,
      boodskap: "Kyk asseblief die gemerkte velde na.",
      velde,
    };
  }

  // 4. Invoeg.
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("pending_registrations")
      .insert(uitslag.data);

    if (error) {
      // Moenie die databasisfout deurgee nie — dit kan die skema verklap.
      // Log dit bedienerkant sonder die indiener se PII.
      console.error("[registreer] invoeg misluk:", error.code, error.message);
      return {
        ok: false,
        boodskap:
          "Ons kon dit nie stoor nie. Probeer asseblief weer, of skakel die kerkkantoor.",
      };
    }
  } catch (fout) {
    console.error("[registreer] onverwagte fout:", fout);
    return {
      ok: false,
      boodskap:
        "Ons kon dit nie stoor nie. Probeer asseblief weer, of skakel die kerkkantoor.",
    };
  }

  return { ok: true };
}
