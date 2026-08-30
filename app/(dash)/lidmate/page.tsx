import type { Metadata } from "next";
import { BladsyKop } from "@/components/kerk/bladsy-kop";
import { LidmaatAksies } from "./lidmaat-aksies";
import { LidmaatLys } from "./lidmaat-lys";
import { LEDE, REGISTRASIES, WYKE } from "@/lib/mock";

export const metadata: Metadata = { title: "Lidmate" };

export default function LidmateBladsy() {
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
