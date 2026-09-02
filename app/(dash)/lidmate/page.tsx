import type { Metadata } from "next";
import { BladsyKop } from "@/components/kerk/bladsy-kop";
import { LidmaatAksies } from "./lidmaat-aksies";
import { LidmaatLys } from "./lidmaat-lys";
import { haalLede, haalRegistrasieRye, haalWyke } from "@/lib/data/gemeente-data";

export const metadata: Metadata = { title: "Lidmate" };

export const dynamic = "force-dynamic";

export default async function LidmateBladsy() {
  const [LEDE, REGISTRASIES, WYKE] = await Promise.all([
    haalLede(),
    haalRegistrasieRye(),
    haalWyke(),
  ]);

  return (
    <>
      <BladsyKop
        titel="Lidmate"
        beskrywing={`${LEDE.length} lidmate in die register.`}
        aksies={<LidmaatAksies aantal={LEDE.length} />}
      />
      <LidmaatLys lede={LEDE} wyke={WYKE} registrasies={REGISTRASIES} />
    </>
  );
}
