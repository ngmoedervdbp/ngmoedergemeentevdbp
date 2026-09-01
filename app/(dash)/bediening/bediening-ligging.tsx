"use client";

import { useState } from "react";
import { Crosshair, Info, MapPin } from "lucide-react";
import { Knop, Leeg, Paneel, PaneelKop } from "@/components/ui/basis";
import { DEMO, useMelding } from "@/components/ui/melding";

/**
 * Ligging-opsporing.
 *
 * Die Base44-demo se skakelaar sê net "Outomaties elke 5 minute naspoor". Ons
 * sê ook wat dit beteken: dit is deurlopende naspeuring van 'n persoon, en
 * onder POPIA verg dit uitdruklike, ingeligte toestemming — nie 'n skakelaar
 * wat iemand per ongeluk raakvat nie.
 *
 * Daarom: die skakelaar is af by verstek, die teks verduidelik die gevolg
 * voordat dit aangeskakel word, en die bewaartermyn word hier gesê in plaas
 * daarvan om in 'n migrasie weggesteek te wees.
 */
export function BedieningLigging() {
  const [outomaties, setOutomaties] = useState(false);
  const { wys } = useMelding();

  function wissel() {
    const nuut = !outomaties;
    setOutomaties(nuut);
    wys(
      DEMO(
        nuut
          ? "Outomatiese naspeuring aangeskakel"
          : "Outomatiese naspeuring afgeskakel",
      ),
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Paneel>
        <PaneelKop titel="Ligging-opsporing" />

        <div className="flex flex-col gap-4 p-4 sm:p-5">
          <div className="border-line flex flex-wrap items-center justify-between gap-3 rounded-xl border p-3.5">
            <div className="flex min-w-0 flex-col gap-0.5">
              <span className="font-semibold">Outomaties elke 5 minute naspoor</span>
              <span className="text-ink-muted text-sm text-pretty">
                Teken jou ligging deurlopend aan terwyl jy op pad is.
              </span>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={outomaties}
              onClick={wissel}
              aria-label="Outomatiese ligging-naspeuring"
              className={`focus-visible:outline-accent relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${
                outomaties ? "bg-brand" : "bg-stage ring-line ring-1 ring-inset"
              }`}
            >
              <span
                className={`bg-surface size-5 rounded-full shadow-sm transition-transform ${
                  outomaties ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Die eerlike weergawe van wat die skakelaar doen. */}
          <div className="border-line bg-was-amber/40 flex gap-3 rounded-xl border p-3.5">
            <Info size={18} className="text-glas-amber mt-0.5 shrink-0" aria-hidden />
            <div className="flex min-w-0 flex-col gap-1 text-sm">
              <p className="font-semibold">Wat hiermee gebeur</p>
              <p className="text-ink-muted text-pretty">
                Liggings is net vir jou sigbaar — nie vir die kerkraad of &apos;n
                admin nie. Aantekeninge word na 90 dae outomaties uitgevee, en
                jy kan naspeuring enige tyd afskakel.
              </p>
            </div>
          </div>

          <Knop
            soort="sekonder"
            ikoon={Crosshair}
            onClick={() => wys(DEMO("Ligging aangeteken"))}
            className="w-full sm:w-auto"
          >
            Teken huidige ligging aan
          </Knop>
        </div>
      </Paneel>

      <Paneel>
        <PaneelKop titel="Onlangse ligging-aantekeninge" />
        <Leeg
          ikoon={MapPin}
          titel="Nog geen liggings nie"
          beskrywing="Teken 'n ligging aan wanneer jy by 'n besoek opdaag, of skakel outomatiese naspeuring aan."
        />
      </Paneel>
    </div>
  );
}
