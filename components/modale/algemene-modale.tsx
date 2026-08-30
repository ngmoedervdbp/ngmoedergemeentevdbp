"use client";

import { useState, type ReactNode } from "react";
import { Download, FileSpreadsheet, QrCode, Upload } from "lucide-react";
import { Modaal } from "@/components/ui/modaal";
import { Kenteken, Knop } from "@/components/ui/basis";
import { Invoer, Kies, Teksarea, Veld, VeldRy } from "@/components/ui/vorm";
import { DEMO, useMelding } from "@/components/ui/melding";
import { WYKE, type Family, type Wyk } from "@/lib/mock";

/* ---------------------------------------------------------------
   Bevestig — een dialoog vir elke ja/nee-aksie
   --------------------------------------------------------------- */

export function BevestigModaal({
  oop, sluit, titel, beskrywing, bevestigEtiket, soort = "primer", opBevestig,
}: {
  oop: boolean;
  sluit: () => void;
  titel: string;
  beskrywing: ReactNode;
  bevestigEtiket: string;
  soort?: "primer" | "gevaar";
  opBevestig: () => void;
}) {
  return (
    <Modaal oop={oop} sluit={sluit} titel={titel} breedte="sm"
      voet={
        <>
          <Knop soort="stil" onClick={sluit}>Kanselleer</Knop>
          <Knop soort={soort} onClick={() => { opBevestig(); sluit(); }}>
            {bevestigEtiket}
          </Knop>
        </>
      }>
      <div className="text-ink-muted text-sm">{beskrywing}</div>
    </Modaal>
  );
}

/* ---------------------------------------------------------------
   Wyk
   --------------------------------------------------------------- */

export function WykModaal({ oop, sluit, wyk }: { oop: boolean; sluit: () => void; wyk?: Wyk }) {
  const { wys } = useMelding();
  const [nommer, setNommer] = useState(wyk?.nommer ?? "");
  const [fout, setFout] = useState<string>();

  function stoor(e: React.FormEvent) {
    e.preventDefault();
    if (!nommer.trim()) { setFout("Wyknommer is verpligtend."); return; }
    setFout(undefined);
    wys(DEMO(`Wyk ${nommer} ${wyk ? "opgedateer" : "geskep"}`));
    sluit();
  }

  return (
    <Modaal oop={oop} sluit={sluit} titel={wyk ? "Wysig wyk" : "Nuwe wyk"}
      voet={
        <>
          <Knop soort="stil" onClick={sluit}>Kanselleer</Knop>
          <Knop type="submit" form="wyk-vorm" soort="primer">{wyk ? "Stoor" : "Skep wyk"}</Knop>
        </>
      }>
      <form id="wyk-vorm" onSubmit={stoor} className="flex flex-col gap-4" noValidate>
        <VeldRy>
          <Veld etiket="Wyknommer" verpligtend fout={fout}
            hulp="Teks, nie 'n getal nie — “30 A” is geldig.">
            <Invoer value={nommer} onChange={(e) => setNommer(e.target.value)} placeholder="30 A" />
          </Veld>
          <Veld etiket="Kapasiteit" hulp="Riglyn, nie afgedwing nie.">
            <Kies defaultValue={String(wyk?.kapasiteit ?? 50)}>
              <option value="50">50</option>
              <option value="60">60</option>
              <option value="70">70</option>
            </Kies>
          </Veld>
        </VeldRy>
        <Veld etiket="Wyksouderling" hulp="Laat leeg as die wyk vakant is.">
          <Invoer defaultValue={wyk?.ouderling ?? ""} placeholder="Naam en van" />
        </Veld>
      </form>
    </Modaal>
  );
}

/* ---------------------------------------------------------------
   Gesin
   --------------------------------------------------------------- */

