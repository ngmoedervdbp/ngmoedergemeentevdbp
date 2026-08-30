import type { Metadata } from "next";
import { CalendarOff, Users, UserRound } from "lucide-react";
import { SonderDatumKnop, VerslagAksies } from "./verslag-aksies";
import { BladsyKop } from "@/components/kerk/bladsy-kop";
import { StatTeel } from "@/components/kerk/stat-teel";
import { LidmaatAvatar } from "@/components/kerk/lidmaat-avatar";
import { Paneel, PaneelKop } from "@/components/ui/basis";
import { GroeiGrafiek, HorisontaleStaaf, Legende, RingGrafiek, StaafGrafiek } from "@/components/kerk/grafieke";
import { Tabelrol } from "@/components/ui/tabel";
import { GLAS } from "@/lib/glas";
import { berekenOuderdom, fmtDatum, fmtOuderdom } from "@/lib/format";
import {
  aktieweLede, geslagsTellings, groeiPerMaand, ouderdomsGroepTellings,
  ouderdomsOorsig, wykTellings,
} from "@/lib/mock";

export const metadata: Metadata = { title: "Verslae" };

export default function VerslaeBladsy() {
  const o = ouderdomsOorsig();
  const geslag = geslagsTellings();
  const groepe = ouderdomsGroepTellings();
  const wyke = wykTellings().map((w) => ({ naam: w.naam.replace("Wyk ", ""), waarde: w.tel }));
  const sonderDatum = aktieweLede().filter((l) => !l.date_of_birth);
  const kinders = aktieweLede()
    .filter((l) => { const a = berekenOuderdom(l.date_of_birth); return a !== null && a < 18; })
    .sort((a, b) => (berekenOuderdom(a.date_of_birth) ?? 0) - (berekenOuderdom(b.date_of_birth) ?? 0));

  return (
    <>
      <BladsyKop titel="Verslae" beskrywing="Statistieke en analise van lidmaatskap."
        aksies={<VerslagAksies aantal={o.totaalAktief} />} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTeel etiket="Aktiewe lidmate" waarde={o.totaalAktief} ikoon={Users} tint="saffier" />
        <StatTeel etiket="Volwassenes (18+)" waarde={o.volwassenes} ikoon={UserRound} tint="groen" />
        <StatTeel etiket="Kinders (onder 18)" waarde={o.kinders} ikoon={Users} tint="kobalt" />
        <StatTeel etiket="Geen geboortedatum" waarde={o.sonderDatum}
          byskrif="Uitgesluit uit ouderdomsyfers" ikoon={CalendarOff} tint="amber" />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Paneel>
          <PaneelKop titel="Lidmaatgroei" byskrif="Nuwe lidmate per maand, laaste 12 maande" />
          <div className="px-3 py-4"><GroeiGrafiek data={groeiPerMaand()} /></div>
        </Paneel>

        <Paneel>
          <PaneelKop titel="Geslagsverspreiding" byskrif={`${o.totaalAktief} aktiewe lidmate`} />
          <div className="px-3 pt-4 pb-2"><RingGrafiek data={geslag} kleure={[GLAS.kobalt, GLAS.wyn]} /></div>
          <div className="px-5 pb-4">
            <Legende items={[
              { ...geslag[0], kleur: GLAS.kobalt },
              { ...geslag[1], kleur: GLAS.wyn },
            ]} />
          </div>
        </Paneel>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Paneel>
          <PaneelKop titel="Ouderdomsgroepe" byskrif={`Bereken uit ${o.metDatum} geboortedatums`} />
          <div className="px-3 py-4"><StaafGrafiek data={groepe} kleur={GLAS.violet} /></div>
        </Paneel>

        <Paneel>
          <PaneelKop titel="Lidmate per wyk" byskrif="Slegs aktiewe lidmate" />
          <div className="px-3 py-4"><HorisontaleStaaf data={wyke} /></div>
        </Paneel>
      </div>

      <Paneel className="bg-was-amber/50">
        <div className="flex flex-wrap items-center gap-4 px-4 py-4 sm:px-5">
          <span className="boog-vorm bg-surface text-glas-amber ring-line flex size-10 shrink-0 items-center justify-center ring-1">
            <CalendarOff size={17} strokeWidth={1.9} aria-hidden />
          </span>
          <p className="min-w-0 flex-1 text-sm">
            <strong className="font-semibold">{o.sonderDatum} aktiewe lidmate het geen geboortedatum nie.</strong>{" "}
            Hulle word uit elke ouderdomsyfer op hierdie bladsy weggelaat — nie as nul getel nie.
          </p>
          <SonderDatumKnop lede={sonderDatum} />
        </div>
      </Paneel>

      <Paneel>
        <PaneelKop titel="Lys van kinders onder 18" byskrif={`${kinders.length} kinders`} />
        <Tabelrol>
          <table className="w-full min-w-[640px] text-sm">
            <thead className="border-line bg-ground/60 border-b">
              <tr className="text-ink-muted text-left text-xs font-semibold tracking-[0.08em] uppercase">
                <th scope="col" className="px-4 py-2.5 sm:px-5">Naam</th>
                <th scope="col" className="px-3 py-2.5">Van</th>
                <th scope="col" className="px-3 py-2.5">Ouderdom</th>
                <th scope="col" className="px-3 py-2.5">Geboortedatum</th>
                <th scope="col" className="px-4 py-2.5 sm:px-5">Geslag</th>
              </tr>
            </thead>
            <tbody className="divide-line divide-y">
              {kinders.map((l) => (
                <tr key={l.id} className="hover:bg-stage/50 transition-colors">
                  <td className="px-4 py-2.5 sm:px-5">
                    <span className="flex items-center gap-2.5 font-medium">
                      <LidmaatAvatar lid={l} grootte="sm" />{l.first_name}
                    </span>
                  </td>
                  <td className="text-ink-muted px-3 py-2.5">{l.last_name}</td>
                  <td className="tabular px-3 py-2.5">{fmtOuderdom(berekenOuderdom(l.date_of_birth))}</td>
                  <td className="tabular text-ink-muted px-3 py-2.5">{fmtDatum(l.date_of_birth)}</td>
                  <td className="text-ink-muted px-4 py-2.5 sm:px-5">{l.geslag === "manlik" ? "Manlik" : "Vroulik"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Tabelrol>
      </Paneel>
    </>
  );
}
