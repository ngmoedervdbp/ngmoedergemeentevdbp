# Bediening Opsporing — Base44-inventaris

Die Dominee se eie app: `ministry-track-log.base44.app`. Vasgelê vanaf skermskote,
1 September 2026. Dit is die bron vir die `ministry`-tabelle in
`supabase/migrations/` — moenie velde hier byvoeg wat nie in die demo gesien is nie.

Kop: **"Bediening Opsporing"**, subtitel "9 aktiwiteite hierdie week", met 'n klok
(kennisgewings), 'n **Afsprake**-knop en 'n primêre **+ Aanteken**-knop.

Vyf oortjies: **Aktiwiteite · Verslae · Ligging · Kalender · Sinkroniseer**.

## Aktiwiteitstipes

Uit die kalender se legende — tien, in hierdie volgorde:

| Tipe | Engelse sleutel in die lys | Kleur in demo |
|---|---|---|
| Tuisbesoek | `home visit` | blou |
| Hospitaalbesoek | `hospital visit` | rooi |
| Begrafnis | `funeral` | donkergrys |
| Vergadering | `meeting` | pers |
| Preek | `sermon` | oranje/amber |
| Berading | `counseling` | turkoois |
| Doop | `baptism` | ligblou |
| Troue | `wedding` | pienk |
| Bybelstudie | `bible study` | groen |
| Ander | `other` | oranje |

Die aktiwiteitslys wys die Engelse sleutel as byskrif (`home visit • Bestaande
Lidmaat • Siesta saal D`), maar die UI-etikette is Afrikaans.

## Aktiwiteit — velde

Uit "Nuwe Aktiwiteit Aanteken" en "Wysig Aktiwiteit":

| Veld | Verpligtend | Notas |
|---|---|---|
| Titel | ✓ | Vrye teks. In die praktyk 'n persoon se naam ("emma oelofse") of 'n gebeurtenis ("kerkraad vergadering") |
| Tipe | ✓ | Die tien hierbo. Verstek: Tuisbesoek |
| Lidmaat Tipe | ✓ | "Kies opsie" → **Bestaande Lidmaat** / **Nuwe Lidmaat** |
| Datum | ✓ | |
| Begintyd | | Opsioneel |
| Eindtyd | | Opsioneel — saam met begintyd gee dit die "Totale Ure"-syfer |
| Plek Naam | | bv. "NG Kerk Stellenbosch", "Cormed hospitaal", "Siesta saal D" |
| Adres | | Volle adres, met 'n GPS-knop langsaan om die huidige ligging te gebruik |

Let op: "Lidmaat Tipe" is **nie** dieselfde as `lede.tipe` (belydend/doop) in die
hoofapp nie. Dit sê of die besoek 'n bestaande lidmaat of 'n nuwe kontak was.
Party rye in die demo het glad geen lidmaat-tipe nie (bv. "Johhny Hirst se dogter",
"Pols Bybelstudie"), so dit is nullable ten spyte van die sterretjie in die vorm.

## Verslae

Uitvoer: **Druk · Word · PDF/Pages**.
Tydperk-knoppies: **Vandag · Hierdie Week · Hierdie Maand · Laaste 30 Dae**, plus
'n Van/Tot-datumreeks. Wys "31 aktiwiteite gevind".

Vier stat-teëls: **Totale Aktiwiteite** (31) · **Totale Ure** (35.8) ·
**Liggings** (19) · **Per Week (gem.)** (7.2).

Dan "Aktiwiteit Verspreiding" (sirkeldiagram), "Aktiwiteite per Tipe" (staafdiagram)
en "Uiteensetting per Kategorie" (gerangskikte lys met vorderingsbalke).

> Die getalle is bereken, nie gestoor nie — Totale Ure is die som van
> (eindtyd − begintyd), Liggings is 'n telling van unieke plekke.

## Ligging

- 'n Skakelaar: **"Outomaties elke 5 minute naspoor"** (af in die demo).
- 'n Knop: **"Teken Huidige Ligging Aan"**.
- 'n Lys "Onlangse Ligging Aantekeninge" — leeg in die demo.

> Dit is die swaarste POPIA-item in die hele projek: outomatiese
> ligging-naspeuring van 'n persoon elke 5 minute. Sien die waarskuwing in
> CLAUDE.md voor daar iets hiervan gebou word.

## Kalender

Maandaansig (September 2026), dagname **Son Ma Di Wo Do Vr Sa**, met die
tipe-legende onderaan.

## Sinkroniseer

**Kalender Sinkronisasie** — koppel 'n iCloud-kalender om gebeure outomaties in te
voer. 'n `iKal Kalender URL`-veld (`http://p121-caldav.icloud.com/published/2/…`),
knoppies **Stoor URL** en **Sinkroniseer Nou**, en "Laas gesinkroniseer:
2026-06-02 08:21:43".

## Afsprake (aparte skerm: "Afsprake Bestuur")

Twee aansigte: **Lys** / **Kalender**. Wys "0 totale afsprake" in die demo, so die
veldlys van 'n afspraak self is nog **nie gesien nie**.

Filter-oortjies: **Hangend · Aktief · Voltooi · Afgekeur**.

Die kalender se legende wys ses statusse, en dié is in Engels gelos in die demo:
**Pending · Approved · Rescheduled · Declined · Completed · No Show**.

> Let op die verskil: die filter-oortjies (4) en die kalender-legende (6) stem nie
> ooreen nie. Die legende is die volledige stel; "Aktief" in die filters dek
> waarskynlik Approved + Rescheduled. Bevestig by die Dominee.

## Wat ons NIE gesien het nie

- Die "Nuwe Afspraak"-vorm se velde (die lys was leeg).
- Of 'n aktiwiteit aan 'n regte `lede`-ry gekoppel word, en of die titel net vrye
  teks is. In die demo lyk dit soos vrye teks.
- Wat die klok-ikoon (kennisgewings) doen.
- Of daar aantekeninge/notas op 'n aktiwiteit is — die vorm is onder "Adres"
  afgesny.
