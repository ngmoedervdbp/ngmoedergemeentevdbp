import Link from "next/link";
import { FlaskConical } from "lucide-react";
import { Skil } from "@/components/kerk/skil";
import { MeldingVerskaffer } from "@/components/ui/melding";
import { navHrefsVir } from "@/lib/nav";
import { huidigeGebruiker, ROL_ETIKET } from "@/lib/sessie";
import { haalLede } from "@/lib/data/gemeente-data";
import { werkruimteFont } from "@/lib/werkruimte-font";
import { IS_DEMO } from "@/lib/demo";
import "@/components/kerk/admin.css";

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
  const [gebruiker, lede] = await Promise.all([huidigeGebruiker(), haalLede()]);
  const navHrefs = navHrefsVir(gebruiker?.rol ?? null);

  return (
    <div className={`${werkruimteFont.variable} admin-app`}>
      <MeldingVerskaffer>
        <Skil
          navHrefs={navHrefs}
          lede={lede}
          gebruiker={gebruiker?.naam ?? "Gas"}
          rolEtiket={gebruiker ? ROL_ETIKET[gebruiker.rol] : ""}
          banier={IS_DEMO ? <DemoBanier /> : null}
        >
          {children}
        </Skil>
      </MeldingVerskaffer>
    </div>
  );
}

/** Sodat niemand ooit dink die demo is die regte stelsel nie. */
function DemoBanier() {
  return (
    <p className="border-line bg-was-amber text-glas-amber veilig-kant flex shrink-0 items-center justify-center gap-2 border-b px-4 py-1.5 text-center text-xs font-semibold">
      <FlaskConical size={13} className="shrink-0" aria-hidden />
      <span className="text-pretty">
        Demo — jou eie speelruimte. Niemand anders sien jou data nie.{" "}
        <Link href="/instellings" className="underline underline-offset-2">
          Speel as &apos;n ander rol
        </Link>
      </span>
    </p>
  );
}
