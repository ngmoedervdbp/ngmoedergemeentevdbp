"use client";

import { useState } from "react";
import {
  Building2, Copy, ExternalLink, Link2, QrCode, Save, Shield,
  Smartphone, UserCog, Users,
} from "lucide-react";
import { Kenteken, Knop, Paneel, PaneelKop } from "@/components/ui/basis";
import { Oortjies, OortjiePaneel } from "@/components/ui/oortjies";
import { Modaal } from "@/components/ui/modaal";
import { Invoer, Kies, Teksarea, Veld } from "@/components/ui/vorm";
import { QrModaal } from "@/components/modale/algemene-modale";
import { DEMO, useMelding } from "@/components/ui/melding";
import { Tabelrol } from "@/components/ui/tabel";

const REGISTRASIE_URL = "https://ngmoeder.co.za/registreer";

const KERKRAAD = [
  { naam: "Tiaan Botha", epos: "dev2@startechgroup.co.za", rol: "Admin" },
  { naam: "Ds. Marius van Zyl", epos: "dominee@ngmoeder.co.za", rol: "Admin" },
  { naam: "Hans Kruger", epos: "hans.kruger@vodamail.co.za", rol: "Ouderling" },
  { naam: "Piet Els", epos: "piet.els@gmail.com", rol: "Ouderling" },
  { naam: "Daleen Haasbroek", epos: "daleen.haasbroek@sasol.com", rol: "Ouderling" },
] as const;

type Oortjie = "gemeente" | "registrasie" | "admin";

