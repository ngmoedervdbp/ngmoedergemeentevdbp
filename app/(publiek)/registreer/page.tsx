import type { Metadata } from "next";
import { GlasBoog } from "@/components/kerk/glas-boog";

export const metadata: Metadata = { title: "Registreer as lidmaat" };

/**
 * DIE ENIGSTE PUBLIEKE ROETE.
 *
 * Onbekende besoekers bereik hierdie bladsy via 'n QR-kode by die kerk se
 * ingang of 'n skakel in 'n WhatsApp-groep. Dit is skryf-alleen: dit skep 'n
 * inskrywing in die goedkeuringsry en lees NOOIT lidmaatdata terug nie.
 *
 * Voor dit regtig oopgaan, benodig dit:
 *   - streng Zod-validasie op die bediener
 *   - tempo-beperking per IP
 *   - 'n gemorswag (honeypot of Turnstile)
 * Sien CLAUDE.md § Auth & access.
 */
export default function RegistreerBladsy() {
  return (
    <div className="flex min-h-dvh items-center justify-center px-6 py-12">
      <div className="border-line bg-surface w-full max-w-lg rounded-xl border p-8 text-center">
        <GlasBoog width={46} className="text-brand mx-auto" />

        <h1 className="font-display mt-5 text-4xl leading-tight font-semibold text-balance">
          Welkom by ons gemeente
        </h1>
        <p className="text-ink-muted mx-auto mt-2.5 max-w-sm text-base text-balance">
          Vul asseblief hierdie vorm in en die kerkkantoor sal met jou in
          verbinding tree.
        </p>

        <div className="border-line bg-ground text-ink-muted mt-7 rounded-lg border border-dashed p-4 text-left text-sm">
          Die registrasievorm is nog nie gebou nie. Die velde moet eers by die
          bestaande Base44-vorm gaan kyk word — sien{" "}
          <code className="text-ink">docs/base44-reference/notes.md</code>.
        </div>
      </div>
    </div>
  );
}
