import type { Metadata } from "next";
import Link from "next/link";
import { Archive, Info } from "lucide-react";
import { HeraktiveerKnop } from "./heraktiveer-knop";
import { BladsyKop } from "@/components/kerk/bladsy-kop";
import { StatTeel } from "@/components/kerk/stat-teel";
import { LidmaatAvatar } from "@/components/kerk/lidmaat-avatar";
import { StatusKenteken } from "@/components/kerk/status-kenteken";
import { Leeg, Paneel } from "@/components/ui/basis";
import { Tabelrol } from "@/components/ui/tabel";
import { fmtMaandJaar } from "@/lib/format";
import { geargiveerdeLede, telPerStatus, volleNaam, wykPerId } from "@/lib/mock";

export const metadata: Metadata = { title: "Argief" };

export default function ArgiefBladsy() {
  const lede = geargiveerdeLede();

  return (
    <>
      <BladsyKop titel="Argief"
        beskrywing="Onaktiewe, oorgeplaaste en oorlede lidmate — nie in verslae ingesluit nie." />

      <div className="border-line bg-was-amber/60 flex items-start gap-3 rounded-xl border px-4 py-3 text-sm">
        <span className="boog-vorm bg-surface text-glas-amber ring-line mt-0.5 flex size-8 shrink-0 items-center justify-center ring-1">
          <Info size={15} strokeWidth={2} aria-hidden />
        </span>
        <p>
          <strong className="font-semibold">Hierdie lidmate is geargiveer.</strong> Hulle
          word <strong className="font-semibold">nie</strong> in verslae, statistieke of
          aktiewe lyste ingesluit nie. Data word behou vir geskiedenisdoeleindes — &apos;n
          lidmaat word nooit uitgevee nie.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <StatTeel etiket="Totale argief" waarde={lede.length} ikoon={Archive} tint="saffier" />
        <StatTeel etiket="Onaktief" waarde={telPerStatus("onaktief")} ikoon={Archive} tint="kobalt" />
        <StatTeel etiket="Oorgeplaas" waarde={telPerStatus("oorgeplaas")} ikoon={Archive} tint="amber" />
        <StatTeel etiket="Oorlede" waarde={telPerStatus("oorlede")} ikoon={Archive} tint="wyn" />
      </div>

      <Paneel className="overflow-hidden">
        {lede.length === 0 ? (
          <Leeg ikoon={Archive} titel="Die argief is leeg"
            beskrywing="Elke lidmaat in die register is tans aktief." />
        ) : (
          <Tabelrol>
            <table className="w-full min-w-[720px] text-sm">
              <thead className="border-line bg-ground/60 border-b">
                <tr className="text-ink-muted text-left text-xs font-semibold tracking-[0.08em] uppercase">
                  <th scope="col" className="px-4 py-2.5 sm:px-5">Naam</th>
                  <th scope="col" className="px-3 py-2.5">Selfoon</th>
                  <th scope="col" className="px-3 py-2.5">Wyk</th>
                  <th scope="col" className="px-3 py-2.5">Lid sedert</th>
                  <th scope="col" className="px-3 py-2.5">Status</th>
                  <th scope="col" className="px-4 py-2.5 sm:px-5 text-right">Aksies</th>
                </tr>
              </thead>
              <tbody className="divide-line divide-y">
                {lede.map((l) => {
                  const wyk = wykPerId(l.wyk_id);
                  return (
                    <tr key={l.id} className="hover:bg-stage/50 transition-colors">
                      <td className="px-4 py-2.5 sm:px-5">
                        <Link href={`/lidmate/${l.id}`} className="flex items-center gap-2.5 font-medium hover:underline">
                          <LidmaatAvatar lid={l} grootte="sm" />{volleNaam(l)}
                        </Link>
                      </td>
                      <td className="tabular text-ink-muted px-3 py-2.5">{l.selfoon ?? "—"}</td>
                      <td className="text-ink-muted px-3 py-2.5">{wyk?.naam ?? "—"}</td>
                      <td className="text-ink-muted px-3 py-2.5">{fmtMaandJaar(l.lid_sedert)}</td>
                      <td className="px-3 py-2.5"><StatusKenteken status={l.status} /></td>
                      <td className="px-4 py-2.5 sm:px-5 text-right">
                        {l.status !== "oorlede" ? (
                          <HeraktiveerKnop lid={l} />
                        ) : (
                          <span className="text-ink-muted text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Tabelrol>
        )}
      </Paneel>
    </>
  );
}
