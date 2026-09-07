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
 * Dit MOET 'n kliëntkomponent wees. Supabase sit die eenmalige token in die
 * URL se FRAGMENT (`#access_token=…`), en 'n fragment word nooit na die
 * bediener gestuur nie — net die blaaier sien dit. Die Supabase-kliënt ruil
 * dit self vir 'n sessie in wanneer die bladsy laai.
 */
export function WagwoordNuutVorm() {
  const router = useRouter();
  const [wagwoord, setWagwoord] = useState("");
  const [bevestig, setBevestig] = useState("");
  const [besig, setBesig] = useState(false);
  const [fout, setFout] = useState<string | null>(null);
  const [klaar, setKlaar] = useState(false);
  const [sessie, setSessie] = useState<"wag" | "ja" | "nee">("wag");

  // Wag tot die kliënt die token uit die fragment verwerk het.
  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getSession().then(({ data }) => {
      setSessie(data.session ? "ja" : "nee");
    });

    const { data: luister } = supabase.auth.onAuthStateChange((_e, s) => {
      if (s) setSessie("ja");
    });

    return () => luister.subscription.unsubscribe();
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
      setFout("Kon nie die wagwoord stel nie. Vra vir 'n nuwe skakel.");
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
