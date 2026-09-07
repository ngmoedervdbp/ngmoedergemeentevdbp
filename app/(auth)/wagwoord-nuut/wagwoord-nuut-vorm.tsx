"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, TriangleAlert } from "lucide-react";
import { Knop } from "@/components/ui/basis";
import { KruisLaaier } from "@/components/ui/kruis-laaier";
import { Invoer, Veld } from "@/components/ui/vorm";
import { createClient } from "@/lib/supabase/client";

/**
 * Stel 'n nuwe wagwoord ná 'n uitnodiging of herstel-skakel.
 *
 * Dit MOET 'n kliëntkomponent wees: die eenmalige token kom in die URL, en by
 * die fragment-vorm (`#access_token=…`) sien net die blaaier dit — 'n fragment
 * word nooit na die bediener gestuur nie.
 *
 * Supabase stuur die token op TWEE maniere, afhangend van die vloei:
 *   1. `?code=…`            — PKCE. Moet uitdruklik ingeruil word.
 *   2. `#access_token=…`    — die ouer fragment-vorm, outomaties hanteer.
 *
 * ⚠ MOENIE `getSession()` een keer op mount roep en die antwoord glo nie.
 *   Die kliënt het die token dan nog nie verwerk nie, so dit gee `null` terug
 *   en die bladsy sê "die skakel het verval" oor 'n perfek geldige skakel.
 *   Dít was 'n regte fout: dieselfde skakel het soms gewerk en soms nie,
 *   afhangend van watter een eerste klaar was.
 */
export function WagwoordNuutVorm() {
  const router = useRouter();
  const [wagwoord, setWagwoord] = useState("");
  const [bevestig, setBevestig] = useState("");
  const [besig, setBesig] = useState(false);
  const [fout, setFout] = useState<string | null>(null);
  const [klaar, setKlaar] = useState(false);
  const [sessie, setSessie] = useState<"wag" | "ja" | "nee">("wag");

  useEffect(() => {
    const supabase = createClient();
    let gestop = false;

    // Die luisteraar eerste, sodat 'n sessie wat tydens die inruil opduik nie
    // gemis word nie.
    const { data: luister } = supabase.auth.onAuthStateChange((_e, s) => {
      if (!gestop && s) setSessie("ja");
    });

    (async () => {
      // 1. PKCE: 'n `?code=` moet self ingeruil word.
      const kode = new URLSearchParams(window.location.search).get("code");
      if (kode) {
        const { error } = await supabase.auth.exchangeCodeForSession(kode);
        if (!gestop && !error) {
          setSessie("ja");
          return;
        }
      }

      // 2. Fragment-vloei: die kliënt verwerk `#access_token=…` self, maar dit
      //    is nie noodwendig klaar wanneer hierdie effek loop nie. Peil eerder
      //    'n paar keer as om een antwoord te glo — 'n vals "verval" is die
      //    ergste moontlike uitkoms hier.
      for (let poging = 0; poging < 10; poging++) {
        if (gestop) return;
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          setSessie("ja");
          return;
        }
        await new Promise((r) => setTimeout(r, 250));
      }

      if (!gestop) setSessie("nee");
    })();

    return () => {
      gestop = true;
      luister.subscription.unsubscribe();
    };
  }, []);

  async function stuur(e: React.FormEvent) {
    e.preventDefault();
    setFout(null);

    if (wagwoord.length < 8) {
      setFout("Die wagwoord moet minstens 8 karakters wees.");
      return;
    }
    if (wagwoord !== bevestig) {
      setFout("Die twee wagwoorde stem nie ooreen nie.");
      return;
    }

    setBesig(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: wagwoord });
    setBesig(false);

    if (error) {
      // Gee die egte rede deur. Die ou boodskap het altyd "vra vir 'n nuwe
      // skakel" gesê, ook wanneer die wagwoord bloot te swak was — dan vra
      // iemand 'n nuwe uitnodiging vir 'n probleem wat hy self kon regmaak.
      const m = error.message.toLowerCase();
      setFout(
        m.includes("weak") || m.includes("password")
          ? "Kies asseblief 'n sterker wagwoord — minstens 8 karakters, en nie 'n algemene woord nie."
          : m.includes("expired") || m.includes("invalid")
            ? "Hierdie skakel het verval. Vra die kerkkantoor vir 'n nuwe uitnodiging."
            : "Kon nie die wagwoord stel nie. Probeer asseblief weer.",
      );
      return;
    }

    setKlaar(true);
    // Kort blaaskans sodat die boodskap gelees kan word.
    setTimeout(() => router.push("/dashboard"), 1200);
  }

  if (klaar) {
    return (
      <div className="lig-in mt-6 flex flex-col items-center gap-3 text-center">
        <span className="boog-vorm bg-was-groen text-glas-groen ring-line flex size-12 items-center justify-center ring-1">
          <CheckCircle2 size={22} strokeWidth={1.7} aria-hidden />
        </span>
        <p className="font-display text-lg font-semibold">Wagwoord gestel</p>
        <p className="text-ink-muted text-sm">Ons neem jou nou na die stelsel…</p>
      </div>
    );
  }

  if (sessie === "nee") {
    return (
      <p
        role="alert"
        className="text-glas-wyn bg-was-wyn/60 mt-6 flex items-start gap-2 rounded-lg px-3 py-2.5 text-sm"
      >
        <TriangleAlert size={15} className="mt-0.5 shrink-0" aria-hidden />
        <span className="text-pretty">
          Hierdie skakel het verval of is reeds gebruik. Vra die kerkkantoor vir
          &apos;n nuwe uitnodiging.
        </span>
      </p>
    );
  }

  return (
    <form onSubmit={stuur} className="mt-6 flex flex-col gap-4" noValidate>
      <Veld etiket="Nuwe wagwoord" hulp="Minstens 8 karakters.">
        <Invoer
          type="password"
          value={wagwoord}
          onChange={(e) => setWagwoord(e.target.value)}
          autoComplete="new-password"
          required
          disabled={besig || sessie === "wag"}
        />
      </Veld>

      <Veld etiket="Bevestig wagwoord">
        <Invoer
          type="password"
          value={bevestig}
          onChange={(e) => setBevestig(e.target.value)}
          autoComplete="new-password"
          required
          disabled={besig || sessie === "wag"}
        />
      </Veld>

      {fout ? (
        <p
          role="alert"
          className="text-glas-wyn bg-was-wyn/60 flex items-start gap-2 rounded-lg px-3 py-2.5 text-sm"
        >
          <TriangleAlert size={15} className="mt-0.5 shrink-0" aria-hidden />
          <span className="text-pretty">{fout}</span>
        </p>
      ) : null}

      <Knop
        type="submit"
        soort="primer"
        disabled={besig || sessie === "wag"}
        className="w-full"
      >
        {besig ? (
          <>
            <KruisLaaier variant="kring" size="sm" decorative />
            Stel tans…
          </>
        ) : (
          "Stel wagwoord"
        )}
      </Knop>
    </form>
  );
}
