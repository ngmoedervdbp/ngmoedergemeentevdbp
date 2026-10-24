# Plaaslike soekbaarheid

Die kanonieke werf is **https://ngmoedervdbp.co.za**. Die inhoud fokus op die
werklike gemeente in **Vanderbijlpark en die Vaaldriehoek**.

## Wat die kode doen

- `/sitemap.xml` bevat die tien openbare bladsye; geen kerkraadroetes of
  lidmaatdata nie. `lib/seo.ts` is die sentrale lys van openbare URL's,
  bladsytitels en beskrywings.
- `/nuut-hier` help besoekers om hul eerste Sondag te beplan; `/bybelstudie`
  bevat die bevestigde tyd en praktiese aansluitinligting; `/vrae` beantwoord
  21 vrae in ses onderwerpe. Alle antwoorde is in die bediener se HTML,
  ook wanneer 'n besoeker nog nie 'n vraag oopgemaak het nie.
- [Die Afrikaanse soektemas](seo-soektemas.md) verbind voorgestelde soekfrases
  met bruikbare inhoud. Dit is idees, nie gemete soekvolumes of rangordes nie.
- Elke openbare bladsy het sy eie kanonieke URL, titel, beskrywing en
  Open Graph/Twitter-metadata. `/opengraph-image` bou die deelprent uit die
  bestaande logo en teks, sonder 'n eksterne beelddiens.
- JSON-LD beskryf die kerk, adres, Facebook-profiel en werf. Onderbladsye het
  broodkrummels. Kontakbesonderhede kom uit `lib/gemeente.ts`; ontbrekende
  telefoon- en e-poswaardes word weggelaat.
- `robots.txt` verwys na die sitemap. Die reëls vir `/kalender` en `/bediening`
  gebruik presiese grense sodat `/kalender-gemeente` en `/bedienings` oop bly.
  Aanmelding en wagwoordbladsye behou `noindex` uit die worteluitleg.
- Vercel-voorskoue kry `noindex`, 'n leë sitemap en `Disallow: /`.
  Die kanonieke domein bly die produksiedomein.
- Die sitemap en robots-lêer is bereikbaar sonder 'n sessie of Supabase.
  Toegangsbeheer vir die kerkraad bly in `proxy.ts`.

## By ontplooiing

1. Koppel `ngmoedervdbp.co.za` aan die produksieprojek in Vercel en voltooi die
   DNS/HTTPS-opstelling. Herlei alternatiewe domeine na hierdie een.
2. `NEXT_PUBLIC_WERF_URL` is opsioneel en val terug na
   `https://ngmoedervdbp.co.za`. As dit reeds gestel is, moet dit ook hierdie
   adres wees; moenie 'n Vercel-voorskou-URL gebruik nie. Herbou ná veranderinge.
3. Voeg die domein by Google Search Console en verifieer dit met DNS. Vir 'n
   URL-prefix-property kan `GOOGLE_SITE_VERIFICATION` die waarde van Google se
   verifikasie-meta-etiket bevat. Ontplooi weer nadat dit gestel is.
4. Dien `https://ngmoedervdbp.co.za/sitemap.xml` in Search Console in. Inspekteer
   die tuisblad, `/eredienste` en `/kontak` nadat die nuwe weergawe lewendig is.
5. Hou die kerk se Google Business Profile se naam, adres, werf en werklike
   dienstye op datum. Bevestig die publieke besonderhede met die kerkkantoor.

## Wanneer inhoud verander

Voeg 'n nuwe openbare bladsy by `PUBLIC_PAGES`, gebruik `publicPageMetadata` en
`PublicPageStructuredData` op die bladsy, en voeg 'n sigbare interne skakel by.
Die proxy se openbare roetelys moet ook die nuwe bladsy toelaat. Publiseer slegs
inhoud wat nuttig vir besoekers is en deur die gemeente bevestig is.

Moenie wysigingsdatums op elke bou herskryf of nuwe liggingbladsye skep wat
dieselfde teks herhaal nie. Die sitemap laat `lastmod` weg totdat 'n betroubare
inhoudswysigingsdatum beskikbaar is. Google ignoreer `priority` en `changefreq`;
dit is nie rangordeversterkers nie.

'n Sitemap help met ontdekking; dit waarborg nie indeksering of 'n eerste plek
nie. Sien [Google se sitemap-riglyne](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
en [plaaslike rangordefaktore](https://support.google.com/business/answer/7091).
