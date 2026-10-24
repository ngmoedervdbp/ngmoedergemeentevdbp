import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PubliekKop } from "@/components/publiek/bladsy-kop";
import { PublicPageStructuredData } from "@/components/publiek/structured-data";
import { PUBLIC_QUESTION_GROUPS } from "@/lib/public-questions";
import { publicPageMetadata } from "@/lib/seo";

export const metadata = publicPageMetadata("/vrae");

export default function ChurchQuestionsPage() {
  return (
    <>
      <PublicPageStructuredData path="/vrae" />
      <PubliekKop
        oortitel="Vrae en antwoorde"
        titel="Wat wil jy oor die gemeente weet?"
        leiding="Van jou eerste Sondag tot Bybelstudie, kinders en lidmaatskap: hier is praktiese antwoorde oor NG Moedergemeente Vanderbijlpark, en die regte plek om verdere reëlings te bespreek."
      />
      <div className="site-content mb-16">
        <nav aria-label="Onderwerpe op hierdie bladsy" className="site-info-panel">
          <h2>Kies jou onderwerp</h2>
          <ul className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {PUBLIC_QUESTION_GROUPS.map((group) => (
              <li key={group.id}>
                <a href={`#${group.id}`} className="site-text-link">{group.title} <ArrowUpRight size={16} aria-hidden /></a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-10 flex flex-col gap-12">
          {PUBLIC_QUESTION_GROUPS.map((group) => (
            <section key={group.id} id={group.id} aria-labelledby={`${group.id}-title`}>
              <h2 id={`${group.id}-title`} className="font-display mb-5 text-2xl">{group.title}</h2>
              <div className="divide-line border-line divide-y border-y">
                {group.questions.map((item) => (
                  <details key={item.id} id={item.id} className="group py-5">
                    <summary className="cursor-pointer text-lg font-medium marker:text-brand">{item.question}</summary>
                    <p className="text-ink-muted mt-4 leading-relaxed">{item.answer}</p>
                    {item.href.startsWith("https://") ? (
                      <a href={item.href} target="_blank" rel="noopener noreferrer" className="site-text-link mt-3">{item.linkLabel} <ArrowUpRight size={16} aria-hidden /></a>
                    ) : (
                      <Link href={item.href} className="site-text-link mt-3">{item.linkLabel} <ArrowUpRight size={16} aria-hidden /></Link>
                    )}
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>
        <section className="site-info-panel mt-12" aria-labelledby="ander-vraag">
          <h2 id="ander-vraag">Staan jou vraag nie hier nie?</h2>
          <p className="mt-3">Kontak die kerkkantoor vir die jongste reëlings of om te vra met wie jy kan praat. Jy is ook welkom om Sondag eers &apos;n diens te kom besoek.</p>
          <Link href="/kontak" className="site-text-link mt-4">Kom ons help jou verder <ArrowUpRight size={18} aria-hidden /></Link>
        </section>
      </div>
    </>
  );
}
