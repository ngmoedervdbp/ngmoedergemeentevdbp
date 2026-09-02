import type { Metadata } from "next";
import { BladsyKop } from "@/components/kerk/bladsy-kop";
import { InstellingsOortjies } from "./instellings-oortjies";
import { haalKerkraad } from "@/lib/data/gebruikers";
import { huidigeGebruiker } from "@/lib/sessie";

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
      <InstellingsOortjies
        kerkraad={kerkraad}
        isAdmin={ek?.rol === "admin"}
        myId={ek?.id ?? ""}
      />
    </>
  );
}
