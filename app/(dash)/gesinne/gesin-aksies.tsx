"use client";
import { useState } from "react";
import { HousePlus } from "lucide-react";
import { Knop } from "@/components/ui/basis";
import { GesinModaal } from "@/components/modale/algemene-modale";

export function GesinAksies() {
  const [oop, setOop] = useState(false);
  return (
    <>
      <Knop soort="primer" ikoon={HousePlus} grootte="sm" onClick={() => setOop(true)}>Nuwe gesin</Knop>
      <GesinModaal oop={oop} sluit={() => setOop(false)} />
    </>
  );
}
