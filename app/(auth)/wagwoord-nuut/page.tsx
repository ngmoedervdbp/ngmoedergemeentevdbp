import type { Metadata } from "next";
import Image from "next/image";
import { Vensterveld } from "@/components/publiek/vensterveld";
import { WagwoordNuutVorm } from "./wagwoord-nuut-vorm";

export const metadata: Metadata = { title: "Kies 'n wagwoord" };

/**
 * Waar 'n genooide gebruiker sy eie wagwoord kies.
 *
 * Supabase se uitnodiging- en herstel-skakels stuur die persoon hierheen met 'n
 * eenmalige token in die URL-fragment. Die Supabase-kliënt ruil dit outomaties
 * vir 'n sessie in sodra die bladsy laai — daarna is `updateUser` genoeg.
 */
export default function WagwoordNuutBladsy() {
  return (
    <div className="nag-paneel veilig-bo veilig-onder relative isolate flex min-h-dvh flex-col items-center justify-center overflow-hidden px-5 py-10 sm:px-6">
      <Vensterveld className="opacity-[0.42]" />

      <main className="relative w-full max-w-sm">
        <div className="glas-paneel border-line lig-in-groot relative rounded-[1.5rem] border p-7 shadow-[0_30px_80px_-30px_rgba(10,9,18,0.85)] sm:p-9">
          <Image
            src="/logo/ng-merk-256.png"
            alt=""
            width={96}
            height={96}
            priority
            className="mb-6 h-20 w-auto drop-shadow-[0_8px_20px_rgba(59,58,114,0.18)]"
          />

          <h1 className="font-display text-3xl leading-tight font-semibold">
            Kies &apos;n wagwoord
          </h1>
          <p className="text-ink-muted mt-1.5 text-sm text-pretty">
            Welkom by Lidmaatbestuur. Kies &apos;n wagwoord en jy is binne.
          </p>

          <WagwoordNuutVorm />
        </div>
      </main>
    </div>
  );
}
