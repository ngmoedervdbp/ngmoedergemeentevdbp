-- 009 — Tabel: pending_registrations
--
-- Die moderasietou vir /registreer — die ENIGSTE publieke, ongeverifieerde
-- roete in die app. Nuwe lidmate bereik dit via 'n QR-kode by die kerkdeur.
--
-- Hierdie tabel is die app se hele aanvalsoppervlak en dit aanvaar PII van
-- anonieme gebruikers. Behandel elke ry as vyandige invoer:
--   * die publieke rol mag hier INSERT doen en niks anders nie — geen SELECT,
--     want die vorm mag nooit data terug lees nie (sien 010 vir die beleide);
--   * die roete self benodig tempobeperking, 'n gemorsfilter en streng
--     Zod-validering voor dit hier land;
--   * 'n kerkraadslid keur goed, en eers dán word 'n `lede`-ry geskep.
--
-- `goedgekeur_lid_id` hou die skakel na die geskepte lidmaat sodat 'n
-- goedkeuring nie twee keer verwerk kan word nie.

create table pending_registrations (
  id uuid primary key default gen_random_uuid(),
  first_name text not null check (length(trim(first_name)) between 1 and 100),
  last_name text not null check (length(trim(last_name)) between 1 and 100),
  selfoon text check (length(selfoon) <= 30),
  epos text check (length(epos) <= 255),
  adres text check (length(adres) <= 500),
  status registrasie_status not null default 'wagtend',
  goedgekeur_lid_id uuid references lede (id) on delete set null,
  goedgekeur_deur uuid references auth.users (id) on delete set null,
  goedgekeur_op timestamptz,
  ontvang timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index pending_registrations_status_idx on pending_registrations (status);

comment on table pending_registrations is
  'Moderasietou vir die publieke registrasievorm. Publiek mag slegs INSERT — nooit SELECT nie.';
