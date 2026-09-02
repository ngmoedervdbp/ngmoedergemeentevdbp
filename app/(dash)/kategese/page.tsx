import type { Metadata } from "next";
import { BookOpen, CalendarPlus, GraduationCap, TriangleAlert } from "lucide-react";
import { BladsyKop } from "@/components/kerk/bladsy-kop";
import { StatTeel } from "@/components/kerk/stat-teel";
import { KategeseAansig } from "./kategese-aansig";
import { kategeseKinders } from "@/lib/data/afleidings";
import { haalGebeurtenisse, haalKategeseGroepe, haalLede } from "@/lib/data/gemeente-data";

export const metadata: Metadata = { title: "Kategese" };

export const dynamic = "force-dynamic";

export default async function KategeseBladsy() {
  const [GEBEURTENISSE, KATEGESE_GROEPE, LEDE] = await Promise.all([
    haalGebeurtenisse(),
    haalKategeseGroepe(),
    haalLede(),
  ]);

  const { inGroep, sonderGroep, alleKinders } = kategeseKinders(KATEGESE_GROEPE, LEDE);
  const jeugGebeure = GEBEURTENISSE
    .filter((g) => g.kategorie === "jeug")
    .sort((a, b) => a.datum.localeCompare(b.datum));

  return (
    <>
      <BladsyKop titel="Kategese" beskrywing="Sondagskool en kategese-bestuur." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTeel etiket="Kinders" waarde={alleKinders.length} ikoon={GraduationCap} tint="saffier" />
        <StatTeel etiket="Groepe" waarde={KATEGESE_GROEPE.length} ikoon={BookOpen} tint="kobalt" />
        <StatTeel etiket="Aanstaande gebeure" waarde={jeugGebeure.length} ikoon={CalendarPlus} tint="groen" />
        <StatTeel etiket="Sonder groep" waarde={sonderGroep.length} ikoon={TriangleAlert} tint="amber" />
      </div>

      <KategeseAansig
        groepe={KATEGESE_GROEPE}
        inGroep={inGroep}
        sonderGroep={sonderGroep}
        alleKinders={alleKinders}
        gebeure={jeugGebeure}
      />
    </>
  );
}
