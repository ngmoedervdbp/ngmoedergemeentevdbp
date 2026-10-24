import type { Metadata } from "next";
import { GEMEENTE } from "@/lib/gemeente";

// Keep the church's custom domain canonical, including on Vercel previews.
const configuredUrl =
  process.env.NEXT_PUBLIC_WERF_URL?.trim() || "https://ngmoedervdbp.co.za";
const siteUrl = new URL(configuredUrl);
if (!["https:", "http:"].includes(siteUrl.protocol)) {
  throw new Error("NEXT_PUBLIC_WERF_URL must be an absolute HTTP(S) website URL.");
}

export const SITE_URL = siteUrl.origin;
export const IS_PREVIEW =
  process.env.VERCEL_ENV === "preview" ||
  process.env.VERCEL_ENV === "development";

/** Only these public pages belong in search results. Never derive from admin data. */
export const PUBLIC_PAGES = {
  "/": {
    label: "Tuis",
    title: "NG Moedergemeente Vanderbijlpark | Kerk in die Vaal",
    description:
      "Soek jy 'n kerk in Vanderbijlpark of die Vaal? Kom kuier by NG Moedergemeente. Sondae 08:30, h/v Faraday en Pasteur Boulevard. Almal is welkom.",
  },
  "/oor-ons": {
    label: "Oor ons",
    title: "Oor ons gemeente in Vanderbijlpark | NG Moedergemeente",
    description:
      "Leer NG Moedergemeente Vanderbijlpark ken: gestig in 1949, deel van die NG Kerk se Sinode Goudland en die Vaaldriehoek se gemeentegeskiedenis.",
  },
  "/eredienste": {
    label: "Eredienste",
    title: "Eredienste in Vanderbijlpark | Sondag 08:30 | NG Moedergemeente",
    description:
      "Kom Sondag 08:30 na NG Moedergemeente se erediens in Vanderbijlpark. Kry dienstye, die kerk se adres en inligting vir jou eerste besoek uit die Vaal.",
  },
  "/kalender-gemeente": {
    label: "Gemeentekalender",
    title: "Gemeentekalender in Vanderbijlpark | NG Moedergemeente",
    description:
      "Sien komende eredienste, byeenkomste en spesiale geleenthede by NG Moedergemeente Vanderbijlpark in die Vaaldriehoek. Besoekers is welkom.",
  },
  "/bedienings": {
    label: "Bedienings",
    title: "Kategese, jeug en bedienings | NG Moedergemeente Vanderbijlpark",
    description:
      "Vrae oor Sondagskool, kategese of jeug in Vanderbijlpark? Verken NG Moedergemeente se bedienings en vra hoe jy of jou gesin kan inskakel.",
  },
  "/kontak": {
    label: "Kontak en aanwysings",
    title: "Kerkadres en aanwysings | NG Moedergemeente Vanderbijlpark",
    description:
      "Kry NG Moedergemeente op die hoek van Faraday en Pasteur Boulevard, Vanderbijlpark, Gauteng. Kaart, aanwysings en kontak vir jou besoek uit die Vaal.",
  },
  "/registreer": {
    label: "Word deel van ons",
    title: "Word deel van ons | NG Moedergemeente Vanderbijlpark",
    description:
      "Nuut in Vanderbijlpark of op soek na 'n kerktuiste in die Vaal? Laat jou besonderhede by NG Moedergemeente en die kerkkantoor tree met jou in verbinding.",
  },
  "/nuut-hier": {
    label: "Nuut hier",
    title: "Nuut by die kerk? Jou eerste besoek | NG Moedergemeente",
    description:
      "Soek jy 'n Afrikaanse kerk in Vanderbijlpark? Beplan jou eerste besoek: Sondag 08:30, kinders welkom, aanwysings en hoe om by die gemeente in te skakel.",
  },
  "/bybelstudie": {
    label: "Bybelstudie",
    title: "Bybelstudie in Vanderbijlpark | Donderdag 20:00",
    description:
      "Soek jy Bybelstudie in die Vaal? NG Moedergemeente Vanderbijlpark kom Donderdae 20:00 saam. Lees hoe om aan te sluit, ook as jy 'n beginner is.",
  },
  "/vrae": {
    label: "Vrae en antwoorde",
    title: "Kerkvrae: dienstye, kinders en inskakeling | Vanderbijlpark",
    description:
      "Vrae oor kerk in Vanderbijlpark? Kry dienstye, Bybelstudie en lidmaatskapinligting, plus wat om die kerkkantoor oor doop, troues of 'n begrafnis te vra.",
  },
} as const;

export type PublicPath = keyof typeof PUBLIC_PAGES;

export function absoluteUrl(path: string) {
  return new URL(path, `${SITE_URL}/`).toString();
}

export function publicPageMetadata(path: PublicPath): Metadata {
  const { title, description } = PUBLIC_PAGES[path];
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: absoluteUrl(path) },
    robots: {
      index: !IS_PREVIEW,
      follow: true,
      googleBot: {
        index: !IS_PREVIEW,
        follow: true,
        "max-image-preview": "large",
      },
    },
    openGraph: {
      type: "website",
      locale: "af_ZA",
      siteName: GEMEENTE.naam,
      url: absoluteUrl(path),
      title,
      description,
      images: [{
        url: absoluteUrl("/opengraph-image"),
        width: 1200,
        height: 630,
        alt: GEMEENTE.naam,
      }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl("/opengraph-image")],
    },
  };
}
