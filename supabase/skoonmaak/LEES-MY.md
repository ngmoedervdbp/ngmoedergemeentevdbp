# Skoonmaak — van toets na produksie

Twee skrifte, vir twee verskillende oomblikke.

## `leeg-data.sql` — hou die skema, gooi die data weg

Vir wanneer die gemeente gereed is om regtig te begin. Elke toetsry gaan weg;
tabelle, enums, indekse en RLS-beleide bly presies soos hulle is.

```
Supabase → SQL Editor → plak → Run
```

**Kerkraad-aanmeldings bly staan.** `profiles` en `auth.users` word doelbewus
nie uitgevee nie — dit sou jou uit jou eie app sluit. Verwyder 'n spesifieke
toetsgebruiker in Supabase → Authentication → Users.

## `laat-val-alles.sql` — 'n heeltemal skoon lei

Vir wanneer jy die migrasies van voor af wil loop. Verwyder al 13 tabelle,
11 enums en 4 funksies wat 001–018 skep.

```
1. laat-val-alles.sql   → Run
2. 001 tot 018          → in volgorde
```

**Loop dit nooit op 'n projek met werklike gemeentedata nie.**

---

## Die spotdata in die app self

Die SQL hierbo raak net die databasis. Die app se eie spotdata leef in
`lib/mock/` en word tans deur **39 lêers** ingevoer.

Dit is nie 'n vinnige uitvee nie: elke bladsy roep 'n helper soos
`aktieweLede()` of `komendeVerjaarsdae()` aan. Die pad daaruit is om daardie
helpers een vir een met 'n Supabase-navraag te vervang — die handtekeninge is
reeds daarvoor ontwerp — en dan `lib/mock/` te verwyder sodra niks meer
daarna verwys nie.

Kyk waar dit nog gebruik word:

```bash
grep -rln "@/lib/mock" --include="*.tsx" --include="*.ts" app components lib
```

Wanneer daardie lys leeg is, is die omruil klaar.
