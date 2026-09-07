"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { TriangleAlert } from "lucide-react";
import { KruisLaaier } from "@/components/ui/kruis-laaier";
import { Invoer, Veld } from "@/components/ui/vorm";
import { tekenIn, type TekenInUitslag } from "./aksies";

/**
 * Die aanteken-vorm.
 *
 * Stuur na 'n Server Action sodat die sessiekoekie bedienerkant gestel word —
 * sien `aksies.ts`. Foute wys inlyn, nie as 'n roosterbroodjie nie: 'n
 * aantekenfout hoort langs die velde waaroor dit gaan.
 */
export function TekenInVorm() {
  const soek = useSearchParams();
  const volgende = soek.get("volgende") ?? "/dashboard";

  const [uitslag, aksie] = useActionState<TekenInUitslag, FormData>(
    tekenIn,
    null,
  );

  return (
    <form action={aksie} className="mt-6 flex flex-col gap-4" noValidate>
      {/* Waarheen ná aanmelding — proxy.ts sit dit in die URL wanneer dit 'n
          beskermde bladsy onderskep het. */}
      <input type="hidden" name="volgende" value={volgende} />

      {/*
          `defaultValue` uit die uitslag, want die velde is onbeheer: ná 'n
          mislukte poging herrender die vorm en sonder dit is albei velde leeg.
          Om die e-pos te hertik omdat die wagwoord verkeerd was, is irriterend
          — veral op 'n foon.

          `key` dwing die veld om te herstel wanneer 'n NUWE poging 'n ander
          e-pos teruggee; sonder dit hou React die ou DOM-waarde.
      */}
      <Veld etiket="E-posadres">
        <Invoer
          key={uitslag?.epos ?? ""}
          type="email"
          name="epos"
          placeholder="jou@epos.co.za"
          autoComplete="email"
          defaultValue={uitslag?.epos ?? ""}
          required
        />
      </Veld>

      {/* Die wagwoord word doelbewus nie herstel nie — dit reis nie terug van
          die bediener af nie. Outofokus sit die wyser waar die tikwerk is. */}
      <Veld etiket="Wagwoord">
        <Invoer
          type="password"
          name="wagwoord"
          autoComplete="current-password"
          autoFocus={Boolean(uitslag?.fout)}
          required
        />
      </Veld>

      {uitslag?.fout ? (
        <p
          role="alert"
          className="text-glas-wyn bg-was-wyn/60 flex items-start gap-2 rounded-lg px-3 py-2.5 text-sm"
        >
          <TriangleAlert size={15} className="mt-0.5 shrink-0" aria-hidden />
          <span className="text-pretty">{uitslag.fout}</span>
        </p>
      ) : null}

      <TekenInKnop />

      <Link
        href="/wagwoord-herstel"
        className="text-ink-muted hover:text-ink inline-flex min-h-[44px] items-center justify-center text-sm font-semibold"
      >
        Wagwoord vergeet?
      </Link>
    </form>
  );
}

/** Eie komponent — `useFormStatus` werk net binne 'n kind van die `<form>`. */
function TekenInKnop() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-brand focus-visible:outline-accent inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-white shadow-[0_1px_2px_rgba(34,31,38,0.18)] transition-colors hover:bg-[#33326a] focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60"
    >
      {pending ? (
        <>
          <KruisLaaier variant="kring" size="sm" decorative />
          Teken tans in…
        </>
      ) : (
        "Teken in"
      )}
    </button>
  );
}
