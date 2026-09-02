import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { huidigeGebruiker, magBediening } from "@/lib/sessie";

/**
 * Bediening Opsporing is 'n TWEEDE installeerbare app in dieselfde projek.
 *
 * 'n Blaaier installeer een PWA per bereik ("scope"), en 'n bladsy kan net een
 * manifes hê. Deur hierdie tak sy eie manifes te gee met `scope: "/bediening"`,
 * kan die Dominee albei op sy tuisskerm sit: Lidmaatbestuur vanaf enige ander
 * bladsy, en Bediening vanaf hierdie een. Een projek, een ontplooiing, twee
 * ikone.
 *
 * Let wel: die twee deel 'n aanmelding, want dit is dieselfde oorsprong.
 */
/**
 * MOET dinamies wees.
 *
 * Sonder dit word hierdie tak by bou-tyd geprerender met watter rol ook al toe
 * gegeld het, en die gestoorde HTML — mét pastorale data — word daarna aan
 * elke besoeker bedien. Die `notFound()` hieronder loop dan nooit weer nie.
 *
 * Sodra Supabase Auth leef, maak `cookies()` hierdie roete in elk geval
 * dinamies; dit staan hier sodat die hek NOU al werk en nie stilweg van 'n
 * toekomstige verandering afhang nie.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  manifest: "/bediening.webmanifest",
  icons: {
    icon: [
      { url: "/ikone/bediening-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/ikone/bediening-180.png", sizes: "180x180" }],
  },
  appleWebApp: {
    capable: true,
    title: "Bediening",
    statusBarStyle: "default",
  },
};

/**
 * Rol-hek. Die sybalk wys die skakel reeds net vir die Dominee, maar 'n
 * versteekte skakel is nie sekuriteit nie — iemand kan die URL tik. Hier word
 * dit 'n 404 eerder as 'n "toegang geweier", sodat die bestaan van die skerm
 * self nie bevestig word nie.
 *
 * Die egte hek bly RLS (migrasie 017): selfs met 'n oop roete gee die databasis
 * niks terug vir iemand anders nie.
 */
export default async function BedieningLayout({
  children,
}: LayoutProps<"/bediening">) {
  const gebruiker = await huidigeGebruiker();
  if (!magBediening(gebruiker)) notFound();

  return <>{children}</>;
}
