import type { Metadata } from "next";
import { PubliekKop } from "@/components/publiek/publiek-kop";
import { PubliekVoet } from "@/components/publiek/publiek-voet";
import { GEMEENTE } from "@/lib/gemeente";

/**
 * Die publieke werf — die gemeente se voordeur.
 *
 * Anders as die admin-app is dit lig en oop: geen donker sybalk nie, 'n breë
 * kolom, en die lansetboog wat die bladsy dra eerder as 'n raam wat dit
 * omsluit. Die Glas-taal bly (kalksteen, diep glastone, Spectral), maar die
 * lood raam is 'n admin-ding en hoort nie op 'n tuisblad nie.
 *
 * Hierdie tak indekseer WEL — anders as die res van die app, wat `robots:
 * noindex` in die wortel-uitleg kry.
 */
export const metadata: Metadata = {
  title: {
    default: `${GEMEENTE.naam}`,
    template: `%s · ${GEMEENTE.kortNaam}`,
  },
  description:
    "'n Gemeente in die hart van Vanderbijlpark sedert 1949. Almal is welkom.",
  robots: { index: true, follow: true },
};

export default function PubliekLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <div className="werf-grond flex min-h-dvh flex-col">
      <PubliekKop />
      <main className="flex-1">{children}</main>
      <PubliekVoet />
    </div>
  );
}
