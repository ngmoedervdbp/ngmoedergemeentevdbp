"use client";

import { useState } from "react";
import { Modaal } from "@/components/ui/modaal";
import { Knop } from "@/components/ui/basis";
import { Invoer, Kies, Teksarea, Veld, VeldRy } from "@/components/ui/vorm";
import { useMelding } from "@/components/ui/melding";
import { stoorLidmaat } from "@/lib/data/aksies";
import type { Family, Lid, Wyk } from "@/lib/mock/tipes";

/**
 * Een vorm vir "Nuwe lidmaat" en "Wysig lidmaat".
 *
 * Die validasie hier is die minimum wat die skerm nodig het. Wanneer dit aan
 * Supabase gekoppel word, moet dieselfde reëls in 'n Zod-skema op die bediener
 * herhaal word — kliëntvalidasie is 'n gerief, nie 'n wag nie.
 */
export function LidmaatModaal({
  oop,
  sluit,
  lid,
  wyke = [],
  families = [],
}: {
  oop: boolean;
  sluit: () => void;
  lid?: Lid;
  /** Uit die bladsy — die modaal haal nie self data nie. */
  wyke?: Wyk[];
  families?: Family[];
}) {
  const wysig = Boolean(lid);
  const { wys } = useMelding();
  const [naam, setNaam] = useState(lid?.first_name ?? "");
  const [van, setVan] = useState(lid?.last_name ?? "");
  const [foute, setFoute] = useState<{ naam?: string; van?: string }>({});

  const [besig, setBesig] = useState(false);

  async function stoor(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f: typeof foute = {};
    if (!naam.trim()) f.naam = "Naam is verpligtend.";
    if (!van.trim()) f.van = "Van is verpligtend.";
    setFoute(f);
    if (Object.keys(f).length > 0) return;

    setBesig(true);
    const uitslag = await stoorLidmaat(new FormData(e.currentTarget));
    setBesig(false);

    if (uitslag.ok) {
      wys(`${naam} ${van} ${wysig ? "opgedateer" : "bygevoeg"}.`);
      sluit();
    } else {
      wys(uitslag.fout, "fout");
    }
  }

  return (
    <Modaal
      oop={oop}
      sluit={sluit}
      titel={wysig ? "Wysig lidmaat" : "Nuwe lidmaat"}
      beskrywing={wysig ? undefined : "Voeg 'n lidmaat direk by die register."}
      breedte="lg"
      voet={
        <>
          <Knop type="button" soort="stil" onClick={sluit}>Kanselleer</Knop>
          <Knop type="submit" form="lidmaat-vorm" soort="primer" disabled={besig}>
            {besig
              ? "Stoor tans…"
              : wysig
                ? "Stoor veranderinge"
                : "Voeg lidmaat by"}
          </Knop>
        </>
      }
    >
      <form id="lidmaat-vorm" onSubmit={stoor} className="flex flex-col gap-4" noValidate>
        <input type="hidden" name="id" value={lid?.id ?? ""} />
        <VeldRy>
          <Veld etiket="Naam" verpligtend fout={foute.naam}>
            <Invoer name="first_name" value={naam} onChange={(e) => setNaam(e.target.value)} autoComplete="given-name" />
          </Veld>
          <Veld etiket="Van" verpligtend fout={foute.van}>
            <Invoer name="last_name" value={van} onChange={(e) => setVan(e.target.value)} autoComplete="family-name" />
          </Veld>
        </VeldRy>

        <VeldRy>
          <Veld etiket="Geboortedatum" hulp="Laat leeg as dit onbekend is — dit word korrek hanteer.">
            <Invoer type="date" name="date_of_birth" defaultValue={lid?.date_of_birth ?? ""} />
          </Veld>
          <Veld etiket="Geslag">
            <Kies name="geslag" defaultValue={lid?.geslag ?? "manlik"}>
              <option value="manlik">Manlik</option>
              <option value="vroulik">Vroulik</option>
            </Kies>
          </Veld>
        </VeldRy>

        <VeldRy>
          <Veld etiket="Selfoon">
            <Invoer type="tel" name="selfoon" autoComplete="tel" defaultValue={lid?.selfoon ?? ""} placeholder="082 123 4567" />
          </Veld>
          <Veld etiket="E-pos">
            <Invoer type="email" name="epos" autoComplete="email" defaultValue={lid?.epos ?? ""} placeholder="naam@voorbeeld.co.za" />
          </Veld>
        </VeldRy>

        <VeldRy>
          <Veld etiket="Wyk">
            <Kies name="wyk_id" defaultValue={lid?.wyk_id ?? ""}>
              <option value="">Geen wyk</option>
              {wyke.map((w) => <option key={w.id} value={w.id}>{w.naam}</option>)}
            </Kies>
          </Veld>
          <Veld etiket="Gesin">
            <Kies name="family_id" defaultValue={lid?.family_id ?? ""}>
              <option value="">Geen gesin</option>
              {families.map((f) => <option key={f.id} value={f.id}>Gesin {f.naam}</option>)}
            </Kies>
          </Veld>
        </VeldRy>

        <VeldRy>
          <Veld etiket="Rol in gesin">
            <Kies name="family_role" defaultValue={lid?.family_role ?? ""}>
              <option value="">Geen</option>
              <option value="man">Man</option>
              <option value="vrou">Vrou</option>
              <option value="kind">Kind</option>
            </Kies>
          </Veld>
          <Veld etiket="Lidmaatskaptipe">
            <Kies name="tipe" defaultValue={lid?.tipe ?? "belydend"}>
              <option value="belydend">Belydende lidmaat</option>
              <option value="doop">Dooplidmaat</option>
            </Kies>
          </Veld>
        </VeldRy>

        <VeldRy>
          <Veld etiket="Status">
            <Kies name="status" defaultValue={lid?.status ?? "aktief"}>
              <option value="aktief">Aktief</option>
              <option value="onaktief">Onaktief</option>
              <option value="oorgeplaas">Oorgeplaas</option>
              <option value="oorlede">Oorlede</option>
            </Kies>
          </Veld>
          <Veld etiket="Lid sedert">
            <Invoer type="date" name="lid_sedert" defaultValue={lid?.lid_sedert ?? ""} />
          </Veld>
        </VeldRy>

        <Veld etiket="Aantekeninge" hulp="Pastorale notas. POPIA-sensitief — hou dit feitelik.">
          <Teksarea name="aantekeninge" rows={3} defaultValue={lid?.aantekeninge ?? ""} />
        </Veld>
      </form>
    </Modaal>
  );
}
