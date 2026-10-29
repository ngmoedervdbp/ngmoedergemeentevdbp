# Demo — 'n eie speelruimte vir elke toetser

Die kerkraad toets die stelsel op 'n **aparte Supabase-projek** met 'n **aparte
Vercel-projek**. Elke toetser begin leeg en sien net sy eie data.

Niks hier raak produksie nie: `speelruimtes.sql` is doelbewus nie in
`supabase/migrations/` nie, en die app se demo-koppelvlak skakel net aan as
`NEXT_PUBLIC_DEMO=1`.

## Opstelling (een keer)

1. **Migrasies** op die demo-projek — SQL Editor → plak → Run, 001 tot die
   nuutste. Plak 001–019 en 020 en verder as twee aparte navrae: 019 voeg
   rolwaardes by wat 020 eers ná 'n commit mag gebruik.

   Die CLI word nie gebruik nie: hierdie gids is nooit aan 'n projek gekoppel
   nie, en produksie se migrasies is ook deur die SQL Editor geloop. `db push`
   sonder migrasiegeskiedenis sou probeer om alles van voor af te loop.

   Kopieer 'n lêer vanuit die terminaal met `pbcopy < pad/na/lêer.sql`, en
   plak dan in die blaaier.

2. **`speelruimtes.sql`** — Demo-projek → SQL Editor → plak → Run.

   Dit weier om te loop as die databasis reeds lidmate het sonder
   speelruimtes, want dit is hoe 'n produksie-databasis lyk.

3. **Gebruikers** — Authentication → Users → *Add user* → *Create new user*,
   met **Auto Confirm User** aangeskakel. Moenie uitnodigings stuur nie:
   Supabase se ingeboude e-pos laat net 'n paar per uur toe.

4. **Authentication → Sign In / Providers**: skakel *Allow new users to sign up*
   af.

5. **Authentication → URL Configuration**: Site URL en Redirect URLs = die demo
   se Vercel-adres.

## Ná elke nuwe migrasie

Plak die migrasie in die demo se SQL Editor (ook in produksie s'n), en **loop
dan `speelruimtes.sql` weer** op die demo. Dit is herloopbaar.
'n Migrasie wat beleide herskep, sou andersins die isolasie stilweg ophef —
toetsers sou mekaar se data sien.

## Hoe die isolasie werk

- Elke gedeelde tabel het `speelruimte_id`, met verstek `auth.uid()`. Die app
  stel dit nooit self nie; RLS laat jou net jou eie rye sien en skryf.
- Almal is admin van hul eie speelruimte. **Speel as** in Instellings wissel
  jou eie rol, sodat leesregte vir 'n ouderling werklik getoets kan word.
- Die publieke registrasievorm het geen sessie nie, so elke toetser kry 'n
  persoonlike skakel (`/registreer?s=<id>`) in Instellings.
- **Maak my speelruimte leeg** roep `maak_speelruimte_leeg()` aan.
- 'n Toetser in Authentication uitvee, vee sy hele speelruimte uit (cascade).

## Wanneer die toetsfase verby is

Vee die Vercel-demoprojek en die Supabase-demoprojek uit. Daar is niks in
produksie om op te ruim nie.
