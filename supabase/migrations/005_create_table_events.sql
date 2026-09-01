-- 005 — Tabel: events
--
-- Gebeurtenisse op die kalender. Tabelnaam is Engels (`events`); slegs die
-- enum-waardes van die kategorie bly Afrikaans.
--
-- `datum` en `tyd` is apart omdat 'n gebeurtenis 'n heeldag-item kan wees
-- (tyd is dan null). Vertoon altyd deur lib/format.ts in af-ZA /
-- Africa/Johannesburg.

create table events (
  id uuid primary key default gen_random_uuid(),
  titel text not null,
  datum date not null,
  tyd time,
  plek text,
  kategorie gebeurtenis_kategorie not null default 'algemeen',
  beskrywing text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index events_datum_idx on events (datum);

comment on column events.tyd is 'Null beteken heeldag-gebeurtenis.';
