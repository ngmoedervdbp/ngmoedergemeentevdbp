import Link from "next/link";
import {
  ArrowRight, Baby, CakeSlice, CalendarPlus, CalendarRange,
  HeartHandshake, Repeat, TriangleAlert, UserMinus, UserPlus, Users,
} from "lucide-react";
import { BladsyKop } from "@/components/kerk/bladsy-kop";
import { DashAksies } from "./dash-aksies";
import { StatTeel } from "@/components/kerk/stat-teel";
import { LidmaatAvatar } from "@/components/kerk/lidmaat-avatar";
import { GroeiGrafiek } from "@/components/kerk/grafieke";
import { KnopSkakel, Kenteken, Leeg, Paneel, PaneelKop } from "@/components/ui/basis";
import { fmtDatum, fmtMaandJaar } from "@/lib/format";
import {
  groeiPerMaand, komendeGebeurtenisse, komendeVerjaarsdae, nuutsteLede,
  ouderdomsOorsig, telPerStatus, volleNaam,
} from "@/lib/data/afleidings";
import {
  haalGebeurtenisse, haalLede, haalRegistrasieRye,
} from "@/lib/data/gemeente-data";

const KATEGORIE_TOON = {
  algemeen: "saffier", jeug: "kobalt", seniors: "violet", spesiaal: "oorgeplaas",
} as const;

const KATEGORIE_ETIKET = {
  algemeen: "Algemeen", jeug: "Jeug", seniors: "Seniors", spesiaal: "Spesiaal",
} as const;

/** Die tou en tellings verander deur die dag — moenie dit prerender nie. */
export const dynamic = "force-dynamic";

