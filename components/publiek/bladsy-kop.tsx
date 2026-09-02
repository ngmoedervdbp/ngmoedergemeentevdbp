import { Vensterwand } from "@/components/publiek/vensterwand";

/**
 * Die kop van 'n binneblad op die publieke werf.
 *
 * Heet `PubliekKop` in sy eie module maar word as `BladsyKop` ingevoer waar
 * die admin-weergawe (components/kerk/bladsy-kop.tsx) nie geld nie — die twee
 * lyk doelbewus anders: hierdie een is gesentreer en het die vensterband,
 * want dit is 'n bladsy vir besoekers, nie 'n werkskerm nie.
 */
export function PubliekKop({
  oortitel,
  titel,
  leiding,
}: {
  oortitel?: string;
  titel: string;
  leiding?: string;
}) {
  return (
    <section className="relative overflow-hidden">
      <Vensterwand className="opacity-60" />
      <div className="veilig-kant relative mx-auto w-full max-w-3xl px-4 pt-20 pb-12 text-center sm:px-6 sm:pt-24 lg:px-8">
        {oortitel ? (
          <p className="lig-in text-accent text-[0.7rem] font-semibold tracking-[0.32em] uppercase">
            {oortitel}
          </p>
        ) : null}
        <h1 className="lig-in-groot vertraag-1 font-display mt-4 text-[2.3rem] leading-[1.03] font-medium tracking-[-0.03em] text-balance sm:text-[3rem] lg:text-[3.4rem]">
          {titel}
        </h1>
        {leiding ? (
          <p className="lig-in vertraag-3 text-ink-muted mx-auto mt-5 max-w-xl leading-relaxed text-pretty sm:text-lg">
            {leiding}
          </p>
        ) : null}
      </div>
    </section>
  );
}
