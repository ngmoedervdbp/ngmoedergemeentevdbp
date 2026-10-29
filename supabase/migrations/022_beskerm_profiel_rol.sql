-- 022 — Niemand mag sy eie rol verhoog nie
--
-- Die gat: 011 se "gebruiker wysig eie profiel" laat 'n gebruiker sy eie
-- profielry opdateer — en RLS werk per RY, nie per kolom nie. 'n Ouderling met
-- leesregte kon dus vanuit die blaaierkonsole
--
--   supabase.from('profiles').update({ rol: 'admin' }).eq('id', <eie id>)
--
-- doen, en daarna alles skryf en elke dominee se bedieningsrekords lees (021).
--
-- Die oplossing is 'n sneller eerder as kolomregte: `stelGebruikerRol` loop as
-- die aangetekende admin (rol `authenticated`), so 'n `revoke update (rol)`
-- sou die admin ook keer. Die sneller vra die regte vraag — is jy 'n admin? —
-- en laat die naamvelde vir almal oop.
--
-- Bewaak ook `wyk_id`: dit word die omvang van 'n wyksouderling se toegang
-- sodra rolle per wyk afgedwing word, en is dus net so 'n regte-kolom.

create or replace function public.bewaak_profiel()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- Geen auth.uid() nie = die service-role (uitnodigings in aksies.ts) of
  -- direkte SQL (SQL Editor, migrasies). Albei is reeds vertroud, en die
  -- anon-rol het in elk geval geen UPDATE-beleid op profiles nie.
  if auth.uid() is null then
    return new;
  end if;

  if (new.rol is distinct from old.rol or new.wyk_id is distinct from old.wyk_id)
     and not public.is_admin() then
    raise exception 'Net ''n admin mag rolle of wyke verander.'
      using errcode = '42501';
  end if;

  return new;
end;
$$;

create trigger bewaak_profiel
  before update on profiles
  for each row execute function public.bewaak_profiel();

comment on function public.bewaak_profiel() is
  'Keer dat ''n nie-admin sy eie rol of wyk verander. RLS kan nie per kolom keer nie.';
