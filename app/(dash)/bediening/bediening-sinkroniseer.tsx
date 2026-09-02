"use client";

import { useState } from "react";
import { Check, Info, RefreshCw } from "lucide-react";
import { Knop, Paneel, PaneelKop } from "@/components/ui/basis";
import { Veld, Invoer } from "@/components/ui/vorm";
import { useMelding } from "@/components/ui/melding";

/**
 * iCal-sinkronisasie: lees 'n gepubliseerde iCloud-kalender in sodat gebeure
 * nie twee keer ingevoer hoef te word nie.
 *
 * Die URL bevat 'n geheime token — enigiemand met daardie skakel kan die
 * kalender lees. Daarom is die veld 'n password-tipe en word dit nooit in 'n
 * log of 'n foutboodskap gewys nie.
 */
export function BedieningSinkroniseer() {
  const [url, setUrl] = useState("");
  const { wys } = useMelding();

  return (
    <Paneel>
      <PaneelKop titel="Kalender-sinkronisasie" />

      <div className="flex flex-col gap-4 p-4 sm:p-5">
        <p className="text-ink-muted text-sm text-pretty">
          Koppel jou iCloud-kalender om gebeure outomaties in te voer.
        </p>

        <div className="border-line bg-was-kobalt/40 flex gap-3 rounded-xl border p-3.5">
          <Info size={18} className="text-glas-kobalt mt-0.5 shrink-0" aria-hidden />
          <div className="flex min-w-0 flex-col gap-1 text-sm">
            <p className="font-semibold">Waar kry ek die skakel?</p>
            <p className="text-ink-muted text-pretty">
              Maak Kalender oop op jou Mac → regskliek op die kalender → Deel
              kalender → Publiseer → kopieer die skakel.
            </p>
          </div>
        </div>

        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            wys("iCal-sinkronisasie is nog nie gebou nie.", "info");
          }}
        >
          <Veld
            etiket="iKal-kalender-URL"
            hulp="Die skakel bevat 'n geheime token — deel dit met niemand nie."
          >
            <Invoer
              type="password"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="webcal://p121-caldav.icloud.com/published/2/..."
              autoComplete="off"
            />
          </Veld>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Knop
              type="button"
              soort="sekonder"
              ikoon={Check}
              onClick={() => wys("Die URL word nog nie gestoor nie.", "info")}
            >
              Stoor URL
            </Knop>
            <Knop type="submit" ikoon={RefreshCw}>
              Sinkroniseer nou
            </Knop>
          </div>
        </form>

        <p className="text-ink-muted text-xs">
          Nog nooit gesinkroniseer nie.
        </p>
      </div>
    </Paneel>
  );
}
