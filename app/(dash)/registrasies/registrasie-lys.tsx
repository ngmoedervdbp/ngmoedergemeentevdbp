"use client";

import { useMemo, useState } from "react";
import {
  Calendar,
  Check,
  Inbox,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  X,
} from "lucide-react";
import { Kenteken, Knop, Leeg, Paneel } from "@/components/ui/basis";
import { DEMO, useMelding } from "@/components/ui/melding";
import { berekenOuderdom, fmtDatum, fmtOuderdom } from "@/lib/format";
import type { Registrasie, RegistrasieStatus } from "@/lib/mock";
import { cn } from "@/lib/utils";

const STATUS: Record<
  RegistrasieStatus,
  { etiket: string; toon: "amber" | "groen" | "wyn" }
> = {
  wagtend: { etiket: "Wag op kontak", toon: "amber" },
  goedgekeur: { etiket: "Goedgekeur", toon: "groen" },
  afgekeur: { etiket: "Afgekeur", toon: "wyn" },
};

const HUWELIK: Record<string, string> = {
  ongetroud: "Ongetroud",
  getroud: "Getroud",
  weduwee_wewenaar: "Weduwee / wewenaar",
};

const GESLAG: Record<string, string> = {
  manlik: "Manlik",
  vroulik: "Vroulik",
};

type Filter = "wagtend" | "alles" | "goedgekeur" | "afgekeur";

export function RegistrasieLys({
  registrasies,
}: {
  registrasies: Registrasie[];
}) {
  // Standaard op "wagtend" — dit is die werk wat gedoen moet word.
  const [filter, setFilter] = useState<Filter>("wagtend");
  const { wys } = useMelding();

  const tellings = useMemo(
    () => ({
      wagtend: registrasies.filter((r) => r.status === "wagtend").length,
      goedgekeur: registrasies.filter((r) => r.status === "goedgekeur").length,
      afgekeur: registrasies.filter((r) => r.status === "afgekeur").length,
      alles: registrasies.length,
    }),
    [registrasies],
  );

  const gewys = useMemo(
    () =>
      filter === "alles"
        ? registrasies
        : registrasies.filter((r) => r.status === filter),
    [registrasies, filter],
  );

  const filters: { sleutel: Filter; etiket: string }[] = [
    { sleutel: "wagtend", etiket: "Wag op kontak" },
    { sleutel: "goedgekeur", etiket: "Goedgekeur" },
    { sleutel: "afgekeur", etiket: "Afgekeur" },
    { sleutel: "alles", etiket: "Alles" },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="scrollbar-none -mx-1 flex gap-2 overflow-x-auto overflow-y-hidden px-1 pb-1">
        {filters.map((f) => (
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
            ikoon={Inbox}
            titel="Niks hier nie"
            beskrywing="Wanneer iemand die vorm op die webwerf invul, verskyn hulle hier."
          />
        </Paneel>
      ) : (
        <ul className="flex flex-col gap-3">
          {gewys.map((r) => {
            const ouderdom = berekenOuderdom(r.date_of_birth);
            const s = STATUS[r.status];

            return (
              <li key={r.id}>
                <Paneel>
                  <div className="flex flex-col gap-4 p-4 sm:p-5">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="flex min-w-0 flex-col gap-0.5">
                        <h2 className="font-display truncate text-lg font-semibold">
                          {r.first_name} {r.last_name}
                        </h2>
                        <p className="text-ink-muted text-sm">
                          Ontvang {fmtDatum(r.ontvang)}
                        </p>
                      </div>
                      <Kenteken toon={s.toon}>{s.etiket}</Kenteken>
                    </div>

                    {/* Kontak eerste — dit is hoekom hierdie bladsy bestaan. */}
                    <div className="flex flex-wrap gap-2">
                      <a
                        href={`tel:${r.selfoon.replace(/\s/g, "")}`}
                        className="border-line bg-surface hover:bg-stage focus-visible:outline-accent inline-flex min-h-[44px] items-center gap-2 rounded-lg border px-3.5 text-sm font-semibold transition-colors focus-visible:outline-2"
                      >
                        <Phone size={14} aria-hidden />
                        <span className="tabular">{r.selfoon}</span>
                      </a>

                      <a
                        href={`https://wa.me/${waNommer(r.selfoon)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border-line bg-surface hover:bg-stage focus-visible:outline-accent inline-flex min-h-[44px] items-center gap-2 rounded-lg border px-3.5 text-sm font-semibold transition-colors focus-visible:outline-2"
                      >
                        <MessageSquare size={14} aria-hidden />
                        WhatsApp
                      </a>

                      {r.epos ? (
                        <a
                          href={`mailto:${r.epos}`}
                          className="border-line bg-surface hover:bg-stage focus-visible:outline-accent inline-flex min-h-[44px] min-w-0 items-center gap-2 rounded-lg border px-3.5 text-sm font-semibold transition-colors focus-visible:outline-2"
                        >
                          <Mail size={14} className="shrink-0" aria-hidden />
                          <span className="truncate">{r.epos}</span>
                        </a>
                      ) : null}
                    </div>

                    <dl className="text-ink-muted grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                      {r.date_of_birth ? (
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="shrink-0" aria-hidden />
                          <dt className="sr-only">Geboortedatum</dt>
                          <dd>
                            {fmtDatum(r.date_of_birth)}
                            <span className="text-ink-muted/70">
                              {" "}
                              · {fmtOuderdom(ouderdom)}
                            </span>
                          </dd>
                        </div>
                      ) : null}

                      {r.geslag || r.huwelikstatus ? (
                        <div className="flex items-center gap-2">
                          <dt className="sr-only">Besonderhede</dt>
                          <dd>
                            {[
                              r.geslag ? GESLAG[r.geslag] : null,
                              r.huwelikstatus
                                ? HUWELIK[r.huwelikstatus]
                                : null,
                            ]
                              .filter(Boolean)
                              .join(" · ")}
                          </dd>
                        </div>
                      ) : null}

                      {r.adres ? (
                        <div className="flex items-start gap-2 sm:col-span-2">
                          <MapPin
                            size={14}
                            className="mt-0.5 shrink-0"
                            aria-hidden
                          />
                          <dt className="sr-only">Adres</dt>
                          <dd className="text-pretty">{r.adres}</dd>
                        </div>
                      ) : null}
                    </dl>

                    {r.aantekeninge ? (
                      <p className="border-line bg-ground text-ink-muted rounded-lg border px-3.5 py-3 text-sm text-pretty">
                        “{r.aantekeninge}”
                      </p>
                    ) : null}

                    {r.status === "wagtend" ? (
                      <div className="border-line flex flex-col gap-2 border-t pt-3.5 sm:flex-row">
                        <Knop
                          soort="primer"
                          grootte="sm"
                          ikoon={Check}
                          onClick={() =>
                            wys(DEMO(`${r.first_name} goedgekeur`))
                          }
                        >
                          Keur goed en skep lidmaat
                        </Knop>
                        <Knop
                          soort="gevaar"
                          grootte="sm"
                          ikoon={X}
                          onClick={() => wys(DEMO("Registrasie afgekeur"))}
                        >
                          Keur af
                        </Knop>
                      </div>
                    ) : null}
                  </div>
                </Paneel>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/**
 * `wa.me` wil 'n internasionale nommer sonder plusteken hê. SA-nommers word
 * plaaslik as 0XX ingevoer, so ruil die leidende nul vir 27.
 */
function waNommer(selfoon: string) {
  const syfers = selfoon.replace(/\D/g, "");
  return syfers.startsWith("0") ? `27${syfers.slice(1)}` : syfers;
}