export function InstellingsOortjies() {
  const [oortjie, setOortjie] = useState<Oortjie>("gemeente");
  const [gekopieer, setGekopieer] = useState(false);
  const [qr, setQr] = useState(false);
  const [nooi, setNooi] = useState(false);
  const { wys } = useMelding();

  async function kopieer() {
    try {
      await navigator.clipboard.writeText(REGISTRASIE_URL);
      setGekopieer(true);
      setTimeout(() => setGekopieer(false), 2000);
    } catch {
      setGekopieer(false);
    }
  }

  return (
    <>
      <Oortjies
        etiket="Instellings"
        aktief={oortjie}
        kies={setOortjie}
        items={[
          { sleutel: "gemeente", etiket: "Gemeente", ikoon: Building2 },
          { sleutel: "registrasie", etiket: "Registrasie", ikoon: Link2 },
          { sleutel: "admin", etiket: "Admin", ikoon: Shield, telling: KERKRAAD.length },
        ]}
      />

      <OortjiePaneel sleutel="gemeente" aktief={oortjie}>
        <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
          <Paneel>
            <PaneelKop titel="Kerkinligting" byskrif="Basiese inligting oor jou gemeente" />
            <div className="flex flex-col gap-4 px-4 py-4 sm:px-5">
              <Veld etiket="Kerknaam" verpligtend>
                <Invoer defaultValue="NG Vanderbijlpark Moedergemeente" />
              </Veld>
              <Veld etiket="E-posadres" verpligtend
                hulp="Nuwe lidmaatregistrasies word na hierdie adres gestuur">
                <Invoer type="email" defaultValue="admin@ngmoeder.co.za" />
              </Veld>
              <Veld etiket="Telefoonnommer">
                <Invoer type="tel" defaultValue="016 004 0041" />
              </Veld>
              <Veld etiket="Adres">
                <Teksarea rows={2} defaultValue="Hoek van Faraday en Pasteur, Vanderbijlpark" />
              </Veld>
              <Veld etiket="Welkomsboodskap" hulp="Word gewys ná suksesvolle registrasie">
                <Teksarea rows={3}
                  defaultValue="Welkom by ons gemeente! Ons is bly om jou hier te hê en sien uit daarna om jou beter te leer ken." />
              </Veld>
              <Knop soort="primer" ikoon={Save} className="self-start"
                onClick={() => wys(DEMO("Instellings gestoor"))}>Stoor instellings</Knop>
            </div>
          </Paneel>

          <Paneel className="self-start">
            <PaneelKop titel="Program" byskrif="Installeer vir vinnige toegang" />
            <div className="flex flex-col gap-3 px-4 py-4 sm:px-5">
              <div className="border-line bg-was-groen/50 flex items-start gap-2.5 rounded-lg border px-3.5 py-2.5">
                <Shield size={15} className="text-glas-groen mt-0.5 shrink-0" aria-hidden />
                <p className="text-xs">
                  <strong className="font-semibold">Data word in die wolk gestoor</strong> en oor
                  alle toestelle gesinkroniseer.
                </p>
              </div>
              <p className="text-ink-muted text-xs">
                Installeer op jou toestel om die app soos &apos;n gewone program oop te maak —
                geen blaaier-tabblad nie.
              </p>
              <Knop ikoon={Smartphone}>Installeer program</Knop>
            </div>
          </Paneel>
        </div>
      </OortjiePaneel>

      <OortjiePaneel sleutel="registrasie" aktief={oortjie}>
        <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
          <Paneel>
            <PaneelKop titel="Registrasieskakel" byskrif="Deel hierdie skakel met nuwe lidmate" />
            <div className="flex flex-col gap-3 px-4 py-4 sm:px-5">
              <code className="border-line bg-ground block overflow-x-auto rounded-lg border px-3.5 py-3 text-sm">
                {REGISTRASIE_URL}
              </code>
              <div className="flex flex-wrap gap-2">
                <Knop ikoon={Copy} onClick={kopieer}>
                  {gekopieer ? "Gekopieer" : "Kopieer skakel"}
                </Knop>
                <Knop ikoon={ExternalLink} onClick={() => wys(DEMO("Registrasiebladsy sou oopmaak"), "info")}>Open</Knop>
                <Knop ikoon={QrCode} onClick={() => setQr(true)}>Skep QR-kode</Knop>
              </div>
              <div className="border-line bg-was-wyn/40 mt-1 flex items-start gap-2.5 rounded-lg border px-3.5 py-2.5">
                <Shield size={15} className="text-glas-wyn mt-0.5 shrink-0" aria-hidden />
                <p className="text-xs">
                  <strong className="font-semibold">Dit is die enigste publieke bladsy.</strong>{" "}
                  Dit aanvaar persoonlike data van onbekende besoekers, so dit dra
                  tempo-beperking, &apos;n gemorswag en streng validasie. Dit lees nooit data terug nie.
                </p>
              </div>
            </div>
          </Paneel>

          <Paneel className="self-start">
            <PaneelKop titel="Wenke vir registrasie" />
            <ul className="text-ink-muted flex flex-col gap-2.5 px-4 py-4 sm:px-5 text-sm">
              {[
                "Plaas die QR-kode by die kerk se ingang",
                "Deel die skakel in WhatsApp-groepe",
                "Voeg dit by die kerk se webwerf",
                "Druk dit op nuusbriewe of pamflette",
              ].map((w) => (
                <li key={w} className="flex items-start gap-2.5">
                  <span className="bg-accent mt-1.5 size-1.5 shrink-0 rounded-full" aria-hidden />
                  {w}
                </li>
              ))}
            </ul>
          </Paneel>
        </div>
      </OortjiePaneel>

      <OortjiePaneel sleutel="admin" aktief={oortjie}>
        <Paneel>
          <PaneelKop titel="Kerkraadgebruikers"
            byskrif="Toegang is uitnodiging-alleen — daar is geen publieke registrasie nie"
            aksie={<Knop soort="primer" grootte="sm" ikoon={UserCog} onClick={() => setNooi(true)}>Nooi gebruiker</Knop>} />
          <Tabelrol>
            <table className="w-full min-w-[560px] text-sm">
              <thead className="border-line bg-ground/60 border-b">
                <tr className="text-ink-muted text-left text-xs font-semibold tracking-[0.08em] uppercase">
                  <th scope="col" className="px-4 py-2.5 sm:px-5">Naam</th>
                  <th scope="col" className="px-3 py-2.5">E-pos</th>
                  <th scope="col" className="px-4 py-2.5 sm:px-5">Rol</th>
                </tr>
              </thead>
              <tbody className="divide-line divide-y">
                {KERKRAAD.map((g) => (
                  <tr key={g.epos} className="hover:bg-stage/50 transition-colors">
                    <td className="px-4 py-2.5 sm:px-5">
                      <span className="flex items-center gap-2.5 font-medium">
                        <span aria-hidden className="boog-vorm bg-was-saffier text-glas-saffier ring-line flex size-8 items-center justify-center text-xs font-semibold ring-1">
                          {g.naam.split(" ").map((d) => d.charAt(0)).join("").slice(0, 2).toUpperCase()}
                        </span>
                        {g.naam}
                      </span>
                    </td>
                    <td className="text-ink-muted px-3 py-2.5">{g.epos}</td>
                    <td className="px-4 py-2.5 sm:px-5">
                      <Kenteken toon={g.rol === "Admin" ? "saffier" : "neutraal"}
                        ikoon={g.rol === "Admin" ? Shield : Users}>
                        {g.rol}
                      </Kenteken>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Tabelrol>
        </Paneel>
      </OortjiePaneel>

      <QrModaal oop={qr} sluit={() => setQr(false)} url={REGISTRASIE_URL} />
      <NooiModaal oop={nooi} sluit={() => setNooi(false)} />
    </>
  );
}

function NooiModaal({ oop, sluit }: { oop: boolean; sluit: () => void }) {
  const { wys } = useMelding();
  const [epos, setEpos] = useState("");
  const [fout, setFout] = useState<string>();

  function stuur(e: React.FormEvent) {
    e.preventDefault();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(epos)) {
      setFout("Voer 'n geldige e-posadres in.");
      return;
    }
    setFout(undefined);
    wys(DEMO(`Uitnodiging aan ${epos} gestuur`));
    setEpos("");
    sluit();
  }

  return (
    <Modaal oop={oop} sluit={sluit} titel="Nooi kerkraadslid"
      beskrywing="Toegang is uitnodiging-alleen. Daar is geen publieke registrasie vir kerkraadslede nie."
      voet={
        <>
          <Knop soort="stil" onClick={sluit}>Kanselleer</Knop>
          <Knop type="submit" form="nooi-vorm" soort="primer">Stuur uitnodiging</Knop>
        </>
      }>
      <form id="nooi-vorm" onSubmit={stuur} className="flex flex-col gap-4" noValidate>
        <Veld etiket="E-posadres" verpligtend fout={fout}>
          <Invoer type="email" value={epos} onChange={(e) => setEpos(e.target.value)}
            placeholder="naam@ngmoeder.co.za" />
        </Veld>
        <Veld etiket="Rol" hulp="Admin kan gebruikers bestuur en instellings verander.">
          <Kies defaultValue="ouderling">
            <option value="admin">Admin</option>
            <option value="ouderling">Ouderling</option>
          </Kies>
        </Veld>
      </form>
    </Modaal>
  );
}


