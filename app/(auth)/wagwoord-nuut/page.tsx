import type { Metadata } from "next";
import { AuthRaam } from "@/components/kerk/auth-raam";
import { WagwoordNuutVorm } from "./wagwoord-nuut-vorm";

export const metadata: Metadata = { title: "Kies 'n wagwoord" };

/** Invitation/recovery tokens are still handled by the existing form. */
export default function WagwoordNuutBladsy() {
  return (
    <AuthRaam
      titel="Kies 'n wagwoord"
      beskrywing="Welkom by Lidmaatbestuur. Kies 'n wagwoord en jy is binne."
    >
      <WagwoordNuutVorm />
    </AuthRaam>
  );
}
