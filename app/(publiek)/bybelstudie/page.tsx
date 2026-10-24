import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PubliekKop } from "@/components/publiek/bladsy-kop";
import { PublicPageStructuredData } from "@/components/publiek/structured-data";
import { EREDIENSTE } from "@/lib/gemeente";
import { publicPageMetadata } from "@/lib/seo";

export const metadata = publicPageMetadata("/bybelstudie");

export default function BibleStudyPage() {
  return (
    <>
      <PublicPageStructuredData path="/bybelstudie" />
      <PubliekKop
        oortitel="Saam rondom die Woord"
        titel="Bybelstudie in Vanderbijlpark"
        leiding="Soek jy 'n plek in die Vaal om saam Bybel te lees, vrae te vra en oor geloof te gesels? NG Moedergemeente se Bybelstudie is 'n gesprek vir almal wat dieper wil delf."
      />
      <div className="site-content mb-16 flex flex-col gap-8">
        <section className="site-info-panel" aria-labelledby="tyd-en-plek">
          <h2 id="tyd-en-plek">Donderdae om {EREDIENSTE[1].tyd}</h2>
          <p className="mt-4">
            Die gewone Bybelstudietyd is Donderdagaand om {EREDIENSTE[1].tyd}.
            Kontak die kerkkantoor voor jou eerste besoek om die ontmoetingsplek
            en die week se reëlings te bevestig. Vra ook watter Bybelgedeelte
            of onderwerp tans bespreek word en of daar voorafleeswerk is.
          </p>
          <Link href="/kontak" className="site-text-link mt-4">Vra oor die volgende Bybelstudie <ArrowUpRight size={18} aria-hidden /></Link>
        </section>

        <section id="begin" aria-labelledby="beginners">
          <h2 id="beginners" className="font-display text-2xl">Bybelstudie vir beginners</h2>
          <div className="text-ink-muted mt-4 flex flex-col gap-4">
            <p>
              Jy hoef nie elke Bybelboek te ken of reeds antwoorde gereed te
              hê om belangstelling te toon nie. Laat weet as dit jou eerste
              keer is, sodat die kantoor jou kan help om by die huidige
              gesprek aan te sluit.
            </p>
            <p>
              Wanneer jy die gedeelte het, lees dit rustig deur. Skryf neer
              wat jou opval en watter woorde of vrae jy graag wil bespreek.
              Bring jou eie Bybel of vra vooraf wat jy vir die byeenkoms
              nodig het.
            </p>
          </div>
          <h3 className="mt-6 text-lg font-semibold">Drie vrae om mee te begin</h3>
          <ol className="text-ink-muted mt-3 list-decimal space-y-2 pl-6">
            <li>Wat gebeur in hierdie Bybelgedeelte, en wie is aan die woord?</li>
            <li>Wat verstaan ek nog nie, of waaroor wil ek meer hoor?</li>
            <li>Watter vraag oor my geloof of daaglikse lewe bring ek na die gesprek?</li>
          </ol>
        </section>

        <section className="site-info-panel" aria-labelledby="eerste-navraag">
          <h2 id="eerste-navraag">Wat vra ek voordat ek aansluit?</h2>
          <ul className="text-ink-muted mt-4 list-disc space-y-2 pl-6">
            <li>Waar ontmoet die groep hierdie Donderdag?</li>
            <li>Is die gewone tyd van {EREDIENSTE[1].tyd} steeds van toepassing?</li>
            <li>Watter gedeelte lees ons, en moet ek iets vooraf voorberei?</li>
            <li>Met wie kan ek kontak maak as ek die plek nie kry nie?</li>
          </ul>
          <p className="mt-4">
            Hierdie vrae help veral wanneer jy nuut in die omgewing is of lanklaas
            by &apos;n Bybelstudiegroep ingeskakel het. Bevestig ook die reëlings
            oor skoolvakansies en openbare vakansiedae.
          </p>
        </section>

        <section aria-labelledby="sondag-ook">
          <h2 id="sondag-ook" className="font-display text-2xl">Kom leer die gemeente ook Sondag ken</h2>
          <p className="text-ink-muted mt-4">
            Ons oggenddiens begin Sondae om {EREDIENSTE[0].tyd} by die kerkgebou
            op die hoek van Faraday en Pasteur Boulevard. Jy kan &apos;n diens
            besoek voordat jy oor lidmaatskap besluit. Die besoekersgids help
            jou om jou eerste Sondag te beplan.
          </p>
          <div className="mt-5 flex flex-wrap gap-x-7 gap-y-4">
            <Link href="/nuut-hier" className="site-text-link">Jou eerste Sondag <ArrowUpRight size={18} aria-hidden /></Link>
            <Link href="/kalender-gemeente" className="site-text-link">Sien die gemeentekalender <ArrowUpRight size={18} aria-hidden /></Link>
          </div>
        </section>
      </div>
    </>
  );
}
