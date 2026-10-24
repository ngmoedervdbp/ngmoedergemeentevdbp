import { publicPageMetadata } from "@/lib/seo";
import { PublicPageStructuredData } from "@/components/publiek/structured-data";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PubliekKop } from "@/components/publiek/bladsy-kop";
import { Geskiedenis } from "@/components/publiek/geskiedenis";
import { GEMEENTE } from "@/lib/gemeente";

export const metadata = publicPageMetadata("/oor-ons");

export default function OorOnsBladsy() {
  return (
    <>
      <PublicPageStructuredData path="/oor-ons" />
      <PubliekKop
        oortitel="Oor ons"
        titel="Die gemeente waaruit die ander gekom het"
        leiding={`Gestig in ${GEMEENTE.gestig}, dieselfde jaar as die dorp. Direk of indirek is ons die moedergemeente van al die NG gemeentes wat sedert die vroeë 1950's in Vanderbijlpark ontstaan het.`}
      />
      <section className="site-content">
        <Geskiedenis headingLevel={2} />
        <div className="site-info-panel mt-10 onthul">
          <h2>Waar ons inpas</h2>
          <dl className="mt-5 grid gap-5 sm:grid-cols-3">
            {[
              { title: "Sinode", value: GEMEENTE.sinode },
              { title: "Ring", value: GEMEENTE.ring },
              { title: "Gestig", value: GEMEENTE.gestig },
            ].map((item) => (
              <div key={item.title}>
                <dt className="site-eyebrow">{item.title}</dt>
                <dd className="mt-2 text-lg">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <Link href="/eredienste" className="site-text-link mt-6">
          Sien wanneer ons saamkom <ArrowUpRight size={18} aria-hidden />
        </Link>
      </section>
    </>
  );
}
