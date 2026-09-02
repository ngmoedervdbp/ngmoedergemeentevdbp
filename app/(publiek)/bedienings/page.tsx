import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PubliekKop } from "@/components/publiek/bladsy-kop";
import { BEDIENINGS } from "@/lib/gemeente";
import { GLAS } from "@/lib/glas";

export const metadata: Metadata = {
  title: "Bedienings",
  description:
    "Kategese, jeug, barmhartigheid en meer — die maniere waarop ons gemeente saam werk en omgee.",
};

/** Elke bediening kry sy eie glastoon, in die volgorde van 'n glasry. */
const TONE = [
  GLAS.saffier,
  GLAS.kobalt,
  GLAS.groen,
  GLAS.wyn,
  GLAS.amber,
  GLAS.violet,
];

export default function BedieningsBladsy() {
  return (
    <>
      <PubliekKop
        oortitel="Bedienings"
        titel="Waar jy kan inskakel"
        leiding="'n Gemeente is nie 'n gebou nie — dit is die mense en die werk wat hulle saam doen. Hier is 'n paar plekke waar jy welkom is."
      />

      <section className="veilig-kant mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        <ul className="grid auto-rows-[minmax(11rem,auto)] gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BEDIENINGS.map((b, i) => (
            <li
              key={b.naam}
              // Ongelyke selle: die eerste twee dra meer gewig. 'n Rooster
              // waar elke sel dieselfde grootte is, is 'n tabel, nie 'n bento.
              className={`onthul glas-kaart glas-paneel border-line flex flex-col gap-2.5 rounded-[1.5rem] border p-5 sm:p-6 ${
                i === 0 ? "sm:col-span-2" : ""
              } ${i === 2 ? "lg:row-span-2" : ""}`}
            >
              {/* Die lansetboog as klein merk, in dié bediening se toon. */}
              <span
                aria-hidden
                className={`dryf dryf-${(i % 6) + 1} borrel boog-vorm ring-line flex size-11 shrink-0 items-center justify-center ring-1`}
                style={{ backgroundColor: `${TONE[i % TONE.length]}1a` }}
              >
                <span
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: TONE[i % TONE.length] }}
                />
              </span>
              <h2 className="font-display text-lg font-semibold">{b.naam}</h2>
              <p className="text-ink-muted text-sm text-pretty">
                {b.beskrywing}
              </p>
            </li>
          ))}
        </ul>

        <div className="onthul border-line mt-10 rounded-2xl border p-6 text-center sm:p-8">
          <h2 className="font-display text-xl font-semibold text-balance">
            Wil jy help, of hulp kry?
          </h2>
          <p className="text-ink-muted mx-auto mt-2.5 max-w-md text-sm text-pretty">
            Albei is welkom, en albei begin met dieselfde gesprek. Laat weet ons
            en iemand kom terug na jou toe.
          </p>
          <Link
            href="/kontak"
            className="text-brand mt-5 inline-flex min-h-[44px] items-center gap-1.5 font-semibold hover:underline"
          >
            Kontak ons
            <ArrowRight size={16} aria-hidden />
          </Link>
        </div>
      </section>
    </>
  );
}