export function GesinModaal({ oop, sluit, gesin }: { oop: boolean; sluit: () => void; gesin?: Family }) {
  const { wys } = useMelding();
  const [naam, setNaam] = useState(gesin?.naam ?? "");
  const [fout, setFout] = useState<string>();

  function stoor(e: React.FormEvent) {
    e.preventDefault();
    if (!naam.trim()) { setFout("Gesinsnaam is verpligtend."); return; }
    setFout(undefined);
    wys(DEMO(`Gesin ${naam} ${gesin ? "opgedateer" : "geskep"}`));
    sluit();
  }

  return (
    <Modaal oop={oop} sluit={sluit} titel={gesin ? "Wysig gesin" : "Nuwe gesin"}
      beskrywing="Die gesin besit die adres; lidmate koppel daaraan."
      voet={
        <>
          <Knop soort="stil" onClick={sluit}>Kanselleer</Knop>
          <Knop type="submit" form="gesin-vorm" soort="primer">{gesin ? "Stoor" : "Skep gesin"}</Knop>
        </>
      }>
      <form id="gesin-vorm" onSubmit={stoor} className="flex flex-col gap-4" noValidate>
        <Veld etiket="Gesinsnaam" verpligtend fout={fout}
          hulp="Gewoonlik die van — maar dit hoef nie te wees nie.">
          <Invoer value={naam} onChange={(e) => setNaam(e.target.value)} placeholder="Ries" />
        </Veld>
        <Veld etiket="Adres">
          <Invoer defaultValue={gesin?.adres ?? ""} placeholder="8 Toselli Straat" />
        </Veld>
        <VeldRy>
          <Veld etiket="Stad">
            <Invoer defaultValue={gesin?.stad ?? "Vanderbijlpark"} />
          </Veld>
          <Veld etiket="Wyk">
            <Kies defaultValue={gesin?.wyk_id ?? ""}>
              <option value="">Geen wyk</option>
              {WYKE.map((w) => <option key={w.id} value={w.id}>{w.naam}</option>)}
            </Kies>
          </Veld>
        </VeldRy>
      </form>
    </Modaal>
  );
}

/* ---------------------------------------------------------------
   Gebeurtenis
   --------------------------------------------------------------- */

export function GebeurtenisModaal({ oop, sluit }: { oop: boolean; sluit: () => void }) {
  const { wys } = useMelding();
  const [titel, setTitel] = useState("");
  const [fout, setFout] = useState<string>();

  function stoor(e: React.FormEvent) {
    e.preventDefault();
    if (!titel.trim()) { setFout("Titel is verpligtend."); return; }
    setFout(undefined);
    wys(DEMO(`“${titel}” op die kalender geplaas`));
    sluit();
  }

  return (
    <Modaal oop={oop} sluit={sluit} titel="Nuwe gebeurtenis"
      voet={
        <>
          <Knop soort="stil" onClick={sluit}>Kanselleer</Knop>
          <Knop type="submit" form="geb-vorm" soort="primer">Skep gebeurtenis</Knop>
        </>
      }>
      <form id="geb-vorm" onSubmit={stoor} className="flex flex-col gap-4" noValidate>
        <Veld etiket="Titel" verpligtend fout={fout}>
          <Invoer value={titel} onChange={(e) => setTitel(e.target.value)} placeholder="Oggenddiens" />
        </Veld>
        <VeldRy>
          <Veld etiket="Datum" verpligtend>
            <Invoer type="date" defaultValue={new Date().toISOString().slice(0, 10)} />
          </Veld>
          <Veld etiket="Tyd">
            <Invoer type="time" defaultValue="09:00" />
          </Veld>
        </VeldRy>
        <VeldRy>
          <Veld etiket="Plek">
            <Invoer placeholder="Kerkgebou" />
          </Veld>
          <Veld etiket="Kategorie">
            <Kies defaultValue="algemeen">
              <option value="algemeen">Algemeen</option>
              <option value="jeug">Jeug</option>
              <option value="seniors">Seniors</option>
              <option value="spesiaal">Spesiale geleentheid</option>
            </Kies>
          </Veld>
        </VeldRy>
        <Veld etiket="Beskrywing">
          <Teksarea rows={3} placeholder="Opsioneel" />
        </Veld>
      </form>
    </Modaal>
  );
}

/* ---------------------------------------------------------------
   Uitvoer / invoer / oplaai
   --------------------------------------------------------------- */

export function UitvoerModaal({
  oop, sluit, aantal, wat = "lidmate",
}: { oop: boolean; sluit: () => void; aantal: number; wat?: string }) {
  const { wys } = useMelding();
  return (
    <Modaal oop={oop} sluit={sluit} titel="Voer uit" breedte="sm"
      beskrywing={`${aantal} ${wat} sal uitgevoer word.`}
      voet={
        <>
          <Knop soort="stil" onClick={sluit}>Kanselleer</Knop>
          <Knop soort="primer" ikoon={Download}
            onClick={() => { wys(DEMO("Lêer sou afgelaai word")); sluit(); }}>
            Laai af
          </Knop>
        </>
      }>
      <div className="flex flex-col gap-4">
        <Veld etiket="Formaat">
          <Kies defaultValue="xlsx">
            <option value="xlsx">Excel (.xlsx)</option>
            <option value="csv">CSV (.csv)</option>
            <option value="pdf">PDF</option>
          </Kies>
        </Veld>
        <div className="border-line bg-was-wyn/40 rounded-lg border px-3.5 py-2.5 text-xs">
          <strong className="font-semibold">POPIA:</strong> die lêer bevat persoonlike
          besonderhede van werklike gesinne. Moenie dit per e-pos aanstuur of op &apos;n
          gedeelde skyf los nie.
        </div>
      </div>
    </Modaal>
  );
}

