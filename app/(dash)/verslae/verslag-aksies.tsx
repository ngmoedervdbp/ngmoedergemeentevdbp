"use client";

import { useState } from "react";
import Link from "next/link";
import { Download, FileText } from "lucide-react";
import { Knop } from "@/components/ui/basis";
import { Modaal } from "@/components/ui/modaal";
import { UitvoerModaal } from "@/components/modale/algemene-modale";
import { LidmaatAvatar } from "@/components/kerk/lidmaat-avatar";
import { ReportExportButton } from "@/components/kerk/report-export";
import { type Lid } from "@/lib/tipes/gemeente";
import { volleNaam } from "@/lib/data/afleidings";

export function VerslagAksies({ aantal }: { aantal: number }) {
  const [oop, setOop] = useState<"uitvoer" | null>(null);
  return (
    <>
      <Knop ikoon={Download} grootte="sm" onClick={() => setOop("uitvoer")}>Uitvoer</Knop>
      <ReportExportButton soort="primer" ikoon={FileText} options={{ formaat: "pdf" }}>
        Volledige lidmateverslag
      </ReportExportButton>
      <UitvoerModaal oop={oop === "uitvoer"} sluit={() => setOop(null)} aantal={aantal} omvang="aktief" />
    </>
  );
}

export function SonderDatumKnop({ lede }: { lede: Lid[] }) {
  const [oop, setOop] = useState(false);
  return (
    <>
      <Knop grootte="sm" onClick={() => setOop(true)}>Wys hulle</Knop>
      <Modaal oop={oop} sluit={() => setOop(false)}
        titel="Lidmate sonder geboortedatum"
        beskrywing="Hulle word uit elke ouderdomsyfer weggelaat — nie as nul getel nie."
        voet={<Knop soort="primer" onClick={() => setOop(false)}>Klaar</Knop>}>
        <ul className="divide-line divide-y">
          {lede.map((l) => (
            <li key={l.id}>
              <Link href={`/lidmate/${l.id}`}
                className="hover:bg-stage/60 -mx-2 flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors">
                <LidmaatAvatar lid={l} grootte="sm" />
                <span className="min-w-0 flex-1 truncate text-sm font-medium">{volleNaam(l)}</span>
                <span className="text-ink-muted text-xs">Voeg datum by</span>
              </Link>
            </li>
          ))}
        </ul>
        {lede.length === 0 ? (
          <p className="text-ink-muted py-4 text-center text-sm">
            Elke aktiewe lidmaat het &apos;n geboortedatum.
          </p>
        ) : null}
      </Modaal>
    </>
  );
}
