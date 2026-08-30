"use client";
import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { Knop } from "@/components/ui/basis";
import { BevestigModaal } from "@/components/modale/algemene-modale";
import { DEMO, useMelding } from "@/components/ui/melding";
import { volleNaam, type Lid } from "@/lib/mock";

export function HeraktiveerKnop({ lid }: { lid: Lid }) {
  const [oop, setOop] = useState(false);
  const { wys } = useMelding();
  const naam = volleNaam(lid);

  return (
    <>
      <Knop grootte="sm" ikoon={RotateCcw} onClick={() => setOop(true)}>Heraktiveer</Knop>
      <BevestigModaal
        oop={oop} sluit={() => setOop(false)}
        titel="Heraktiveer lidmaat"
        beskrywing={<><strong className="text-ink font-semibold">{naam}</strong> word weer aktief en tel voortaan mee in verslae, statistieke en wyktellings.</>}
        bevestigEtiket="Heraktiveer"
        opBevestig={() => wys(DEMO(`${naam} heraktiveer`))}
      />
    </>
  );
}
