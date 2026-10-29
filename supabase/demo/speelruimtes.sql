-- Demo — elke toetser kry sy eie, geïsoleerde speelruimte
--
-- ⚠⚠ SLEGS VIR DIE DEMO-PROJEK. LOOP DIT NOOIT OP PRODUKSIE NIE. ⚠⚠
--
-- Hierdie lêer is doelbewus NIE in supabase/migrations/ nie: `db push` en
-- enige toekomstige outomatisering raak dit dus nooit. Sien LEES-MY.md.
--
-- Wat dit doen:
--   1. Elke gedeelde tabel kry `speelruimte_id`, met verstek auth.uid(). Die
--      app hoef dit nooit te stel nie — 'n invoeging beland outomaties in die
--      invoeger se speelruimte.
--   2. RLS word herskryf: jy sien en skryf slegs jou eie rye. Die rolreëls
--      (lees vs skryf) bly geld BINNE jou speelruimte, sodat "Speel as" in
--      Instellings werklik wys wat 'n ouderling sien.
--   3. Uniekheid word per speelruimte (twee toetsers mag elk 'n wyk "1" hê).
--   4. Almal is admin van hul eie speelruimte, mag hul eie rol wissel, en sien
--      niemand anders se profiel of bedieningsrekords nie.
--   5. `maak_speelruimte_leeg()` vir die herstelknoppie.
--
-- HERLOOPBAAR: loop dit weer ná elke nuwe migrasie. 'n Migrasie wat beleide
-- herskep, sou andersins die isolasie stilweg ophef.

-- ------------------------------------------------------------- veiligheid
-- 'n Produksie-databasis het lidmate maar nog geen speelruimte_id nie. As dit
-- die geval is, stop alles voordat enigiets verander.
do $$
begin
  if exists (select 1 from public.lede)
     and not exists (
       select 1 from information_schema.columns
       where table_schema = 'public' and table_name = 'lede'
         and column_name = 'speelruimte_id'
     ) then
    raise exception
      'Hierdie databasis het reeds lidmate. Is dit die PRODUKSIE-projek? Gestop — niks is verander nie.';
  end if;
end;
$$;

-- -------------------------------------------- 1. speelruimte_id + 2. RLS
do $$
declare
  tabel text;
  beleid record;
begin
  foreach tabel in array array[
    'wyke', 'families', 'lede', 'events', 'kategese_groups',
    'kategese_group_lede', 'documents', 'pending_registrations'
  ] loop
    execute format(
      'alter table public.%I add column if not exists speelruimte_id uuid
         not null default auth.uid()
         references public.profiles (id) on delete cascade',
      tabel
    );
    execute format(
      'create index if not exists %I on public.%I (speelruimte_id)',
      tabel || '_speelruimte_idx', tabel
    );

    -- Gooi ELKE bestaande beleid weg, nie net dié wat ons by naam ken nie —
    -- 'n nuwe migrasie se beleid sou andersins langs ons s'n oop bly staan.
    for beleid in
      select policyname from pg_policies
      where schemaname = 'public' and tablename = tabel
    loop
      execute format('drop policy %I on public.%I', beleid.policyname, tabel);
    end loop;

    execute format(
      'create policy "speelruimte lees" on public.%I
         for select to authenticated
         using (speelruimte_id = auth.uid() and public.is_kerkraad())',
      tabel
    );
    execute format(
      'create policy "speelruimte skryf" on public.%I
         for all to authenticated
         using (speelruimte_id = auth.uid() and public.mag_skryf())
         with check (speelruimte_id = auth.uid() and public.mag_skryf())',
      tabel
    );
  end loop;
end;
$$;

-- Die publieke registrasievorm het geen auth.uid() nie. Die toetser se
-- persoonlike skakel (/registreer?s=<id>) dra sy speelruimte; sonder dit is
-- speelruimte_id null en die NOT NULL weier die ry.
create policy "publiek registreer in speelruimte" on pending_registrations
  for insert to anon
  with check (speelruimte_id is not null);

-- ------------------------------------------------- 3. uniek per speelruimte
alter table wyke drop constraint if exists wyke_nommer_key;
create unique index if not exists wyke_speelruimte_nommer_key
  on wyke (speelruimte_id, nommer);

alter table documents drop constraint if exists documents_sleutel_key;
create unique index if not exists documents_speelruimte_sleutel_key
  on documents (speelruimte_id, sleutel);

-- ------------------------------------------------- 4. profiele en bediening
-- Almal is admin. Bestaande gebruikers word nou opgegradeer; nuwes kry dit
-- by die sneller.
update profiles set rol = 'admin' where rol <> 'admin';

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, epos, rol)
  values (new.id, new.email, 'admin')
  on conflict (id) do nothing;
  return new;
