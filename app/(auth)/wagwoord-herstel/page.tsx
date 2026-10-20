import type { Metadata } from "next";
import { AuthRaam } from "@/components/kerk/auth-raam";
import { HerstelVorm } from "./herstel-vorm";

export const metadata: Metadata = { title: "Wagwoord herstel" };

export default function WagwoordHerstelBladsy() {
  return (
    <AuthRaam
      titel="Wagwoord herstel"
      beskrywing="Ons stuur 'n skakel na jou e-pos waarmee jy 'n nuwe wagwoord kan kies."
    >
      <HerstelVorm />
    </AuthRaam>
  );
}
