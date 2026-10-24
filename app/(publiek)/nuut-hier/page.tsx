import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PubliekKop } from "@/components/publiek/bladsy-kop";
import { PublicPageStructuredData } from "@/components/publiek/structured-data";
import { EREDIENSTE, GEMEENTE } from "@/lib/gemeente";
import { publicPageMetadata } from "@/lib/seo";

export const metadata = publicPageMetadata("/nuut-hier");

export default function FirstVisitPage() {
  return (
    <>
      <PublicPageStructuredData path="/nuut-hier" />
      <PubliekKop
        oortitel="Nuut hier?"
        titel="Jou eerste keer by die kerk"
        leiding="Dalk is jy nuut in Vanderbijlpark, soek jy 'n Afrikaanse kerktuiste in die Vaal, of was jy lanklaas by 'n diens. Jy is welkom om by NG Moedergemeente te kom kuier."
      />
      <div className="site-content mb-16 flex flex-col gap-8">
        <section className="site-info-panel" aria-labelledby="beplan">
          <h2 id="beplan">Beplan jou Sondagbesoek</h2>
          <dl className="mt-5 grid gap-5 sm:grid-cols-2">
            <div>
              <dt className="site-eyebrow">Die oggenddiens</dt>
              <dd className="mt-2 text-xl">Sondag {EREDIENSTE[0].tyd}</dd>
            </div>
            <div>
              <dt className="site-eyebrow">Die kerkgebou</dt>
              <dd className="mt-2">{GEMEENTE.adres.straat}, {GEMEENTE.adres.dorp}</dd>
            </div>
          </dl>
          <p className="mt-5">
            Gebruik die kaart om jou roete te beplan en kyk na die jongste
            aankondigings voordat jy ry, veral oor vakansies. As jy oor toegang
            tot die gebou of jou gesin se behoeftes wonder, vra die kerkkantoor
            vooraf sodat jy weet wat om te verwag.
          </p>
          <Link href="/kontak" className="site-text-link mt-4">
            Kry die kaart en kontakbesonderhede <ArrowUpRight size={18} aria-hidden />
          </Link>
        </section>

        <section id="op-sondag" aria-labelledby="eerste-diens">
          <h2 id="eerste-diens" className="font-display text-2xl">Wat gebeur as ek die eerste keer kom?</h2>
          <div className="text-ink-muted mt-4 flex flex-col gap-4">
            <p>
              Kom soos jy is. Jy hoef nie lidmaat te wees, vooraf te registreer
              of iemand in die gemeente te ken om die erediens by te woon nie.
              Dra iets waarin jy gemaklik voel. Jy kan jou Bybel saambring as
              jy graag daaruit lees, maar jy hoef niks spesiaals aan te skaf nie.
            </p>
            <p>
              Vra gerus iemand by die deur om jou te wys waar om te sit. Jy kan
              eers net luister en die gemeente leer ken. Niemand gaan jou vra
              om op te staan en jouself voor te stel nie.
            </p>
            <p>
              Ons gewone diensprogram sluit kindertyd en nagmaal op die eerste
              Sondag in. Kyk na die diensblad vir die program en bevestig enige
              spesiale reëlings met die kantoor.
            </p>
          </div>
          <Link href="/eredienste" className="site-text-link mt-4">
            Lees oor eredienste en nagmaal <ArrowUpRight size={18} aria-hidden />
          </Link>
        </section>

        <section id="kinders" className="site-info-panel" aria-labelledby="gesin">
          <h2 id="gesin">Kan ons as gesin kerk toe kom?</h2>
          <p className="mt-4">
            Ja, kinders is welkom in die oggenddiens. Daar is kindertyd tydens
            die diens, en julle kan saam kom kuier voordat julle besluit hoe
            julle verder wil inskakel.
          </p>
          <p className="mt-3">
            As jy Sondagskool of kategese vir jou kind soek, vra vooraf oor die
            huidige groepe, die ontmoetingsplek en die reëlings vir die
            betrokke Sondag. Vir tieners kan die kantoor ook bevestig met wie
            julle oor die jeugprogram kan praat.
          </p>
          <Link href="/vrae#kinders-en-jeug" className="site-text-link mt-4">
            Vrae oor kinders, kategese en jeug <ArrowUpRight size={18} aria-hidden />
          </Link>
        </section>

        <section aria-labelledby="kerktuiste">
          <h2 id="kerktuiste" className="font-display text-2xl">Op soek na &apos;n nuwe kerktuiste?</h2>
          <div className="text-ink-muted mt-4 flex flex-col gap-4">
            <p>
              Verhuising bring baie nuwe dinge: &apos;n adres, &apos;n roetine en
              mense om te leer ken. Jy kan eers &apos;n paar keer by die kerk
              kom kuier. Wanneer jy gereed is, laat jou besonderhede sodat die
              kerkkantoor met jou kan gesels oor lidmaatskap en inskakeling.
            </p>
            <p>
              As jy van &apos;n ander gemeente af kom, vra die kantoor oor die
              oordrag van jou attestaat. Hou die vorige gemeente se naam gereed
              vir die gesprek. Jy hoef nie die administrasie af te handel
              voordat jy &apos;n diens kan besoek nie.
            </p>
            <p>
              Wil jy die gemeente ook deur die week leer ken? Lees oor ons
              Donderdagaand se Bybelstudie, of kyk watter openbare byeenkomste
              op die gemeentekalender verskyn.
            </p>
          </div>
          <div className="mt-5 flex flex-wrap gap-x-7 gap-y-4">
            <Link href="/registreer" className="site-button">Laat jou besonderhede <ArrowUpRight size={18} aria-hidden /></Link>
            <Link href="/bybelstudie" className="site-text-link">Verken Bybelstudie <ArrowUpRight size={18} aria-hidden /></Link>
          </div>
        </section>
        <Link href="/vrae" className="site-text-link">Nog vrae oor kerk toe kom? <ArrowUpRight size={18} aria-hidden /></Link>
      </div>
    </>
  );
}
