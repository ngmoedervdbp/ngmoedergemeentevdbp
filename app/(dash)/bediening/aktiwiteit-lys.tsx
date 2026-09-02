"use client";

import { useMemo, useState } from "react";
import { CalendarPlus, Clock, MapPin, Pencil } from "lucide-react";
import { Kenteken, Leeg, Paneel } from "@/components/ui/basis";
import { BedieningChip } from "@/components/kerk/bediening-chip";
import { BEDIENING_TIPE_LYS, BEDIENING_TIPES, LIDMAAT_TIPES } from "@/lib/bediening";
import { fmtDatum, fmtDuur, fmtTydreeks } from "@/lib/format";
import type { BedieningAktiwiteit, BedieningTipe } from "@/lib/tipes/bediening";
import { cn } from "@/lib/utils";

/**
 * Die aktiwiteitslys — die skerm waarop die Dominee die meeste tyd sit.
 *
 * Gegroepeer per dag eerder as 'n plat lys: sy werk is 'n dagboek, en 'n
 * datumkop maak "wat het ek Donderdag gedoen" 'n oogopslag in plaas van 'n
 * soektog deur herhalende datums op elke ry.
 */
export function AktiwiteitLys({
  aktiwiteite,
  wysig,
  nuut,
}: {
  aktiwiteite: BedieningAktiwiteit[];
  wysig: (a: BedieningAktiwiteit) => void;
  nuut: () => void;
}) {
  const [filter, setFilter] = useState<BedieningTipe | "alles">("alles");

  const gefiltreer = useMemo(
    () =>
      filter === "alles"
        ? aktiwiteite
        : aktiwiteite.filter((a) => a.tipe === filter),
    [aktiwiteite, filter],
  );

  /** Tel per tipe, sodat 'n filterkiesie wat niks sal wys, nie gewys word nie. */
  const beskikbaar = useMemo(() => {
    const tel = new Map<BedieningTipe, number>();
    for (const a of aktiwiteite) tel.set(a.tipe, (tel.get(a.tipe) ?? 0) + 1);
    return tel;
  }, [aktiwiteite]);

  const perDag = useMemo(() => {
    const kaart = new Map<string, BedieningAktiwiteit[]>();
    for (const a of gefiltreer) {
      const bestaande = kaart.get(a.datum);
      if (bestaande) bestaande.push(a);
      else kaart.set(a.datum, [a]);
    }
    // Binne 'n dag: vroegste eerste. Aktiwiteite sonder tyd sak na onder.
    for (const lys of kaart.values()) {
      lys.sort((a, b) => (a.begin_tyd ?? "99").localeCompare(b.begin_tyd ?? "99"));
    }
    return [...kaart.entries()];
  }, [gefiltreer]);

  return (
    <div className="flex flex-col gap-4">
      {/* Filterkitsies. `scrollbar-none` want dit rol op 'n foon maar hoef
          nie 'n balk te wys nie; overflow-y moet uitdruklik hidden wees. */}
      <div className="scrollbar-none -mx-1 flex gap-2 overflow-x-auto overflow-y-hidden px-1 pb-1">
        <FilterKits
          aktief={filter === "alles"}
          kies={() => setFilter("alles")}
          etiket="Alles"
          telling={aktiwiteite.length}
        />
        {BEDIENING_TIPE_LYS.filter((t) => beskikbaar.has(t.sleutel)).map((t) => (
          <FilterKits
            key={t.sleutel}
            aktief={filter === t.sleutel}
            kies={() => setFilter(t.sleutel)}
            etiket={t.etiket}
            telling={beskikbaar.get(t.sleutel) ?? 0}
          />
        ))}
      </div>

      {perDag.length === 0 ? (
        <Paneel>
          <Leeg
            ikoon={CalendarPlus}
            titel="Nog niks aangeteken nie"
            beskrywing="Teken jou eerste besoek, vergadering of preek aan — dit vat 'n oomblik."
            aksie={
              <button
                type="button"
                onClick={nuut}
                className="text-brand raak inline-flex items-center font-semibold hover:underline"
              >
                Teken &apos;n aktiwiteit aan
              </button>
            }
          />
        </Paneel>
      ) : (
        <div className="flex flex-col gap-5">
          {perDag.map(([datum, lys]) => (
            <section key={datum} className="flex flex-col gap-2">
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="font-display text-lg font-semibold">
                  {fmtDatum(datum)}
                </h2>
                <span className="text-ink-muted text-xs">
                  {lys.length === 1 ? "1 aktiwiteit" : `${lys.length} aktiwiteite`}
                </span>
              </div>

              <ul className="flex flex-col gap-2">
                {lys.map((a) => (
                  <li key={a.id}>
                    <AktiwiteitRy aktiwiteit={a} wysig={() => wysig(a)} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterKits({
  aktief,
  kies,
  etiket,
  telling,
}: {
  aktief: boolean;
  kies: () => void;
  etiket: string;
  telling: number;
}) {
  return (
    <button
      type="button"
      onClick={kies}
      aria-pressed={aktief}
      className={cn(
        // inline-flex, anders doen min-height niks wanneer die enigste kind
        // inlyn is — sien CLAUDE.md § Mobile.
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors",
        aktief
          ? "border-brand bg-brand text-white"
          : "border-line bg-surface text-ink-muted hover:bg-stage hover:text-ink",
      )}
    >
      {etiket}
      <span className={cn("tabular text-xs", aktief ? "text-white/70" : "text-ink-muted")}>
        {telling}
      </span>
    </button>
  );
}

function AktiwiteitRy({
  aktiwiteit: a,
  wysig,
}: {
  aktiwiteit: BedieningAktiwiteit;
  wysig: () => void;
}) {
  const info = BEDIENING_TIPES[a.tipe];

  return (
    <button
      type="button"
      onClick={wysig}
      className="border-line bg-surface hover:border-brand/30 focus-visible:outline-accent group flex w-full items-start gap-3 rounded-xl border p-3 text-left shadow-[0_1px_2px_rgba(34,31,38,0.04)] transition-[border-color,box-shadow] hover:shadow-[0_6px_18px_-10px_rgba(34,31,38,0.25)] focus-visible:outline-2 sm:p-4"
    >
      <BedieningChip tipe={a.tipe} />

      <span className="flex min-w-0 flex-1 flex-col gap-1.5">
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="truncate font-semibold">{a.titel}</span>
          <Kenteken toon="neutraal">{info.etiket}</Kenteken>
          {a.lidmaat_tipe ? (
            <span className="text-ink-muted text-xs">
              {LIDMAAT_TIPES[a.lidmaat_tipe]}
            </span>
          ) : null}
        </span>

        <span className="text-ink-muted flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
          {a.begin_tyd ? (
            <span className="inline-flex items-center gap-1.5">
              <Clock size={13} aria-hidden />
              <span className="tabular">
                {fmtTydreeks(a.begin_tyd, a.eind_tyd)}
              </span>
              {a.ure !== null ? (
                <span className="text-ink-muted/70">· {fmtDuur(a.ure)}</span>
              ) : null}
            </span>
          ) : null}

          {a.plek_naam ?? a.adres ? (
            <span className="inline-flex min-w-0 items-center gap-1.5">
              <MapPin size={13} aria-hidden className="shrink-0" />
              <span className="truncate">{a.plek_naam ?? a.adres}</span>
            </span>
          ) : null}
        </span>
      </span>

      <Pencil
        size={15}
        aria-hidden
        className="text-ink-muted/0 group-hover:text-ink-muted mt-1 shrink-0 transition-colors"
      />
    </button>
  );
}
