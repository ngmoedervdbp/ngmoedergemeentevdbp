import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { PubliekKop } from "@/components/publiek/publiek-kop";
import { PubliekVoet } from "@/components/publiek/publiek-voet";
import { GEMEENTE } from "@/lib/gemeente";
import { WerfBeweging } from "@/components/publiek/werf-beweging";
import { ChurchStructuredData } from "@/components/publiek/structured-data";
import { publicPageMetadata } from "@/lib/seo";
import "./publiek.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Die publieke werf — die gemeente se voordeur.
 *
 * Die publieke ontwerp leef in publiek.css: papier, bosgroen, sitruskleur en
 * Outfit met Spectral-aksente. Alle veranderlikes is onder .public-site
 * begrens sodat die kerkraad se Glas-ontwerp onafhanklik bly.
 *
 * Hierdie tak indekseer WEL — anders as die res van die app, wat `robots:
 * noindex` in die wortel-uitleg kry.
 */
export const metadata: Metadata = {
  ...publicPageMetadata("/"),
  title: {
    default: `${GEMEENTE.naam}`,
    template: `%s · ${GEMEENTE.kortNaam}`,
  },
  applicationName: GEMEENTE.naam,
  verification: { google: process.env.GOOGLE_SITE_VERIFICATION },
};

export default function PubliekLayout({ children }: LayoutProps<"/">) {
  return (
    <div className={`${outfit.variable} public-site flex min-h-dvh flex-col`}>
      <ChurchStructuredData />
      <a href="#inhoud" className="site-skip">
        Spring na inhoud
      </a>
      <PubliekKop />
      <main id="inhoud" className="flex-1" tabIndex={-1}>
        <WerfBeweging>{children}</WerfBeweging>
      </main>
      <PubliekVoet />
    </div>
  );
}
