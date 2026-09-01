-- 008 — Tabel: documents
--
-- Dokumente wat die gemeente aflaai: lidmaatskapvorm, grondwet,
-- bankbesonderhede, welkombrief.
--
-- `sleutel` merk die vaste dokumente wat die app op spesifieke plekke wys.
-- Dit is uniek waar dit gestel is — daar kan net een huidige grondwet wees —
-- maar bly nullable sodat gewone bygelaaide dokumente geen sleutel het nie.
--
-- Die lêer self leef in Supabase Storage; `storage_path` is die verwysing.
-- Grootte word in grepe gestoor, nie as "1,2 MB"-teks nie: formatteer altyd
-- deur lib/format.ts.

create table documents (
  id uuid primary key default gen_random_uuid(),
  titel text not null,
  beskrywing text,
  sleutel text unique check (
    sleutel in ('lidmaatskapvorm', 'grondwet', 'bankbesonderhede', 'welkombrief')
  ),
  lêernaam text,
  storage_path text,
  grootte_grepe bigint check (grootte_grepe >= 0),
  opgelaai timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on column documents.sleutel is 'Vaste dokumente wat die app op spesifieke plekke wys. Null vir gewone dokumente.';
comment on column documents.grootte_grepe is 'Grepe — formatteer in die UI, moenie teks stoor nie.';
