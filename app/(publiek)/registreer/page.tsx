import type { Metadata } from "next";
import { PubliekKop } from "@/components/publiek/bladsy-kop";
import { RegistreerVorm } from "./registreer-vorm";

export const metadata: Metadata = {
  title: "Word deel van ons",
  description:
    "Laat jou besonderhede by die NG Moedergemeente Vanderbijlpark en die kerkkantoor tree met jou in verbinding.",
};

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
      <PubliekKop
        oortitel="Word deel van ons"
        titel="Ons wil jou graag leer ken"
        leiding="Vul die vorm in en iemand van die kerkkantoor tree met jou in verbinding. Jy hoef nie te wag vir 'n antwoord om by 'n diens in te loer nie."
      />

      <section className="veilig-kant mx-auto w-full max-w-2xl px-4 sm:px-6 lg:px-8">
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
