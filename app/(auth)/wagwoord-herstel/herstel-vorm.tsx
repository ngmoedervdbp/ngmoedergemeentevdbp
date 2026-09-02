"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, MailCheck } from "lucide-react";
import { Knop } from "@/components/ui/basis";
import { KruisLaaier } from "@/components/ui/kruis-laaier";
import { Invoer, Veld } from "@/components/ui/vorm";

/**
 * Wagwoordherstel.
 *
 * Die bevestiging sê doelbewus NIE of die e-pos bestaan nie. 'n Boodskap soos
 * "geen rekening met daardie adres nie" laat enigiemand toe om te toets wie 'n
 * rekening het — en toegang hier is uitnodiging-alleen, so dié lys is self
 * inligting wat ons nie weggee nie.
 */
export function HerstelVorm() {
  const [epos, setEpos] = useState("");
  const [besig, setBesig] = useState(false);
  const [gestuur, setGestuur] = useState(false);

  async function stuur(e: React.FormEvent) {
    e.preventDefault();
    setBesig(true);

    // ---- Vervang met Supabase Auth ------------------------------------
    // const supabase = createClient();
    // await supabase.auth.resetPasswordForEmail(epos, {
    //   redirectTo: `${location.origin}/wagwoord-nuut`,
    // });
    await new Promise((r) => setTimeout(r, 700));
    // -------------------------------------------------------------------

    setBesig(false);
    setGestuur(true);
  }

  if (gestuur) {
    return (
      <div className="mt-6 flex flex-col gap-4">
        <div className="border-line bg-was-groen/50 flex gap-3 rounded-xl border p-3.5">
          <MailCheck
            size={18}
            className="text-glas-groen mt-0.5 shrink-0"
            aria-hidden
          />
          <div className="flex min-w-0 flex-col gap-1 text-sm">
            <p className="font-semibold">Kyk in jou inkassie</p>
            <p className="text-ink-muted text-pretty">
              As daar &apos;n rekening vir daardie adres is, is &apos;n herstelskakel
              onderweg. Dit verval oor &apos;n uur.
            </p>
          </div>
        </div>

        <Link
          href="/teken-in"
          className="text-ink-muted hover:text-ink inline-flex min-h-[44px] items-center justify-center gap-1.5 text-sm font-semibold"
        >
          <ArrowLeft size={15} aria-hidden />
          Terug na aanteken
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={stuur} className="mt-6 flex flex-col gap-4" noValidate>
      <Veld etiket="E-posadres">
        <Invoer
          type="email"
          name="epos"
          value={epos}
          onChange={(e) => setEpos(e.target.value)}
          placeholder="jou@epos.co.za"
          autoComplete="email"
          required
          disabled={besig}
        />
      </Veld>

      <Knop type="submit" soort="primer" disabled={besig} className="w-full">
        {besig ? (
          <>
            <KruisLaaier variant="kring" size="sm" decorative />
            Stuur tans…
          </>
        ) : (
          "Stuur herstelskakel"
        )}
      </Knop>

      <Link
        href="/teken-in"
        className="text-ink-muted hover:text-ink inline-flex min-h-[44px] items-center justify-center gap-1.5 text-sm font-semibold"
      >
        <ArrowLeft size={15} aria-hidden />
        Terug na aanteken
      </Link>
    </form>
  );
}