export function InvoerModaal({ oop, sluit }: { oop: boolean; sluit: () => void }) {
  const { wys } = useMelding();
  return (
    <Modaal oop={oop} sluit={sluit} titel="Excel invoer"
      beskrywing="Laai 'n sigblad op om lidmate in bulk by te voeg."
      voet={
        <>
          <Knop soort="stil" onClick={sluit}>Kanselleer</Knop>
          <Knop soort="primer" ikoon={Upload}
            onClick={() => { wys(DEMO("Lêer sou verwerk word")); sluit(); }}>
            Laai op
          </Knop>
        </>
      }>
      <div className="flex flex-col gap-4">
        <label className="border-line hover:border-brand/40 hover:bg-stage/50 flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed px-6 py-8 text-center transition-colors">
          <span className="boog-vorm bg-was-groen text-glas-groen ring-line flex size-10 items-center justify-center ring-1">
            <FileSpreadsheet size={18} strokeWidth={1.9} aria-hidden />
          </span>
          <span className="text-sm font-semibold">Kies &apos;n lêer</span>
          <span className="text-ink-muted text-xs">.xlsx of .csv, tot 5 MB</span>
          <input type="file" accept=".xlsx,.csv" className="sr-only" />
        </label>
        <div className="border-line bg-ground rounded-lg border px-3.5 py-2.5 text-xs">
          <p className="font-semibold">Verwagte kolomme</p>
          <p className="text-ink-muted mt-1">
            Naam, Van, Geboortedatum, Geslag, Selfoon, E-pos, Wyk, Status
          </p>
        </div>
      </div>
    </Modaal>
  );
}

export function OplaaiModaal({
  oop, sluit, titel,
}: { oop: boolean; sluit: () => void; titel: string }) {
  const { wys } = useMelding();
  return (
    <Modaal oop={oop} sluit={sluit} titel={titel} breedte="sm"
      beskrywing="Word aan nuwe lidmate beskikbaar gestel ná registrasie."
      voet={
        <>
          <Knop soort="stil" onClick={sluit}>Kanselleer</Knop>
          <Knop soort="primer" ikoon={Upload}
            onClick={() => { wys(DEMO(`${titel} opgelaai`)); sluit(); }}>
            Laai op
          </Knop>
        </>
      }>
      <label className="border-line hover:border-brand/40 hover:bg-stage/50 flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed px-6 py-8 text-center transition-colors">
        <span className="boog-vorm bg-was-saffier text-glas-saffier ring-line flex size-10 items-center justify-center ring-1">
          <Upload size={18} strokeWidth={1.9} aria-hidden />
        </span>
        <span className="text-sm font-semibold">Kies &apos;n lêer</span>
        <span className="text-ink-muted text-xs">PDF, tot 10 MB</span>
        <input type="file" accept=".pdf" className="sr-only" />
      </label>
    </Modaal>
  );
}

/* ---------------------------------------------------------------
   QR-kode
   --------------------------------------------------------------- */

export function QrModaal({ oop, sluit, url }: { oop: boolean; sluit: () => void; url: string }) {
  return (
    <Modaal oop={oop} sluit={sluit} titel="QR-kode vir registrasie" breedte="sm"
      beskrywing="Plaas dit by die kerk se ingang."
      voet={<Knop soort="primer" onClick={sluit}>Klaar</Knop>}>
      <div className="flex flex-col items-center gap-3">
        <div className="border-line bg-surface text-ink-muted flex size-44 items-center justify-center rounded-xl border">
          <QrCode size={72} strokeWidth={1.2} aria-hidden />
        </div>
        <code className="text-ink-muted text-xs break-all">{url}</code>
        <Kenteken toon="neutraal">Word gegenereer sodra die roete regtig lewe</Kenteken>
      </div>
    </Modaal>
  );
}
