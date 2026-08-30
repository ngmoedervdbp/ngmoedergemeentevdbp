import type { Metadata } from "next";
import { BladsyKop } from "@/components/kerk/bladsy-kop";
import { InstellingsOortjies } from "./instellings-oortjies";

export const metadata: Metadata = { title: "Instellings" };

export default function InstellingsBladsy() {
  return (
    <>
      <BladsyKop titel="Instellings" beskrywing="Bestuur kerkinstellings en konfigurasie." />
      <InstellingsOortjies />
    </>
  );
}
