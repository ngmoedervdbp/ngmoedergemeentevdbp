import { publicPageMetadata } from "@/lib/seo";
import { PublicPageStructuredData } from "@/components/publiek/structured-data";
import Link from "next/link";
import { ArrowRight, Clock, MapPin } from "lucide-react";
import { PubliekKop } from "@/components/publiek/bladsy-kop";
import { EREDIENSTE, GEMEENTE } from "@/lib/gemeente";

export const metadata = publicPageMetadata("/eredienste");

export default function EredienssteBladsy() {
  return (
    <>
      <PublicPageStructuredData path="/eredienste" />
      <PubliekKop
        oortitel="Eredienste"
        titel="Eredienste in Vanderbijlpark"
        leiding="Soek jy 'n kerk in die Vaal? Kom Sondag saam met ons by NG Moedergemeente. Jy hoef niks vooraf te weet nie. Kom soos jy is."
      />

      <section className="site-content">
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
        <Link href="/bybelstudie" className="site-text-link mt-5">
          Meer oor Donderdagaand se Bybelstudie <ArrowRight size={16} aria-hidden />
        </Link>

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
            <MapPin
              size={17}
              className="text-ink-muted mt-0.5 shrink-0"
              aria-hidden
            />
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

        <section className="site-info-panel mt-8" aria-labelledby="besoek-vrae">
          <h2 id="besoek-vrae">Jou eerste besoek aan ons kerk</h2>
          <dl className="mt-5 flex flex-col gap-5">
            <div>
              <dt className="font-semibold">Hoe laat begin die Sondagdiens?</dt>
              <dd className="text-ink-muted mt-1">
                Ons oggenddiens begin Sondae om {EREDIENSTE[0].tyd}. Tye kan met
                vakansies en spesiale geleenthede verander; kyk op ons{" "}
                <a href={GEMEENTE.kontak.facebook} target="_blank" rel="noopener noreferrer" className="underline">
                  Facebook-blad
                </a>{" "}
                vir die jongste aankondigings.
              </dd>
            </div>
            <div>
              <dt className="font-semibold">Waar in Vanderbijlpark is die kerk?</dt>
              <dd className="text-ink-muted mt-1">
                Ons kom saam op die hoek van Faraday en Pasteur Boulevard in
                Vanderbijlpark, Gauteng. Of jy in Vanderbijlpark woon of van
                elders in die Vaaldriehoek kom, jy is welkom. Kry die kaart op
                ons <Link href="/kontak" className="underline">kontakblad</Link>.
              </dd>
            </div>
            <div>
              <dt className="font-semibold">Moet ek &apos;n lidmaat wees om te kom?</dt>
              <dd className="text-ink-muted mt-1">
                Nee. Jy kan &apos;n erediens besoek sonder om eers te registreer.
                As jy graag wil inskakel, kan jy later{" "}
                <Link href="/registreer" className="underline">jou besonderhede los</Link>{" "}
                sodat die kerkkantoor met jou kan gesels.
              </dd>
            </div>
          </dl>
        </section>
        <div className="mt-6 flex flex-wrap gap-x-7 gap-y-3">
          <Link href="/nuut-hier" className="site-text-link">Beplan jou eerste Sondag <ArrowRight size={16} aria-hidden /></Link>
          <Link href="/vrae" className="site-text-link">Meer vrae oor die gemeente <ArrowRight size={16} aria-hidden /></Link>
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
