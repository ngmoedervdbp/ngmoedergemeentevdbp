"use client";
import { useState } from "react";
import { CalendarPlus } from "lucide-react";
import { Knop } from "@/components/ui/basis";
import { GebeurtenisModaal } from "@/components/modale/algemene-modale";

export function KalenderAksies() {
  const [oop, setOop] = useState(false);
  return (
    <>
      <Knop soort="primer" ikoon={CalendarPlus} grootte="sm" onClick={() => setOop(true)}>
        Nuwe gebeurtenis
      </Knop>
      <GebeurtenisModaal oop={oop} sluit={() => setOop(false)} />
    </>
  );
}
