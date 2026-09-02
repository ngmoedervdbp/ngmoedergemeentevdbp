"use client";

import { useState } from "react";
import { NotebookPen, Pencil } from "lucide-react";
import { Knop } from "@/components/ui/basis";
import { Modaal } from "@/components/ui/modaal";
import { Teksarea, Veld } from "@/components/ui/vorm";
import { useMelding } from "@/components/ui/melding";
import { stoorAantekening } from "@/lib/data/aksies";
import { LidmaatModaal } from "@/components/modale/lidmaat-modaal";
import { type Lid } from "@/lib/tipes/gemeente";
import { volleNaam } from "@/lib/data/afleidings";

export function WysigKnop({ lid }: { lid: Lid }) {
  const [oop, setOop] = useState(false);
  return (
    <>
      <Knop ikoon={Pencil} grootte="sm" onClick={() => setOop(true)}>Wysig</Knop>
      <LidmaatModaal oop={oop} sluit={() => setOop(false)} lid={lid} />
    </>
  );
}

export function AantekeningKnop({ lid }: { lid: Lid }) {
  const [oop, setOop] = useState(false);
  const [teks, setTeks] = useState("");
  const { wys } = useMelding();

  const [besig, setBesig] = useState(false);

  async function stoor(e: React.FormEvent) {
    e.preventDefault();
    if (!teks.trim()) return;
    setBesig(true);
    const uitslag = await stoorAantekening(lid.id, teks);
    setBesig(false);
    if (!uitslag.ok) {
      wys(uitslag.fout, "fout");
      return;
    }
    wys("Aantekening gestoor.");
    setTeks("");
    setOop(false);
  }

  return (
    <>
      <Knop grootte="sm" ikoon={NotebookPen} onClick={() => setOop(true)}>
        Voeg aantekening by
      </Knop>

      <Modaal
        oop={oop}
        sluit={() => setOop(false)}
        titel="Nuwe aantekening"
        beskrywing={`Pastorale nota oor ${volleNaam(lid)}.`}
        voet={
          <>
            <Knop soort="stil" onClick={() => setOop(false)}>Kanselleer</Knop>
            <Knop type="submit" form="nota-vorm" soort="primer" disabled={besig || !teks.trim()}>
              Stoor aantekening
            </Knop>
          </>
        }
      >
        <form id="nota-vorm" onSubmit={stoor} className="flex flex-col gap-4">
          <Veld etiket="Aantekening" verpligtend
            hulp="POPIA-sensitief. Hou dit feitelik — hierdie is 'n gemeenterekord, nie 'n dagboek nie.">
            <Teksarea rows={5} value={teks} onChange={(e) => setTeks(e.target.value)}
              placeholder="Huisbesoek gedoen op…" />
          </Veld>
        </form>
      </Modaal>
    </>
  );
}
