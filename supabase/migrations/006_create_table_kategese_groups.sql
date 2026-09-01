-- 006 — Tabel: kategese_groups
--
-- Kategeseklasse. `kategese_groups` is 'n behoue Afrikaanse identifiseerder
-- (sien CLAUDE.md); die res van die kolomme is Afrikaanse domeinwoorde wat
-- die kerkraad direk lees.
--
-- Kategese sny dwars oor die wyk → gesin → lid-hiërargie: 'n groep se lede kom
-- uit enige wyk. Die lidmaatskap self sit in 006b (die skakeltabel), nie hier
-- as 'n skikking nie.

create table kategese_groups (
  id uuid primary key default gen_random_uuid(),
  naam text not null,
  ouderdomsgroep text,
  onderwyser text,
  lokaal text,
  dag text,
  tyd text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table kategese_groups is 'Kategeseklasse. Lidmaatskap sit in kategese_group_lede.';
