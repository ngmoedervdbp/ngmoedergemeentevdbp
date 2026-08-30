import type { Metadata } from "next";
import { MapPinned, TriangleAlert, UserRound } from "lucide-react";
import { BladsyKop } from "@/components/kerk/bladsy-kop";
import { StatTeel } from "@/components/kerk/stat-teel";
import { WykAansig } from "./wyk-aansig";
import { aktieweLede, ledeInWyk, wykTellings } from "@/lib/mock";

export const metadata: Metadata = { title: "Wyke" };

export default function WykeBladsy() {
  const wyke = wykTellings().map((w) => ({ ...w, lede: ledeInWyk(w.id) }));
  const toegeken = aktieweLede().filter((l) => l.wyk_id).length;
  const nieToegeken = aktieweLede().length - toegeken;

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