export default async function DashboardBladsy() {
  const [LEDE, GEBEURTENISSE, REGISTRASIES] = await Promise.all([
    haalLede(),
    haalGebeurtenisse(),
    haalRegistrasieRye(),
  ]);

  const o = ouderdomsOorsig(LEDE);
  const verjaarsdae = komendeVerjaarsdae(LEDE, 21);
  const gebeure = komendeGebeurtenisse(GEBEURTENISSE, 5);
  const nuutste = nuutsteLede(LEDE, 5);
  const groei = groeiPerMaand(LEDE);
  const nuweHierdieJaar = LEDE.filter((l) =>
    l.lid_sedert.startsWith(String(new Date().getFullYear())),
  ).length;

  return (
    <>
      <BladsyKop
        titel="Dashboard"
        beskrywing="Welkom terug, Tiaan. Hier is 'n oorsig van jou gemeente."
        aksies={<DashAksies />}
      />

      {REGISTRASIES.length > 0 ? (
        <Link
          href="/lidmate?oortjie=wag"
          className="border-line bg-accent-soft hover:border-accent/40 group flex items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors"
        >
          <span className="boog-vorm bg-surface text-accent ring-line flex size-8 shrink-0 items-center justify-center ring-1">
            <TriangleAlert size={15} strokeWidth={2} aria-hidden />
          </span>
          <span className="min-w-0 flex-1">
            <strong className="font-semibold">{REGISTRASIES.length} nuwe registrasies</strong>{" "}
            wag vir goedkeuring.
          </span>
          <ArrowRight size={16} className="text-accent shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </Link>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatTeel etiket="Aktiewe lidmate" waarde={o.totaalAktief}
          byskrif={`${LEDE.length} totaal in databasis`} ikoon={Users} tint="saffier" />
        <StatTeel etiket="Nuwe lidmate" waarde={nuweHierdieJaar}
          byskrif="Hierdie jaar" ikoon={UserPlus} tint="groen" />
        <StatTeel etiket="Oorledenes" waarde={telPerStatus(LEDE, "oorlede")}
          ikoon={UserMinus} tint="wyn" />
        <StatTeel etiket="Oorgeplaas" waarde={telPerStatus(LEDE, "oorgeplaas")}
          ikoon={Repeat} tint="amber" />
        <StatTeel etiket="Kinders (onder 13)" waarde={o.kindersOnder13}
          byskrif={`${o.sonderDatum} sonder geboortedatum`} ikoon={Baby} tint="kobalt" />
        <StatTeel etiket="Seniors (60+)" waarde={o.seniors}
          ikoon={HeartHandshake} tint="violet" />
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.55fr_1fr]">
        <Paneel>
          <PaneelKop titel="Lidmaatgroei" byskrif="Nuwe lidmate per maand, laaste 12 maande" />
          <div className="px-3 py-4"><GroeiGrafiek data={groei} /></div>
        </Paneel>

        <Paneel>
          <PaneelKop
            titel="Verjaarsdae"
            byskrif="Volgende 21 dae"
            aksie={<Kenteken toon="saffier" ikoon={CakeSlice}>{verjaarsdae.length}</Kenteken>}
          />
          {verjaarsdae.length === 0 ? (
            <Leeg ikoon={CakeSlice} titel="Geen verjaarsdae nie"
              beskrywing="Niemand verjaar in die volgende drie weke nie." />
          ) : (
            <ul className="divide-line divide-y">
              {verjaarsdae.slice(0, 5).map(({ lid, datum, oor, word }) => (
                <li key={lid.id}>
                  <Link href={`/lidmate/${lid.id}`}
                    className="hover:bg-stage/60 flex items-center gap-3 px-4 py-2.5 sm:px-5 transition-colors">
                    <LidmaatAvatar lid={lid} grootte="sm" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{volleNaam(lid)}</span>
                      <span className="text-ink-muted block text-xs">
                        {fmtDatum(datum)} · word {word}
                      </span>
                    </span>
                    <span className="text-ink-muted shrink-0 text-xs">
                      {oor === 0 ? "Vandag" : `oor ${oor} d`}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Paneel>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Paneel>
          <PaneelKop titel="Komende gebeurtenisse"
            aksie={<KnopSkakel href="/kalender" soort="stil" grootte="sm">Sien alles</KnopSkakel>} />
          {gebeure.length === 0 ? (
            <Leeg ikoon={CalendarRange} titel="Niks op die kalender nie"
              beskrywing="Skep 'n gebeurtenis om mee te begin."
              aksie={<KnopSkakel href="/kalender" ikoon={CalendarPlus} grootte="sm">Skep gebeurtenis</KnopSkakel>} />
          ) : (
            <ul className="divide-line divide-y">
              {gebeure.map((g) => (
                <li key={g.id} className="flex items-center gap-3.5 px-4 py-3 sm:px-5">
                  <span className="border-line bg-ground flex size-11 shrink-0 flex-col items-center justify-center rounded-lg border">
                    <span className="text-ink-muted text-[0.62rem] font-semibold tracking-wide uppercase">
                      {fmtDatum(g.datum).split(" ")[1]?.slice(0, 3)}
                    </span>
                    <span className="tabular font-display text-base leading-none font-semibold">
                      {new Date(g.datum).getDate()}
                    </span>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{g.titel}</span>
                    <span className="text-ink-muted block truncate text-xs">
                      {g.tyd ? `${g.tyd} · ` : ""}{g.plek ?? "Plek nog nie bepaal nie"}
                    </span>
                  </span>
                  <Kenteken toon={KATEGORIE_TOON[g.kategorie]}>
                    {KATEGORIE_ETIKET[g.kategorie]}
                  </Kenteken>
                </li>
              ))}
            </ul>
          )}
        </Paneel>

        <Paneel>
          <PaneelKop titel="Nuutste lidmate"
            aksie={<KnopSkakel href="/lidmate" soort="stil" grootte="sm">Sien alles</KnopSkakel>} />
          <ul className="divide-line divide-y">
            {nuutste.map((l) => (
              <li key={l.id}>
                <Link href={`/lidmate/${l.id}`}
                  className="hover:bg-stage/60 flex items-center gap-3 px-4 py-2.5 sm:px-5 transition-colors">
                  <LidmaatAvatar lid={l} grootte="sm" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{volleNaam(l)}</span>
                    <span className="text-ink-muted block text-xs">
                      {l.selfoon ?? l.epos ?? "Geen kontakbesonderhede"}
                    </span>
                  </span>
                  <span className="text-ink-muted shrink-0 text-xs">
                    {fmtMaandJaar(l.lid_sedert)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Paneel>
      </div>
    </>
  );
}
