import type { Metadata } from "next";
import { BladsyKop } from "@/components/kerk/bladsy-kop";
import { KalenderAksies } from "./kalender-aksies";
import { KalenderAansig } from "./kalender-aansig";
import { GEBEURTENISSE } from "@/lib/mock";

export const metadata: Metadata = { title: "Kalender" };

export default function KalenderBladsy() {
  return (
    <>
      <BladsyKop titel="Kalender" beskrywing="Bestuur kerkgebeurtenisse en aktiwiteite."
        aksies={<KalenderAksies />} />
      <KalenderAansig gebeurtenisse={GEBEURTENISSE} />
    </>
  );
}
