import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthRaam } from "@/components/kerk/auth-raam";
import { TekenInVorm } from "./teken-in-vorm";

export const metadata: Metadata = { title: "Teken in" };

export default function TekenInBladsy() {
  return (
    <AuthRaam
      titel="Teken in"
      beskrywing="Lidmaatbestuur vir die kerkraad van NG Moedergemeente."
      kennisgewing="Toegang is uitnodiging-alleen. Daar is geen publieke registrasie vir kerkraadslede nie."
    >
      <Suspense fallback={<div className="mt-6 h-64" aria-hidden />}>
        <TekenInVorm />
      </Suspense>
    </AuthRaam>
  );
}
