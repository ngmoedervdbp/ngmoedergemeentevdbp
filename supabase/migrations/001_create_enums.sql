-- 001 — Enums
--
-- Enum-waardes is Afrikaans, want dit is domeinwoordeskat wat die skriba direk
-- in die databasis lees. Sien CLAUDE.md, "Language".
--
-- Let wel: 'n waarde by 'n bestaande enum voeg moet in 'n eie migrasie gebeur
-- (ALTER TYPE ... ADD VALUE kan nie in dieselfde transaksie as die gebruik
-- daarvan loop nie).

create type lidmaat_status as enum ('aktief', 'onaktief', 'oorgeplaas', 'oorlede');

create type geslag as enum ('manlik', 'vroulik');

create type family_role as enum ('man', 'vrou', 'kind');

create type lidmaat_tipe as enum ('belydend', 'doop');

create type gebeurtenis_kategorie as enum ('algemeen', 'jeug', 'seniors', 'spesiaal');

create type registrasie_status as enum ('wagtend', 'goedgekeur', 'afgekeur');
