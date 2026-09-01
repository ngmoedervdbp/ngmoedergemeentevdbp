import type { Metadata } from "next";
import { BladsyKop } from "@/components/kerk/bladsy-kop";
import { afsprake } from "@/lib/mock/bediening";
import { AfspraakAansig } from "./afspraak-aansig";

export const metadata: Metadata = { title: "Afsprake" };

export default function AfsprakeBladsy() {
  const lys = afsprake();

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
