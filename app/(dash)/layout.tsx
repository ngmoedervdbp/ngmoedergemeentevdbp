import { Skil } from "@/components/kerk/skil";
import { MeldingVerskaffer } from "@/components/ui/melding";
import { navHrefsVir } from "@/lib/nav";
import { huidigeGebruiker, ROL_ETIKET } from "@/lib/sessie";

/**
 * Die skil staan stil; net die inhoud rol.
 *
 * Die buitenste houer is presies een skermhoogte met `overflow-hidden`, sodat
 * die sybalk en die boonste balk nooit wegrol nie. `<main>` is die enigste
 * rolhouer. Onder `lg` word die sybalk 'n laai — sien
 * [components/kerk/skil.tsx](components/kerk/skil.tsx).
 *
 * Die rol word HIER opgelos, in 'n Server Component, en die klaar gefiltreerde
 * navigasie word afgestuur. So kom 'n skakel wat jy nie mag sien nie glad nie
 * in die HTML nie — eerder as om dit met CSS weg te steek.
 */
export default async function DashLayout({ children }: LayoutProps<"/">) {
  const gebruiker = await huidigeGebruiker();
  const navHrefs = navHrefsVir(gebruiker?.rol ?? null);

  return (
    <MeldingVerskaffer>
      <Skil
        navHrefs={navHrefs}
        gebruiker={gebruiker?.naam ?? "Gas"}
        rolEtiket={gebruiker ? ROL_ETIKET[gebruiker.rol] : ""}
      >
        {children}
      </Skil>
    </MeldingVerskaffer>
  );
}
