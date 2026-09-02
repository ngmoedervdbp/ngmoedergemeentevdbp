import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Globe, MapPin, Navigation } from "lucide-react";
import { PubliekKop } from "@/components/publiek/bladsy-kop";
import { GEMEENTE } from "@/lib/gemeente";

export const metadata: Metadata = {
  title: "Kontak",
  description:
    "Waar om ons te kry: h/v Faraday en Pasteur Boulevard, Vanderbijlpark.",
};

const KAART_SOEK = encodeURIComponent(
  `${GEMEENTE.adres.straat}, ${GEMEENTE.adres.dorp}`,
);

export default function KontakBladsy() {
  return (
    <>
      <PubliekKop
        oortitel="Kontak"
        titel="Kom kuier by ons"
        leiding="Ons kerkgebou staan sedert 1960 op die hoek van Faraday en Pasteur Boulevard."
      />

      <section className="veilig-kant mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="onthul glas-kaart border-line bg-surface flex flex-col gap-3 rounded-2xl border p-6">
            <span className="boog-vorm bg-was-saffier text-glas-saffier ring-line flex size-10 items-center justify-center ring-1">
              <MapPin size={18} aria-hidden />
            </span>
            <h2 className="font-display text-lg font-semibold">Waar ons is</h2>
            <p className="text-ink-muted text-sm leading-relaxed">
              {GEMEENTE.adres.straat}
              <br />
              {GEMEENTE.adres.dorp}
              <br />
              {GEMEENTE.adres.provinsie}, {GEMEENTE.adres.poskode}
            </p>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${KAART_SOEK}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold hover:underline"
            >
              <Navigation size={14} aria-hidden />
              Wys op die kaart
            </a>
          </div>

          <div className="onthul glas-kaart border-line bg-surface flex flex-col gap-3 rounded-2xl border p-6">
            <span className="boog-vorm bg-was-kobalt text-glas-kobalt ring-line flex size-10 items-center justify-center ring-1">
              <Globe size={18} aria-hidden />
            </span>
            <h2 className="font-display text-lg font-semibold">
              Kry ons aanlyn
            </h2>
            <p className="text-ink-muted text-sm text-pretty">
              Ons plaas nuus, foto&apos;s en veranderinge aan dienstye op ons
              Facebook-blad.
            </p>
            {GEMEENTE.kontak.facebook ? (
              <a
                href={GEMEENTE.kontak.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold hover:underline"
              >
                Volg ons op Facebook
                <ArrowRight size={14} aria-hidden />
              </a>
            ) : null}
          </div>
        </div>

        <div className="border-line bg-was-saffier/40 mt-4 rounded-2xl border p-6 text-center sm:p-8">
          <h2 className="font-display text-xl font-semibold text-balance">
            Wil jy hê ons moet kontak maak?
          </h2>
          <p className="text-ink-muted mx-auto mt-2.5 max-w-md text-sm text-pretty">
            Los jou besonderhede en die kerkkantoor kom terug na jou toe — of
            dit nou is om deel te word, oor &apos;n doop te gesels, of net omdat jy
            iemand nodig het om mee te praat.
          </p>
          <Link
            href="/registreer"
            className="bg-brand focus-visible:outline-accent mt-5 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold text-white shadow-[0_1px_2px_rgba(34,31,38,0.18)] transition-colors hover:bg-[#33326a] focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            Laat ons weet
            <ArrowRight size={16} aria-hidden />
          </Link>
        </div>
      </section>
    </>
  );
}
