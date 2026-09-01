-- 015 — Tabel: afsprake
--
-- "Afsprake Bestuur" in die demo.
--
-- ⚠ LET WEL: die demo het NUL afsprake gehad, so ons het die vorm se velde
-- nooit gesien nie. Alles hier behalwe die status-enum is afgelei uit die
-- skermnaam, die twee aansigte (Lys/Kalender) en hoe 'n afspraak in hierdie
-- konteks werk. Bevestig by die Dominee voordat die UI hierop gebou word —
-- veral of 'n afspraak deur 'n lidmaat aangevra word (dan is 'n publieke
-- invoegroete nodig, met dieselfde moderasie-benadering as
-- pending_registrations) of net deur die Dominee self ingevoer word.
--
-- Vir eers: die Dominee (of 'n kerkraadslid) skep dit. Geen publieke toegang nie.

create table afsprake (
  id uuid primary key default gen_random_uuid(),

  dominee_id uuid not null references profiles (id) on delete cascade,

  titel text not null check (length(trim(titel)) between 1 and 200),
  beskrywing text,

  -- Met wie die afspraak is. Vrye teks, want 'n aanvraer is nie noodwendig 'n
  -- lidmaat nie; `lid_id` skakel dit waar dit wel een is.
  persoon_naam text,
  persoon_selfoon text,
  persoon_epos text,
  lid_id uuid references lede (id) on delete set null,

  datum date not null,
  begin_tyd time,
  eind_tyd time,

  plek_naam text,
  adres text,

  status afspraak_status not null default 'hangend',

  -- Waarheen 'n herskeduleerde afspraak geskuif is. Los die oorspronklike ry
  -- staan sodat die geskiedenis nie verlore gaan nie.
  herskeduleer_na date,

  aantekeninge text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint afspraak_tyd_volgorde check (
    eind_tyd is null
    or (begin_tyd is not null and eind_tyd >= begin_tyd)
  ),

  -- 'n Herskeduleerde datum gee net sin as die status dit sê.
  constraint afspraak_herskeduleer_konsekwent check (
    herskeduleer_na is null or status = 'herskeduleer'
  )
);

create index afsprake_dominee_datum_idx on afsprake (dominee_id, datum desc);
create index afsprake_status_idx on afsprake (status);

comment on table afsprake is
  'Afsprake Bestuur. Veldlys is AFGELEI — die demo het geen afsprake gehad nie.';
comment on column afsprake.status is
  'Ses waardes; die UI se vier filters groepeer hulle (Aktief = goedgekeur + herskeduleer).';
