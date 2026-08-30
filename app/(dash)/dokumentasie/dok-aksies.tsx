"use client";

import { useState } from "react";
import { Download, Plus, Upload } from "lucide-react";
import { Knop } from "@/components/ui/basis";
import { Modaal } from "@/components/ui/modaal";
import { Invoer, Teksarea, Veld } from "@/components/ui/vorm";
import { DEMO, useMelding } from "@/components/ui/melding";
import { OplaaiModaal } from "@/components/modale/algemene-modale";

export function OplaaiKnop({ titel, vervang }: { titel: string; vervang?: boolean }) {
  const [oop, setOop] = useState(false);
  return (
    <>
      {vervang ? (
        <Knop grootte="sm" soort="stil" ikoon={Upload} onClick={() => setOop(true)}>Vervang</Knop>
      ) : (
        <Knop soort="primer" grootte="sm" ikoon={Upload} className="w-full" onClick={() => setOop(true)}>
          Laai op
        </Knop>
      )}
      <OplaaiModaal oop={oop} sluit={() => setOop(false)} titel={titel} />
    </>
  );
}

export function AflaaiKnop({ titel }: { titel: string }) {
  const { wys } = useMelding();
  return (
    <Knop grootte="sm" ikoon={Download} onClick={() => wys(DEMO(`${titel} sou afgelaai word`), "info")}>
      Laai af
    </Knop>
  );
}

export function VoegDokumentKnop() {
  const [oop, setOop] = useState(false);
  const [titel, setTitel] = useState("");
  const [fout, setFout] = useState<string>();
  const { wys } = useMelding();

  function stoor(e: React.FormEvent) {
    e.preventDefault();
    if (!titel.trim()) { setFout("Titel is verpligtend."); return; }
    setFout(undefined);
    wys(DEMO(`“${titel}” bygevoeg`));
    setTitel("");
    setOop(false);
  }

  return (
    <>
      <Knop soort="primer" grootte="sm" ikoon={Plus} onClick={() => setOop(true)}>Voeg by</Knop>
      <Modaal oop={oop} sluit={() => setOop(false)} titel="Voeg dokument by"
        voet={
          <>
            <Knop soort="stil" onClick={() => setOop(false)}>Kanselleer</Knop>
            <Knop type="submit" form="dok-vorm" soort="primer">Voeg by</Knop>
          </>
        }>
        <form id="dok-vorm" onSubmit={stoor} className="flex flex-col gap-4" noValidate>
          <Veld etiket="Titel" verpligtend fout={fout}>
            <Invoer value={titel} onChange={(e) => setTitel(e.target.value)} placeholder="Basaar 2026 — Program" />
          </Veld>
          <Veld etiket="Beskrywing">
            <Teksarea rows={2} placeholder="Kort opsomming" />
          </Veld>
          <label className="border-line hover:border-brand/40 hover:bg-stage/50 flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed px-6 py-7 text-center transition-colors">
            <span className="boog-vorm bg-was-saffier text-glas-saffier ring-line flex size-10 items-center justify-center ring-1">
              <Upload size={18} strokeWidth={1.9} aria-hidden />
            </span>
            <span className="text-sm font-semibold">Kies &apos;n lêer</span>
            <span className="text-ink-muted text-xs">PDF, tot 10 MB</span>
            <input type="file" accept=".pdf" className="sr-only" />
          </label>
        </form>
      </Modaal>
    </>
  );
}
