# Lidmaatbestuur · NG Vanderbijlpark Moedergemeente

Interne lidmaatbestuur-app vir die kerkraad. Vervang 'n Base44-prototipe wat alles
in Google Sheets gestoor het.

## Aan die gang kom

```bash
npm install
cp .env.local.example .env.local   # vul die Supabase-sleutels in
npm run dev
```

Sonder `.env.local` loop die app steeds plaaslik — verifikasie word afgeskakel en
jy sien die skil met leë data. Dit werk **nie** in produksie nie; sien `proxy.ts`.

## Stapel

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 · Supabase · Vercel

Mobiel-eerste en installeerbaar as PWA — die kerkraad lees dit op selfone.

## Waar om te begin

- **[CLAUDE.md](CLAUDE.md)** — die besluite: naamgewing, domeinmodel, toegang, ontwerp.
  Lees dit voor jy kode skryf.
- **[docs/base44-reference/notes.md](docs/base44-reference/notes.md)** — bladsy-vir-bladsy
  weergawe van die ou app, met skermkiekies in `docs/`.

Alles is in Afrikaans. Kode en databasiskolomme is Engels, behalwe die domeinterme
wat nie vertaal nie (`wyke`, `kategese`).
