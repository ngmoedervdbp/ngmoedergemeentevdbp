import type { Metadata } from "next";
import { BladsyKop } from "@/components/kerk/bladsy-kop";
import { SoekPaneel } from "./soek-paneel";
import { LEDE, WYKE } from "@/lib/mock";

export const metadata: Metadata = { title: "Soek & Filter" };

export default function SoekBladsy() {
  return (
    <>
      <BladsyKop titel="Soek & Filter" beskrywing="Gevorderde soek en filter vir lidmate." />
      <SoekPaneel lede={LEDE} wyke={WYKE} />
    </>
  );
}
