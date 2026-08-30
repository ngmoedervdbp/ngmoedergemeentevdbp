import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft, CakeSlice, Church, Mail, MapPin,
  Phone, Users, VenusAndMars,
} from "lucide-react";
import { LidmaatAvatar } from "@/components/kerk/lidmaat-avatar";
import { StatusKenteken } from "@/components/kerk/status-kenteken";
import { Kenteken, KnopSkakel, Paneel, PaneelKop } from "@/components/ui/basis";
import { AantekeningKnop, WysigKnop } from "./lid-aksies";
import { berekenOuderdom, fmtDatum, fmtOuderdom } from "@/lib/format";
import {
  familyPerId, ledeInFamily, lidPerId, volleNaam, wykPerId, LEDE,
} from "@/lib/mock";

export function generateStaticParams() {
  return LEDE.map((l) => ({ id: l.id }));
}

export async function generateMetadata(
  props: PageProps<"/lidmate/[id]">,
): Promise<Metadata> {
  const { id } = await props.params;
  const lid = lidPerId(id);
  return { title: lid ? volleNaam(lid) : "Lidmaat" };
}

const ROL_ETIKET = { man: "Man", vrou: "Vrou", kind: "Kind" } as const;

export default async function LidmaatBladsy(props: PageProps<"/lidmate/[id]">) {
  const { id } = await props.params;
  const lid = lidPerId(id);
  if (!lid) notFound();

  const wyk = wykPerId(lid.wyk_id);
  const family = familyPerId(lid.family_id);
  const gesinslede = family ? ledeInFamily(family.id).filter((l) => l.id !== lid.id) : [];
  const ouderdom = berekenOuderdom(lid.date_of_birth);

  return (
    <>
      <KnopSkakel href="/lidmate" soort="stil" grootte="sm" ikoon={ArrowLeft} className="-ml-2 self-start">
        Terug na lidmate
      </KnopSkakel>

      <Paneel className="overflow-hidden">
        <div className="from-was-saffier flex flex-wrap items-start gap-4 bg-gradient-to-b to-white px-4 py-5 sm:gap-5 sm:px-6 sm:py-6">
          <LidmaatAvatar lid={lid} grootte="lg" className="sm:size-20 sm:text-2xl" />
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-2xl leading-tight font-semibold text-balance sm:text-3xl">
              {volleNaam(lid)}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <StatusKenteken status={lid.status} />
              <Kenteken toon={lid.tipe === "belydend" ? "saffier" : "kobalt"}>
                {lid.tipe === "belydend" ? "Belydende lidmaat" : "Dooplidmaat"}
              </Kenteken>
              {wyk ? <Kenteken toon="violet" ikoon={MapPin}>{wyk.naam}</Kenteken> : null}
            </div>
          </div>
          <div className="w-full sm:w-auto [&>*]:w-full sm:[&>*]:w-auto">
            <WysigKnop lid={lid} />
          </div>
        </div>

        <dl className="divide-line grid divide-y sm:grid-cols-2 sm:divide-y-0 sm:[&>div]:border-b sm:[&>div]:border-[var(--color-line)]">
          <Veld ikoon={CakeSlice} etiket="Geboortedatum">
            {lid.date_of_birth ? (
              <>{fmtDatum(lid.date_of_birth)} <span className="text-ink-muted">· {fmtOuderdom(ouderdom)}</span></>
            ) : (
              <span className="text-ink-muted">Geen geboortedatum</span>
            )}
          </Veld>
          <Veld ikoon={VenusAndMars} etiket="Geslag">
            {lid.geslag === "manlik" ? "Manlik" : "Vroulik"}
          </Veld>
          <Veld ikoon={Phone} etiket="Selfoon">
            {lid.selfoon ? <a href={`tel:${lid.selfoon}`} className="raak -my-1.5 inline-flex items-center py-1.5 hover:underline">{lid.selfoon}</a> : <span className="text-ink-muted">—</span>}
          </Veld>
          <Veld ikoon={Mail} etiket="E-pos">
            {lid.epos ? <a href={`mailto:${lid.epos}`} className="raak -my-1.5 inline-flex items-center py-1.5 break-all hover:underline">{lid.epos}</a> : <span className="text-ink-muted">—</span>}
          </Veld>
          <Veld ikoon={MapPin} etiket="Adres">
            {family ? `${family.adres}, ${family.stad}` : <span className="text-ink-muted">—</span>}
          </Veld>
          <Veld ikoon={Church} etiket="Lid sedert">{fmtDatum(lid.lid_sedert)}</Veld>
        </dl>
      </Paneel>

      <div className="grid gap-5 lg:grid-cols-2">
        <Paneel>
          <PaneelKop titel={family ? `Gesin ${family.naam}` : "Gesin"}
            byskrif={family ? family.adres : undefined}
            aksie={family ? <KnopSkakel href="/gesinne" soort="stil" grootte="sm">Sien gesin</KnopSkakel> : undefined} />
          {!family ? (
            <p className="text-ink-muted px-4 py-6 text-sm sm:px-5">
              Hierdie lidmaat is nie aan &apos;n gesin gekoppel nie.
            </p>
          ) : (
            <ul className="divide-line divide-y">
              <li className="bg-stage/40 flex items-center gap-3 px-4 py-2.5 sm:px-5">
                <LidmaatAvatar lid={lid} grootte="sm" />
                <span className="min-w-0 flex-1 truncate text-sm font-medium">{volleNaam(lid)}</span>
                <span className="text-ink-muted text-xs">
                  {lid.family_role ? ROL_ETIKET[lid.family_role] : "—"}
                </span>
              </li>
              {gesinslede.map((g) => (
                <li key={g.id}>
                  <Link href={`/lidmate/${g.id}`} className="hover:bg-stage/60 flex min-h-11 items-center gap-3 px-4 py-2.5 transition-colors sm:px-5">
                    <LidmaatAvatar lid={g} grootte="sm" />
                    <span className="min-w-0 flex-1 truncate text-sm">{volleNaam(g)}</span>
                    <span className="text-ink-muted text-xs">
                      {g.family_role ? ROL_ETIKET[g.family_role] : "—"}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Paneel>

        <Paneel>
          <PaneelKop titel="Aantekeninge" byskrif="Pastorale notas — POPIA-sensitief" />
          {lid.aantekeninge ? (
            <p className="px-4 py-4 text-sm sm:px-5">{lid.aantekeninge}</p>
          ) : (
            <div className="flex flex-col items-start gap-3 px-4 py-5 sm:px-5">
              <p className="text-ink-muted text-sm">Nog geen aantekeninge nie.</p>
              <AantekeningKnop lid={lid} />
            </div>
          )}
        </Paneel>
      </div>

      {wyk ? (
        <Paneel>
          <PaneelKop titel={`Wyk ${wyk.nommer}`}
            byskrif={wyk.ouderling ? `Wyksouderling: ${wyk.ouderling}` : "Geen wyksouderling toegeken nie"}
            aksie={<KnopSkakel href="/wyke" soort="stil" grootte="sm" ikoon={Users}>Sien wyk</KnopSkakel>} />
        </Paneel>
      ) : null}
    </>
  );
}

function Veld({ ikoon: Ikoon, etiket, children }: { ikoon: typeof Phone; etiket: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 px-4 py-3.5 sm:px-6">
      <span className="boog-vorm bg-stage text-ink-muted mt-0.5 flex size-7 shrink-0 items-center justify-center">
        <Ikoon size={13} strokeWidth={1.9} aria-hidden />
      </span>
      <div className="min-w-0">
        <dt className="text-ink-muted text-xs font-semibold tracking-[0.09em] uppercase">{etiket}</dt>
        <dd className="mt-0.5 text-sm">{children}</dd>
      </div>
    </div>
  );
}
