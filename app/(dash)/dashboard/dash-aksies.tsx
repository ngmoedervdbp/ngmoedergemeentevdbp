"use client";
import { useState } from "react";
import { FileText, UserPlus } from "lucide-react";
import { Knop } from "@/components/ui/basis";
import { LidmaatModaal } from "@/components/modale/lidmaat-modaal";
import { DEMO, useMelding } from "@/components/ui/melding";

export function DashAksies() {
  const [oop, setOop] = useState(false);
  const { wys } = useMelding();
  return (
    <>
      <Knop ikoon={UserPlus} grootte="sm" onClick={() => setOop(true)}>Voeg lidmaat by</Knop>
      <Knop soort="primer" ikoon={FileText} grootte="sm"
        onClick={() => wys(DEMO("PDF-verslag sou gegenereer word"), "info")}>
        Lidmateverslag
      </Knop>
      <LidmaatModaal oop={oop} sluit={() => setOop(false)} />
    </>
  );
}
