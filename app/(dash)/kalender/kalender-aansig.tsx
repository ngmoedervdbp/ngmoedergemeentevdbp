"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Clock, MapPin } from "lucide-react";
import { Kenteken, Knop, Leeg, Paneel, PaneelKop } from "@/components/ui/basis";
import { fmtDatum } from "@/lib/format";
import type { Gebeurtenis, GebeurtenisKategorie } from "@/lib/tipes/gemeente";
import { cn } from "@/lib/utils";

const KATEGORIEE = [
  { sleutel: "algemeen", etiket: "Algemeen", toon: "saffier" },
  { sleutel: "jeug", etiket: "Jeug", toon: "kobalt" },
  { sleutel: "seniors", etiket: "Seniors", toon: "violet" },
  { sleutel: "spesiaal", etiket: "Spesiale geleenthede", toon: "oorgeplaas" },
] as const;

const STIP = {
  algemeen: "bg-glas-saffier", jeug: "bg-glas-kobalt",
  seniors: "bg-glas-violet", spesiaal: "bg-glas-amber",
} as const;

const DAE = ["Son", "Maa", "Din", "Woe", "Don", "Vry", "Sat"];
const MAANDE = ["Januarie","Februarie","Maart","April","Mei","Junie","Julie","Augustus","September","Oktober","November","Desember"];

