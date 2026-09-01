"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  ClipboardList,
  FileText,
  LayoutGrid,
  MapPin,
  Plus,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { Knop } from "@/components/ui/basis";
import { Oortjies, type OortjieItem } from "@/components/ui/oortjies";
import { AktiwiteitModaal } from "@/components/modale/aktiwiteit-modaal";
import type {
  Afspraak,
  BedieningAktiwiteit,
  BedieningTipe,
} from "@/lib/mock/bediening";
import { AktiwiteitLys } from "./aktiwiteit-lys";
import { BedieningVerslae } from "./bediening-verslae";
import { BedieningLigging } from "./bediening-ligging";
import { BedieningKalender } from "./bediening-kalender";
import { BedieningSinkroniseer } from "./bediening-sinkroniseer";

type Oortjie = "aktiwiteite" | "verslae" | "ligging" | "kalender" | "sinkroniseer";

const OORTJIES: OortjieItem<Oortjie>[] = [
  { sleutel: "aktiwiteite", etiket: "Aktiwiteite", ikoon: LayoutGrid },
  { sleutel: "verslae", etiket: "Verslae", ikoon: FileText },
  { sleutel: "ligging", etiket: "Ligging", ikoon: MapPin },
  { sleutel: "kalender", etiket: "Kalender", ikoon: CalendarDays },
  { sleutel: "sinkroniseer", etiket: "Sinkroniseer", ikoon: RefreshCw },
];

export function BedieningAansig({
  aktiwiteite,
  afsprake,
  perTipe,
  oorsig,
}: {
  aktiwiteite: BedieningAktiwiteit[];
  afsprake: Afspraak[];
  perTipe: { tipe: BedieningTipe; aantal: number; persentasie: number }[];
  oorsig: {
    totaal: number;
    totaleUre: number;
    liggings: number;
    perWeek: number;
  };
}) {
  const [oortjie, setOortjie] = useState<Oortjie>("aktiwiteite");
  const [modaalOop, setModaalOop] = useState(false);
  const [wysig, setWysig] = useState<BedieningAktiwiteit | null>(null);

  const items = useMemo(
    () =>
      OORTJIES.map((o) =>
        o.sleutel === "aktiwiteite"
          ? { ...o, telling: aktiwiteite.length }
          : o,
      ),
    [aktiwiteite.length],
  );

  function nuut() {
    setWysig(null);
    setModaalOop(true);
  }

  function begin(a: BedieningAktiwiteit) {
    setWysig(a);
    setModaalOop(true);
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Oortjies
            items={items}
            aktief={oortjie}
            kies={setOortjie}
            etiket="Bediening"
          />
          <Knop ikoon={Plus} onClick={nuut} className="w-full sm:w-auto">
            Aanteken
          </Knop>
        </div>

        {oortjie === "aktiwiteite" ? (
          <AktiwiteitLys aktiwiteite={aktiwiteite} wysig={begin} nuut={nuut} />
        ) : null}

        {oortjie === "verslae" ? (
          <BedieningVerslae
            aktiwiteite={aktiwiteite}
            perTipe={perTipe}
            oorsig={oorsig}
          />
        ) : null}

        {oortjie === "ligging" ? <BedieningLigging /> : null}

        {oortjie === "kalender" ? (
          <BedieningKalender aktiwiteite={aktiwiteite} />
        ) : null}

        {oortjie === "sinkroniseer" ? <BedieningSinkroniseer /> : null}
      </div>

      <AktiwiteitModaal
        oop={modaalOop}
        sluit={() => setModaalOop(false)}
        aktiwiteit={wysig}
      />

      {/* Afsprake leef op sy eie bladsy; die telling hier hou dit sigbaar. */}
      <Link
        href="/bediening/afsprake"
        className="border-line bg-surface hover:border-brand/30 focus-visible:outline-accent raak flex items-center justify-between gap-3 rounded-xl border px-4 py-3 transition-colors focus-visible:outline-2"
      >
        <span className="flex items-center gap-2.5">
          <ClipboardList size={17} className="text-ink-muted shrink-0" aria-hidden />
          <span className="text-sm font-semibold">
            {afsprake.length} afsprake in die stelsel
          </span>
        </span>
        <span className="text-brand shrink-0 text-sm font-semibold">Bestuur</span>
      </Link>
    </>
  );
}
