-- 004 — Tabel: lede
--
-- Die kerntabel. `lede` bly Afrikaans (behoue identifiseerder), maar die
-- kolomme is Engels: first_name, last_name, date_of_birth.
--
-- Let op die wanverhouding: die tabel heet `lede`, die UI sê oral "Lidmate".
-- Dit is wat Base44 doen en wat die kerkraad lees — moenie een van die twee
-- "regmaak" nie. Sien CLAUDE.md.
--
-- date_of_birth is NULLABLE — 3 uit 17 lewende rekords het geen datum nie.
-- Elke ouderdomsberekening moet dit hanteer en die "Geen geboortedatum"-telling
-- wys. Ouderdomme word altyd bereken, nooit gestoor nie.
--
-- Daar is geen argieftabel nie: "Argief" is status != 'aktief'. Moet NOOIT 'n
-- lidmaat hard uitvee nie — dit is historiese rekords van 'n gemeente.

create table lede (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  date_of_birth date,
  geslag geslag not null,
  status lidmaat_status not null default 'aktief',
  tipe lidmaat_tipe not null default 'belydend',
  selfoon text,
  epos text,
  wyk_id uuid references wyke (id) on delete set null,
  family_id uuid references families (id) on delete set null,
  family_role family_role,
  lid_sedert date not null default current_date,
  aantekeninge text,
  foto text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index lede_wyk_id_idx on lede (wyk_id);
create index lede_family_id_idx on lede (family_id);
create index lede_status_idx on lede (status);

-- Verjaarsdae word prominent gewys en word op maand/dag gesoek, nie op jaar nie.
create index lede_verjaarsdag_idx on lede (
  extract(month from date_of_birth),
  extract(day from date_of_birth)
) where date_of_birth is not null;

comment on column lede.date_of_birth is 'NULLABLE — hanteer ontbrekende datums altyd eksplisiet.';
comment on column lede.status is 'Argief is status != ''aktief''. Moet nooit hard uitgevee word nie.';
