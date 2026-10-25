"use client";
import { useState } from "react";
import { FileText, UserPlus } from "lucide-react";
import { Knop } from "@/components/ui/basis";
import { LidmaatModaal } from "@/components/modale/lidmaat-modaal";
import { ReportExportButton } from "@/components/kerk/report-export";

export function DashAksies() {
  const [oop, setOop] = useState(false);
  return (
    <>
      <Knop ikoon={UserPlus} grootte="sm" onClick={() => setOop(true)}>Voeg lidmaat by</Knop>
      <ReportExportButton soort="primer" ikoon={FileText} options={{ formaat: "pdf" }}>
        Lidmateverslag
      </ReportExportButton>
      <LidmaatModaal oop={oop} sluit={() => setOop(false)} />
    </>
  );
}
