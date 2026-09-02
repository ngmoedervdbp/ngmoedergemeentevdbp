import type { Metadata } from "next";
import { MapPinned, TriangleAlert, UserRound } from "lucide-react";
import { BladsyKop } from "@/components/kerk/bladsy-kop";
import { StatTeel } from "@/components/kerk/stat-teel";
import { WykAansig } from "./wyk-aansig";
import { aktieweLede, ledeInWyk, wykTellings } from "@/lib/data/afleidings";
import { haalLede, haalWyke } from "@/lib/data/gemeente-data";

export const metadata: Metadata = { title: "Wyke" };

export const dynamic = "force-dynamic";

export default async function WykeBladsy() {
  const [LEDE, WYKE] = await Promise.all([
    haalLede(),
    haalWyke(),
  ]);

  const wyke = wykTellings(WYKE, LEDE).map((w) => ({ ...w, lede: ledeInWyk(LEDE, w.id) }));
  const toegeken = aktieweLede(LEDE).filter((l) => l.wyk_id).length;
  const nieToegeken = aktieweLede(LEDE).length - toegeken;

  return (
    <>
      <BladsyKop titel="Wyke" beskrywing="Bestuur gemeentewyke en lidmaat-indeling." />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatTeel etiket="Wyke" waarde={wyke.length} ikoon={MapPinned} tint="saffier" />
        <StatTeel etiket="Toegeken aan wyk" waarde={toegeken} ikoon={UserRound} tint="groen" />
        <StatTeel etiket="Nie toegeken nie" waarde={nieToegeken} ikoon={TriangleAlert} tint="amber" />
      </div>

      <WykAansig wyke={wyke} />
    </>
  );
}
