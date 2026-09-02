import type { Metadata } from "next";
import { BladsyKop } from "@/components/kerk/bladsy-kop";
import { SoekPaneel } from "./soek-paneel";
import { haalLede, haalWyke } from "@/lib/data/gemeente-data";

export const metadata: Metadata = { title: "Soek & Filter" };

export const dynamic = "force-dynamic";

export default async function SoekBladsy() {
  const [LEDE, WYKE] = await Promise.all([
    haalLede(),
    haalWyke(),
  ]);

  return (
    <>
      <BladsyKop titel="Soek & Filter" beskrywing="Gevorderde soek en filter vir lidmate." />
      <SoekPaneel lede={LEDE} wyke={WYKE} />
    </>
  );
}
