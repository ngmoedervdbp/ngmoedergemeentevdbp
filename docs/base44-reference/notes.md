# Base44 App — Page-by-Page Inventory

Exhaustive record of the app we're replacing. `CLAUDE.md` holds the decisions;
this holds the evidence. Screenshots live in `docs/`.

Live URL: `kerk-lid-hub.base44.app` · Data currently in Google Sheets · 17 lidmate.

## Established facts

| Question | Answer |
|---|---|
| Who logs in | Kerkraad only. Lidmate never log in — see Registration below. |
| Public surface | **One public route**: the registration form. Everything else is gated. |
| Language | Afrikaans only. No English toggle. |
| Hosting | Vercel |
| Framework | Next.js App Router |
| Naming | English identifiers, Afrikaans kept for `wyke` / `kategese` |
| PWA | Installable, online-only. No offline sync. |
| Roles | At least `admin` vs non-admin (Admin page returns "Toegang Geweier") |

## The registration flow (this is the "member accounts" question)

Lidmate do **not** get accounts. Instellings exposes a shareable link:

```
https://kerk-lid-hub.base44.app/Registration
```

Guidance in-app: put a QR code at the church entrance, share in WhatsApp groups, put
it on the website, print on pamphlets. A new lidmaat fills the form → the submission
lands in the **"Wag vir Goedkeuring"** queue on the Lidmate page → kerkraad approves →
they become a normal record. A notification email goes to the address in Instellings
(`admin@ngmoeder.co.za`). After registering they're shown a welcome message and given
the four documents from Dokumentasie.

So: public write-only form + moderation queue. Not authentication.

---

## Pages

### Dashboard
"Welkom terug! Hier is 'n oorsig van jou gemeente."
- Actions: Excel, Verslag, Lidmateverslag PDF
- Gradient tiles: Aktiewe Lidmate (15, "17 totaal in databasis"), Nuwe Lidmate (10, hierdie jaar), Oorledenes (0), Oorgeplaas (0), Kinders onder 13 (2), Seniors 60+ (5)
- Lidmate per Wyk — small count cards per wyk, plus "Geen Wyk"
- Banner: Kinders onder 18, with 0–5 / 6–12 / 13–17 breakdown
- Lidmaatgroei Per Maand (area chart, 12 months)
- Lidmate per Kategorie (empty), Status Verspreiding (pie), Geslagsverspreiding (bar)
- Komende Gebeurtenisse, Nuutste Lidmate
- CTA: "Genereer Volledige Lidmateverslag (PDF) — Professionele PDF geskik vir Kerkraad en Sinode"
- Vinnige Aksies: Voeg Lidmaat By, Skep Gebeurtenis, Bekyk Verslae, Dokumentasie

### Lidmate
"17 lidmate in databasis" · Actions: Uitvoer, Excel Invoer, + Nuwe Lidmaat
- Tiles: Totaal 17, Aktief 15, Onaktief 2, Wag Goedkeuring 0
- Charts: Lidmaatstatus (pie), Nuwe Lidmate per Maand, Lidmate per Wyk
- Tabs: **Almal (17)** / **Wag vir Goedkeuring (0)** ← the moderation queue
- Filters: search, Alle Status, Alle Tipes
- Cards: initials avatar, name, status pill, phone, email, city, "Wys Adres", "Lid sedert Feb 2026"

### Wyke
"Bestuur gemeente wyke en lidmaat-indeling"
- View toggle Kaarte / Ledelys · Actions: Verdeel Lidmate in Wyke, Druk Wyk Lys, + Nuwe Wyk
- Tiles: 8 Wyke, 16 Toegeken aan Wyk, 0 Nie Toegeken
- Wyk card: number badge (`#1`, `#30 A`, `#38 A` — **not integers**), name, optional
  ouderling (Hans Kruger, Piet Els), "Lidmate 5 / 50" with capacity bar, Druk Wyk Lys, edit/delete
- Capacities vary: 50, 60, 70

### Gesinne
"4 gesinne gevind" · search only — **no "Nuwe Gesin" button**
- Card: "Gesin <Van>", section EGPAAR (Man / Vrou), section KINDERS (n) (Kind), address
- Appears to be **derived from surname + household role**, not a real entity. See CLAUDE.md.

### Kategese
"Sondagskool & Kategese Bestuur" · Actions: Nuwe Gebeurtenis, Voeg Kind By, Nuwe Groep
- Tiles: Kinders, Groepe, Aanstaande Gebeure, Sonder Groep
- Tabs: Groepe / Alle Kinders / Kalender & Gebeure
- Currently empty — unused so far

### Kalender
"Bestuur kerkgebeurtenisse en aktiwiteite" · + Nuwe Gebeurtenis
- Category tabs with counts: Algemeen (7), Jeug (1), Seniors (1), Spesiale Geleenthede (1)
- Prev / Vandag / Next · Maand / Week toggle
- Day headers: Son Maa Din Woe Don Vry Sat

