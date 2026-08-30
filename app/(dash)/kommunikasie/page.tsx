import type { Metadata } from "next";
import { BladsyKop } from "@/components/kerk/bladsy-kop";
import { KommunikasiePaneel } from "./kommunikasie-paneel";
import { aktieweLede } from "@/lib/mock";

export const metadata: Metadata = { title: "Kommunikasie" };

export default function KommunikasieBladsy() {
  return (
    <>
      <BladsyKop titel="Kommunikasie" beskrywing="Kontak lidmate via e-pos en WhatsApp." />
      <KommunikasiePaneel lede={aktieweLede()} />
    </>
  );
}
