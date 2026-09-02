import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PubliekKop } from "@/components/publiek/bladsy-kop";
import { GEMEENTE, GESKIEDENIS } from "@/lib/gemeente";

export const metadata: Metadata = {
  title: "Oor ons",
  description:
    "Die NG Moedergemeente Vanderbijlpark is in 1949 gestig — die moedergemeente van al die NG gemeentes in die dorp.",
};

export default function OorOnsBladsy() {
  return (
    <>
      <PubliekKop
        oortitel="Oor ons"
        titel="Die gemeente waaruit die ander gekom het"
        leiding={`Gestig in ${GEMEENTE.gestig}, dieselfde jaar as die dorp. Direk of indirek is ons die moedergemeente van al die NG gemeentes wat sedert die vroeë 1950's in Vanderbijlpark ontstaan het.`}
      />

      <section className="veilig-kant mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10">
          {GESKIEDENIS.map((g) => (
            <article key={g.jaar} className="onthul flex flex-col gap-2">
              <span className="text-accent text-xs font-semibold tracking-[0.16em] uppercase tabular">
                {g.jaar}
              </span>
              <h2 className="font-display text-2xl font-semibold text-balance">
                {g.titel}
              </h2>
              <p className="text-ink-muted text-pretty">{g.teks}</p>
            </article>
          ))}
        </div>

        <div className="border-line mt-12 rounded-2xl border p-6 sm:p-8">
          <h2 className="font-display text-xl font-semibold">
            Waar ons inpas
          </h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-3">
            <div>
              <dt className="text-ink-muted text-xs font-semibold tracking-[0.14em] uppercase">
                Sinode
              </dt>
              <dd className="mt-1 font-medium">{GEMEENTE.sinode}</dd>
            </div>
            <div>
              <dt className="text-ink-muted text-xs font-semibold tracking-[0.14em] uppercase">
                Ring
              </dt>
              <dd className="mt-1 font-medium">{GEMEENTE.ring}</dd>
            </div>
            <div>
              <dt className="text-ink-muted text-xs font-semibold tracking-[0.14em] uppercase">
                Gestig
              </dt>
              <dd className="mt-1 font-medium tabular">{GEMEENTE.gestig}</dd>
            </div>
          </dl>
        </div>

        <Link
          href="/eredienste"
          className="text-brand mt-8 inline-flex min-h-[44px] items-center gap-1.5 font-semibold hover:underline"
        >
          Sien wanneer ons saamkom
          <ArrowRight size={16} aria-hidden />
        </Link>
      </section>
    </>
  );
}
