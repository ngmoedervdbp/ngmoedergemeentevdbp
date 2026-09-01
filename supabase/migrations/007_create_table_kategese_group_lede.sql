-- 007 — Skakeltabel: kategese_group_lede
--
-- Die spotdata hou groeplede as 'n `lid_ids`-skikking. Dit word hier 'n regte
-- skakeltabel: 'n skikking van vreemde sleutels kan nie deur die databasis
-- afgedwing word nie, en 'n lid wat uitgevee of oorgeplaas word laat 'n dooie
-- verwysing agter.
--
-- 'n Lid kan in meer as een groep wees (bv. 'n helper), daarom is die primêre
-- sleutel die paar en nie lid_id alleen nie.

create table kategese_group_lede (
  kategese_group_id uuid not null references kategese_groups (id) on delete cascade,
  lid_id uuid not null references lede (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (kategese_group_id, lid_id)
);

create index kategese_group_lede_lid_id_idx on kategese_group_lede (lid_id);

comment on table kategese_group_lede is 'Watter lidmate in watter kategesegroep is.';
