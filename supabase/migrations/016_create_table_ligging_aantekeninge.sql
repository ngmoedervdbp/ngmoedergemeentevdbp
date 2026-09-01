-- 016 — Tabel: ligging_aantekeninge + bediening_instellings
--
-- ⚠⚠ DIT IS DIE SENSITIEFSTE DATA IN DIE HELE PROJEK. ⚠⚠
--
-- Die demo het 'n skakelaar: "Outomaties elke 5 minute naspoor". Dit is
-- deurlopende ligging-naspeuring van 'n werklike persoon. Onder POPIA is dit
-- persoonlike inligting wat 'n uitdruklike, ingeligte, herroepbare toestemming
-- verg — 'n skakelaar in 'n instellingsblad is op sy eie NIE genoeg nie.
--
-- Reëls wat hierdie tabel dra:
--   1. Slegs die Dominee self sien sy eie liggings. Nie die kerkraad nie, nie 'n
--      admin nie. Sien 017.
--   2. Outomatiese naspeuring is AF by verstek en moet uitdruklik aangeskakel
--      word deur die persoon self.
--   3. Daar is 'n bewaartermyn. Liggingspore hoop op en het geen langtermyn-
--      waarde nie — sien `verval_op`.
--
-- Moenie hierdie tabel aan enige verslag of uitvoer koppel sonder om eers te
-- vra nie.

create table ligging_aantekeninge (
  id uuid primary key default gen_random_uuid(),

  dominee_id uuid not null references profiles (id) on delete cascade,

  breedtegraad numeric(9, 6) not null check (breedtegraad between -90 and 90),
  lengtegraad numeric(9, 6) not null check (lengtegraad between -180 and 180),
  akkuraatheid_meter numeric(8, 2) check (akkuraatheid_meter >= 0),

  plek_naam text,
  adres text,

  -- Was dit 'n handmatige "Teken Huidige Ligging Aan" of die outomatiese
  -- 5-minuut-naspeuring? Die twee het verskillende toestemmingsgrondslae.
  outomaties boolean not null default false,

  -- Opsioneel aan 'n aktiwiteit gekoppel wanneer die ligging daarvoor aangeteken is.
  aktiwiteit_id uuid references bediening_aktiwiteite (id) on delete cascade,

  aangeteken_op timestamptz not null default now(),

  -- Bewaartermyn. 'n Skoonmaaktaak vee rye uit waar verval_op verby is.
  -- 90 dae is 'n beginpunt, nie 'n besluit nie — bevestig dit.
  verval_op timestamptz not null default (now() + interval '90 days'),

  created_at timestamptz not null default now()
);

create index ligging_aantekeninge_dominee_idx
  on ligging_aantekeninge (dominee_id, aangeteken_op desc);

create index ligging_aantekeninge_verval_idx on ligging_aantekeninge (verval_op);

comment on table ligging_aantekeninge is
  'POPIA-sensitief. Slegs die persoon self mag dit sien. Het ''n bewaartermyn.';
comment on column ligging_aantekeninge.outomaties is
  'true = die 5-minuut-naspeuring; false = handmatig aangeteken.';
comment on column ligging_aantekeninge.verval_op is
  'Na hierdie tyd moet die ry uitgevee word. 90 dae is ''n voorlopige keuse.';

-- --------------------------------------------------------------------------
-- Per-gebruiker instellings vir die bedieningsapp: die ligging-skakelaar en
-- die iCloud-kalenderskakel uit die "Sinkroniseer"-oortjie.
--
-- Een ry per gebruiker, daarom is die primêre sleutel die gebruiker self.

create table bediening_instellings (
  dominee_id uuid primary key references profiles (id) on delete cascade,

  -- Verstek AF. Skakel dit nooit programmaties aan nie.
  outomatiese_ligging boolean not null default false,
  ligging_toestemming_op timestamptz,

  -- "iKal Kalender URL" — 'n gepubliseerde iCloud-kalender wat ingelees word.
  ikal_url text,
  laas_gesinkroniseer timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Naspeuring aan sonder 'n opgetekende toestemming is presies wat POPIA
  -- verbied. Die databasis weier dit eerder as om daarop te vertrou dat die
  -- UI dit onthou.
  constraint ligging_verg_toestemming check (
    outomatiese_ligging = false or ligging_toestemming_op is not null
  )
);

comment on table bediening_instellings is
  'Per-gebruiker instellings: ligging-naspeuring en iCal-sinkronisasie.';
comment on column bediening_instellings.ikal_url is
  'Gepubliseerde iCloud-kalender-URL. Bevat ''n geheime token — nooit publiek wys nie.';