end;
$$;

-- "Speel as": jy mag jou eie rol wissel. Ander s'n kan jy in elk geval nie
-- sien nie (hieronder).
create or replace function public.bewaak_profiel()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null or new.id = auth.uid() then
    return new;
  end if;

  if (new.rol is distinct from old.rol or new.wyk_id is distinct from old.wyk_id)
     and not public.is_admin() then
    raise exception 'Net ''n admin mag rolle of wyke verander.'
      using errcode = '42501';
  end if;

  return new;
end;
$$;

-- Profiele: net jou eie. Die produksiereël "'n admin sien almal" sou hier
-- elke toetser aan elke ander wys, want almal is admin.
do $$
declare
  beleid record;
begin
  for beleid in
    select policyname from pg_policies
    where schemaname = 'public' and tablename = 'profiles'
  loop
    execute format('drop policy %I on public.profiles', beleid.policyname);
  end loop;
end;
$$;

create policy "speelruimte lees eie profiel" on profiles
  for select to authenticated using (id = auth.uid());

create policy "speelruimte wysig eie profiel" on profiles
  for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

-- Bediening: 021 laat 'n admin elke dominee se rekords lees. In die demo is
-- almal admin, so terug na 017 se eienaar-alleen.
drop policy if exists "eienaar of admin sien aktiwiteite" on bediening_aktiwiteite;
drop policy if exists "dominee sien eie aktiwiteite" on bediening_aktiwiteite;
create policy "dominee sien eie aktiwiteite" on bediening_aktiwiteite
  for select to authenticated using (dominee_id = auth.uid());

drop policy if exists "eienaar of admin sien afsprake" on afsprake;
drop policy if exists "dominee sien eie afsprake" on afsprake;
create policy "dominee sien eie afsprake" on afsprake
  for select to authenticated using (dominee_id = auth.uid());

-- ------------------------------------------------------------ 5. herstel
-- SECURITY DEFINER sodat dit ook werk terwyl jy "as ouderling" speel en self
-- geen skryfreg het nie. Dit raak slegs rye van auth.uid().
--
-- Die "moet nooit 'n lidmaat hard uitvee nie"-reël geld vir werklike
-- gemeentedata. Hierdie is versinde toetsdata.
create or replace function public.maak_speelruimte_leeg()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  ek uuid := auth.uid();
begin
  if ek is null then
    raise exception 'Nie aangeteken nie.' using errcode = '42501';
  end if;

  delete from public.ligging_aantekeninge where dominee_id = ek;
  delete from public.bediening_aktiwiteite where dominee_id = ek;
  delete from public.afsprake where dominee_id = ek;
  delete from public.bediening_instellings where dominee_id = ek;

  delete from public.kategese_group_lede where speelruimte_id = ek;
  delete from public.pending_registrations where speelruimte_id = ek;
  delete from public.lede where speelruimte_id = ek;
  delete from public.families where speelruimte_id = ek;
  delete from public.kategese_groups where speelruimte_id = ek;
  delete from public.events where speelruimte_id = ek;
  delete from public.documents where speelruimte_id = ek;
  delete from public.wyke where speelruimte_id = ek;

  update public.profiles set rol = 'admin' where id = ek;
end;
$$;

revoke execute on function public.maak_speelruimte_leeg() from public, anon;
grant execute on function public.maak_speelruimte_leeg() to authenticated;