### Verslae
"Statistieke en analise van lidmaatskap" · Laaste 12 maande selector, Uitvoer, Genereer Volledige Lidmateverslag (PDF)
- Charts: Nuwe Lidmate per Maand, Lidmaatskap Tipes (empty), Geslagsverspreiding (Manlik 7 / Vroulik 8), Status Verspreiding
- Ouderdomsverdeling "bereken uit geboortedatums": Kinders onder 18 = 2 (17%), Volwassenes 18+ = 10 (83%), **Geen geboortedatum = 3**
- Ouderdomsgroepe buckets: 0–5, 6–12, 13–17, 18–35, 36–59, 60+
- Lys van Kinders onder 18 — columns #, Naam, **Van**, Ouderdom, Geboortedatum, Selfoon, Status

> ⚠️ **Base44 bugs — do not replicate.** Verslae shows two identical "Aktiewe Lidmate 15"
> tiles, and reports Kinders 0 / Seniors 0 while the Dashboard reports 2 / 5 for the same
> data. The age maths is inconsistent between pages.

### Dokumentasie
"Bestuur kerk dokumente vir lidmate"
- **Nuwe Lidmaat Dokumente** — "word aan nuwe lidmate beskikbaar gestel na registrasie".
  Four fixed slots: Lidmaatskapvorm (PDF), Kerk se Grondwet, Bankbesonderhede (bydraes en tiendes), Welkombrief
- Each slot: "Nog nie opgelaai" badge + Laai Op
- **Ander Dokumente** — arbitrary uploads, + Voeg By

### Argief
"Onaktiewe en oorgeplaasde lidmate (nie in verslae ingesluit nie)"
- Banner: "Hulle word **nie** ingesluit in verslae, statistieke of aktiewe lyste nie.
  Data word behou vir geskiedenisdoeleindes."
- Tiles: Totale Argief 2, Onaktief 2, Oorgeplaas 0
- Search on naam/selfoon, filter Alle Geargiveerdes
- Table: Naam, Selfoon, E-pos, Status, **Aantekeninge**, Aksies → **Heraktiveer**
- Confirms archive is a *view over status*, not a separate store.

### Kommunikasie
"Kontak lidmate via e-pos en WhatsApp"
- Left: Kies Lidmate — search, Alle Tipes, Aktief, Kies Almal / Ontkies, checkbox list
  with Foon / E-pos capability badges
- E-pos: Onderwerp, Boodskap, `{naam}` merge token, Stuur E-pos (n)
- WhatsApp: Boodskap + warning "boodskappe moet individueel gestuur word — sal WhatsApp
  Web oopmaak met die eerste lidmaat se nommer". It's a `wa.me` link, not a real integration.

### Admin
Returns **"Toegang Geweier" — "Hierdie bladsy is slegs beskikbaar vir admin-gebruikers."**
Tiaan's account is not admin, so contents unknown. Presumably user/role management.

### Instellings
"Bestuur kerk instellings en konfigurasie"
- **Kerk Inligting**: Kerk Naam `NG Vanderbijlpark Moedergemeente`, E-pos `admin@ngmoeder.co.za`
  ("Nuwe lidmaat registrasies sal na hierdie adres gestuur word"), Telefoon `0160040041`,
  Adres `hoek van Faraday en Pasteur`, Welkoms Boodskap (shown after successful registration)
- **Registrasie Skakel** — see registration flow above
- **Program & Wolkberging** — Wolkberging Aktief, Outomatiese Sinchronisasie, Installeer Program

---

## Confirmed member fields

| Field | Evidence |
|---|---|
| Naam / Van (separate) | Verslae table has both columns |
| Geboortedatum | nullable — 3 of 17 records have none |
| Ouderdom | computed, never stored |
| Selfoon | nullable |
| E-pos | nullable |
| Adres + stad | "Vanderbijlpark", "Wys Adres" link |
| Geslag | Manlik / Vroulik |
| Wyk | nullable ("Geen Wyk") |
| Status | Aktief / Onaktief / Oorgeplaas / Oorlede |
| Lidmaatskap tipe | "Alle Tipes" filter + "Lidmaatskap Tipes" chart (values unseen — chart empty) |
| Huishouding-rol | Man / Vrou / Kind |
| Lid sedert | "Lid sedert Feb 2026" |
| Aantekeninge | Argief table column |
| Goedkeuring | Wag vir Goedkeuring queue |

## Still unknown

- Admin page contents (locked out) — ask the Dominee for a screenshot
- The values of "Lidmaatskap Tipes" — chart renders empty
- The registration form's own fields — get a screenshot of `/Registration`
- Whether Kategese was ever populated
