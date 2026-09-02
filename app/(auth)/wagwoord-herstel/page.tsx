import type { Metadata } from "next";
import Image from "next/image";
import { Vensterveld } from "@/components/publiek/vensterveld";
import { HerstelVorm } from "./herstel-vorm";

export const metadata: Metadata = { title: "Wagwoord herstel" };

export default function WagwoordHerstelBladsy() {
  return (
    <div className="nag-paneel veilig-bo veilig-onder relative isolate flex min-h-dvh flex-col items-center justify-center overflow-hidden px-5 py-10 sm:px-6">
      {/* 'n Volskerm-veld van vensters — die hele muur, nie net 'n band bo-aan
          nie. In die donker lees dit soos glas snags. */}
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
            Wagwoord herstel
          </h1>
          <p className="text-ink-muted mt-1.5 text-sm text-pretty">
            Ons stuur &apos;n skakel na jou e-pos waarmee jy &apos;n nuwe wagwoord kan
            kies.
          </p>

          <HerstelVorm />
        </div>
      </main>
    </div>
  );
}
