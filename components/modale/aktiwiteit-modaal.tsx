"use client";

import { useState } from "react";

import { Crosshair } from "lucide-react";
import { Knop } from "@/components/ui/basis";
import { Modaal } from "@/components/ui/modaal";
import { Invoer, Kies, Teksarea, Veld, VeldRy } from "@/components/ui/vorm";
import { useMelding } from "@/components/ui/melding";
import { stoorAktiwiteit } from "@/lib/data/aksies";
import { BEDIENING_TIPE_LYS, LIDMAAT_TIPES } from "@/lib/bediening";
import type { BedieningAktiwiteit } from "@/lib/mock/bediening";

const VORM_ID = "aktiwiteit-vorm";

/**
 * Een vorm vir beide "Aanteken" en "Wysig" — gee `aktiwiteit` om te wysig.
 * Dieselfde patroon as LidmaatModaal.
 *
 * Die veldvolgorde volg die Dominee se Base44-vorm presies, want dit is die
 * volgorde waarin hy dit tik.
 */
export function AktiwiteitModaal({
  oop,
  sluit,
  aktiwiteit,
}: {
  oop: boolean;
  sluit: () => void;
  aktiwiteit?: BedieningAktiwiteit | null;
}) {
  const { wys } = useMelding();
  const [besig, setBesig] = useState(false);
  const wysig = Boolean(aktiwiteit);

  async function stuur(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBesig(true);
    const uitslag = await stoorAktiwiteit(new FormData(e.currentTarget));
    setBesig(false);

    if (uitslag.ok) {
      wys(wysig ? "Aktiwiteit gestoor." : "Aktiwiteit aangeteken.");
      sluit();
    } else {
      wys(uitslag.fout, "fout");
    }
  }

  return (
    <Modaal
      oop={oop}
      sluit={sluit}
      titel={wysig ? "Wysig aktiwiteit" : "Nuwe aktiwiteit aanteken"}
      beskrywing={
        wysig
          ? undefined
          : "Teken 'n besoek, vergadering, preek of ander bediening aan."
      }
      breedte="lg"
      voet={
        <>
          <Knop soort="sekonder" onClick={sluit}>
            Kanselleer
          </Knop>
          <Knop type="submit" form={VORM_ID} disabled={besig}>
            {besig ? "Stoor tans…" : wysig ? "Stoor veranderinge" : "Teken aan"}
          </Knop>
        </>
      }
    >
      <form
        id={VORM_ID}
        className="flex flex-col gap-4"
        onSubmit={stuur}
      >
        <input type="hidden" name="id" value={aktiwiteit?.id ?? ""} />

        <Veld etiket="Titel" verpligtend hulp="Dikwels 'n naam — werk ook vir iemand wat nie 'n lidmaat is nie.">
          <Invoer
            name="titel"
            defaultValue={aktiwiteit?.titel ?? ""}
            placeholder="bv. Emma Oelofse"
            required
          />
        </Veld>

        <VeldRy>
          <Veld etiket="Tipe" verpligtend>
            <Kies name="tipe" defaultValue={aktiwiteit?.tipe ?? "tuisbesoek"}>
              {BEDIENING_TIPE_LYS.map((t) => (
                <option key={t.sleutel} value={t.sleutel}>
                  {t.etiket}
                </option>
              ))}
            </Kies>
          </Veld>

          <Veld etiket="Lidmaat-tipe">
            <Kies name="lidmaat_tipe" defaultValue={aktiwiteit?.lidmaat_tipe ?? ""}>
              <option value="">Kies opsie</option>
              {Object.entries(LIDMAAT_TIPES).map(([sleutel, etiket]) => (
                <option key={sleutel} value={sleutel}>
                  {etiket}
                </option>
              ))}
            </Kies>
          </Veld>
        </VeldRy>

        <Veld etiket="Datum" verpligtend>
          <Invoer
            type="date"
            name="datum"
            defaultValue={aktiwiteit?.datum ?? ""}
            required
          />
        </Veld>

        <VeldRy>
          <Veld etiket="Begintyd">
            <Invoer
              type="time"
              name="begin_tyd"
              defaultValue={aktiwiteit?.begin_tyd ?? ""}
            />
          </Veld>

          <Veld etiket="Eindtyd" hulp="Saam met die begintyd gee dit die duur.">
            <Invoer
              type="time"
              name="eind_tyd"
              defaultValue={aktiwiteit?.eind_tyd ?? ""}
            />
          </Veld>
        </VeldRy>

        <Veld etiket="Plek">
          <Invoer
            name="plek_naam"
            defaultValue={aktiwiteit?.plek_naam ?? ""}
            placeholder="bv. NG Kerk Stellenbosch"
          />
        </Veld>

        <Veld etiket="Adres">
          <div className="flex gap-2">
            <Invoer
              name="adres"
              defaultValue={aktiwiteit?.adres ?? ""}
              placeholder="Volle adres"
              className="min-w-0 flex-1"
            />
            <Knop
              type="button"
              soort="sekonder"
              ikoon={Crosshair}
              aria-label="Gebruik huidige ligging"
              onClick={() => wys("Ligging word later gekoppel.", "info")}
            />
          </div>
        </Veld>

        <Veld
          etiket="Aantekeninge"
          hulp="Vertroulik — net jy sien dit, nie die kerkraad nie."
        >
          <Teksarea
            name="aantekeninge"
            rows={3}
            defaultValue={aktiwiteit?.aantekeninge ?? ""}
          />
        </Veld>
      </form>
    </Modaal>
  );
}
