import type { Metadata } from "next";
import { BladsyKop } from "@/components/kerk/bladsy-kop";
import { KommunikasiePaneel } from "./kommunikasie-paneel";
import { aktieweLede } from "@/lib/data/afleidings";
import { haalLede } from "@/lib/data/gemeente-data";

export const metadata: Metadata = { title: "Kommunikasie" };

export const dynamic = "force-dynamic";

export default async function KommunikasieBladsy() {
  return (
    <>
      <BladsyKop titel="Kommunikasie" beskrywing="Kontak lidmate via e-pos en WhatsApp." />
      <KommunikasiePaneel lede={aktieweLede(await haalLede())} />
    </>
  );
}
