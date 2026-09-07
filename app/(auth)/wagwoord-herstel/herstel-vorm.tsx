"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { ArrowLeft, MailCheck, TriangleAlert } from "lucide-react";
import { KruisLaaier } from "@/components/ui/kruis-laaier";
import { Invoer, Veld } from "@/components/ui/vorm";
import { vraWagwoordHerstel, type HerstelUitslag } from "../teken-in/aksies";

/**
 * Wagwoordherstel.
 *
 * Die bevestiging sê doelbewus NIE of die e-pos bestaan nie. 'n Boodskap soos
 * "geen rekening met daardie adres nie" laat enigiemand toe om te toets wie 'n
 * rekening het — en toegang hier is uitnodiging-alleen, so dié lys is self
 * inligting wat ons nie weggee nie.
 */
export function HerstelVorm() {
  const [uitslag, aksie] = useActionState<HerstelUitslag, FormData>(
    vraWagwoordHerstel,
    null,
  );

  if (uitslag?.ok) {
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
    <form action={aksie} className="mt-6 flex flex-col gap-4" noValidate>
      {/* Hou die getikte adres ná 'n fout — dieselfde rede as by aanteken. */}
      <Veld etiket="E-posadres">
        <Invoer
          key={uitslag && !uitslag.ok ? uitslag.epos : ""}
          type="email"
          name="epos"
          placeholder="jou@epos.co.za"
          autoComplete="email"
          defaultValue={uitslag && !uitslag.ok ? uitslag.epos : ""}
          required
        />
      </Veld>

      {uitslag && !uitslag.ok ? (
        <p
          role="alert"
          className="text-glas-wyn bg-was-wyn/60 flex items-start gap-2 rounded-lg px-3 py-2.5 text-sm"
        >
          <TriangleAlert size={15} className="mt-0.5 shrink-0" aria-hidden />
          <span className="text-pretty">{uitslag.fout}</span>
        </p>
      ) : null}

      <StuurKnop />

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

/** Eie komponent — `useFormStatus` werk net binne 'n kind van die `<form>`. */
function StuurKnop() {
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
          Stuur tans…
        </>
      ) : (
        "Stuur herstelskakel"
      )}
    </button>
  );
}
