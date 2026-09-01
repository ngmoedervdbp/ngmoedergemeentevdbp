-- 010 — Tabel: profiles
--
-- Kerkraadslede. Slegs hulle het rekeninge — daar is GEEN lidmaat-rekeninge
-- nie en geen publieke registrasie van gebruikers nie (net van lidmate, deur
-- die moderasietou in 009).
--
-- Skakel een-tot-een aan auth.users. Die rol bepaal toegang: die Admin-oortjie
-- in Instellings is hard gesluit vir 'admin'.
--
-- Of wyksouderlinge tot hul eie wyk beperk moet word, is nog 'n oop vraag
-- (sien CLAUDE.md) — `wyk_id` staan reeds hier sodat daardie beleid later
-- bygevoeg kan word sonder 'n skemaverandering.

create type gebruiker_rol as enum ('admin', 'kerkraad');

create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  first_name text,
  last_name text,
  epos text,
  rol gebruiker_rol not null default 'kerkraad',
  wyk_id uuid references wyke (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table profiles is 'Kerkraadslede. Geen lidmaat-rekeninge — uitnodiging alleen.';

-- Skep outomaties 'n profiel wanneer 'n gebruiker uitgenooi word, sodat daar
-- nooit 'n auth.users-ry sonder 'n ooreenstemmende profiel is nie.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, epos)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
