"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { ArrowRight, CheckCircle2, TriangleAlert } from "lucide-react";
import { KruisLaaier } from "@/components/ui/kruis-laaier";
import { Invoer, Kies, Teksarea, Veld, VeldRy } from "@/components/ui/vorm";
import { stuurRegistrasie, type RegistrasieUitslag } from "./aksies";

/**
 * Die publieke registrasievorm.
 *
 * Velde volg die Base44-vorm sodat 'n lidmaat wat albei sien dieselfde vrae
 * kry. Die vorm stuur na 'n Server Action — sien `aksies.ts` vir die
 * heuningpot, tempobeperking en validering.
 *
 * Let op: die vorm gebruik `action` (nie `onSubmit`) nie, so dit werk selfs
 * voordat JavaScript gelaai het.
 */
export function RegistreerVorm() {
  const [uitslag, aksie] = useActionState<RegistrasieUitslag | null, FormData>(
    stuurRegistrasie,
    null,
  );

  if (uitslag?.ok) {
    return (
      <div className="lig-in flex flex-col items-center gap-4 py-10 text-center">
        <span className="boog-vorm bg-was-groen text-glas-groen ring-line flex size-14 items-center justify-center ring-1">
          <CheckCircle2 size={26} strokeWidth={1.7} aria-hidden />
        </span>
        <h2 className="font-display text-2xl font-semibold">
          Dankie — ons het jou besonderhede
        </h2>
        <p className="text-ink-muted max-w-sm text-pretty">
          Iemand van die kerkkantoor sal binnekort met jou in verbinding tree.
          Jy is intussen meer as welkom by enige erediens.
        </p>
        <Link
          href="/eredienste"
          className="text-brand group mt-2 inline-flex min-h-[44px] items-center gap-1.5 font-semibold"
        >
          <span className="streep-groei">Wanneer ons saamkom</span>
          <ArrowRight
            size={15}
            aria-hidden
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </Link>
      </div>
    );
  }

  const velde = uitslag?.ok === false ? uitslag.velde : undefined;

  return (
    <form action={aksie} className="flex flex-col gap-8" noValidate>
      {uitslag?.ok === false ? (
        <p
          role="alert"
          className="text-glas-wyn bg-was-wyn/60 flex items-start gap-2 rounded-lg px-3.5 py-3 text-sm"
        >
          <TriangleAlert size={15} className="mt-0.5 shrink-0" aria-hidden />
          <span className="text-pretty">{uitslag.boodskap}</span>
        </p>
      ) : null}

      {/* --------------------------------------------- persoonlike inligting */}
      <fieldset className="flex flex-col gap-4">
        <legend className="border-line font-display mb-4 w-full border-b pb-2.5 text-lg font-semibold">
          Persoonlike inligting
        </legend>

        <VeldRy>
          <Veld etiket="Voornaam" verpligtend fout={velde?.first_name}>
            <Invoer name="first_name" autoComplete="given-name" required />
          </Veld>
          <Veld etiket="Van" verpligtend fout={velde?.last_name}>
            <Invoer name="last_name" autoComplete="family-name" required />
          </Veld>
        </VeldRy>

        <Veld etiket="Geboortedatum" fout={velde?.date_of_birth}>
          <Invoer type="date" name="date_of_birth" autoComplete="bday" />
        </Veld>

        <VeldRy>
          <Veld etiket="Geslag">
            <Kies name="geslag" defaultValue="">
              <option value="">Kies…</option>
              <option value="manlik">Manlik</option>
              <option value="vroulik">Vroulik</option>
            </Kies>
          </Veld>

          <Veld etiket="Huwelikstatus">
            <Kies name="huwelikstatus" defaultValue="">
              <option value="">Kies…</option>
              <option value="ongetroud">Ongetroud</option>
              <option value="getroud">Getroud</option>
              <option value="weduwee_wewenaar">Weduwee / wewenaar</option>
            </Kies>
          </Veld>
        </VeldRy>
      </fieldset>

      {/* ------------------------------------------------ kontakinligting */}
      <fieldset className="flex flex-col gap-4">
        <legend className="border-line font-display mb-4 w-full border-b pb-2.5 text-lg font-semibold">
          Kontakinligting
        </legend>

        <Veld etiket="Selfoonnommer" verpligtend fout={velde?.selfoon}>
          <Invoer type="tel" name="selfoon" autoComplete="tel" required />
        </Veld>

        <Veld etiket="E-pos" fout={velde?.epos}>
          <Invoer type="email" name="epos" autoComplete="email" />
        </Veld>

        <Veld etiket="Fisiese adres" fout={velde?.adres}>
          <Teksarea name="adres" rows={3} autoComplete="street-address" />
        </Veld>
      </fieldset>

      {/* ------------------------------------------------------ nog iets? */}
      <fieldset className="flex flex-col gap-4">
        <legend className="border-line font-display mb-4 w-full border-b pb-2.5 text-lg font-semibold">
          Nog iets wat ons moet weet?
        </legend>
        <Veld
          etiket="Aantekeninge"
          hulp="Heeltemal opsioneel — enigiets wat jy graag wil deel."
          fout={velde?.aantekeninge}
        >
          <Teksarea name="aantekeninge" rows={4} />
        </Veld>
      </fieldset>

      {/* Heuningpot — versteek vir mense, sigbaar vir bots. Nie `display:none`
          nie: party bots slaan dít oor. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Los hierdie veld leeg
          <input name="webwerf" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <StuurKnop />
    </form>
  );
}

/**
 * Eie komponent sodat `useFormStatus` die omringende vorm se toestand kan sien
 * — die haak werk net binne 'n kind van die `<form>`.
 */
function StuurKnop() {
  const { pending } = useFormStatus();

  return (
    <div className="flex flex-col gap-3">
      <button
        type="submit"
        disabled={pending}
        className="group bg-brand focus-visible:outline-accent inline-flex min-h-[44px] w-full items-center justify-center gap-2.5 rounded-full px-7 py-3.5 text-sm font-semibold text-white shadow-[0_2px_20px_-6px_rgba(59,58,114,0.6)] transition-all duration-300 hover:bg-[#33326a] focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60"
      >
        {pending ? (
          <>
            <KruisLaaier variant="kring" size="sm" decorative />
            Stuur tans…
          </>
        ) : (
          <>
            Stuur my besonderhede
            <ArrowRight
              size={16}
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </>
        )}
      </button>

      <p className="text-ink-muted text-center text-xs text-pretty">
        Ons gebruik jou besonderhede net om met jou in verbinding te tree.
        Niks word met iemand anders gedeel nie.
      </p>
    </div>
  );
}
