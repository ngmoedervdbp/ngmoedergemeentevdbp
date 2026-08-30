import type { Metadata } from "next";
import { GlasBoog } from "@/components/kerk/glas-boog";

export const metadata: Metadata = { title: "Teken in" };

export default function TekenInBladsy() {
  return (
    <div className="bg-lood flex min-h-dvh items-center justify-center px-6 py-12">
      <div className="border-line bg-surface w-full max-w-sm rounded-xl border p-8 shadow-[0_24px_60px_-24px_rgba(15,14,26,0.6)]">
        <GlasBoog width={38} className="text-brand mb-5" />

        <h1 className="font-display text-3xl leading-tight font-semibold">
          Teken in
        </h1>
        <p className="text-ink-muted mt-1.5 text-sm">
          Lidmaatbestuur vir die kerkraad van NG Moedergemeente.
        </p>

        <div className="border-line bg-ground text-ink-muted mt-6 rounded-lg border border-dashed p-4 text-sm">
          Supabase Auth is nog nie gekoppel nie. Toegang is uitnodiging-alleen —
          daar is geen publieke registrasie vir kerkraadslede nie.
        </div>
      </div>
    </div>
  );
}
