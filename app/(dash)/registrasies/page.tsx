import type { Metadata } from "next";
import { ClipboardList, Clock, UserCheck, UserX } from "lucide-react";
import { BladsyKop } from "@/components/kerk/bladsy-kop";
import { StatTeel } from "@/components/kerk/stat-teel";
import { haalRegistrasies } from "@/lib/registrasies";
import { RegistrasieLys } from "./registrasie-lys";

export const metadata: Metadata = { title: "Registrasies" };

/**
 * Die moderasietou — wie het hul besonderhede op die publieke werf gelos.
 *
 * Dit is die kerkraad se kant van `pending_registrations` (migrasie 009). Die
 * publiek mag daar INSERT en niks anders nie; hierdie bladsy is die enigste
 * plek waar dit gelees word.
 */
/**
 * Dinamies: die tou verander sodra iemand die vorm indien, so 'n geprerenderde
 * kopie sou verouderd wees die oomblik dit gebou is.
 */
export const dynamic = "force-dynamic";

export default async function RegistrasiesBladsy() {
  const { registrasies: alles, bron } = await haalRegistrasies();

  const wagtend = alles.filter((r) => r.status === "wagtend");
  const goedgekeur = alles.filter((r) => r.status === "goedgekeur");
  const afgekeur = alles.filter((r) => r.status === "afgekeur");

  return (
    <>
      <BladsyKop
        titel="Registrasies"
        beskrywing="Mense wat hul besonderhede op die webwerf gelos het. Tree met hulle in verbinding en keur hulle dan goed."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTeel
          etiket="Wag op kontak"
          waarde={wagtend.length}
          ikoon={Clock}
          tint="amber"
        />
        <StatTeel
          etiket="Goedgekeur"
          waarde={goedgekeur.length}
          ikoon={UserCheck}
          tint="groen"
        />
        <StatTeel
          etiket="Afgekeur"
          waarde={afgekeur.length}
          ikoon={UserX}
          tint="wyn"
        />
        <StatTeel
          etiket="Altesaam"
          waarde={alles.length}
          ikoon={ClipboardList}
          tint="saffier"
        />
      </div>

      {bron === "spotdata" ? (
        <p className="border-line bg-was-amber/40 text-ink-muted rounded-lg border px-3.5 py-2.5 text-sm">
          Supabase is nog nie gekoppel nie — dit is spotdata. Sodra die
          sleutels gestel is, kom hierdie lys uit die databasis.
        </p>
      ) : null}

      <RegistrasieLys registrasies={alles} />
    </>
  );
}
