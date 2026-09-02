import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalendarDays, Clock, MapPin, TrendingUp } from "lucide-react";
import { BladsyKop } from "@/components/kerk/bladsy-kop";
import { StatTeel } from "@/components/kerk/stat-teel";
import {
  aktiwiteiteHierdieWeek,
  bedieningOorsig,
  tellingPerTipe,
} from "@/lib/data/bediening-afleidings";
import { haalAfsprake, haalAktiwiteite } from "@/lib/data/bediening-data";
import { BedieningAansig } from "./bediening-aansig";
import { huidigeGebruiker, magBediening } from "@/lib/sessie";

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
export default async function BedieningBladsy() {
  // Die hek moet HIER staan, nie net in die uitleg nie: Next render 'n uitleg
  // en sy bladsy PARALLEL, so die uitleg se notFound() keer nie dat hierdie
  // bladsy sy data haal en in die RSC-vrag stuur nie.
  if (!magBediening(await huidigeGebruiker())) notFound();

  const [lys, afsprakeLys] = await Promise.all([
    haalAktiwiteite(),
    haalAfsprake(),
  ]);

  const week = aktiwiteiteHierdieWeek(lys);
  const oorsig = bedieningOorsig(lys);
  const perTipe = tellingPerTipe(lys);

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
