import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, MapPin } from "lucide-react";
import { PubliekKop } from "@/components/publiek/bladsy-kop";
import { EREDIENSTE, GEMEENTE } from "@/lib/gemeente";

export const metadata: Metadata = {
  title: "Eredienste",
  description:
    "Wanneer ons saamkom by die NG Moedergemeente Vanderbijlpark, en wat om te verwag as jy die eerste keer kom.",
};

export default function EredienssteBladsy() {
  return (
    <>
      <PubliekKop
        oortitel="Eredienste"
        titel="Wanneer ons saamkom"
        leiding="Jy hoef niks saam te bring nie en niks vooraf te weet nie. Kom soos jy is."
      />

      <section className="veilig-kant mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
        <ul className="flex flex-col gap-3">
          {EREDIENSTE.map((e) => (
            <li
              key={`${e.dag}-${e.tyd}`}
              className="onthul glas-kaart border-line bg-surface flex flex-col gap-2 rounded-2xl border p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-6"
            >
              <div className="flex shrink-0 flex-col sm:w-32">
                <span className="text-ink-muted text-xs font-semibold tracking-[0.14em] uppercase">
                  {e.dag}
                </span>
                <span className="font-display text-glas-saffier text-[2.6rem] leading-none font-medium tabular">
                  {e.tyd}
                </span>
              </div>
              <div className="flex min-w-0 flex-col gap-1">
                <h2 className="font-display text-lg font-semibold">{e.naam}</h2>
                <p className="text-ink-muted text-sm text-pretty">
                  {e.beskrywing}
                </p>
                {e.plek ? (
                  <p className="text-ink-muted inline-flex items-start gap-1.5 text-sm">
                    <MapPin size={13} className="mt-0.5 shrink-0" aria-hidden />
                    {e.plek}
                  </p>
                ) : null}
              </div>
            </li>
          ))}
        </ul>

        <div className="onthul border-line bg-was-saffier/40 mt-8 rounded-2xl border p-6 sm:p-8">
          <h2 className="font-display text-xl font-semibold">
            As dit jou eerste keer is
          </h2>
          <div className="text-ink-muted mt-3 flex flex-col gap-2.5 text-sm text-pretty sm:text-base">
            <p>
              Kinders is welkom in die diens — daar is kindertyd tydens die
              oggenddiens.
            </p>
            <p>
              Kom gerus net soos jy is. Iemand by die deur sal jou wys waar om
              te sit.
            </p>
          </div>
        </div>

        <div className="border-line mt-6 flex flex-col gap-3 rounded-2xl border p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="flex items-start gap-2.5">
            <MapPin size={17} className="text-ink-muted mt-0.5 shrink-0" aria-hidden />
            <p className="text-sm leading-relaxed font-medium">
              {GEMEENTE.adres.straat}
              <br />
              <span className="text-ink-muted font-normal">
                {GEMEENTE.adres.dorp}, {GEMEENTE.adres.poskode}
              </span>
            </p>
          </div>
          <Link
            href="/kontak"
            className="text-brand inline-flex min-h-[44px] shrink-0 items-center gap-1.5 text-sm font-semibold hover:underline"
          >
            Kry aanwysings
            <ArrowRight size={15} aria-hidden />
          </Link>
        </div>

        <p className="text-ink-muted mt-6 inline-flex items-start gap-2 text-xs">
          <Clock size={13} className="mt-0.5 shrink-0" aria-hidden />
          Tye kan verander oor vakansies en met spesiale geleenthede — kyk gerus
          op ons Facebook-blad vir die jongste.
        </p>
      </section>
    </>
  );
}
