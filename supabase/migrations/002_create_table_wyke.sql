-- 002 — Tabel: wyke
--
-- Geografiese onderverdeling van die gemeente. `wyke` bly Afrikaans (sien die
-- lys behoue identifiseerders in CLAUDE.md).
--
-- `nommer` is 'n TEKS, nie 'n heelgetal nie — "30 A" en "38 A" bestaan regtig.
-- `kapasiteit` is 'n sagte riglyn wat as 'n vorderingsbalk gewys word; dit word
-- doelbewus NIE afgedwing nie.

create table wyke (
  id uuid primary key default gen_random_uuid(),
  nommer text not null unique,
  naam text not null,
  ouderling text,
  kapasiteit integer not null default 50 check (kapasiteit > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on column wyke.nommer is 'Wyknommer as teks — "1", "30 A", "38 A".';
comment on column wyke.kapasiteit is 'Sagte riglyn vir die vorderingsbalk, nie afgedwing nie.';
