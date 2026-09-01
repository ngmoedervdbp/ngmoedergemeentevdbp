-- 018 — updated_at-snellers vir die bedieningstabelle
--
-- Dieselfde rede as 012: 'n kolomverstek vuur net by INSERT.
-- public.set_updated_at() kom uit 012.
--
-- ligging_aantekeninge kry NIE 'n sneller nie — dit het geen updated_at nie,
-- want 'n liggingsmeting word nooit gewysig nie (sien 017).

create trigger set_updated_at before update on bediening_aktiwiteite
  for each row execute function public.set_updated_at();

create trigger set_updated_at before update on afsprake
  for each row execute function public.set_updated_at();

create trigger set_updated_at before update on bediening_instellings
  for each row execute function public.set_updated_at();
