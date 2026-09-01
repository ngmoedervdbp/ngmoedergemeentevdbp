-- 017 — RLS vir die bedieningstabelle
--
-- Hierdie lêer wyk doelbewus af van 011. Daar mag enige kerkraadslid alles lees;
-- hier NIE.
--
-- Pastorale werk is vertroulik. 'n Hospitaalbesoek verklap 'n siekte; 'n
-- beradingsessie verklap 'n krisis in 'n huwelik. Daardie inligting is nie die
-- kerkraad s'n om te lees nie, en die Dominee moet kan aanteken sonder om te
-- wonder wie dit sien.
--
-- Verstek daarom: **slegs die eienaar**. Nie die kerkraad nie, nie 'n admin nie.
--
-- 'n Admin kan steeds die databasis self bereik (dit is onvermydelik), maar die
-- app gee dit nie vir hom nie — dit is die verskil tussen "kan in nood" en
-- "sien elke dag".
--
-- ⚠ As die gemeente later besluit die kerkraad moet besoek-STATISTIEK sien
-- (hoeveel besoeke, nie wie nie), doen dit met 'n aparte geaggregeerde view of
-- 'n security-definer funksie wat net tellings teruggee. Moenie hierdie beleide
-- verslap nie.

-- --------------------------------------------------- bediening_aktiwiteite
alter table bediening_aktiwiteite enable row level security;

create policy "dominee sien eie aktiwiteite" on bediening_aktiwiteite
  for select to authenticated
  using (dominee_id = auth.uid());

create policy "dominee skep eie aktiwiteite" on bediening_aktiwiteite
  for insert to authenticated
  with check (dominee_id = auth.uid());

create policy "dominee wysig eie aktiwiteite" on bediening_aktiwiteite
  for update to authenticated
  using (dominee_id = auth.uid())
  with check (dominee_id = auth.uid());

create policy "dominee vee eie aktiwiteite uit" on bediening_aktiwiteite
  for delete to authenticated
  using (dominee_id = auth.uid());

-- ------------------------------------------------------------------ afsprake
alter table afsprake enable row level security;

create policy "dominee sien eie afsprake" on afsprake
  for select to authenticated
  using (dominee_id = auth.uid());

create policy "dominee skep eie afsprake" on afsprake
  for insert to authenticated
  with check (dominee_id = auth.uid());

create policy "dominee wysig eie afsprake" on afsprake
  for update to authenticated
  using (dominee_id = auth.uid())
  with check (dominee_id = auth.uid());

create policy "dominee vee eie afsprake uit" on afsprake
  for delete to authenticated
  using (dominee_id = auth.uid());

-- ------------------------------------------------------ ligging_aantekeninge
-- Die strengste tabel in die skema. Geen uitsondering vir admin, geen
-- uitsondering vir kerkraad.
alter table ligging_aantekeninge enable row level security;

create policy "dominee sien eie liggings" on ligging_aantekeninge
  for select to authenticated
  using (dominee_id = auth.uid());

create policy "dominee skep eie liggings" on ligging_aantekeninge
  for insert to authenticated
  with check (dominee_id = auth.uid());

-- Doelbewus GEEN update-beleid nie: 'n liggingsrekord is 'n meting op 'n
-- tydstip. Dit word geskep of uitgevee, nooit herskryf nie.
create policy "dominee vee eie liggings uit" on ligging_aantekeninge
  for delete to authenticated
  using (dominee_id = auth.uid());

-- ----------------------------------------------------- bediening_instellings
alter table bediening_instellings enable row level security;

create policy "dominee sien eie instellings" on bediening_instellings
  for select to authenticated
  using (dominee_id = auth.uid());

create policy "dominee skep eie instellings" on bediening_instellings
  for insert to authenticated
  with check (dominee_id = auth.uid());

create policy "dominee wysig eie instellings" on bediening_instellings
  for update to authenticated
  using (dominee_id = auth.uid())
  with check (dominee_id = auth.uid());
