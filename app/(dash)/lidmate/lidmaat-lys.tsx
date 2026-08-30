"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Check, LayoutGrid, List, Mail, MapPin, Phone, Search, UserRoundX, X,
} from "lucide-react";
import { LidmaatAvatar } from "@/components/kerk/lidmaat-avatar";
import { StatusKenteken } from "@/components/kerk/status-kenteken";
import { Knop, Leeg, Paneel } from "@/components/ui/basis";
import { Oortjies, OortjiePaneel } from "@/components/ui/oortjies";
import { BevestigModaal } from "@/components/modale/algemene-modale";
import { DEMO, useMelding } from "@/components/ui/melding";
import { Tabelrol } from "@/components/ui/tabel";
import { berekenOuderdom, fmtMaandJaar, fmtOuderdom } from "@/lib/format";
import { volleNaam, type Lid, type Registrasie, type Status, type Wyk } from "@/lib/mock";
import { cn } from "@/lib/utils";

type Aansig = "kaarte" | "lys";
type Oortjie = "almal" | "wag";

export function LidmaatLys({
  lede, wyke, registrasies,
}: { lede: Lid[]; wyke: Wyk[]; registrasies: Registrasie[] }) {
  const [oortjie, setOortjie] = useState<Oortjie>("almal");
  const [aansig, setAansig] = useState<Aansig>("kaarte");
  const [vraag, setVraag] = useState("");
  const [status, setStatus] = useState<Status | "alle">("alle");
  const [wyk, setWyk] = useState<string>("alle");

  const wykNaam = useMemo(
    () => new Map(wyke.map((w) => [w.id, w.naam])), [wyke],
  );

  const gefiltreer = useMemo(() => {
    const q = vraag.trim().toLowerCase();
    return lede.filter((l) => {
      if (status !== "alle" && l.status !== status) return false;
      if (wyk !== "alle" && l.wyk_id !== wyk) return false;
      if (!q) return true;
      return (
        volleNaam(l).toLowerCase().includes(q) ||
        (l.selfoon ?? "").includes(q) ||
        (l.epos ?? "").toLowerCase().includes(q)
      );
    });
  }, [lede, vraag, status, wyk]);

  const isGefiltreer = vraag !== "" || status !== "alle" || wyk !== "alle";

  return (
    <>
      <Oortjies
        etiket="Lidmaatlyste"
        aktief={oortjie}
        kies={setOortjie}
        items={[
          { sleutel: "almal", etiket: "Almal", telling: lede.length },
          { sleutel: "wag", etiket: "Wag vir goedkeuring", telling: registrasies.length, dringend: true },
        ]}
      />

      <OortjiePaneel sleutel="wag" aktief={oortjie}>
        <GoedkeuringsRy registrasies={registrasies} />
      </OortjiePaneel>

      <OortjiePaneel sleutel="almal" aktief={oortjie}>
        <>
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative w-full min-w-0 sm:w-auto sm:min-w-56 sm:flex-1">
              <Search size={15} className="text-ink-muted pointer-events-none absolute top-1/2 left-3 -translate-y-1/2" aria-hidden />
              <input
                value={vraag}
                onChange={(e) => setVraag(e.target.value)}
                type="search"
                inputMode="search"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                placeholder="Soek op naam, selfoon of e-pos…"
                aria-label="Soek lidmate"
                className="border-line bg-surface placeholder:text-ink-muted focus-visible:outline-accent h-11 w-full rounded-lg border pr-3 pl-9 text-sm focus-visible:outline-2 focus-visible:-outline-offset-1 sm:h-10"
              />
            </div>

            <Kies waarde={status} onChange={(v) => setStatus(v as Status | "alle")} etiket="Status">
              <option value="alle">Alle status</option>
              <option value="aktief">Aktief</option>
              <option value="onaktief">Onaktief</option>
              <option value="oorgeplaas">Oorgeplaas</option>
              <option value="oorlede">Oorlede</option>
            </Kies>

            <Kies waarde={wyk} onChange={setWyk} etiket="Wyk">
              <option value="alle">Alle wyke</option>
              {wyke.map((w) => <option key={w.id} value={w.id}>{w.naam}</option>)}
            </Kies>

            {isGefiltreer ? (
              <Knop soort="stil" grootte="sm" ikoon={X}
                onClick={() => { setVraag(""); setStatus("alle"); setWyk("alle"); }}>
                Herstel
              </Knop>
            ) : null}

            <div className="border-line bg-surface ml-auto flex shrink-0 gap-0.5 rounded-lg border p-0.5">
              <AansigKnop aktief={aansig === "kaarte"} onClick={() => setAansig("kaarte")} etiket="Kaarte"><LayoutGrid size={15} aria-hidden /></AansigKnop>
              <AansigKnop aktief={aansig === "lys"} onClick={() => setAansig("lys")} etiket="Lys"><List size={15} aria-hidden /></AansigKnop>
            </div>
          </div>

          <p className="text-ink-muted -mt-2 text-sm">
            <span className="tabular text-ink font-semibold">{gefiltreer.length}</span>{" "}
            {gefiltreer.length === 1 ? "lidmaat" : "lidmate"} gevind
          </p>

          {gefiltreer.length === 0 ? (
            <Paneel>
              <Leeg ikoon={UserRoundX} titel="Geen lidmate gevind nie"
                beskrywing="Probeer 'n ander soekterm of maak die filters oop."
                aksie={<Knop grootte="sm" ikoon={X} onClick={() => { setVraag(""); setStatus("alle"); setWyk("alle"); }}>Herstel filters</Knop>} />
            </Paneel>
          ) : aansig === "kaarte" ? (
            <ul className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-3">
              {gefiltreer.map((l) => (
                <li key={l.id}>
                  <Link href={`/lidmate/${l.id}`}
                    className="border-line bg-surface hover:border-brand/30 focus-visible:outline-accent flex h-full flex-col gap-3 rounded-xl border p-4 shadow-[0_1px_2px_rgba(34,31,38,0.04)] transition-[border-color,box-shadow] hover:shadow-[0_6px_18px_-10px_rgba(34,31,38,0.25)] focus-visible:outline-2">
                    <div className="flex items-start gap-3">
                      <LidmaatAvatar lid={l} grootte="lg" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold">{volleNaam(l)}</p>
                        <p className="text-ink-muted text-xs">
                          {fmtOuderdom(berekenOuderdom(l.date_of_birth))}
                          {l.wyk_id ? ` · ${wykNaam.get(l.wyk_id)}` : " · Geen wyk"}
                        </p>
                        <div className="mt-1.5"><StatusKenteken status={l.status} /></div>
                      </div>
                    </div>
                    <dl className="text-ink-muted mt-auto space-y-1 text-xs">
                      {l.selfoon ? <Reël ikoon={Phone}>{l.selfoon}</Reël> : null}
                      {l.epos ? <Reël ikoon={Mail}>{l.epos}</Reël> : null}
                      <Reël ikoon={MapPin}>Lid sedert {fmtMaandJaar(l.lid_sedert)}</Reël>
                    </dl>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <Paneel className="overflow-hidden">
              <Tabelrol>
                <table className="w-full min-w-[720px] text-sm">
                  <thead className="border-line bg-ground/60 border-b">
                    <tr className="text-ink-muted text-left text-xs font-semibold tracking-[0.08em] uppercase">
                      <th scope="col" className="px-4 py-2.5 sm:px-5">Naam</th>
                      <th scope="col" className="px-3 py-2.5">Selfoon</th>
                      <th scope="col" className="px-3 py-2.5">Ouderdom</th>
                      <th scope="col" className="px-3 py-2.5">Wyk</th>
                      <th scope="col" className="px-3 py-2.5">Lid sedert</th>
                      <th scope="col" className="px-4 py-2.5 sm:px-5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-line divide-y">
                    {gefiltreer.map((l) => (
                      <tr key={l.id} className="hover:bg-stage/50 transition-colors">
                        <td className="px-4 py-2.5 sm:px-5">
                          <Link href={`/lidmate/${l.id}`} className="flex items-center gap-2.5 font-medium hover:underline">
                            <LidmaatAvatar lid={l} grootte="sm" />
                            {volleNaam(l)}
                          </Link>
                        </td>
                        <td className="tabular text-ink-muted px-3 py-2.5">{l.selfoon ?? "—"}</td>
                        <td className="tabular text-ink-muted px-3 py-2.5">{fmtOuderdom(berekenOuderdom(l.date_of_birth))}</td>
                        <td className="text-ink-muted px-3 py-2.5">{l.wyk_id ? wykNaam.get(l.wyk_id) : "—"}</td>
                        <td className="text-ink-muted px-3 py-2.5">{fmtMaandJaar(l.lid_sedert)}</td>
                        <td className="px-4 py-2.5 sm:px-5"><StatusKenteken status={l.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Tabelrol>
            </Paneel>
          )}
        </>
      </OortjiePaneel>
    </>
  );
}

function GoedkeuringsRy({ registrasies }: { registrasies: Registrasie[] }) {
  if (registrasies.length === 0) {
    return (
      <Paneel>
        <Leeg ikoon={Check} titel="Niks wag vir goedkeuring nie"
          beskrywing="Nuwe registrasies vanaf die publieke vorm verskyn hier." />
      </Paneel>
    );
  }
  return (
    <ul className="flex flex-col gap-3">
      {registrasies.map((r) => (
        <Paneel key={r.id} className="flex flex-wrap items-center gap-4 p-4">
          <span aria-hidden className="boog-vorm bg-was-amber text-glas-amber ring-line flex size-11 items-center justify-center text-sm font-semibold ring-1">
            {r.first_name.charAt(0)}{r.last_name.charAt(0)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-semibold">{r.first_name} {r.last_name}</p>
            <p className="text-ink-muted text-xs">
              {[r.selfoon, r.epos, r.adres].filter(Boolean).join(" · ")}
            </p>
          </div>
          <RegistrasieAksies registrasie={r} />
        </Paneel>
      ))}
    </ul>
  );
}

function RegistrasieAksies({ registrasie }: { registrasie: Registrasie }) {
  const [oop, setOop] = useState<"keur" | "verwerp" | null>(null);
  const { wys } = useMelding();
  const naam = `${registrasie.first_name} ${registrasie.last_name}`;
  const sluit = () => setOop(null);

  return (
    <>
      <div className="flex gap-2">
        <Knop grootte="sm" soort="gevaar" ikoon={X} onClick={() => setOop("verwerp")}>Verwerp</Knop>
        <Knop grootte="sm" soort="primer" ikoon={Check} onClick={() => setOop("keur")}>Keur goed</Knop>
      </div>

      <BevestigModaal
        oop={oop === "keur"} sluit={sluit}
        titel="Keur registrasie goed"
        beskrywing={<><strong className="text-ink font-semibold">{naam}</strong> word &apos;n aktiewe lidmaat en verskyn dadelik in verslae en statistieke.</>}
        bevestigEtiket="Keur goed"
        opBevestig={() => wys(DEMO(`${naam} goedgekeur`))}
      />

      <BevestigModaal
        oop={oop === "verwerp"} sluit={sluit}
        titel="Verwerp registrasie"
        soort="gevaar"
        beskrywing={<>Die aansoek van <strong className="text-ink font-semibold">{naam}</strong> word verwyder. Hulle sal weer moet registreer.</>}
        bevestigEtiket="Verwerp"
        opBevestig={() => wys(DEMO(`${naam} verwerp`), "info")}
      />
    </>
  );
}

function Reël({ ikoon: Ikoon, children }: { ikoon: typeof Phone; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1.5">
      <Ikoon size={12} strokeWidth={1.9} className="shrink-0" aria-hidden />
      <span className="truncate">{children}</span>
    </div>
  );
}

function AansigKnop({ aktief, onClick, etiket, children }: { aktief: boolean; onClick: () => void; etiket: string; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} aria-label={etiket} aria-pressed={aktief}
      className={cn("geen-raak-vloer focus-visible:outline-accent flex size-9 items-center justify-center rounded-md transition-colors focus-visible:outline-2 sm:size-8",
        aktief ? "bg-brand text-white" : "text-ink-muted hover:bg-stage")}>
      {children}
    </button>
  );
}

function Kies({ waarde, onChange, etiket, children }: { waarde: string; onChange: (v: string) => void; etiket: string; children: React.ReactNode }) {
  return (
    <select value={waarde} onChange={(e) => onChange(e.target.value)} aria-label={etiket}
      className="border-line bg-surface focus-visible:outline-accent h-11 min-w-0 flex-1 rounded-lg border px-3 text-sm focus-visible:outline-2 focus-visible:-outline-offset-1 sm:h-10 sm:flex-none">
      {children}
    </select>
  );
}
