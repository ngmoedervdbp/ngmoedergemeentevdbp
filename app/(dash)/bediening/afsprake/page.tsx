import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BladsyKop } from "@/components/kerk/bladsy-kop";
import { haalAfsprake } from "@/lib/data/bediening-data";
import { huidigeGebruiker, magBediening } from "@/lib/sessie";
import { AfspraakAansig } from "./afspraak-aansig";

export const metadata: Metadata = { title: "Afsprake" };

export default async function AfsprakeBladsy() {
  // Sien die kommentaar in ../page.tsx — die hek moet per bladsy staan.
  if (!magBediening(await huidigeGebruiker())) notFound();

  const lys = await haalAfsprake();

  return (
    <>
      <BladsyKop
        titel="Afsprake"
        beskrywing={
          lys.length === 1 ? "1 afspraak." : `${lys.length} afsprake in totaal.`
        }
      />
      <AfspraakAansig afsprake={lys} />
    </>
  );
}
