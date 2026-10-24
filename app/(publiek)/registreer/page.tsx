import { publicPageMetadata } from "@/lib/seo";
import { PublicPageStructuredData } from "@/components/publiek/structured-data";
import { PubliekKop } from "@/components/publiek/bladsy-kop";
import { RegistreerVorm } from "./registreer-vorm";

export const metadata = publicPageMetadata("/registreer");

/**
 * DIE APP SE ENIGSTE PUBLIEKE SKRYFROETE.
 *
 * Onbekende besoekers bereik dit via die werf, 'n QR-kode by die ingang, of 'n
 * skakel in 'n WhatsApp-groep. Dit skep 'n inskrywing in die moderasietou en
 * lees NOOIT lidmaatdata terug nie. Sien CLAUDE.md § Auth & access.
 */
export default function RegistreerBladsy() {
  return (
    <>
      <PublicPageStructuredData path="/registreer" />
      <PubliekKop
        oortitel="Word deel van ons"
        titel="Ons wil jou graag leer ken"
        leiding="Vul die vorm in en iemand van die kerkkantoor tree met jou in verbinding. Jy hoef nie te wag vir 'n antwoord om by 'n diens in te loer nie."
      />

      <section className="site-content">
        <div className="onthul glas-paneel border-line rounded-[1.5rem] border p-6 sm:p-9">
          <p className="text-ink-muted mb-7 text-sm">
            Velde gemerk met{" "}
            <span className="text-glas-wyn font-semibold">*</span> is
            verpligtend.
          </p>
          <RegistreerVorm />
        </div>
      </section>
    </>
  );
}
