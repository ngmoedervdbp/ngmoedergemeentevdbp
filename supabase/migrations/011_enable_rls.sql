-- 011 — RLS op elke tabel, geen uitsonderings nie
--
-- Twee reëls dra hierdie hele lêer:
--   1. Aangetekende kerkraadslede lees en skryf die gemeentedata.
--   2. Die publiek mag PRESIES EEN ding doen: 'n registrasie invoeg. Geen
--      SELECT op enigiets nie, ooit — die registrasievorm lees nooit data terug
--      nie.
--
-- Let wel: RLS aanskakel sonder beleide sluit 'n tabel heeltemal toe. Elke
-- tabel hieronder kry dus sy beleide in dieselfde migrasie.

-- 'n Helper wat sê of die huidige gebruiker 'n kerkraadslid is. SECURITY
-- DEFINER sodat dit profiles kan lees sonder om profiles se eie beleid in 'n
-- oneindige lus te laat verwys.
create function public.is_kerkraad()
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select exists (select 1 from public.profiles where id = auth.uid());
$$;

create function public.is_admin()
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and rol = 'admin');
$$;

-- ---------------------------------------------------------------- wyke
alter table wyke enable row level security;

create policy "kerkraad lees wyke" on wyke
  for select to authenticated using (public.is_kerkraad());

create policy "kerkraad skryf wyke" on wyke
  for all to authenticated using (public.is_kerkraad()) with check (public.is_kerkraad());

-- ------------------------------------------------------------ families
alter table families enable row level security;

create policy "kerkraad lees families" on families
  for select to authenticated using (public.is_kerkraad());

create policy "kerkraad skryf families" on families
  for all to authenticated using (public.is_kerkraad()) with check (public.is_kerkraad());

-- ---------------------------------------------------------------- lede
alter table lede enable row level security;

create policy "kerkraad lees lede" on lede
  for select to authenticated using (public.is_kerkraad());

create policy "kerkraad skryf lede" on lede
  for all to authenticated using (public.is_kerkraad()) with check (public.is_kerkraad());

-- -------------------------------------------------------------- events
alter table events enable row level security;

create policy "kerkraad lees events" on events
  for select to authenticated using (public.is_kerkraad());

create policy "kerkraad skryf events" on events
  for all to authenticated using (public.is_kerkraad()) with check (public.is_kerkraad());

-- ----------------------------------------------------- kategese_groups
alter table kategese_groups enable row level security;

create policy "kerkraad lees kategese_groups" on kategese_groups
  for select to authenticated using (public.is_kerkraad());

create policy "kerkraad skryf kategese_groups" on kategese_groups
  for all to authenticated using (public.is_kerkraad()) with check (public.is_kerkraad());

-- ------------------------------------------------ kategese_group_lede
alter table kategese_group_lede enable row level security;

create policy "kerkraad lees kategese_group_lede" on kategese_group_lede
  for select to authenticated using (public.is_kerkraad());

create policy "kerkraad skryf kategese_group_lede" on kategese_group_lede
  for all to authenticated using (public.is_kerkraad()) with check (public.is_kerkraad());

-- ----------------------------------------------------------- documents
alter table documents enable row level security;

create policy "kerkraad lees documents" on documents
  for select to authenticated using (public.is_kerkraad());

create policy "kerkraad skryf documents" on documents
  for all to authenticated using (public.is_kerkraad()) with check (public.is_kerkraad());

-- ------------------------------------------------ pending_registrations
alter table pending_registrations enable row level security;

-- Die enigste publieke skryfreg in die hele skema. `with check (true)` laat die
-- invoeging toe; daar is DOELBEWUS geen select-beleid vir anon nie, so die
-- vorm kan niks terug lees nie — ook nie sy eie ry nie.
create policy "publiek mag registreer" on pending_registrations
  for insert to anon with check (true);

create policy "kerkraad lees registrasies" on pending_registrations
  for select to authenticated using (public.is_kerkraad());

create policy "kerkraad keur registrasies" on pending_registrations
  for update to authenticated using (public.is_kerkraad()) with check (public.is_kerkraad());

-- ------------------------------------------------------------ profiles
alter table profiles enable row level security;

create policy "gebruiker lees eie profiel" on profiles
  for select to authenticated using (id = auth.uid() or public.is_kerkraad());

create policy "gebruiker wysig eie profiel" on profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- Slegs 'n admin mag rolle en ander se profiele verander.
create policy "admin bestuur profiele" on profiles
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
