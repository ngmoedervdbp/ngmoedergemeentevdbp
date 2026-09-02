"use client";

import { useState } from "react";
import Link from "next/link";
import { LayoutGrid, List, Pencil, Plus, Printer, Shuffle, Trash2 } from "lucide-react";
import { LidmaatAvatar } from "@/components/kerk/lidmaat-avatar";
import { Kenteken, Knop, Paneel, Vordering } from "@/components/ui/basis";
import { BevestigModaal, WykModaal } from "@/components/modale/algemene-modale";
import { useMelding } from "@/components/ui/melding";
import { veeWykUit } from "@/lib/data/aksies";
import { Tabelrol } from "@/components/ui/tabel";
import { type Lid, type Wyk } from "@/lib/tipes/gemeente";
import { volleNaam } from "@/lib/data/afleidings";
import { cn } from "@/lib/utils";

type WykMetLede = Wyk & { tel: number; lede: Lid[] };
type Aansig = "kaarte" | "lys";

export function WykAansig({ wyke }: { wyke: WykMetLede[] }) {
  const [aansig, setAansig] = useState<Aansig>("kaarte");
  const [nuut, setNuut] = useState(false);
  const [wysig, setWysig] = useState<WykMetLede | null>(null);
  const [skrap, setSkrap] = useState<WykMetLede | null>(null);
  const [verdeel, setVerdeel] = useState(false);
  const { wys } = useMelding();

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <div className="border-line bg-surface flex gap-0.5 rounded-lg border p-0.5">
          <AansigKnop aan={aansig === "kaarte"} onClick={() => setAansig("kaarte")} etiket="Kaarte">
            <LayoutGrid size={15} aria-hidden />
          </AansigKnop>
          <AansigKnop aan={aansig === "lys"} onClick={() => setAansig("lys")} etiket="Ledelys">
            <List size={15} aria-hidden />
          </AansigKnop>
        </div>

        <div className="ml-auto flex w-full flex-wrap gap-2 sm:w-auto [&>*]:flex-1 sm:[&>*]:flex-none">
          <Knop ikoon={Shuffle} grootte="sm" onClick={() => setVerdeel(true)}>Verdeel lidmate</Knop>
          <Knop ikoon={Printer} grootte="sm" onClick={() => wys("Druk is nog nie gebou nie.", "info")}>
            Druk wyklys
          </Knop>
          <Knop soort="primer" ikoon={Plus} grootte="sm" onClick={() => setNuut(true)}>Nuwe wyk</Knop>
        </div>
      </div>

      {aansig === "kaarte" ? (
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {wyke.map((w) => {
            const vol = w.tel / w.kapasiteit;
            return (
              <li key={w.id}>
                <Paneel className="flex h-full flex-col">
                  <div className="border-line flex items-start justify-between gap-2 border-b px-4 py-3.5 sm:px-5">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="tabular border-line bg-ground text-ink-muted rounded border px-1.5 py-0.5 text-xs font-semibold">
                          #{w.nommer}
                        </span>
                        <h2 className="font-display truncate text-lg font-semibold">{w.naam}</h2>
                      </div>
                      <p className="text-ink-muted mt-1 truncate text-xs">
                        {w.ouderling ? `Ouderling: ${w.ouderling}` : "Geen wyksouderling toegeken nie"}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      {!w.ouderling ? <Kenteken toon="oorgeplaas">Vakant</Kenteken> : null}
                      <IkoonKnop etiket={`Wysig ${w.naam}`} onClick={() => setWysig(w)}>
                        <Pencil size={14} aria-hidden />
                      </IkoonKnop>
                      <IkoonKnop etiket={`Skrap ${w.naam}`} gevaar onClick={() => setSkrap(w)}>
                        <Trash2 size={14} aria-hidden />
                      </IkoonKnop>
                    </div>
                  </div>

                  <div className="px-4 py-4 sm:px-5">
                    <div className="mb-1.5 flex items-baseline justify-between text-sm">
                      <span className="text-ink-muted">Lidmate</span>
                      <span className="tabular font-semibold">
                        {w.tel} <span className="text-ink-muted font-normal">/ {w.kapasiteit}</span>
                      </span>
                    </div>
                    <Vordering waarde={w.tel} maks={w.kapasiteit}
                      toon={vol > 0.9 ? "amber" : vol > 0.5 ? "groen" : "saffier"} />
                  </div>

                  {w.lede.length > 0 ? (
                    <div className="mt-auto flex flex-wrap items-center gap-1 px-5 pb-4">
                      {w.lede.slice(0, 5).map((l) => (
                        <Link key={l.id} href={`/lidmate/${l.id}`} title={volleNaam(l)}
                          className="raak focus-visible:outline-accent flex items-center justify-center rounded-sm transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2">
                          <LidmaatAvatar lid={l} grootte="sm" />
                        </Link>
                      ))}
                      {w.tel > 5 ? (
                        <span className="text-ink-muted ml-1 text-xs">+{w.tel - 5} meer</span>
                      ) : null}
                    </div>
                  ) : (
                    <p className="text-ink-muted mt-auto px-5 pb-4 text-xs">
                      Nog geen lidmate toegeken nie.
                    </p>
                  )}
                </Paneel>
              </li>
            );
          })}
        </ul>
      ) : (
        <Paneel className="overflow-hidden">
          <Tabelrol>
            <table className="w-full min-w-[680px] text-sm">
              <thead className="border-line bg-ground/60 border-b">
                <tr className="text-ink-muted text-left text-xs font-semibold tracking-[0.08em] uppercase">
                  <th scope="col" className="px-4 py-2.5 sm:px-5">Wyk</th>
                  <th scope="col" className="px-3 py-2.5">Wyksouderling</th>
                  <th scope="col" className="px-3 py-2.5">Lidmate</th>
                  <th scope="col" className="px-3 py-2.5 w-48">Kapasiteit</th>
                  <th scope="col" className="px-4 py-2.5 sm:px-5 text-right">Aksies</th>
                </tr>
              </thead>
              <tbody className="divide-line divide-y">
                {wyke.map((w) => (
                  <tr key={w.id} className="hover:bg-stage/50 transition-colors">
                    <td className="px-4 py-2.5 sm:px-5 font-medium">
                      <span className="tabular border-line bg-ground text-ink-muted mr-2 rounded border px-1.5 py-0.5 text-xs font-semibold">
                        #{w.nommer}
                      </span>
                      {w.naam}
                    </td>
                    <td className="text-ink-muted px-3 py-2.5">
                      {w.ouderling ?? <Kenteken toon="oorgeplaas">Vakant</Kenteken>}
                    </td>
                    <td className="tabular px-3 py-2.5">{w.tel} / {w.kapasiteit}</td>
                    <td className="px-3 py-2.5">
                      <Vordering waarde={w.tel} maks={w.kapasiteit} />
                    </td>
                    <td className="px-4 py-2.5 sm:px-5">
                      <div className="flex justify-end gap-1">
                        <IkoonKnop etiket={`Wysig ${w.naam}`} onClick={() => setWysig(w)}>
                          <Pencil size={14} aria-hidden />
                        </IkoonKnop>
                        <IkoonKnop etiket={`Skrap ${w.naam}`} gevaar onClick={() => setSkrap(w)}>
                          <Trash2 size={14} aria-hidden />
                        </IkoonKnop>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Tabelrol>
        </Paneel>
      )}

      <WykModaal oop={nuut} sluit={() => setNuut(false)} />
      <WykModaal oop={wysig !== null} sluit={() => setWysig(null)} wyk={wysig ?? undefined} />

      <BevestigModaal
        oop={skrap !== null}
        sluit={() => setSkrap(null)}
        titel="Skrap wyk"
        soort="gevaar"
        beskrywing={
          <>
            <strong className="text-ink font-semibold">{skrap?.naam}</strong> word verwyder.
            Die {skrap?.tel ?? 0} lidmate daarin word <strong className="text-ink font-semibold">nie</strong> uitgevee
            nie — hulle staan daarna sonder wyk.
          </>
        }
        bevestigEtiket="Skrap wyk"
        opBevestig={async () => {
          if (!skrap) return;
          const u = await veeWykUit(skrap.id);
          wys(u.ok ? `${skrap.naam} geskrap.` : u.fout, u.ok ? undefined : "fout");
        }}
      />

      <BevestigModaal
        oop={verdeel}
        sluit={() => setVerdeel(false)}
        titel="Verdeel lidmate in wyke"
        beskrywing="Lidmate sonder 'n wyk word outomaties versprei op grond van hul gesin se adres. Bestaande toewysings bly onaangeraak."
        bevestigEtiket="Verdeel"
        opBevestig={() => wys("Outomatiese verdeling is nog nie gebou nie.", "info")}
      />
    </>
  );
}

function AansigKnop({ aan, onClick, etiket, children }: {
  aan: boolean; onClick: () => void; etiket: string; children: React.ReactNode;
}) {
  return (
    <button type="button" onClick={onClick} aria-label={etiket} aria-pressed={aan}
      className={cn("focus-visible:outline-accent flex size-8 items-center justify-center rounded-md transition-colors focus-visible:outline-2",
        aan ? "bg-brand text-white" : "text-ink-muted hover:bg-stage")}>
      {children}
    </button>
  );
}

function IkoonKnop({ etiket, onClick, gevaar, children }: {
  etiket: string; onClick: () => void; gevaar?: boolean; children: React.ReactNode;
}) {
  return (
    <button type="button" onClick={onClick} aria-label={etiket} title={etiket}
      className={cn("focus-visible:outline-accent flex size-9 items-center justify-center rounded-md transition-colors focus-visible:outline-2 sm:size-7",
        gevaar ? "text-ink-muted hover:bg-was-wyn hover:text-glas-wyn" : "text-ink-muted hover:bg-stage hover:text-ink")}>
      {children}
    </button>
  );
}
