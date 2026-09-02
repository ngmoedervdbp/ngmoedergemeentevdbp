"use client";
import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { Knop } from "@/components/ui/basis";
import { BevestigModaal } from "@/components/modale/algemene-modale";
import { useMelding } from "@/components/ui/melding";
import { volleNaam } from "@/lib/data/afleidings";
import type { Lid } from "@/lib/tipes/gemeente";
import { stelLidmaatStatus } from "@/lib/data/aksies";

export function HeraktiveerKnop({ lid }: { lid: Lid }) {
  const [oop, setOop] = useState(false);
  const [besig, setBesig] = useState(false);
  const { wys } = useMelding();
  const naam = volleNaam(lid);

  async function heraktiveer() {
    setBesig(true);
    const uitslag = await stelLidmaatStatus(lid.id, "aktief");
    setBesig(false);
    wys(uitslag.ok ? `${naam} is heraktiveer.` : uitslag.fout, uitslag.ok ? undefined : "fout");
  }

  return (
    <>
      <Knop
        grootte="sm"
        ikoon={RotateCcw}
        disabled={besig}
        onClick={() => setOop(true)}
      >
        Heraktiveer
      </Knop>
      <BevestigModaal
        oop={oop} sluit={() => setOop(false)}
        titel="Heraktiveer lidmaat"
        beskrywing={<><strong className="text-ink font-semibold">{naam}</strong> word weer aktief en tel voortaan mee in verslae, statistieke en wyktellings.</>}
        bevestigEtiket="Heraktiveer"
        opBevestig={heraktiveer}
      />
    </>
  );
}
