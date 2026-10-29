"use client";

import { useState } from "react";
import { Copy, ExternalLink, RotateCcw } from "lucide-react";
import { Knop, Paneel, PaneelKop } from "@/components/ui/basis";
import { Modaal } from "@/components/ui/modaal";
import { Kies, Veld } from "@/components/ui/vorm";
import { useMelding } from "@/components/ui/melding";
import { maakSpeelruimteLeeg, speelAsRol } from "@/lib/data/demo-aksies";
import type { Rol } from "@/lib/sessie";

/**
 * Die toetser se beheerpaneel — slegs in die demo (sien lib/demo.ts).
 *
 * Elke toetser het 'n eie, leë speelruimte. Hier wissel hy sy rol om te sien
 * wat 'n ouderling of skriba sien, kry sy persoonlike registrasieskakel, en
 * begin van voor af.
 */
export function DemoPaneel({
  myId,
  rol,
  rolEtikette,
}: {
  myId: string;
  rol: Rol;
  /** Van die bladsy af — lib/sessie trek die bedienerkliënt in. */
  rolEtikette: Record<Rol, string>;
}) {
  const { wys } = useMelding();
  const [besig, setBesig] = useState(false);
  const [bevestig, setBevestig] = useState(false);

  // Die publieke vorm het geen sessie nie, so die skakel dra die speelruimte.
  const registrasiePad = `/registreer?s=${myId}`;

  async function wissel(nuut: string) {
    setBesig(true);
    const uitslag = await speelAsRol(nuut);
    setBesig(false);
    wys(
      uitslag.ok
        ? `Jy speel nou as ${rolEtikette[nuut as Rol].toLowerCase()}.`
        : uitslag.fout,
      uitslag.ok ? undefined : "fout",
    );
  }

  async function kopieer() {
    try {
      await navigator.clipboard.writeText(window.location.origin + registrasiePad);
      wys("Skakel gekopieer.");
    } catch {
      wys("Kon nie kopieer nie — kies die skakel en kopieer dit self.", "fout");
    }
  }

  async function maakLeeg() {
    setBesig(true);
    const uitslag = await maakSpeelruimteLeeg();
    setBesig(false);
    setBevestig(false);
    wys(
      uitslag.ok ? "Jou speelruimte is leeg. Jy is weer admin." : uitslag.fout,
      uitslag.ok ? undefined : "fout",
    );
  }

  return (
    <Paneel className="mb-5">
      <PaneelKop
        titel="Demo-speelruimte"
        byskrif="Alles hier is joune alleen — ander toetsers sien niks daarvan nie"
      />
      <div className="grid gap-5 px-4 py-4 sm:px-5 lg:grid-cols-3">
        <Veld
          etiket="Speel as"
          hulp="Wissel om te sien wat elke rol mag sien en verander."
        >
          <Kies value={rol} disabled={besig} onChange={(e) => wissel(e.target.value)}>
            {(Object.keys(rolEtikette) as Rol[]).map((r) => (
              <option key={r} value={r}>
                {rolEtikette[r]}
              </option>
            ))}
          </Kies>
        </Veld>

        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold">Jou registrasieskakel</p>
          <p className="text-ink-muted text-xs text-pretty">
            Registrasies via hierdie skakel beland in jóú tou onder Lidmate.
          </p>
          <div className="flex flex-wrap gap-2">
            <Knop grootte="sm" ikoon={Copy} onClick={kopieer}>Kopieer</Knop>
            <Knop grootte="sm" ikoon={ExternalLink}
              onClick={() => window.open(registrasiePad, "_blank")}>Open</Knop>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold">Begin van voor af</p>
          <p className="text-ink-muted text-xs text-pretty">
            Vee al jou toetsdata uit en maak jou weer admin.
          </p>
          <Knop grootte="sm" soort="gevaar" ikoon={RotateCcw} className="self-start"
            disabled={besig} onClick={() => setBevestig(true)}>
            Maak my speelruimte leeg
          </Knop>
        </div>
      </div>

      <Modaal
        oop={bevestig}
        sluit={() => setBevestig(false)}
        titel="Maak jou speelruimte leeg?"
        breedte="sm"
        voet={
          <>
            <Knop soort="stil" onClick={() => setBevestig(false)}>Kanselleer</Knop>
            <Knop soort="gevaar" ikoon={RotateCcw} disabled={besig} onClick={maakLeeg}>
              {besig ? "Vee tans uit…" : "Ja, maak leeg"}
            </Knop>
          </>
        }
      >
        <p className="text-sm text-pretty">
          Al jou lidmate, gesinne, wyke, gebeurtenisse en bedieningsrekords word
          uitgevee. Ander toetsers se data bly onaangeraak.
        </p>
      </Modaal>
    </Paneel>
  );
}
