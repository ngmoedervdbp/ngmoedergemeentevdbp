import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import { Vensterveld } from "@/components/publiek/vensterveld";
import { TekenInVorm } from "./teken-in-vorm";

export const metadata: Metadata = { title: "Teken in" };

/**
 * Aanteken. Donker lood-agtergrond met een verligte paneel — die glas in die
 * venster, met die lood rondom. Dieselfde logika as die sybalk: donker raam,
 * lig binne.
 */
export default function TekenInBladsy() {
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
            Teken in
          </h1>
          <p className="text-ink-muted mt-1.5 text-sm text-pretty">
            Lidmaatbestuur vir die kerkraad van NG Moedergemeente.
          </p>

          {/* useSearchParams verg 'n Suspense-grens in Next 16, anders word
              die hele bladsy dinamies gerender. */}
          <Suspense
            fallback={<div className="mt-6 h-64" aria-hidden />}
          >
            <TekenInVorm />
          </Suspense>
        </div>

        <p className="mt-5 text-center text-xs text-balance text-white/45">
          Toegang is uitnodiging-alleen. Daar is geen publieke registrasie vir
          kerkraadslede nie.
        </p>
      </main>
    </div>
  );
}
