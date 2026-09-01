-- 013 — Enums vir die bedieningsopsporing
--
-- Bron: docs/base44-reference/bediening-opsporing.md (die Dominee se Base44-demo).
-- Moenie waardes hier byvoeg wat nie in daardie demo gesien is nie.

-- Die tien aktiwiteitstipes, in die volgorde van die kalender se legende.
create type bediening_tipe as enum (
  'tuisbesoek',
  'hospitaalbesoek',
  'begrafnis',
  'vergadering',
  'preek',
  'berading',
  'doop',
  'troue',
  'bybelstudie',
  'ander'
);

-- "Lidmaat Tipe" in die vorm: was dit 'n bestaande lidmaat of 'n nuwe kontak?
--
-- LET WEL: dit is NIE dieselfde as lede.tipe (belydend | doop) nie. Dieselfde
-- woord, twee betekenisse — moenie die twee enums saamvoeg nie.
create type bediening_lidmaat_tipe as enum ('bestaande', 'nuwe');

-- Afspraak-statusse. Die kalender-legende wys ses; die filter-oortjies wys vier
-- (Hangend · Aktief · Voltooi · Afgekeur). Ons stoor die ses fyner waardes en
-- laat die UI dit in vier groepe wys — andersom kan nie: uit "aktief" alleen kan
-- jy nie aflei of dit goedgekeur of herskeduleer is nie.
create type afspraak_status as enum (
  'hangend',        -- Pending
  'goedgekeur',     -- Approved
  'herskeduleer',   -- Rescheduled
  'afgekeur',       -- Declined
  'voltooi',        -- Completed
  'nie_opgedaag'    -- No Show
);