export function KalenderAansig({ gebeurtenisse }: { gebeurtenisse: Gebeurtenis[] }) {
  const vandag = new Date();
  const [maand, setMaand] = useState(new Date(vandag.getFullYear(), vandag.getMonth(), 1));
  const [filters, setFilters] = useState<Set<GebeurtenisKategorie>>(new Set());

  const sigbaar = useMemo(
    () => filters.size === 0 ? gebeurtenisse : gebeurtenisse.filter((g) => filters.has(g.kategorie)),
    [gebeurtenisse, filters],
  );

  const perDag = useMemo(() => {
    const kaart = new Map<string, Gebeurtenis[]>();
    for (const g of sigbaar) {
      const lys = kaart.get(g.datum) ?? [];
      lys.push(g);
      kaart.set(g.datum, lys);
    }
    return kaart;
  }, [sigbaar]);

  const eersteDag = new Date(maand.getFullYear(), maand.getMonth(), 1).getDay();
  const daeInMaand = new Date(maand.getFullYear(), maand.getMonth() + 1, 0).getDate();
  const selle: (Date | null)[] = [
    ...Array.from({ length: eersteDag }, () => null),
    ...Array.from({ length: daeInMaand }, (_, i) => new Date(maand.getFullYear(), maand.getMonth(), i + 1)),
  ];
  while (selle.length % 7 !== 0) selle.push(null);

  const sleutelVan = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  const maandGebeure = sigbaar
    .filter((g) => g.datum.startsWith(`${maand.getFullYear()}-${String(maand.getMonth() + 1).padStart(2, "0")}`))
    .sort((a, b) => a.datum.localeCompare(b.datum));

  function wissel(k: GebeurtenisKategorie) {
    setFilters((vorige) => {
      const nuut = new Set(vorige);
      if (nuut.has(k)) nuut.delete(k); else nuut.add(k);
      return nuut;
    });
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        {KATEGORIEE.map(({ sleutel, etiket, toon }) => {
          const aan = filters.has(sleutel);
          const tel = gebeurtenisse.filter((g) => g.kategorie === sleutel).length;
          return (
            <button key={sleutel} type="button" onClick={() => wissel(sleutel)} aria-pressed={aan}
              className={cn(
                "focus-visible:outline-accent inline-flex items-center rounded-full transition-[box-shadow,opacity] focus-visible:outline-2 focus-visible:outline-offset-2",
                aan ? "ring-brand/40 ring-2 ring-offset-1" : filters.size > 0 ? "opacity-55" : "",
              )}>
              <Kenteken toon={toon}>{etiket} <span className="tabular">{tel}</span></Kenteken>
            </button>
          );
        })}
        {filters.size > 0 ? (
          <Knop soort="stil" grootte="sm" onClick={() => setFilters(new Set())}>Wys almal</Knop>
        ) : null}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.7fr_1fr]">
        <Paneel>
          <div className="border-line flex flex-col-reverse gap-2 border-b px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:px-4 sm:py-3">
            <div className="flex items-center gap-1">
              <Knop soort="stil" grootte="sm" aria-label="Vorige maand"
                onClick={() => setMaand(new Date(maand.getFullYear(), maand.getMonth() - 1, 1))}>
                <ChevronLeft size={16} aria-hidden />
              </Knop>
              <Knop soort="sekonder" grootte="sm"
                onClick={() => setMaand(new Date(vandag.getFullYear(), vandag.getMonth(), 1))}>
                Vandag
              </Knop>
              <Knop soort="stil" grootte="sm" aria-label="Volgende maand"
                onClick={() => setMaand(new Date(maand.getFullYear(), maand.getMonth() + 1, 1))}>
                <ChevronRight size={16} aria-hidden />
              </Knop>
            </div>
            <h2 className="font-display text-lg font-semibold sm:text-xl">
              {MAANDE[maand.getMonth()]} {maand.getFullYear()}
            </h2>
          </div>

          <div className="grid grid-cols-7 border-b border-[var(--color-line)]">
            {DAE.map((d) => (
              <div key={d} className="text-ink-muted px-0.5 py-2 text-center text-xs font-semibold tracking-wide uppercase sm:px-2">
                <span className="sm:hidden">{d.charAt(0)}</span>
                <span className="hidden sm:inline">{d}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {selle.map((d, i) => {
              if (!d) return <div key={i} className="border-line bg-ground/40 min-h-14 border-r border-b last:border-r-0 sm:min-h-24" />;
              const sleutel = sleutelVan(d);
              const items = perDag.get(sleutel) ?? [];
              const isVandag = sleutelVan(vandag) === sleutel;
              return (
                <div key={i} className={cn("border-line min-h-14 border-r border-b p-1 sm:min-h-24 sm:p-1.5", (i + 1) % 7 === 0 && "border-r-0")}>
                  <span className={cn(
                    "tabular mx-auto mb-1 flex size-6 items-center justify-center rounded-full text-xs sm:mx-0",
                    isVandag ? "bg-brand font-semibold text-white" : "text-ink-muted",
                  )}>
                    {d.getDate()}
                  </span>

                  {/*
                    Op 'n foon is 'n sel omtrent 45px breed — 'n titel pas nie.
                    Stippels wys dát daar iets is; die lys hieronder sê wát.
                  */}
                  {items.length > 0 ? (
                    <span className="flex justify-center gap-0.5 sm:hidden">
                      {items.slice(0, 3).map((g) => (
                        <span key={g.id} className={cn("size-1.5 rounded-full", STIP[g.kategorie])} />
                      ))}
                      <span className="sr-only">
                        {items.length} {items.length === 1 ? "gebeurtenis" : "gebeurtenisse"}
                      </span>
                    </span>
                  ) : null}

                  <ul className="hidden flex-col gap-1 sm:flex">
                    {items.slice(0, 2).map((g) => (
                      <li key={g.id} className="bg-stage flex items-center gap-1 rounded px-1.5 py-0.5">
                        <span className={cn("size-1.5 shrink-0 rounded-full", STIP[g.kategorie])} aria-hidden />
                        <span className="truncate text-xs">{g.titel}</span>
                      </li>
                    ))}
                    {items.length > 2 ? (
                      <li className="text-ink-muted px-1.5 text-[0.68rem]">+{items.length - 2} meer</li>
                    ) : null}
                  </ul>
                </div>
              );
            })}
          </div>
        </Paneel>

        <Paneel>
          <PaneelKop titel="Hierdie maand" byskrif={`${maandGebeure.length} gebeurtenisse`} />
          {maandGebeure.length === 0 ? (
            <Leeg ikoon={Clock} titel="Niks hierdie maand nie"
              beskrywing="Daar is geen gebeurtenisse vir hierdie maand nie." />
          ) : (
            <ul className="divide-line divide-y">
              {maandGebeure.map((g) => (
                <li key={g.id} className="flex gap-3 px-4 py-3 sm:px-5">
                  <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", STIP[g.kategorie])} aria-hidden />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{g.titel}</p>
                    <p className="text-ink-muted mt-0.5 text-xs">{fmtDatum(g.datum)}</p>
                    <p className="text-ink-muted mt-0.5 flex flex-wrap gap-x-3 text-xs">
                      {g.tyd ? <span className="flex items-center gap-1"><Clock size={11} aria-hidden />{g.tyd}</span> : null}
                      {g.plek ? <span className="flex items-center gap-1"><MapPin size={11} aria-hidden />{g.plek}</span> : null}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Paneel>
      </div>
    </>
  );
}
