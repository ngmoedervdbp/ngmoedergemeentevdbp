-- 021 — 'n Admin mag die bedieningsdata lees
--
-- 017 was eienaar-alleen: net die dominee wat 'n ry geskep het, kon dit sien.
-- Op versoek van die gemeente (en met die Dominee se toestemming) kry 'n admin
-- nou ook leestoegang tot alle bedieningsrekords.
--
-- ⚠ WEET WAT DIT BETEKEN. Hierdie tabelle bevat die sensitiefste data in die
--   projek: 'n hospitaalbesoek verklap 'n siekte, 'n berading verklap 'n
--   krisis. Enigiemand met die rol 'admin' — nou of later — kan dit lees.
--
--   Die beskerming is nie meer tegnies nie, dit is administratief: gee die
--   admin-rol aan so min mense as moontlik, en vergewis jou dat hulle die
--   vertroulikheidsooreenkoms geteken het.
--
-- SKRYF bly eienaar-alleen. 'n Admin kan lees, maar nie namens die dominee
-- aanteken of sy rekords verander nie — dit sou die rekord se herkoms
-- vertroebel.

-- --------------------------------------------------- bediening_aktiwiteite
drop policy if exists "dominee sien eie aktiwiteite" on bediening_aktiwiteite;
create policy "eienaar of admin sien aktiwiteite" on bediening_aktiwiteite
  for select to authenticated
  using (dominee_id = auth.uid() or public.is_admin());

-- ------------------------------------------------------------------ afsprake
drop policy if exists "dominee sien eie afsprake" on afsprake;
create policy "eienaar of admin sien afsprake" on afsprake
  for select to authenticated
  using (dominee_id = auth.uid() or public.is_admin());

-- ------------------------------------------------------ ligging_aantekeninge
--
-- Ligging bly DOELBEWUS eienaar-alleen.
--
-- Dit is deurlopende naspeuring van 'n persoon se bewegings — die swaarste
-- POPIA-item in die projek. Leestoegang tot besoeke is een ding; 'n rekord van
-- waar iemand elke vyf minute was, is iets anders. Laat dit staan tensy die
-- Dominee dit uitdruklik vra.

comment on table bediening_aktiwiteite is
  'Die Dominee se bedieningsopsporing. Eienaar skryf; eienaar en admin lees.';
