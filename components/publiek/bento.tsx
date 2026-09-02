import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  HandHeart,
  Music,
  Sparkles,
  Users,
} from "lucide-react";
import { GLAS } from "@/lib/glas";
import { komendePubliek } from "@/lib/publieke-kalender";
import { GEMEENTE } from "@/lib/gemeente";

/**
 * Die bento — die hart van die tuisblad.
 *
 * 'n Rooster van ongelyke selle: die kalender kry twee kolomme, die res sit
 * daarom. Dit is wat 'n bladsy uit "ry ná ry ná ry" haal.
 *
 * Elke sel het sy eie toon en sy eie gewig. Die reël wat dit bymekaar hou:
 * hoogstens EEN sel per rooster is donker, en die kalender is altyd die
 * grootste — dit is die inligting waarvoor mense werklik kom.
 */

const BORREL = [
  { ikoon: BookOpen, toon: GLAS.saffier, wasKlas: "bg-was-saffier", etiket: "Kategese" },
  { ikoon: Users, toon: GLAS.kobalt, wasKlas: "bg-was-kobalt", etiket: "Jeug" },
  { ikoon: HandHeart, toon: GLAS.wyn, wasKlas: "bg-was-wyn", etiket: "Omgee" },
  { ikoon: Music, toon: GLAS.groen, wasKlas: "bg-was-groen", etiket: "Sang" },
  { ikoon: Sparkles, toon: GLAS.amber, wasKlas: "bg-was-amber", etiket: "Seniors" },
  { ikoon: CalendarDays, toon: GLAS.violet, wasKlas: "bg-was-violet", etiket: "Byeenkomste" },
];

