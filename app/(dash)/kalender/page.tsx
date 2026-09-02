import type { Metadata } from "next";
import { BladsyKop } from "@/components/kerk/bladsy-kop";
import { KalenderAksies } from "./kalender-aksies";
import { KalenderAansig } from "./kalender-aansig";
import { haalGebeurtenisse } from "@/lib/data/gemeente-data";

export const metadata: Metadata = { title: "Kalender" };

export const dynamic = "force-dynamic";

export default async function KalenderBladsy() {
  const [GEBEURTENISSE] = await Promise.all([
    haalGebeurtenisse(),
  ]);

  return (
    <>
      <BladsyKop titel="Kalender" beskrywing="Bestuur kerkgebeurtenisse en aktiwiteite."
        aksies={<KalenderAksies />} />
      <KalenderAansig gebeurtenisse={GEBEURTENISSE} />
    </>
  );
}
