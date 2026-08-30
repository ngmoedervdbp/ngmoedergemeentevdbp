import type { Metadata } from "next";
import { BookMarked, Building2, FileText, MailOpen } from "lucide-react";
import { AflaaiKnop, OplaaiKnop, VoegDokumentKnop } from "./dok-aksies";
import { BladsyKop } from "@/components/kerk/bladsy-kop";
import { Kenteken, Leeg, Paneel, PaneelKop } from "@/components/ui/basis";
import { fmtDatum } from "@/lib/format";
import { DOKUMENTE } from "@/lib/mock";

export const metadata: Metadata = { title: "Dokumentasie" };

const SLEUTEL_IKOON = {
  lidmaatskapvorm: FileText,
  grondwet: BookMarked,
  bankbesonderhede: Building2,
  welkombrief: MailOpen,
} as const;

export default function DokumentasieBladsy() {
  const vaste = DOKUMENTE.filter((d) => d.sleutel !== null);
  const ander = DOKUMENTE.filter((d) => d.sleutel === null);

  return (
    <>
      <BladsyKop titel="Dokumentasie" beskrywing="Bestuur kerkdokumente vir lidmate." />

      <section className="flex flex-col gap-3.5">
        <div>
          <h2 className="font-display text-xl font-semibold">Nuwe lidmaat dokumente</h2>
          <p className="text-ink-muted mt-0.5 text-sm">
            Hierdie dokumente word aan nuwe lidmate beskikbaar gestel ná registrasie.
          </p>
        </div>

        <ul className="grid gap-4 md:grid-cols-2">
          {vaste.map((d) => {
            const Ikoon = SLEUTEL_IKOON[d.sleutel!];
            const opgelaai = d.lêernaam !== null;
            return (
              <li key={d.id}>
                <Paneel className="flex h-full flex-col p-5">
                  <div className="flex items-start gap-3.5">
                    <span className={`boog-vorm ring-line flex size-11 shrink-0 items-center justify-center ring-1 ${opgelaai ? "bg-was-saffier text-glas-saffier" : "bg-stage text-ink-muted"}`}>
                      <Ikoon size={19} strokeWidth={1.8} aria-hidden />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-display text-lg leading-snug font-semibold">{d.titel}</h3>
                      <p className="text-ink-muted mt-0.5 text-xs">{d.beskrywing}</p>
                      <div className="mt-2">
                        {opgelaai ? (
                          <Kenteken toon="aktief">Opgelaai</Kenteken>
                        ) : (
                          <Kenteken toon="oorgeplaas">Nog nie opgelaai nie</Kenteken>
                        )}
                      </div>
                    </div>
                  </div>

                  {opgelaai ? (
                    <div className="border-line mt-4 flex items-center justify-between gap-3 border-t pt-3">
                      <p className="text-ink-muted min-w-0 truncate text-xs">
                        {d.lêernaam} · {d.grootte} · {fmtDatum(d.opgelaai)}
                      </p>
                      <div className="flex shrink-0 gap-2">
                        <AflaaiKnop titel={d.titel} />
                        <OplaaiKnop titel={d.titel} vervang />
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4">
                      <OplaaiKnop titel={d.titel} />
                    </div>
                  )}
                </Paneel>
              </li>
            );
          })}
        </ul>
      </section>

      <Paneel>
        <PaneelKop titel="Ander dokumente" byskrif="Addisionele dokumente en hulpbronne"
          aksie={<VoegDokumentKnop />} />
        {ander.length === 0 ? (
          <Leeg ikoon={FileText} titel="Geen ander dokumente nie"
            beskrywing="Laai enige addisionele hulpbronne op wat die kerkraad benodig." />
        ) : (
          <ul className="divide-line divide-y">
            {ander.map((d) => (
              <li key={d.id} className="flex flex-wrap items-center gap-3 px-4 py-3 sm:px-5">
                <span className="boog-vorm bg-stage text-ink-muted flex size-9 shrink-0 items-center justify-center">
                  <FileText size={16} strokeWidth={1.8} aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{d.titel}</p>
                  <p className="text-ink-muted truncate text-xs">
                    {d.beskrywing} · {d.grootte} · {fmtDatum(d.opgelaai)}
                  </p>
                </div>
                <AflaaiKnop titel={d.titel} />
              </li>
            ))}
          </ul>
        )}
      </Paneel>
    </>
  );
}
