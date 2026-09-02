-- LAAT DIE HELE SKEMA VAL — 'n skoon lei
--
-- Vir wanneer jy die migrasies van voor af wil loop: verwyder elke tabel,
-- enum, funksie en sneller wat 001–018 geskep het, sodat die projek weer leeg
-- is soos 'n splinternuwe een.
--
-- ⚠⚠ DIT VEE ALLES UIT. Elke lidmaat, elke besoek, elke registrasie.
--    Loop dit NOOIT op 'n projek met werklike gemeentedata nie.
--
-- Gebruik:
--   1. Supabase → SQL Editor → hierdie lêer → Run
--   2. Dan 001 tot 018 in volgorde
--
-- Waarom `if exists` oral: die skrip moet loop of die tabel nou bestaan of
-- nie, sodat 'n halfvoltooide migrasie ook skoongemaak kan word.

begin;

-- Snellers op auth.users moet eerste, want die tabel self bly staan.
drop trigger if exists on_auth_user_created on auth.users;

drop table if exists
  kategese_group_lede,
  ligging_aantekeninge,
  bediening_aktiwiteite,
  bediening_instellings,
  afsprake,
  pending_registrations,
  documents,
  events,
  kategese_groups,
  lede,
  families,
  wyke,
  profiles
cascade;

drop function if exists public.handle_new_user() cascade;
drop function if exists public.set_updated_at() cascade;
drop function if exists public.is_kerkraad() cascade;
drop function if exists public.is_admin() cascade;

drop type if exists
  lidmaat_status,
  geslag,
  family_role,
  lidmaat_tipe,
  gebeurtenis_kategorie,
  registrasie_status,
  huwelikstatus,
  gebruiker_rol,
  bediening_tipe,
  bediening_lidmaat_tipe,
  afspraak_status
cascade;

commit;
