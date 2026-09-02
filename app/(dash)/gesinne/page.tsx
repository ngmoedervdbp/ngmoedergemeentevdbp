import type { Metadata } from "next";
import Link from "next/link";
import { Heart, MapPin, Baby } from "lucide-react";
import { GesinAksies } from "./gesin-aksies";
import { BladsyKop } from "@/components/kerk/bladsy-kop";
import { LidmaatAvatar } from "@/components/kerk/lidmaat-avatar";
import { Paneel } from "@/components/ui/basis";
import { berekenOuderdom, fmtOuderdom } from "@/lib/format";
import { ledeInFamily, volleNaam, wykPerId } from "@/lib/data/afleidings";
import { haalFamilies, haalLede, haalWyke } from "@/lib/data/gemeente-data";

export const metadata: Metadata = { title: "Gesinne" };

export const dynamic = "force-dynamic";

export default async function GesinneBladsy() {
  const [FAMILIES, LEDE, WYKE] = await Promise.all([
    haalFamilies(),
    haalLede(),
    haalWyke(),
  ]);

  const gesinne = FAMILIES.map((f) => {
    const lede = ledeInFamily(LEDE, f.id);
    return {
      ...f,
      egpaar: lede.filter((l) => l.family_role === "man" || l.family_role === "vrou"),
      kinders: lede.filter((l) => l.family_role === "kind"),
      ander: lede.filter((l) => l.family_role === null),
      totaal: lede.length,
    };
  }).filter((f) => f.totaal > 0);

  return (
    <>
      <BladsyKop
        titel="Gesinne"
        beskrywing={`${gesinne.length} gesinne — elke gesin besit sy eie adres.`}
        aksies={<GesinAksies />}
      />

      <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {gesinne.map((f) => {
          const wyk = wykPerId(WYKE, f.wyk_id);
          return (
            <li key={f.id}>
              <Paneel className="flex h-full flex-col">
                <div className="border-line flex items-center justify-between gap-3 border-b px-4 py-3.5 sm:px-5">
                  <h2 className="font-display truncate text-lg font-semibold">Gesin {f.naam}</h2>
                  <span className="text-ink-muted tabular text-xs">{f.totaal}</span>
                </div>

                <div className="flex flex-col gap-4 px-4 py-4 sm:px-5">
                  {f.egpaar.length > 0 ? (
                    <Groep ikoon={Heart} etiket="Egpaar" lede={f.egpaar} />
                  ) : null}
                  {f.kinders.length > 0 ? (
                    <Groep ikoon={Baby} etiket={`Kinders (${f.kinders.length})`} lede={f.kinders} />
                  ) : null}
                  {f.ander.length > 0 ? (
                    <Groep ikoon={Heart} etiket="Ander" lede={f.ander} />
                  ) : null}
                </div>

                <div className="border-line text-ink-muted mt-auto flex items-start gap-1.5 border-t px-4 py-3 sm:px-5 text-xs">
                  <MapPin size={13} className="mt-0.5 shrink-0" aria-hidden />
                  <span>
                    {f.adres}, {f.stad}
                    {wyk ? <span className="text-ink-muted"> · {wyk.naam}</span> : null}
                  </span>
                </div>
              </Paneel>
            </li>
          );
        })}
      </ul>
    </>
  );
}

function Groep({
  ikoon: Ikoon, etiket, lede,
}: { ikoon: typeof Heart; etiket: string; lede: ReturnType<typeof ledeInFamily> }) {
  return (
    <div>
      <p className="text-ink-muted mb-2 flex items-center gap-1.5 text-[0.68rem] font-semibold tracking-[0.11em] uppercase">
        <Ikoon size={11} strokeWidth={2.2} aria-hidden />
        {etiket}
      </p>
      <ul className="flex flex-col gap-1.5">
        {lede.map((l) => (
          <li key={l.id}>
            <Link href={`/lidmate/${l.id}`}
              className="hover:bg-stage -mx-1.5 flex items-center gap-2.5 rounded-lg px-1.5 py-1 transition-colors">
              <LidmaatAvatar lid={l} grootte="sm" />
              <span className="min-w-0 flex-1 truncate text-sm">{volleNaam(l)}</span>
              <span className="text-ink-muted tabular shrink-0 text-xs">
                {fmtOuderdom(berekenOuderdom(l.date_of_birth))}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
