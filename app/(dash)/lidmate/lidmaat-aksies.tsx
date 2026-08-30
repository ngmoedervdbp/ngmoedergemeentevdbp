"use client";

import { useState } from "react";
import { Download, Upload, UserPlus } from "lucide-react";
import { Knop } from "@/components/ui/basis";
import { LidmaatModaal } from "@/components/modale/lidmaat-modaal";
import { InvoerModaal, UitvoerModaal } from "@/components/modale/algemene-modale";

export function LidmaatAksies({ aantal }: { aantal: number }) {
  const [oop, setOop] = useState<"nuut" | "uitvoer" | "invoer" | null>(null);
  const sluit = () => setOop(null);

  return (
    <>
      <Knop ikoon={Download} grootte="sm" onClick={() => setOop("uitvoer")}>Uitvoer</Knop>
      <Knop ikoon={Upload} grootte="sm" onClick={() => setOop("invoer")}>Excel invoer</Knop>
      <Knop soort="primer" ikoon={UserPlus} grootte="sm" onClick={() => setOop("nuut")}>
        Nuwe lidmaat
      </Knop>

      <LidmaatModaal oop={oop === "nuut"} sluit={sluit} />
      <UitvoerModaal oop={oop === "uitvoer"} sluit={sluit} aantal={aantal} />
      <InvoerModaal oop={oop === "invoer"} sluit={sluit} />
    </>
  );
}
