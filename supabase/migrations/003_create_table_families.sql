-- 003 — Tabel: families
--
-- Gesinne is 'n WERKLIKE tabel, nie afgelei uit van + huishoudingsrol nie.
-- Base44 lei dit af, wat breek by twee onverwante families met dieselfde van,
-- vroue wat hul nooiensvan hou, saamgestelde gesinne en loseerders.
-- Sien CLAUDE.md, "Domain model".
--
-- Die gesin besit die adres; lede skakel daaraan met 'n family_role.

create table families (
  id uuid primary key default gen_random_uuid(),
  naam text not null,
  adres text,
  stad text,
  wyk_id uuid references wyke (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index families_wyk_id_idx on families (wyk_id);

comment on table families is 'Huishouding. Besit die adres; lede skakel hierheen.';