export function Bento() {
  const komende = komendePubliek(5);

  return (
    <section className="veilig-kant mx-auto w-full max-w-6xl px-4 pt-24 sm:px-6 sm:pt-32 lg:px-8">
      <div className="onthul mx-auto mb-10 max-w-2xl text-center">
        <p className="text-accent text-[0.7rem] font-semibold tracking-[0.32em] uppercase">
          Wat by ons gebeur
        </p>
        <h2 className="font-display mt-4 text-[2.1rem] leading-[1.05] font-medium tracking-[-0.02em] text-balance sm:text-[2.6rem]">
          Daar is elke week
          <span className="text-glas-saffier italic"> iets aan die gang</span>
        </h2>
      </div>

      <div className="grid auto-rows-[minmax(0,auto)] gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* -------------------- Kalender: die grootste sel, twee kolomme breed */}
        <div className="onthul glas-paneel border-line relative order-1 flex flex-col gap-5 overflow-hidden rounded-[1.5rem] border p-6 sm:col-span-2 sm:row-span-2 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-ink-muted text-[0.68rem] font-semibold tracking-[0.24em] uppercase">
                Kalender
              </p>
              <h3 className="font-display mt-1.5 text-2xl font-medium">
                Komende byeenkomste
              </h3>
            </div>
            <span
              aria-hidden
              className="boog-vorm bg-was-saffier text-glas-saffier ring-line flex size-11 shrink-0 items-center justify-center ring-1"
            >
              <CalendarDays size={19} strokeWidth={1.8} />
            </span>
          </div>

          <ul className="divide-line -mx-1 flex flex-col divide-y">
            {komende.map((g) => (
              <li
                key={g.id}
                className="group flex items-center gap-4 px-1 py-3.5 first:pt-0"
              >
                {/* Die datum as 'n klein glaspaneel — dit gee die lys ritme. */}
                <span
                  aria-hidden
                  className="bg-was-saffier/70 text-glas-saffier boog-vorm flex size-12 shrink-0 flex-col items-center justify-center leading-none"
                >
                  <span className="text-[0.6rem] font-semibold tracking-wide uppercase">
                    {new Date(g.datum)
                      .toLocaleDateString("af-ZA", {
                        month: "short",
                        timeZone: "Africa/Johannesburg",
                      })
                      .replace(".", "")}
                  </span>
                  <span className="font-display text-lg font-semibold tabular">
                    {new Date(g.datum).getDate()}
                  </span>
                </span>

                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate font-semibold">{g.titel}</span>
                  <span className="text-ink-muted truncate text-sm">
                    {g.tyd ? <span className="tabular">{g.tyd}</span> : null}
                    {g.tyd && g.plek ? " · " : ""}
                    {g.plek}
                  </span>
                </span>
              </li>
            ))}
          </ul>

          <Link
            href="/kalender-gemeente"
            className="text-brand group mt-auto inline-flex min-h-[44px] items-center gap-1.5 self-start text-sm font-semibold"
          >
            <span className="streep-groei">Sien die hele kalender</span>
            <ArrowRight
              size={14}
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* ------------------------------ Borrels: die bedienings as dryfbolle */}
        <div className="onthul glas-paneel border-line order-2 flex flex-col gap-4 rounded-[1.5rem] border p-6 sm:p-7">
          <div>
            <p className="text-ink-muted text-[0.68rem] font-semibold tracking-[0.24em] uppercase">
              Bedienings
            </p>
            <h3 className="font-display mt-1.5 text-xl font-medium">
              Waar jy kan inskakel
            </h3>
          </div>

          <ul className="grid grid-cols-3 gap-x-2 gap-y-4">
            {BORREL.map((b, i) => {
              const Ikoon = b.ikoon;
              return (
                <li key={b.etiket} className="flex flex-col items-center gap-1.5">
                  <span
                    aria-hidden
                    className={`dryf dryf-${i + 1} borrel boog-vorm ring-line flex size-12 items-center justify-center ring-1 ${b.wasKlas}`}
                    style={{ color: b.toon }}
                  >
                    <Ikoon size={19} strokeWidth={1.8} />
                  </span>
                  <span className="text-ink-muted text-center text-[0.7rem] leading-tight font-medium">
                    {b.etiket}
                  </span>
                </li>
              );
            })}
          </ul>

          <Link
            href="/bedienings"
            className="text-brand group mt-auto inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold"
          >
            <span className="streep-groei">Al ons bedienings</span>
            <ArrowRight
              size={14}
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* ------------------------------------- Nagpaneel: die een donker sel */}
        <div className="onthul nag-paneel order-3 flex flex-col justify-between gap-5 rounded-[1.5rem] p-6 sm:p-7">
          <div>
            <p className="text-[0.68rem] font-semibold tracking-[0.24em] text-[#b9b2cf] uppercase">
              Sedert {GEMEENTE.gestig}
            </p>
            <p className="font-display mt-2 text-[2.6rem] leading-none font-medium text-[#f6f4f0] tabular">
              {new Date().getFullYear() - GEMEENTE.gestig}
            </p>
            <p className="font-display text-lg text-[#c3bfd4] italic">
              jaar op hierdie hoek
            </p>
          </div>
          <Link
            href="/oor-ons"
            className="group inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-[#f6f4f0]"
          >
            <span className="streep-groei">Ons verhaal</span>
            <ArrowRight
              size={14}
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* --------------------------------------------------------- Nuut hier */}
        <div className="onthul glas-paneel border-line order-4 flex flex-col justify-between gap-4 rounded-[1.5rem] border p-6 sm:col-span-2 lg:col-span-3 sm:p-7">
          <div className="flex items-start gap-4">
            <span
              aria-hidden
              className="dryf dryf-4 boog-vorm bg-was-amber text-glas-amber ring-line flex size-12 shrink-0 items-center justify-center ring-1"
            >
              <Sparkles size={20} strokeWidth={1.8} />
            </span>
            <div className="min-w-0">
              <h3 className="font-display text-xl font-medium">
                Eerste keer hier?
              </h3>
              <p className="text-ink-muted mt-1.5 text-sm leading-relaxed text-pretty">
                Kom soos jy is, sit waar jy wil, en gaan wanneer jy wil.
                Niemand gaan jou vra om op te staan nie.
              </p>
            </div>
          </div>
          <Link
            href="/eredienste"
            className="text-brand group inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold"
          >
            <span className="streep-groei">Wat om te verwag</span>
            <ArrowRight
              size={14}
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
