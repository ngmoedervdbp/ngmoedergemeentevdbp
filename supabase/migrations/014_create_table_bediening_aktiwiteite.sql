-- 014 — Tabel: bediening_aktiwiteite
--
-- Die kern van die Dominee se opsporing: elke tuisbesoek, hospitaalbesoek,
-- begrafnis, preek, ens. Sien docs/base44-reference/bediening-opsporing.md.
--
-- Ontwerpbesluite waar ons van Base44 afwyk:
--
--  * `dominee_id` — Base44 is 'n enkelgebruiker-app en het geen eienaar nie.
--    Ons het meer as een gebruiker, en die RLS-beleid hang hiervan af, so elke
--    ry weet aan wie dit behoort.
--
--  * `lid_id` — Base44 se "Titel" is vrye teks ("emma oelofse"), so 'n besoek
--    is nie aan 'n regte lidmaat gekoppel nie. Ons hou die vrye teks (dit werk
--    vir 'n nie-lidmaat soos "Johhny Hirst se dogter") maar voeg 'n opsionele
--    skakel by. Dit is wat later "wys my alle besoeke aan hierdie gesin"
--    moontlik maak.
--
--  * begin_tyd/eind_tyd bly `time`, nie `timestamptz` nie, omdat die vorm 'n
--    datum plus twee tye vra. Duur word bereken, nooit gestoor nie — sien die
--    `ure`-kolom hieronder.

create table bediening_aktiwiteite (
  id uuid primary key default gen_random_uuid(),

  dominee_id uuid not null references profiles (id) on delete cascade,

  titel text not null check (length(trim(titel)) between 1 and 200),
  tipe bediening_tipe not null default 'tuisbesoek',
  lidmaat_tipe bediening_lidmaat_tipe,

  datum date not null,
  begin_tyd time,
  eind_tyd time,

  plek_naam text,
  adres text,
  breedtegraad numeric(9, 6) check (breedtegraad between -90 and 90),
  lengtegraad numeric(9, 6) check (lengtegraad between -180 and 180),

  -- Opsionele skakel na 'n regte lidmaat. `on delete set null` en nie cascade
  -- nie: as 'n lidmaat uit die stelsel gaan, bly die pastorale rekord staan.
  lid_id uuid references lede (id) on delete set null,

  aantekeninge text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- 'n Eindtyd sonder 'n begintyd is betekenisloos, en 'n eind voor die begin
  -- is 'n tikfout. Albei stilweg toelaat breek die "Totale Ure"-syfer.
  constraint bediening_tyd_volgorde check (
    eind_tyd is null
    or (begin_tyd is not null and eind_tyd >= begin_tyd)
  )
);

-- Die duur, bereken uit die twee tye. Dit is die bron van "Totale Ure" (35.8 in
-- die demo). Gestoor as 'n gegenereerde kolom sodat 'n som eenvoudig bly en
-- daar geen kans is dat 'n berekening in die app hiervan verskil nie.
alter table bediening_aktiwiteite
  add column ure numeric(5, 2)
  generated always as (
    case
      when begin_tyd is null or eind_tyd is null then null
      else round(extract(epoch from (eind_tyd - begin_tyd)) / 3600.0, 2)
    end
  ) stored;

create index bediening_aktiwiteite_dominee_datum_idx
  on bediening_aktiwiteite (dominee_id, datum desc);

create index bediening_aktiwiteite_tipe_idx on bediening_aktiwiteite (tipe);

create index bediening_aktiwiteite_lid_id_idx
  on bediening_aktiwiteite (lid_id) where lid_id is not null;

comment on table bediening_aktiwiteite is
  'Die Dominee se bedieningsopsporing. Pastorale data — sien die RLS-beleid in 017.';
comment on column bediening_aktiwiteite.titel is
  'Vrye teks: dikwels ''n naam, maar werk ook vir ''n nie-lidmaat.';
comment on column bediening_aktiwiteite.lidmaat_tipe is
  'Bestaande of nuwe kontak. NIE lede.tipe (belydend/doop) nie.';
comment on column bediening_aktiwiteite.ure is
  'Bereken uit begin_tyd/eind_tyd. Bron van die "Totale Ure"-syfer.';
