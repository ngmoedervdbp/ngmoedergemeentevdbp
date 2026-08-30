"use client";

import { useMemo, useState } from "react";
import { CheckSquare, Mail, MessageCircle, Search, Send, Square, TriangleAlert } from "lucide-react";
import { LidmaatAvatar } from "@/components/kerk/lidmaat-avatar";
import { Kenteken, Knop, Paneel, PaneelKop } from "@/components/ui/basis";
import { BevestigModaal } from "@/components/modale/algemene-modale";
import { DEMO, useMelding } from "@/components/ui/melding";
import { volleNaam, type Lid } from "@/lib/mock";
import { cn } from "@/lib/utils";

export function KommunikasiePaneel({ lede }: { lede: Lid[] }) {
  const [gekies, setGekies] = useState<Set<string>>(new Set());
  const [vraag, setVraag] = useState("");
  const [onderwerp, setOnderwerp] = useState("");
  const [boodskap, setBoodskap] = useState("");
  const [wa, setWa] = useState("");
  const [bevestig, setBevestig] = useState<"epos" | "wa" | null>(null);
  const { wys } = useMelding();

  const sigbaar = useMemo(() => {
    const q = vraag.trim().toLowerCase();
    return q ? lede.filter((l) => volleNaam(l).toLowerCase().includes(q)) : lede;
  }, [lede, vraag]);

  const gekiesLede = lede.filter((l) => gekies.has(l.id));
  const metEpos = gekiesLede.filter((l) => l.epos).length;
  const metFoon = gekiesLede.filter((l) => l.selfoon).length;

  function wissel(id: string) {
    setGekies((v) => {
      const n = new Set(v);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_1.25fr]">
      <Paneel className="flex max-h-[26rem] flex-col sm:max-h-[36rem]">
        <PaneelKop titel="Kies lidmate" byskrif={`${gekies.size} gekies`} />
        <div className="border-line flex flex-col gap-2 border-b px-4 py-3">
          <div className="relative">
            <Search size={15} className="text-ink-muted pointer-events-none absolute top-1/2 left-3 -translate-y-1/2" aria-hidden />
            <input value={vraag} onChange={(e) => setVraag(e.target.value)}
              type="search" inputMode="search" autoCapitalize="none" autoCorrect="off" spellCheck={false}
              placeholder="Soek…" aria-label="Soek lidmate"
              className="border-line bg-surface placeholder:text-ink-muted focus-visible:outline-accent h-9 w-full rounded-lg border pr-3 pl-9 text-sm focus-visible:outline-2 focus-visible:-outline-offset-1" />
          </div>
          <div className="flex gap-2 [&>*]:flex-1 sm:[&>*]:flex-none">
            <Knop grootte="sm" onClick={() => setGekies(new Set(sigbaar.map((l) => l.id)))}>Kies almal</Knop>
            <Knop grootte="sm" soort="stil" onClick={() => setGekies(new Set())}>Ontkies</Knop>
          </div>
        </div>

        <ul className="divide-line flex-1 divide-y overflow-y-auto">
          {sigbaar.map((l) => {
            const aan = gekies.has(l.id);
            return (
              <li key={l.id}>
                <button type="button" onClick={() => wissel(l.id)} aria-pressed={aan}
                  className={cn("hover:bg-stage/60 focus-visible:outline-accent flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2",
                    aan && "bg-brand-soft/70")}>
                  {aan ? <CheckSquare size={16} className="text-brand shrink-0" aria-hidden />
                       : <Square size={16} className="text-ink-muted shrink-0" aria-hidden />}
                  <LidmaatAvatar lid={l} grootte="sm" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{volleNaam(l)}</span>
                    <span className="text-ink-muted flex gap-1.5 text-xs">
                      {l.selfoon ? <span>Foon</span> : null}
                      {l.epos ? <span>E-pos</span> : null}
                      {!l.selfoon && !l.epos ? <span>Geen kontak</span> : null}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </Paneel>

      <div className="flex flex-col gap-5">
        <Paneel>
          <PaneelKop titel="E-pos" byskrif={`${metEpos} van ${gekies.size} gekiesde lidmate het 'n e-posadres`}
            aksie={<Mail size={17} className="text-brand" aria-hidden />} />
          <div className="flex flex-col gap-3 px-4 py-4 sm:px-5">
            <label className="flex flex-col gap-1">
              <span className="text-ink-muted text-xs font-semibold tracking-[0.08em] uppercase">Onderwerp</span>
              <input value={onderwerp} onChange={(e) => setOnderwerp(e.target.value)}
                placeholder="E-pos onderwerp"
                className="border-line bg-surface placeholder:text-ink-muted focus-visible:outline-accent h-10 rounded-lg border px-3 text-sm focus-visible:outline-2 focus-visible:-outline-offset-1" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-ink-muted text-xs font-semibold tracking-[0.08em] uppercase">Boodskap</span>
              <textarea value={boodskap} onChange={(e) => setBoodskap(e.target.value)} rows={5}
                placeholder="Skryf jou boodskap hier…"
                className="border-line bg-surface placeholder:text-ink-muted focus-visible:outline-accent resize-y rounded-lg border px-3 py-2 text-sm focus-visible:outline-2 focus-visible:-outline-offset-1" />
            </label>
            <p className="text-ink-muted text-xs">
              Wenk: gebruik <code className="text-ink bg-stage rounded px-1 py-0.5">{"{naam}"}</code> om die lidmaat se naam outomaties in te voeg.
            </p>
            <Knop soort="primer" ikoon={Send} disabled={metEpos === 0 || !onderwerp.trim()}
              className="w-full sm:w-auto sm:self-start" onClick={() => setBevestig("epos")}>
              Stuur e-pos ({metEpos})
            </Knop>
          </div>
        </Paneel>

        <Paneel>
          <PaneelKop titel="WhatsApp" byskrif={`${metFoon} van ${gekies.size} gekiesde lidmate het 'n selfoonnommer`}
            aksie={<MessageCircle size={17} className="text-glas-groen" aria-hidden />} />
          <div className="flex flex-col gap-3 px-4 py-4 sm:px-5">
            <textarea value={wa} onChange={(e) => setWa(e.target.value)} rows={3}
              placeholder="Skryf jou WhatsApp boodskap hier…"
              className="border-line bg-surface placeholder:text-ink-muted focus-visible:outline-accent resize-y rounded-lg border px-3 py-2 text-sm focus-visible:outline-2 focus-visible:-outline-offset-1" />
            <div className="border-line bg-was-amber/60 flex items-start gap-2.5 rounded-lg border px-3.5 py-2.5 text-xs">
              <TriangleAlert size={14} className="text-glas-amber mt-0.5 shrink-0" aria-hidden />
              <p>
                <strong className="font-semibold">Let wel:</strong> WhatsApp-boodskappe word
                een-vir-een gestuur via &apos;n <code className="bg-surface rounded px-1">wa.me</code>-skakel.
                Ware massa-WhatsApp vereis die betaalde Business API.
              </p>
            </div>
            <Knop ikoon={MessageCircle} disabled={metFoon === 0} className="w-full sm:w-auto sm:self-start"
              onClick={() => setBevestig("wa")}>
              Open WhatsApp ({metFoon})
            </Knop>
          </div>
        </Paneel>

        <BevestigModaal
          oop={bevestig === "epos"} sluit={() => setBevestig(null)}
          titel="Stuur e-pos"
          beskrywing={<>Die boodskap gaan na <strong className="text-ink font-semibold">{metEpos}</strong> lidmate met &apos;n e-posadres. Die {gekies.size - metEpos} sonder een word oorgeslaan.</>}
          bevestigEtiket={`Stuur ${metEpos} e-posse`}
          opBevestig={() => wys(DEMO(`${metEpos} e-posse sou gestuur word`))}
        />

        <BevestigModaal
          oop={bevestig === "wa"} sluit={() => setBevestig(null)}
          titel="Open WhatsApp"
          beskrywing={<>WhatsApp Web maak oop met die <strong className="text-ink font-semibold">eerste</strong> lidmaat se nommer. Die res moet een vir een gedoen word — ware massa-WhatsApp vereis die betaalde Business API.</>}
          bevestigEtiket="Open WhatsApp"
          opBevestig={() => wys(DEMO("WhatsApp Web sou oopmaak"), "info")}
        />

        {gekies.size > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {gekiesLede.slice(0, 12).map((l) => (
              <Kenteken key={l.id} toon="saffier">{volleNaam(l)}</Kenteken>
            ))}
            {gekiesLede.length > 12 ? (
              <Kenteken toon="neutraal">+{gekiesLede.length - 12} meer</Kenteken>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
