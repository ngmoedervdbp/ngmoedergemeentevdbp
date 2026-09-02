import type { Metadata, Viewport } from "next";
import { Source_Sans_3, Spectral } from "next/font/google";
import "./globals.css";

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const spectral = Spectral({
  variable: "--font-spectral",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Lidmaatbestuur · NG Moedergemeente",
    template: "%s · NG Moedergemeente",
  },
  description:
    "Lidmaatbestuur vir die kerkraad van NG Vanderbijlpark Moedergemeente.",
  applicationName: "Lidmaatbestuur",
  manifest: "/manifest.webmanifest",
  // iOS gebruik nie die manifes se ikone vir "Voeg by tuisskerm" nie — dit wil
  // 'n apple-touch-icon hê. Die bediening-tak oorheers dit in sy eie uitleg.
  icons: {
    icon: [{ url: "/ikone/app-192.png", sizes: "192x192", type: "image/png" }],
    apple: [{ url: "/ikone/app-180.png", sizes: "180x180" }],
  },
  appleWebApp: {
    capable: true,
    title: "Lidmaatbestuur",
    statusBarStyle: "default",
  },
  // Interne app met persoonlike data — hou dit uit soekenjins uit.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#1f1d2b",
  width: "device-width",
  initialScale: 1,
  // Die kerkraad gebruik dit op selfone met 'n keep — hou inhoud uit die
  // afgeronde hoeke en die tuisbalk uit. Sien `.veilig-*` in globals.css.
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="af"
      className={`${sourceSans.variable} ${spectral.variable} h-full antialiased`}
    >
      <body className="font-sans min-h-full">{children}</body>
    </html>
  );
}
