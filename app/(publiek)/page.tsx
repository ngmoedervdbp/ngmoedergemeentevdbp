import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { Vensterwand } from "@/components/publiek/vensterwand";
import { Vensterband } from "@/components/publiek/vensterband";
import { Bento } from "@/components/publiek/bento";
import { Sweefborrels } from "@/components/publiek/sweefborrels";
import { EREDIENSTE, GEMEENTE, GESKIEDENIS } from "@/lib/gemeente";

/**
 * Die tuisblad.
 *
 * Die held is 'n vensterwand — 'n regte lanset-arkade met wisselende hoogtes,
 * nie 'n patroon nie. Die inhoud kom daaronder deur op asof die lig net
 * deurgebreek het.
 *
 * Geen foto's: ons het geen egte foto van hierdie gemeente nie, en 'n
 * voorraadfoto van 'n ander kerk lieg. Die argitektuur self is die beeld.
 */
export default function TuisBladsy() {
  const sondag = EREDIENSTE.filter((e) => e.dag === "Sondag");
  const week = EREDIENSTE.filter((e) => e.dag !== "Sondag");

  return (
    <>
      {/* -------------------------------------------------------------- held */}
      <section className="relative isolate overflow-hidden">
        <Vensterwand />
        {/* Die borrels lê bo die vensterwand maar onder die teks — die teks
            se houer is `relative`, so dit wen sonder 'n z-index-oorlog. */}
        <Sweefborrels />

        <div className="veilig-kant relative mx-auto w-full max-w-6xl px-4 pt-24 pb-16 sm:px-6 sm:pt-32 lg:px-8 lg:pt-44 lg:pb-24">
          <div className="max-w-3xl">
            <p className="lig-in text-accent text-[0.7rem] font-semibold tracking-[0.32em] uppercase">
              Sedert {GEMEENTE.gestig} · Vanderbijlpark
            </p>

            {/* Die titel is die hele bladsy se gewig. Spectral, groot, styf
                gespasieer, en die tweede reël in die glastoon — dit lees soos
                'n bladsy uit 'n boek eerder as 'n banier. */}
            <h1 className="lig-in-groot vertraag-1 font-display mt-5 text-[2.7rem] leading-[0.98] font-medium tracking-[-0.03em] text-balance sm:text-[3.8rem] lg:text-[4.6rem]">
              Daar is plek vir jou
              <span className="text-glas-saffier block italic">
                by hierdie tafel
              </span>
            </h1>

            <p className="lig-in vertraag-3 text-ink-muted mt-7 max-w-lg text-base leading-relaxed text-pretty sm:text-lg">
              Die moedergemeente van Vanderbijlpark, al meer as
              sewentig jaar op dieselfde hoek
            </p>

            <div className="lig-in vertraag-4 mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/eredienste"
                className="group bg-brand focus-visible:outline-accent inline-flex min-h-[44px] items-center justify-center gap-2.5 rounded-full px-7 py-3.5 text-sm font-semibold text-white shadow-[0_2px_20px_-6px_rgba(59,58,114,0.6)] transition-all duration-300 hover:bg-[#33326a] hover:shadow-[0_8px_30px_-8px_rgba(59,58,114,0.7)] focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                Wanneer ons saamkom
                <ArrowRight
                  size={16}
                  aria-hidden
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
              <Link
                href="/oor-ons"
                className="text-ink streep-groei inline-flex min-h-[44px] items-center self-start px-1 text-sm font-semibold sm:px-2"
              >
                Leer ons ken
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------- wanneer ons saamkom */}
      <section className="veilig-kant relative mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Asimmetries: die twee Sondagdienste kry gewig, die res 'n smal
            kolom. 'n Ry gelyke bokse is presies wat "goedkoop" laat voel. */}
        <div className="onthul border-line bg-surface overflow-hidden rounded-[1.75rem] border shadow-[0_1px_2px_rgba(34,31,38,0.04)]">
          {/* Die kolomme volg die aantal Sondagdienste — hardkodeer dit nie.
              Voeg die gemeente later 'n aanddiens by, groei die rooster self. */}
          <div
            className="grid lg:grid-cols-[repeat(var(--sondag),1fr)_0.85fr]"
            style={{ "--sondag": sondag.length } as CSSProperties}
          >
            {sondag.map((e) => (
              <div
                key={e.naam}
                className="group border-line relative flex flex-col gap-3 border-b p-7 sm:p-9 lg:border-r lg:border-b-0"
              >
                {/* 'n Hairline wat by hover oor die kaart se bokant trek. */}
                <span
                  aria-hidden
                  className="bg-glas-saffier absolute inset-x-0 top-0 h-px origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                />
                <span className="text-ink-muted text-[0.68rem] font-semibold tracking-[0.24em] uppercase">
                  {e.dag}
                </span>
                <span className="font-display text-glas-saffier text-[3.4rem] leading-[0.9] font-medium tabular">
                  {e.tyd}
                </span>
                <span className="font-display text-lg font-semibold">
                  {e.naam}
                </span>
                <span className="text-ink-muted text-sm leading-relaxed text-pretty">
                  {e.beskrywing}
                </span>
              </div>
            ))}

            <div className="bg-was-saffier/45 flex flex-col justify-between gap-6 p-7 sm:p-9">
              <div className="flex flex-col gap-3">
                {week.map((e) => (
                  <div key={e.naam} className="flex flex-col">
                    <span className="text-ink-muted text-[0.68rem] font-semibold tracking-[0.24em] uppercase">
                      {e.dag}
                    </span>
                    <span className="font-display mt-0.5 text-xl font-medium">
                      <span className="tabular">{e.tyd}</span> · {e.naam}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-glas-saffier/15 flex flex-col gap-2 border-t pt-5">
                <span className="text-ink-muted inline-flex items-center gap-1.5 text-[0.68rem] font-semibold tracking-[0.24em] uppercase">
                  <MapPin size={12} aria-hidden />
                  Waar
                </span>
                <p className="text-sm leading-relaxed font-medium">
                  {GEMEENTE.adres.straat}
                  <br />
                  <span className="text-ink-muted font-normal">
                    {GEMEENTE.adres.dorp}
                  </span>
                </p>
                <Link
                  href="/kontak"
                  className="text-brand group inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold"
                >
                  <span className="streep-groei">Kry aanwysings</span>
                  <ArrowRight
                    size={14}
                    aria-hidden
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Bento />

      {/* ------------------------------------------------------- geskiedenis */}
      <section className="veilig-kant mx-auto w-full max-w-6xl px-4 pt-24 sm:px-6 sm:pt-32 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          {/* Die kop bly staan terwyl die tydlyn verbyrol — dit is 'n
              redaksionele patroon, nie 'n dashboard-een nie. */}
          <div className="onthul lg:sticky lg:top-28 lg:self-start">
            <p className="text-accent text-[0.7rem] font-semibold tracking-[0.32em] uppercase">
              Ons verhaal
            </p>
            <h2 className="font-display mt-4 text-[2.1rem] leading-[1.05] font-medium tracking-[-0.02em] text-balance sm:text-[2.6rem]">
              Meer as sewentig jaar
              <span className="text-glas-saffier block italic">
                op hierdie hoek
              </span>
            </h2>
            <p className="text-ink-muted mt-5 text-pretty">
              Die gemeente is in {GEMEENTE.gestig} gestig — dieselfde jaar as
              die dorp self. Direk of indirek is elke NG gemeente in
              Vanderbijlpark hieruit gebore.
            </p>
          </div>

          <ol className="flex flex-col">
            {GESKIEDENIS.map((g, i) => (
              <li key={g.jaar} className="onthul group relative flex gap-6 sm:gap-8">
                <div className="flex shrink-0 flex-col items-center" aria-hidden>
                  <span className="bg-surface ring-line group-hover:ring-brand mt-1 flex size-3 items-center justify-center rounded-full ring-2 transition-all duration-500">
                    <span className="bg-brand size-1.5 scale-0 rounded-full transition-transform duration-500 group-hover:scale-100" />
                  </span>
                  {i < GESKIEDENIS.length - 1 ? (
                    <span className="from-line w-px flex-1 bg-gradient-to-b to-transparent" />
                  ) : null}
                </div>

                <div className="flex flex-col gap-2 pb-14">
                  <span className="font-display text-glas-saffier/45 text-[2.6rem] leading-none font-medium tabular transition-colors duration-500 group-hover:text-glas-saffier/70">
                    {g.jaar}
                  </span>
                  <h3 className="font-display text-xl font-semibold">
                    {g.titel}
                  </h3>
                  <p className="text-ink-muted leading-relaxed text-pretty">
                    {g.teks}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* -------------------------------------------------------------- nooi */}
      <section className="veilig-kant mx-auto w-full max-w-6xl px-4 pt-10 sm:px-6 lg:px-8">
        <div className="onthul bg-lood relative isolate overflow-hidden rounded-[1.75rem] px-6 py-16 text-center sm:px-12 sm:py-24">
          <Vensterband dowwer className="opacity-[0.16]" />

          <div className="relative mx-auto flex max-w-xl flex-col items-center">
            <p className="text-accent text-[0.7rem] font-semibold tracking-[0.32em] uppercase">
              Nuut hier?
            </p>
            <h2 className="font-display mt-5 text-[2.1rem] leading-[1.05] font-medium tracking-[-0.02em] text-balance text-[#f6f4f0] sm:text-[2.8rem]">
              Kom sit gerus eers agter
              <span className="block italic text-[#c3bfd4]">en luister</span>
            </h2>
            <p className="mt-5 text-pretty text-[#a9a3b8]">
              Niemand gaan jou vra om op te staan of jouself voor te stel nie.
              Wanneer jy gereed is om deel te word, laat ons weet — dan kom ons
              na jou toe.
            </p>
            <Link
              href="/registreer"
              className="group focus-visible:outline-accent mt-9 inline-flex min-h-[44px] items-center justify-center gap-2.5 rounded-full bg-[#f6f4f0] px-7 py-3.5 text-sm font-semibold text-[#221f26] transition-all duration-300 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              Word deel van ons
              <ArrowRight
                size={16}
                aria-hidden
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
