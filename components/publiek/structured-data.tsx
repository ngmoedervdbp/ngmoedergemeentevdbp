import { GEMEENTE } from "@/lib/gemeente";
import { absoluteUrl, PUBLIC_PAGES, type PublicPath } from "@/lib/seo";

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export function ChurchStructuredData() {
  return (
    <JsonLd data={{
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": ["Church", "Organization"],
          "@id": absoluteUrl("/#church"),
          name: GEMEENTE.naam,
          alternateName: "NG Vanderbijlpark Moedergemeente",
          url: absoluteUrl("/"),
          description: "'n NG gemeente in Vanderbijlpark in die Vaaldriehoek, gestig in 1949.",
          foundingDate: String(GEMEENTE.gestig),
          logo: absoluteUrl("/logo/ng-logo-512.png"),
          image: absoluteUrl("/opengraph-image"),
          address: {
            "@type": "PostalAddress",
            streetAddress: GEMEENTE.adres.straat,
            addressLocality: GEMEENTE.adres.dorp,
            addressRegion: GEMEENTE.adres.provinsie,
            postalCode: GEMEENTE.adres.poskode,
            addressCountry: "ZA",
          },
          hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${GEMEENTE.adres.straat}, ${GEMEENTE.adres.dorp}`)}`,
          areaServed: ["Vanderbijlpark", "Vaaldriehoek"],
          sameAs: [GEMEENTE.kontak.facebook],
          ...(GEMEENTE.kontak.telefoon ? { telephone: GEMEENTE.kontak.telefoon } : {}),
          ...(GEMEENTE.kontak.epos ? { email: GEMEENTE.kontak.epos } : {}),
        },
        {
          "@type": "WebSite",
          "@id": absoluteUrl("/#website"),
          name: GEMEENTE.naam,
          url: absoluteUrl("/"),
          inLanguage: "af-ZA",
          publisher: { "@id": absoluteUrl("/#church") },
        },
      ],
    }} />
  );
}

export function PublicPageStructuredData({ path }: { path: PublicPath }) {
  const page = PUBLIC_PAGES[path];
  const breadcrumbId = absoluteUrl(`${path}#breadcrumb`);
  return (
    <JsonLd data={{
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": path === "/kontak" ? "ContactPage" : path === "/oor-ons" ? "AboutPage" : "WebPage",
          "@id": absoluteUrl(`${path}#webpage`),
          url: absoluteUrl(path),
          name: page.title,
          description: page.description,
          inLanguage: "af-ZA",
          isPartOf: { "@id": absoluteUrl("/#website") },
          about: { "@id": absoluteUrl("/#church") },
          ...(path === "/" ? {} : { breadcrumb: { "@id": breadcrumbId } }),
        },
        ...(path === "/" ? [] : [{
          "@type": "BreadcrumbList",
          "@id": breadcrumbId,
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Tuis", item: absoluteUrl("/") },
            { "@type": "ListItem", position: 2, name: page.label, item: absoluteUrl(path) },
          ],
        }]),
      ],
    }} />
  );
}
