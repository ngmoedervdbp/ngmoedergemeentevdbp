"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CakeSlice, Download, Filter, SearchX, UserRound, Users, X } from "lucide-react";
import { LidmaatAvatar } from "@/components/kerk/lidmaat-avatar";
import { StatusKenteken } from "@/components/kerk/status-kenteken";
import { StatTeel } from "@/components/kerk/stat-teel";
import { Kenteken, Knop, Leeg, Paneel } from "@/components/ui/basis";
import { Tabelrol } from "@/components/ui/tabel";
import { berekenOuderdom, fmtDatum, fmtOuderdom } from "@/lib/format";
import { type Lid, type Status, type Wyk } from "@/lib/tipes/gemeente";
import { volleNaam } from "@/lib/data/afleidings";

const MAANDE = ["Januarie","Februarie","Maart","April","Mei","Junie","Julie","Augustus","September","Oktober","November","Desember"];

type Vinnig = "verjaarsdae" | "seniors" | "jeug" | null;

export function SoekPaneel({ lede, wyke }: { lede: Lid[]; wyke: Wyk[] }) {
  const [vraag, setVraag] = useState("");
  const [maand, setMaand] = useState("alle");
  const [wyk, setWyk] = useState("alle");
  const [status, setStatus] = useState<Status | "alle">("aktief");
  const [ouderdom, setOuderdom] = useState("enige");
  const [kontak, setKontak] = useState("enige");
  const [vinnig, setVinnig] = useState<Vinnig>(null);

  const hierdieMaand = new Date().getMonth();

  const resultate = useMemo(() => {
    const q = vraag.trim().toLowerCase();
    return lede.filter((l) => {
      if (status !== "alle" && l.status !== status) return false;
      if (wyk !== "alle" && l.wyk_id !== wyk) return false;

      const a = berekenOuderdom(l.date_of_birth);
      if (ouderdom === "kind" && !(a !== null && a < 18)) return false;
      if (ouderdom === "volwasse" && !(a !== null && a >= 18 && a < 60)) return false;
      if (ouderdom === "senior" && !(a !== null && a >= 60)) return false;
      if (ouderdom === "geen" && a !== null) return false;

      if (kontak === "selfoon" && !l.selfoon) return false;
      if (kontak === "epos" && !l.epos) return false;
      if (kontak === "geen" && (l.selfoon || l.epos)) return false;

      if (maand !== "alle") {
        if (!l.date_of_birth) return false;
        if (new Date(l.date_of_birth).getMonth() !== Number(maand)) return false;
      }

      if (vinnig === "verjaarsdae" && (!l.date_of_birth || new Date(l.date_of_birth).getMonth() !== hierdieMaand)) return false;
      if (vinnig === "seniors" && !(a !== null && a >= 60)) return false;
      if (vinnig === "jeug" && !(a !== null && a < 18)) return false;

      if (!q) return true;
      return (
        volleNaam(l).toLowerCase().includes(q) ||
        (l.selfoon ?? "").includes(q) ||
        (l.epos ?? "").toLowerCase().includes(q)
      );
    });
  }, [lede, vraag, maand, wyk, status, ouderdom, kontak, vinnig, hierdieMaand]);

  const aktief = lede.filter((l) => l.status === "aktief");
  const verjaarHierdieMaand = aktief.filter(
    (l) => l.date_of_birth && new Date(l.date_of_birth).getMonth() === hierdieMaand,
  ).length;
  const seniors = aktief.filter((l) => (berekenOuderdom(l.date_of_birth) ?? -1) >= 60).length;
  const jeug = aktief.filter((l) => { const a = berekenOuderdom(l.date_of_birth); return a !== null && a < 18; }).length;

  function herstel() {
    setVraag(""); setMaand("alle"); setWyk("alle");
    setStatus("aktief"); setOuderdom("enige"); setKontak("enige"); setVinnig(null);
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTeel etiket="Totale lidmate" waarde={lede.length} ikoon={Users} tint="saffier" />
        <StatTeel etiket="Verjaarsdae hierdie maand" waarde={verjaarHierdieMaand} ikoon={CakeSlice} tint="wyn" />
        <StatTeel etiket="Seniors (60+)" waarde={seniors} ikoon={UserRound} tint="amber" />
        <StatTeel etiket="Jeug (onder 18)" waarde={jeug} ikoon={Users} tint="groen" />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-ink-muted text-xs font-semibold tracking-[0.1em] uppercase">Vinnig</span>
        <Vinnigknop aan={vinnig === "verjaarsdae"} onClick={() => setVinnig(vinnig === "verjaarsdae" ? null : "verjaarsdae")} toon="wyn">
          Verjaarsdae hierdie maand
        </Vinnigknop>
        <Vinnigknop aan={vinnig === "seniors"} onClick={() => setVinnig(vinnig === "seniors" ? null : "seniors")} toon="oorgeplaas">
          Senior lidmate (60+)
        </Vinnigknop>
        <Vinnigknop aan={vinnig === "jeug"} onClick={() => setVinnig(vinnig === "jeug" ? null : "jeug")} toon="aktief">
          Jeug (onder 18)
        </Vinnigknop>
      </div>

      <Paneel>
        <div className="border-line flex items-center gap-2 border-b px-4 py-3 sm:px-5">
          <Filter size={15} className="text-ink-muted" aria-hidden />
          <h2 className="font-display text-lg font-semibold">Filters</h2>
          <Knop soort="stil" grootte="sm" ikoon={X} onClick={herstel} className="ml-auto">Herstel</Knop>
        </div>
        <div className="flex flex-col gap-3 px-4 py-4 sm:px-5">
          <input value={vraag} onChange={(e) => setVraag(e.target.value)}
            type="search" inputMode="search" autoCapitalize="none" autoCorrect="off" spellCheck={false}
            placeholder="Soek naam, selfoon of e-pos…" aria-label="Soek"
            className="border-line bg-surface placeholder:text-ink-muted focus-visible:outline-accent h-10 w-full rounded-lg border px-3 text-sm focus-visible:outline-2 focus-visible:-outline-offset-1" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <Veld etiket="Verjaarsdagmaand">
              <select value={maand} onChange={(e) => setMaand(e.target.value)} className={KIES}>
                <option value="alle">Alle maande</option>
                {MAANDE.map((m, i) => <option key={m} value={i}>{m}</option>)}
              </select>
            </Veld>
            <Veld etiket="Wyk">
              <select value={wyk} onChange={(e) => setWyk(e.target.value)} className={KIES}>
                <option value="alle">Alle wyke</option>
                {wyke.map((w) => <option key={w.id} value={w.id}>{w.naam}</option>)}
              </select>
            </Veld>
            <Veld etiket="Status">
              <select value={status} onChange={(e) => setStatus(e.target.value as Status | "alle")} className={KIES}>
                <option value="alle">Alle status</option>
                <option value="aktief">Aktief</option>
                <option value="onaktief">Onaktief</option>
                <option value="oorgeplaas">Oorgeplaas</option>
                <option value="oorlede">Oorlede</option>
              </select>
            </Veld>
            <Veld etiket="Ouderdom">
              <select value={ouderdom} onChange={(e) => setOuderdom(e.target.value)} className={KIES}>
                <option value="enige">Enige ouderdom</option>
                <option value="kind">Onder 18</option>
                <option value="volwasse">18 – 59</option>
                <option value="senior">60+</option>
                <option value="geen">Geen geboortedatum</option>
              </select>
            </Veld>
            <Veld etiket="Kontak">
              <select value={kontak} onChange={(e) => setKontak(e.target.value)} className={KIES}>
                <option value="enige">Enige kontak</option>
                <option value="selfoon">Het selfoon</option>
                <option value="epos">Het e-pos</option>
                <option value="geen">Geen kontak</option>
              </select>
            </Veld>
          </div>
        </div>
      </Paneel>

      <div className="flex items-center justify-between gap-3">
        <p className="text-ink-muted text-sm">
          <span className="tabular text-ink font-semibold">{resultate.length}</span> lidmate gevind
        </p>
        <Knop grootte="sm" ikoon={Download}>Voer resultate uit</Knop>
      </div>

      <Paneel className="overflow-hidden">
        {resultate.length === 0 ? (
          <Leeg ikoon={SearchX} titel="Niks gevind nie"
            beskrywing="Geen lidmaat pas by hierdie kombinasie van filters nie."
            aksie={<Knop grootte="sm" ikoon={X} onClick={herstel}>Herstel filters</Knop>} />
        ) : (
          <Tabelrol>
            <table className="w-full min-w-[760px] text-sm">
              <thead className="border-line bg-ground/60 border-b">
                <tr className="text-ink-muted text-left text-xs font-semibold tracking-[0.08em] uppercase">
                  <th scope="col" className="px-4 py-2.5 sm:px-5">Naam</th>
                  <th scope="col" className="px-3 py-2.5">Selfoon</th>
                  <th scope="col" className="px-3 py-2.5">Geboortedatum</th>
                  <th scope="col" className="px-3 py-2.5">Ouderdom</th>
                  <th scope="col" className="px-3 py-2.5">Wyk</th>
                  <th scope="col" className="px-4 py-2.5 sm:px-5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-line divide-y">
                {resultate.map((l) => (
                  <tr key={l.id} className="hover:bg-stage/50 transition-colors">
                    <td className="px-4 py-2.5 sm:px-5">
                      <Link href={`/lidmate/${l.id}`} className="flex items-center gap-2.5 font-medium hover:underline">
                        <LidmaatAvatar lid={l} grootte="sm" />{volleNaam(l)}
                      </Link>
                    </td>
                    <td className="tabular text-ink-muted px-3 py-2.5">{l.selfoon ?? "—"}</td>
                    <td className="tabular text-ink-muted px-3 py-2.5">{fmtDatum(l.date_of_birth)}</td>
                    <td className="tabular px-3 py-2.5">{fmtOuderdom(berekenOuderdom(l.date_of_birth))}</td>
                    <td className="text-ink-muted px-3 py-2.5">
                      {wyke.find((w) => w.id === l.wyk_id)?.naam ?? "—"}
                    </td>
                    <td className="px-4 py-2.5 sm:px-5"><StatusKenteken status={l.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Tabelrol>
        )}
      </Paneel>
    </>
  );
}

const KIES = "border-line bg-surface focus-visible:outline-accent h-9 w-full rounded-lg border px-2.5 text-sm focus-visible:outline-2 focus-visible:-outline-offset-1";

function Veld({ etiket, children }: { etiket: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-ink-muted text-xs font-semibold tracking-[0.08em] uppercase">{etiket}</span>
      {children}
    </label>
  );
}

function Vinnigknop({ aan, onClick, toon, children }: {
  aan: boolean; onClick: () => void;
  toon: "wyn" | "oorgeplaas" | "aktief"; children: React.ReactNode;
}) {
  return (
    <button type="button" onClick={onClick} aria-pressed={aan}
      className={`focus-visible:outline-accent inline-flex items-center rounded-full transition-[box-shadow] focus-visible:outline-2 focus-visible:outline-offset-2 ${aan ? "ring-brand/40 ring-2 ring-offset-1" : ""}`}>
      <Kenteken toon={toon}>{children}</Kenteken>
    </button>
  );
}
