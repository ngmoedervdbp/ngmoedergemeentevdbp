import type { Metadata } from "next";
import { CalendarDays, Clock, MapPin, TrendingUp } from "lucide-react";
import { BladsyKop } from "@/components/kerk/bladsy-kop";
import { StatTeel } from "@/components/kerk/stat-teel";
import {
  aktiwiteite,
  aktiwiteiteHierdieWeek,
  afsprake,
  bedieningOorsig,
  tellingPerTipe,
} from "@/lib/mock/bediening";
import { BedieningAansig } from "./bediening-aansig";

export const metadata: Metadata = { title: "Bediening" };

/**
 * Bediening Opsporing — die Dominee se eie werkskerm.
 *
 * Vyf oortjies soos sy Base44-demo: Aktiwiteite, Verslae, Ligging, Kalender,
 * Sinkroniseer. Sien docs/base44-reference/bediening-opsporing.md.
 *
 * Die data en die syfers word hier op die bediener bereken; die oortjies self
 * is 'n kliëntkomponent omdat dit interaktief is.
 */
export default function BedieningBladsy() {
  const lys = aktiwiteite();
  const week = aktiwiteiteHierdieWeek();
  const oorsig = bedieningOorsig(lys);
  const perTipe = tellingPerTipe(lys);
  const afsprakeLys = afsprake();

  return (
    <>
      <BladsyKop
        titel="Bediening"
        beskrywing={
          week.length === 1
            ? "1 aktiwiteit hierdie week."
            : `${week.length} aktiwiteite hierdie week.`
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTeel
          etiket="Totale aktiwiteite"
          waarde={oorsig.totaal}
          ikoon={CalendarDays}
          tint="saffier"
        />
        <StatTeel
          etiket="Totale ure"
          waarde={oorsig.totaleUre}
          ikoon={Clock}
          tint="groen"
        />
        <StatTeel
          etiket="Liggings"
          waarde={oorsig.liggings}
          ikoon={MapPin}
          tint="amber"
        />
        <StatTeel
          etiket="Per week (gem.)"
          waarde={oorsig.perWeek}
          ikoon={TrendingUp}
          tint="wyn"
        />
      </div>

      <BedieningAansig
        aktiwiteite={lys}
        afsprake={afsprakeLys}
        perTipe={perTipe}
        oorsig={oorsig}
      />
    </>
  );
}
