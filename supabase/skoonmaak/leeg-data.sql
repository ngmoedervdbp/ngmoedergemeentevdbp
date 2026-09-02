-- LEEG ALLE DATA, HOU DIE SKEMA
--
-- Vir wanneer die gemeente gereed is om regtig te begin: gooi elke toetsry weg
-- maar hou die tabelle, enums, indekse en RLS-beleide presies soos hulle is.
--
-- ⚠ ONOMKEERBAAR. Daar is geen "ongedaan" nie. Maak seker jy is op die regte
--   projek — kyk na die URL in die Supabase-blad voordat jy dit loop.
--
-- Gebruik:
--   Supabase → SQL Editor → plak → Run
--
-- `truncate ... cascade` volg vreemde sleutels self, so die volgorde hier maak
-- nie saak nie, en `restart identity` stel enige reeks terug.

begin;

truncate table
  kategese_group_lede,
  ligging_aantekeninge,
  bediening_aktiwiteite,
  afsprake,
  bediening_instellings,
  pending_registrations,
  documents,
  events,
  kategese_groups,
  lede,
  families,
  wyke
restart identity cascade;

commit;

-- LET WEL: `profiles` en `auth.users` word DOELBEWUS nie hier uitgevee nie.
--
-- Dit sou elke kerkraadslid se aanmelding vernietig, insluitend joune — jy sou
-- uitgesluit wees uit jou eie app. Om 'n spesifieke toetsgebruiker te verwyder,
-- doen dit in Supabase → Authentication → Users; die profiel volg vanself
-- (on delete cascade).
