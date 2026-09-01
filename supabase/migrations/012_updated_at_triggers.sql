-- 012 — updated_at word outomaties bygewerk
--
-- Elke tabel het 'n `updated_at`, maar 'n kolom-verstek werk net by INSERT.
-- Sonder 'n sneller bly dit op die skeppingstyd staan en lieg dit stilweg.

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_updated_at before update on wyke
  for each row execute function public.set_updated_at();

create trigger set_updated_at before update on families
  for each row execute function public.set_updated_at();

create trigger set_updated_at before update on lede
  for each row execute function public.set_updated_at();

create trigger set_updated_at before update on events
  for each row execute function public.set_updated_at();

create trigger set_updated_at before update on kategese_groups
  for each row execute function public.set_updated_at();

create trigger set_updated_at before update on documents
  for each row execute function public.set_updated_at();

create trigger set_updated_at before update on profiles
  for each row execute function public.set_updated_at();
