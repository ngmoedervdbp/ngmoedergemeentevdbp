import { Skil } from "@/components/kerk/skil";
import { MeldingVerskaffer } from "@/components/ui/melding";

/** Word later die aangetekende gebruiker uit Supabase Auth. */
const GEBRUIKER = "Tiaan Botha";

/**
 * Die skil staan stil; net die inhoud rol.
 *
 * Die buitenste houer is presies een skermhoogte met `overflow-hidden`, sodat
 * die sybalk en die boonste balk nooit wegrol nie. `<main>` is die enigste
 * rolhouer. Onder `lg` word die sybalk 'n laai — sien
 * [components/kerk/skil.tsx](components/kerk/skil.tsx).
 */
export default function DashLayout({ children }: LayoutProps<"/">) {
  return (
    <MeldingVerskaffer>
      <Skil gebruiker={GEBRUIKER}>{children}</Skil>
    </MeldingVerskaffer>
  );
}
