-- 020 — Skei lees van skryf
--
-- 011 het gesê "enige kerkraadslid mag alles lees én skryf". Dit was 'n
-- plekhouer. Die gemeente se werklike verwagting:
--
--   admin, dominee, skriba   -> lees en skryf
--   ouderling, kerkraad      -> slegs lees
--
-- 'n Ouderling moet 'n lidmaat se selfoonnommer kan opsoek voor 'n besoek,
-- maar nie per ongeluk 'n rekord kan verander of uitvee nie.
--
-- LET WEL: 019 moet EERS geloop het, anders bestaan 'dominee' en 'skriba' nie
-- as enum-waardes nie en faal hierdie funksie stil.

/**
 * Mag hierdie gebruiker skryf?
 *
 * SECURITY DEFINER sodat dit profiles kan lees sonder om profiles se eie
 * beleid in 'n oneindige lus te verwys — dieselfde patroon as is_kerkraad().
 */
create or replace function public.mag_skryf()
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and rol in ('admin', 'dominee', 'skriba')
  );
$$;

-- Elke tabel kry dieselfde behandeling: die leesbeleid bly soos dit is (enige
-- kerkraadslid), en die skryfbeleid word vervang.

drop policy if exists "kerkraad skryf wyke" on wyke;
create policy "skrywers skryf wyke" on wyke
  for all to authenticated
  using (public.mag_skryf()) with check (public.mag_skryf());

drop policy if exists "kerkraad skryf families" on families;
create policy "skrywers skryf families" on families
  for all to authenticated
  using (public.mag_skryf()) with check (public.mag_skryf());

drop policy if exists "kerkraad skryf lede" on lede;
create policy "skrywers skryf lede" on lede
  for all to authenticated
  using (public.mag_skryf()) with check (public.mag_skryf());

drop policy if exists "kerkraad skryf events" on events;
create policy "skrywers skryf events" on events
  for all to authenticated
  using (public.mag_skryf()) with check (public.mag_skryf());

drop policy if exists "kerkraad skryf kategese_groups" on kategese_groups;
create policy "skrywers skryf kategese_groups" on kategese_groups
  for all to authenticated
  using (public.mag_skryf()) with check (public.mag_skryf());

drop policy if exists "kerkraad skryf kategese_group_lede" on kategese_group_lede;
create policy "skrywers skryf kategese_group_lede" on kategese_group_lede
  for all to authenticated
  using (public.mag_skryf()) with check (public.mag_skryf());

drop policy if exists "kerkraad skryf documents" on documents;
create policy "skrywers skryf documents" on documents
  for all to authenticated
  using (public.mag_skryf()) with check (public.mag_skryf());

-- Registrasies: 'n ouderling mag die tou sien (hulle bel die mense), maar net
-- 'n skrywer mag goedkeur of afkeur.
drop policy if exists "kerkraad keur registrasies" on pending_registrations;
create policy "skrywers keur registrasies" on pending_registrations
  for update to authenticated
  using (public.mag_skryf()) with check (public.mag_skryf());

comment on function public.mag_skryf() is
  'admin, dominee en skriba mag skryf; ouderling en kerkraad lees net.';
