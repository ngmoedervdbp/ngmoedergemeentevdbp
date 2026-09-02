"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen, CalendarPlus, CalendarRange, Clock, DoorOpen,
  Plus, UserPlus, Users,
} from "lucide-react";
import { LidmaatAvatar } from "@/components/kerk/lidmaat-avatar";
import { Kenteken, Knop, Leeg, Paneel, PaneelKop } from "@/components/ui/basis";
import { Oortjies, OortjiePaneel } from "@/components/ui/oortjies";
import { Modaal } from "@/components/ui/modaal";
import { Invoer, Kies, Veld, VeldRy } from "@/components/ui/vorm";
import { useMelding } from "@/components/ui/melding";
import { stoorKategeseGroep } from "@/lib/data/aksies";
import { GebeurtenisModaal } from "@/components/modale/algemene-modale";
import { Tabelrol } from "@/components/ui/tabel";
import { berekenOuderdom, fmtDatum, fmtOuderdom } from "@/lib/format";
import { type Gebeurtenis, type KategeseGroep, type Lid } from "@/lib/tipes/gemeente";
import { volleNaam } from "@/lib/data/afleidings";

type Blad = "groepe" | "kinders" | "kalender";

export function KategeseAansig({
  groepe, inGroep, sonderGroep, alleKinders, gebeure,
}: {
  groepe: KategeseGroep[];
  inGroep: Lid[];
  sonderGroep: Lid[];
  alleKinders: Lid[];
  gebeure: Gebeurtenis[];
}) {
  const [blad, setBlad] = useState<Blad>("groepe");
  const [modaal, setModaal] = useState<"groep" | "kind" | "gebeurtenis" | null>(null);
  const [deelIn, setDeelIn] = useState<Lid | null>(null);
  const { wys } = useMelding();
  const sluit = () => setModaal(null);

  const groepVan = new Map<string, KategeseGroep>();
  for (const g of groepe) for (const id of g.lid_ids) groepVan.set(id, g);

  return (
    <>
      <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center lg:justify-between">
        <Oortjies
          etiket="Kategese"
          aktief={blad}
          kies={setBlad}
          items={[
            { sleutel: "groepe", etiket: "Groepe", ikoon: BookOpen, telling: groepe.length },
            { sleutel: "kinders", etiket: "Alle kinders", ikoon: Users, telling: alleKinders.length },
            { sleutel: "kalender", etiket: "Kalender & gebeure", ikoon: CalendarRange, telling: gebeure.length },
          ]}
        />
        <div className="flex flex-wrap gap-2 [&>*]:flex-1 sm:[&>*]:flex-none">
          <Knop ikoon={CalendarPlus} grootte="sm" onClick={() => setModaal("gebeurtenis")}>Nuwe gebeurtenis</Knop>
          <Knop ikoon={UserPlus} grootte="sm" onClick={() => setModaal("kind")}>Voeg kind by</Knop>
          <Knop soort="primer" ikoon={Plus} grootte="sm" onClick={() => setModaal("groep")}>Nuwe groep</Knop>
        </div>
      </div>

      <OortjiePaneel sleutel="groepe" aktief={blad}>
        {groepe.length === 0 ? (
          <Paneel><Leeg ikoon={BookOpen} titel="Geen groepe nie"
            beskrywing="Skep jou eerste kategesegroep om te begin."
            aksie={<Knop grootte="sm" ikoon={Plus} onClick={() => setModaal("groep")}>Skep groep</Knop>} /></Paneel>
        ) : (
          <ul className="grid gap-4 md:grid-cols-2">
            {groepe.map((g) => {
              const lede = g.lid_ids
                .map((id) => inGroep.find((l) => l.id === id))
                .filter((l): l is Lid => Boolean(l));
              return (
                <li key={g.id}>
                  <Paneel className="flex h-full flex-col">
                    <div className="border-line flex items-start justify-between gap-3 border-b px-4 py-3.5 sm:px-5">
                      <div className="min-w-0">
                        <h2 className="font-display truncate text-lg font-semibold">{g.naam}</h2>
                        <p className="text-ink-muted mt-0.5 text-xs">{g.onderwyser}</p>
                      </div>
                      <Kenteken toon="kobalt">{g.ouderdomsgroep}</Kenteken>
                    </div>
                    <div className="text-ink-muted flex flex-wrap gap-x-4 gap-y-1 px-4 py-3 sm:px-5 text-xs">
                      <span className="flex items-center gap-1.5">
                        <Clock size={12} strokeWidth={1.9} aria-hidden />{g.dag} {g.tyd}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <DoorOpen size={12} strokeWidth={1.9} aria-hidden />{g.lokaal}
                      </span>
                    </div>
                    {lede.length === 0 ? (
                      <p className="text-ink-muted border-line mt-auto border-t px-4 py-3 sm:px-5 text-xs">
                        Nog geen kinders in hierdie groep nie.
                      </p>
                    ) : (
                      <ul className="divide-line mt-auto divide-y border-t border-[var(--color-line)]">
                        {lede.map((l) => (
                          <li key={l.id}>
                            <Link href={`/lidmate/${l.id}`}
                              className="hover:bg-stage/60 flex items-center gap-2.5 px-5 py-2 transition-colors">
                              <LidmaatAvatar lid={l} grootte="sm" />
                              <span className="min-w-0 flex-1 truncate text-sm">{volleNaam(l)}</span>
                              <span className="text-ink-muted tabular text-xs">
                                {fmtOuderdom(berekenOuderdom(l.date_of_birth))}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </Paneel>
                </li>
              );
            })}
          </ul>
        )}
      </OortjiePaneel>

      <OortjiePaneel sleutel="kinders" aktief={blad}>
        <Paneel className="overflow-hidden">
          <PaneelKop titel="Alle kinders onder 18"
            byskrif={`${sonderGroep.length} nog sonder groep`} />
          <Tabelrol>
            <table className="w-full min-w-[600px] text-sm">
              <thead className="border-line bg-ground/60 border-b">
                <tr className="text-ink-muted text-left text-xs font-semibold tracking-[0.08em] uppercase">
                  <th scope="col" className="px-4 py-2.5 sm:px-5">Naam</th>
                  <th scope="col" className="px-3 py-2.5">Ouderdom</th>
                  <th scope="col" className="px-3 py-2.5">Groep</th>
                  <th scope="col" className="px-4 py-2.5 sm:px-5 text-right">Aksie</th>
                </tr>
              </thead>
              <tbody className="divide-line divide-y">
                {alleKinders.map((l) => {
                  const g = groepVan.get(l.id);
                  return (
                    <tr key={l.id} className="hover:bg-stage/50 transition-colors">
                      <td className="px-4 py-2.5 sm:px-5">
                        <Link href={`/lidmate/${l.id}`} className="flex items-center gap-2.5 font-medium hover:underline">
                          <LidmaatAvatar lid={l} grootte="sm" />{volleNaam(l)}
                        </Link>
                      </td>
                      <td className="tabular px-3 py-2.5">{fmtOuderdom(berekenOuderdom(l.date_of_birth))}</td>
                      <td className="px-3 py-2.5">
                        {g ? <Kenteken toon="kobalt">{g.naam}</Kenteken>
                           : <Kenteken toon="oorgeplaas">Sonder groep</Kenteken>}
                      </td>
                      <td className="px-4 py-2.5 sm:px-5 text-right">
                        {g ? <span className="text-ink-muted text-xs">—</span>
                           : <Knop grootte="sm" onClick={() => setDeelIn(l)}>Deel in</Knop>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Tabelrol>
        </Paneel>
      </OortjiePaneel>

      <OortjiePaneel sleutel="kalender" aktief={blad}>
        <Paneel>
          <PaneelKop titel="Jeug- en kategesegebeure" byskrif="Uit die gemeentekalender" />
          {gebeure.length === 0 ? (
            <Leeg ikoon={CalendarRange} titel="Niks beplan nie"
              beskrywing="Daar is geen komende jeuggebeure nie."
              aksie={<Knop grootte="sm" ikoon={CalendarPlus} onClick={() => setModaal("gebeurtenis")}>Skep gebeurtenis</Knop>} />
          ) : (
            <ul className="divide-line divide-y">
              {gebeure.map((g) => (
                <li key={g.id} className="flex items-center gap-3.5 px-4 py-3 sm:px-5">
                  <span className="border-line bg-ground flex size-11 shrink-0 flex-col items-center justify-center rounded-lg border">
                    <span className="text-ink-muted text-[0.62rem] font-semibold tracking-wide uppercase">
                      {fmtDatum(g.datum).split(" ")[1]?.slice(0, 3)}
                    </span>
                    <span className="tabular font-display text-base leading-none font-semibold">
                      {new Date(g.datum).getDate()}
                    </span>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{g.titel}</span>
                    <span className="text-ink-muted block truncate text-xs">
                      {g.tyd ? `${g.tyd} · ` : ""}{g.plek ?? "Plek nog nie bepaal nie"}
                    </span>
                  </span>
                  <Kenteken toon="kobalt">Jeug</Kenteken>
                </li>
              ))}
            </ul>
          )}
        </Paneel>
      </OortjiePaneel>

      <GroepModaal oop={modaal === "groep"} sluit={sluit} />
      <KindModaal oop={modaal === "kind"} sluit={sluit} groepe={groepe} />
      <GebeurtenisModaal oop={modaal === "gebeurtenis"} sluit={sluit} />

      <Modaal
        oop={deelIn !== null}
        sluit={() => setDeelIn(null)}
        titel="Deel in by 'n groep"
        breedte="sm"
        beskrywing={deelIn ? volleNaam(deelIn) : undefined}
        voet={
          <>
            <Knop soort="stil" onClick={() => setDeelIn(null)}>Kanselleer</Knop>
            <Knop soort="primer" onClick={() => {
              wys("Kies 'n groep om die kind in te deel — nog nie gebou nie.", "info");
              setDeelIn(null);
            }}>Deel in</Knop>
          </>
        }
      >
        <Veld etiket="Kategesegroep" verpligtend>
          <Kies defaultValue={groepe[0]?.id}>
            {groepe.map((g) => (
              <option key={g.id} value={g.id}>{g.naam} · {g.ouderdomsgroep}</option>
            ))}
          </Kies>
        </Veld>
      </Modaal>
    </>
  );
}

function GroepModaal({ oop, sluit }: { oop: boolean; sluit: () => void }) {
  const { wys } = useMelding();
  const [naam, setNaam] = useState("");
  const [fout, setFout] = useState<string>();

  async function stoor(e: React.FormEvent) {
    e.preventDefault();
    if (!naam.trim()) { setFout("Groepnaam is verpligtend."); return; }
    setFout(undefined);
    const fd = new FormData();
    fd.set("naam", naam);
    const u = await stoorKategeseGroep(fd);
    if (!u.ok) { wys(u.fout, "fout"); return; }
    wys(`Groep “${naam}” geskep.`);
    setNaam("");
    sluit();
  }

  return (
    <Modaal oop={oop} sluit={sluit} titel="Nuwe kategesegroep"
      voet={
        <>
          <Knop soort="stil" onClick={sluit}>Kanselleer</Knop>
          <Knop type="submit" form="groep-vorm" soort="primer">Skep groep</Knop>
        </>
      }>
      <form id="groep-vorm" onSubmit={stoor} className="flex flex-col gap-4" noValidate>
        <VeldRy>
          <Veld etiket="Groepnaam" verpligtend fout={fout}>
            <Invoer value={naam} onChange={(e) => setNaam(e.target.value)} placeholder="Graad 4 – 7" />
          </Veld>
          <Veld etiket="Ouderdomsgroep">
            <Invoer placeholder="10 – 13 jaar" />
          </Veld>
        </VeldRy>
        <VeldRy>
          <Veld etiket="Onderwyser"><Invoer placeholder="Naam en van" /></Veld>
          <Veld etiket="Lokaal"><Invoer placeholder="Lokaal 3" /></Veld>
        </VeldRy>
        <VeldRy>
          <Veld etiket="Dag">
            <Kies defaultValue="Sondag">
              {["Sondag","Maandag","Dinsdag","Woensdag","Donderdag","Vrydag","Saterdag"].map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </Kies>
          </Veld>
          <Veld etiket="Tyd"><Invoer type="time" defaultValue="08:00" /></Veld>
        </VeldRy>
      </form>
    </Modaal>
  );
}

function KindModaal({ oop, sluit, groepe }: {
  oop: boolean; sluit: () => void; groepe: KategeseGroep[];
}) {
  const { wys } = useMelding();
  return (
    <Modaal oop={oop} sluit={sluit} titel="Voeg kind by kategese" breedte="sm"
      beskrywing="Kies 'n bestaande lidmaat onder 18."
      voet={
        <>
          <Knop soort="stil" onClick={sluit}>Kanselleer</Knop>
          <Knop soort="primer" onClick={() => { wys("Byvoeging is nog nie gebou nie.", "info"); sluit(); }}>Voeg by</Knop>
        </>
      }>
      <div className="flex flex-col gap-4">
        <Veld etiket="Lidmaat" verpligtend hulp="Slegs aktiewe lidmate onder 18 verskyn hier.">
          <Invoer placeholder="Begin tik om te soek…" />
        </Veld>
        <Veld etiket="Groep">
          <Kies defaultValue={groepe[0]?.id}>
            {groepe.map((g) => <option key={g.id} value={g.id}>{g.naam}</option>)}
          </Kies>
        </Veld>
      </div>
    </Modaal>
  );
}
