import type { Metadata } from "next";
import { BladsyKop } from "@/components/kerk/bladsy-kop";
import { InstellingsOortjies } from "./instellings-oortjies";
import { haalKerkraad } from "@/lib/data/gebruikers";
import { huidigeGebruiker, ROL_ETIKET } from "@/lib/sessie";
import { IS_DEMO } from "@/lib/demo";
import { DemoPaneel } from "./demo-paneel";

export const metadata: Metadata = { title: "Instellings" };

export const dynamic = "force-dynamic";

export default async function InstellingsBladsy() {
  const [kerkraad, ek] = await Promise.all([
    haalKerkraad(),
    huidigeGebruiker(),
  ]);

  return (
    <>
      <BladsyKop titel="Instellings" beskrywing="Bestuur kerkinstellings en konfigurasie." />
      {IS_DEMO && ek ? <DemoPaneel myId={ek.id} rol={ek.rol} rolEtikette={ROL_ETIKET} /> : null}
      <InstellingsOortjies
        kerkraad={kerkraad}
        // In die demo is almal admin van net hul eie speelruimte. Uitnodigings
        // en wagwoordherstel hoort nie daar nie — gebruikers word in die
        // Supabase-paneel geskep.
        isAdmin={ek?.rol === "admin" && !IS_DEMO}
        myId={ek?.id ?? ""}
      />
    </>
  );
}
