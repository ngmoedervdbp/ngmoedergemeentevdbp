-- 019 — Brei gebruiker_rol uit na die werklike rolle
--
-- 010 het die enum as 'admin | kerkraad' geskep, wat 'n plekhouer was. Die app
-- werk intussen met vyf rolle (sien lib/sessie.ts) en `dominee` is die een wat
-- Bediening Opsporing oopsluit. Sonder hierdie migrasie faal
--   update profiles set rol = 'dominee' ...
-- met "invalid input value for enum gebruiker_rol".
--
-- ⚠ ELKE `alter type ... add value` MOET IN SY EIE STELLING WEES, en Postgres
--   laat dit histories nie in dieselfde transaksie as die gebruik daarvan toe
--   nie. Loop hierdie lêer dus op sy eie, nie saamgevoeg met ander migrasies
--   nie.

alter type gebruiker_rol add value if not exists 'dominee';
alter type gebruiker_rol add value if not exists 'skriba';
alter type gebruiker_rol add value if not exists 'ouderling';

comment on type gebruiker_rol is
  'admin bestuur die stelsel; dominee kry Bediening Opsporing; skriba doen data-invoer; ouderling en kerkraad lees die gemeentedata.';
