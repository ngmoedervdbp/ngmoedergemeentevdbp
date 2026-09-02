"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, CalendarClock, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { Kenteken, Leeg, Paneel } from "@/components/ui/basis";
import { AFSPRAAK_FILTERS, AFSPRAAK_STATUSSE, type AfspraakFilter } from "@/lib/bediening";
import { fmtDatum, fmtTydreeks } from "@/lib/format";
import type { Afspraak, AfspraakStatus } from "@/lib/tipes/bediening";
import { cn } from "@/lib/utils";

/** Die kentekentoon per status — Kenteken se eie tone, nie die glaspalet nie. */
const KENTEKEN_TOON: Record<AfspraakStatus, "neutraal" | "groen" | "amber" | "wyn" | "saffier"> = {
  hangend: "amber",
  goedgekeur: "groen",
  herskeduleer: "saffier",
  afgekeur: "wyn",
  voltooi: "neutraal",
  nie_opgedaag: "wyn",
};

export function AfspraakAansig({ afsprake }: { afsprake: Afspraak[] }) {
  const [filter, setFilter] = useState<AfspraakFilter>("hangend");

  const tellings = useMemo(() => {
    const uit = {} as Record<AfspraakFilter, number>;
    for (const f of AFSPRAAK_FILTERS) {
      uit[f.sleutel] = afsprake.filter((a) =>
        (f.dek as readonly AfspraakStatus[]).includes(a.status),
      ).length;
    }
    return uit;
  }, [afsprake]);

  const gewys = useMemo(() => {
    const f = AFSPRAAK_FILTERS.find((x) => x.sleutel === filter);
    if (!f) return [];
    return afsprake.filter((a) =>
      (f.dek as readonly AfspraakStatus[]).includes(a.status),
    );
  }, [afsprake, filter]);

  return (
    <div className="flex flex-col gap-4">
      <Link
        href="/bediening"
        className="text-ink-muted hover:text-ink inline-flex min-h-[44px] min-w-[44px] items-center gap-1.5 self-start text-sm font-semibold"
      >
        <ArrowLeft size={15} aria-hidden />
        Terug na Bediening
      </Link>

      <div className="scrollbar-none -mx-1 flex gap-2 overflow-x-auto overflow-y-hidden px-1 pb-1">
        {AFSPRAAK_FILTERS.map((f) => (
          <button
            key={f.sleutel}
            type="button"
            onClick={() => setFilter(f.sleutel)}
            aria-pressed={filter === f.sleutel}
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors",
              filter === f.sleutel
                ? "border-brand bg-brand text-white"
                : "border-line bg-surface text-ink-muted hover:bg-stage hover:text-ink",
            )}
          >
            {f.etiket}
            <span
              className={cn(
                "tabular text-xs",
                filter === f.sleutel ? "text-white/70" : "text-ink-muted",
              )}
            >
              {tellings[f.sleutel]}
            </span>
          </button>
        ))}
      </div>

      {gewys.length === 0 ? (
        <Paneel>
          <Leeg
            ikoon={CalendarClock}
            titel="Geen afsprake hier nie"
            beskrywing="Niks in hierdie kategorie op die oomblik nie."
          />
        </Paneel>
      ) : (
        <ul className="flex flex-col gap-2">
          {gewys.map((a) => (
            <li key={a.id}>
              <Paneel>
                <div className="flex flex-col gap-3 p-4 sm:p-5">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="flex min-w-0 flex-col gap-0.5">
                      <h2 className="font-display truncate text-lg font-semibold">
                        {a.titel}
                      </h2>
                      {a.persoon_naam ? (
                        <p className="text-ink-muted truncate text-sm">
                          {a.persoon_naam}
                        </p>
                      ) : null}
                    </div>
                    <Kenteken toon={KENTEKEN_TOON[a.status]}>
                      {AFSPRAAK_STATUSSE[a.status].etiket}
                    </Kenteken>
                  </div>

                  {a.beskrywing ? (
                    <p className="text-ink-muted text-sm text-pretty">
                      {a.beskrywing}
                    </p>
                  ) : null}

                  <dl className="text-ink-muted flex flex-wrap gap-x-4 gap-y-1.5 text-sm">
                    <div className="inline-flex items-center gap-1.5">
                      <dt className="sr-only">Datum</dt>
                      <CalendarClock size={14} aria-hidden />
                      <dd className="tabular">
                        {fmtDatum(a.datum)}
                        {a.begin_tyd ? (
                          <> · {fmtTydreeks(a.begin_tyd, a.eind_tyd)}</>
                        ) : null}
                      </dd>
                    </div>

                    {a.persoon_selfoon ? (
                      <div className="inline-flex items-center gap-1.5">
                        <dt className="sr-only">Selfoon</dt>
                        <Phone size={14} aria-hidden />
                        <dd>
                          <a
                            href={`tel:${a.persoon_selfoon.replace(/\s/g, "")}`}
                            className="hover:text-ink tabular inline-flex min-h-[44px] items-center"
                          >
                            {a.persoon_selfoon}
                          </a>
                        </dd>
                      </div>
                    ) : null}

                    {a.persoon_epos ? (
                      <div className="inline-flex min-w-0 items-center gap-1.5">
                        <dt className="sr-only">E-pos</dt>
                        <Mail size={14} aria-hidden className="shrink-0" />
                        <dd className="min-w-0 truncate">
                          <a
                            href={`mailto:${a.persoon_epos}`}
                            className="hover:text-ink inline-flex min-h-[44px] items-center"
                          >
                            {a.persoon_epos}
                          </a>
                        </dd>
                      </div>
                    ) : null}
                  </dl>

                  {a.herskeduleer_na ? (
                    <p className="text-glas-kobalt bg-was-kobalt/50 rounded-lg px-3 py-2 text-sm">
                      Geskuif na {fmtDatum(a.herskeduleer_na)}
                      {a.aantekeninge ? ` — ${a.aantekeninge}` : ""}
                    </p>
                  ) : null}
                </div>
              </Paneel>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
