# NG Vanderbijlpark Moedergemeente — Lidmaatbestuur

Member-management app for the kerkraad. Replaces a Base44 prototype that stored
everything in Google Sheets.

Full page-by-page inventory of the app we're replacing: `docs/base44-reference/notes.md`.

> **Status: MVP op spotdata.** All twelve pages are built and navigable against a mock
> dataset in `lib/mock/`. **There is still no database.** Every page reads from
> `lib/mock/index.ts`, whose query helpers deliberately mirror the shape a Supabase
> query will return, so swapping them out is mechanical. Buttons that would mutate
> (Stoor, Keur goed, Heraktiveer, Laai op) are inert.

## Stack

| Layer | Choice |
|---|---|
| Framework | **Next.js 16.3** (App Router, Turbopack) + React 19.2, TypeScript strict |
| Styling | **Tailwind v4** — tokens in `app/globals.css` under `@theme`, no `tailwind.config` file |
| Database / Auth / Storage | Supabase (Postgres, RLS, Auth, Storage) |
| Server layer | Route Handlers + Server Actions |
| Hosting | Vercel |
| PWA | Installable (manifest + icons), **online-only**. No offline caching, no sync layer. |
| Theme | **Light only.** Base44 is light-only and the kerkraad uses it in daylight. Don't add dark mode without asking. |

## Commands

Package manager is **npm** — `corepack enable pnpm` needs sudo on this machine.
Switch to pnpm later if you want; nothing depends on npm specifically.

```bash
npm run dev        # local dev
npm run build      # must pass before any push
npm run lint
npm run typecheck
npx next typegen   # regenerate PageProps/LayoutProps after adding routes
npx supabase start # local Supabase stack
npm run db:push    # apply migrations
npm run db:types   # regenerate lib/database.types.ts — run after EVERY schema change
```

## Next.js 16 — things that changed

This version breaks patterns you probably have memorised. Full guide ships in the repo at
`node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md` — read it before
reaching for a familiar API.

- **`middleware.ts` is now `proxy.ts`**, and the export is `proxy`, not `middleware`.
  Node.js runtime only, not configurable. Ours is at [proxy.ts](proxy.ts).
- **`cookies()`, `headers()`, `params` and `searchParams` are async-only.** The synchronous
  compatibility shim from v15 is gone. Always `await` them.
- **`PageProps<'/route'>` / `LayoutProps<'/route'>` are generated globals.** They come from
  `next typegen`, which runs as part of `dev`/`build`. A bare `tsc --noEmit` on a clean
  checkout fails until it has run once.
- `next lint` is removed — the script calls `eslint` directly.
- **The React Compiler lint is on.** Mutating a variable across a `.map` during render is
  an error, not a warning. Compute cumulative values with `reduce`.

## Two traps that cost real time

- **Never export a plain constant from a `"use client"` module and import it into a Server
  Component.** You get a client-reference proxy, not the value, and every field reads
  `undefined` — silently. That is why the palette lives in [lib/glas.ts](lib/glas.ts) and
  not in `components/kerk/grafieke.tsx`. Symptom: black SVG fills, missing colours.
- **There is no chart library.** recharts was removed. Its `<Pie>` emitted no `fill` at
  all in 3.10, and `<ResponsiveContainer>` measures the DOM before drawing — when that
  measurement fails (zoom, a container sized late, an extension) you get a blank box with
  no error. [components/kerk/grafieke.tsx](components/kerk/grafieke.tsx) draws plain SVG
  against a fixed `viewBox` and scales with CSS: nothing to measure, nothing to fail, and
  the charts are Server Components that ship zero JS. Keep it that way — reach for an SVG
  path before reaching for a dependency.
- **Arch avatars must not overlap.** The lansetboog has straight vertical sides, so a
  `-space-x-*` stack clips neighbours and cuts the initials in half (circles get away with
  it; arches don't). Lay them out with `gap-1`. Also never put `rounded-[inherit]` on a
  wrapper whose parent has no radius — you get a rectangular ring around a curved shape.

## Language

**The app is Afrikaans-only. There is no English toggle and no i18n framework.**
Write Afrikaans directly in the JSX. (If English is ever needed it's a mechanical
extraction — don't pre-build for it now.)

The one thing to stay disciplined about: format all dates and numbers through a central
helper using the `af-ZA` locale and `Africa/Johannesburg` — never `toLocaleDateString()`
inline. That's the part that's genuinely painful to fix later.

**Code, tables and columns are English.** Afrikaans is retained only for domain terms
that don't survive translation. The complete list of retained identifiers — do not add
without discussion:

```
wyke, wyk_id, kategese_groups, lede
```

Everything else is English: `families`, `events`, `documents`,
`lede.first_name`, `lede.date_of_birth`.

> **Note the mismatch:** the table is `lede` but the UI says "Lidmate" everywhere, because
> that is what Base44 uses and what the kerkraad reads. Don't 'fix' either one.

**Enum values are Afrikaans**, because they're domain vocabulary the skriba reads
directly in the DB: `aktief | onaktief | oorgeplaas | oorlede`, `manlik | vroulik`,
`man | vrou | kind`.

### Glossary

| Afrikaans | Meaning |
|---|---|
| Lidmaat / lidmate | Member(s) of the congregation |
| Gesin / gesinne | Household |
| Wyk / wyke | Ward. Geographic subdivision; each may have a wyksouderling. Numbered as **strings** — `1`, `30 A`, `38 A` |
| Kerkraad | Church council — our entire user base |
| Ouderling | Elder |
| Skriba | Secretary — usually the person doing data entry |
| Kategese | Sunday school / catechism classes |
| Oorgeplaas | Transferred to another congregation |
| Oorlede | Deceased |
| Verjaarsdag | Birthday — the app surfaces these prominently |
| Aantekeninge | Notes |

## Domain model

Core hierarchy: **wyk → family → lid**, with kategese groups cutting across.

**Households must be a real table.** Base44 appears to derive "Gesin Ries" from surname
+ household role — there's no "Nuwe Gesin" button anywhere. That breaks on two unrelated
Smith families, women who keep their maiden name, blended families, and lodgers. Model it
explicitly: a `families` row owns the address, lede link to it with a
`family_role` of `man | vrou | kind`.

**`lede.status` is `aktief | onaktief | oorgeplaas | oorlede`.** There is no archive
table — "Argief" is `status != 'aktief'`, and those records are excluded from all reports
and statistics. Never hard-delete a lidmaat; these are historical records of a
congregation.

`date_of_birth` is **nullable** — 3 of 17 live records have none. Every age calculation,
chart bucket and "Seniors 60+" count must handle missing dates explicitly and surface the
"Geen geboortedatum" count, the way Verslae does. Ages are always computed, never stored.

Wyke have a soft capacity (`50`, `60`, `70`) shown as a progress bar. It's informational,
not a constraint to enforce.

Detailed confirmed field list: see `docs/base44-reference/notes.md`.

## Auth & access

- **Kerkraad members only. No lidmaat accounts.** Invite-only; no public signup.
- **Exactly one public, unauthenticated route: the registration form.** New lidmate reach
  it via a shared link / QR code at the church entrance. It is public write-only —
  submissions land in a moderation queue (`pending_registrations` or
  `lede.status = 'wag_goedkeuring'`) and a kerkraad member approves them.
  - This route needs rate limiting, a spam guard, and strict Zod validation. It is the
    app's only attack surface and it accepts PII from anonymous users. Treat it as hostile input.
  - It must never read data back — only insert.
- Supabase Auth via `@supabase/ssr`. Server client in `lib/supabase/server.ts`, browser
  client in `lib/supabase/client.ts`. Never import one into the other's context.
- **RLS on every table, no exceptions.**
- The service-role key is server-only. Never in a Client Component, never in a
  `NEXT_PUBLIC_*` var. This is why we chose Next.js over a pure SPA.
- Roles: `admin` and standard kerkraad user at minimum — Base44's Admin page hard-gates on
  admin. Whether wyksouderlinge should be scoped to their own wyk is still open.

## Design — "Glas"

**Gebrandskilderde glas.** Deep, luminous jewel tones on pale limestone, framed in dark
lead. The rule that keeps it from looking cheap: **colour is always deep and muted, never
bright.** Old glass glows from within; saturated primaries read as a toy. If a colour
looks lively on its own, it is too bright for this app.

All tokens live in `app/globals.css` under `@theme`. Never hardcode a hex in a component.

**Neutrals — kalksteen.** `ground #f4f2ed` (page), `surface #ffffff` (cards),
`stage #eae6dd`, `line #e1dcd2` hairlines, `ink #221f26`, `ink-muted #6b6570`.

**Lood.** The sidebar is dark: `lood #1f1d2b`, hover `lood-op`, dividers `lood-lyn`.
Dark frame, light glass — the content area is the window. This is the single biggest
reason it no longer reads as generic-SaaS.

**The six glass tones.** `saffier` (also `brand`), `kobalt`, `groen`, `wyn`, `amber`,
`violet`. Each has a pale `was-*` companion for backgrounds. **Do not add a seventh
without discussion** — the restraint is the design. `wyn` carries Oorledenes: dignified,
not an alarm-red.

**Accent** is `#a8752b`, an aged-glass gold. It marks the active nav item and notices.

**Lansetboog.** The pointed church-window arch is the signature shape —
[components/kerk/glas-boog.tsx](components/kerk/glas-boog.tsx) for the logo and empty
states, `.boog-vorm` for small icon chips. **Use it sparingly.** On every card it stops
meaning anything.

The logo is **monoline, not filled** — thin leadwork on a barely-there glass tint, where
the tracery itself forms the cross. It takes `currentColor`, so it works white on the dark
sidebar and `text-brand` on pale pages. A filled, gradient version reads as an app icon.

**Scale.** `html { font-size: 17.5px }` in `globals.css` is the single lever for overall
size — Tailwind's type *and* spacing are rem-based, so that one rule scales the app
evenly. Never hardcode a `text-[13px]`: it won't follow the scale. Use the named steps.

**Type.** Spectral (display) for headings and all statistic numerals — big serif figures
are most of the refinement. Source Sans 3 for UI. `.tabular` wherever digits align.

**Stat tiles** are panes of glass: hairline border, wash tinting from the top, the numeral
in the deep tone, a white arch chip for the icon. No gradient fills, no coloured card
backgrounds — that was the Base44 look we deliberately left behind.

**Still to carry over from Base44:** pill status badges (Aktief / Onaktief), initials
avatars with real photos where available, Lucide icons.

**Personal microcopy:** greet by name, surface "Verjaarsdae hierdie week", warm Afrikaans
in empty states rather than "Geen data".

**Kruis-laaier.** [components/ui/kruis-laaier.tsx](components/ui/kruis-laaier.tsx) is the
standard loading state — `trek` for route transitions and full-page waits, `kring` for
buttons and in-card loads. Show it only after ~300 ms.

## Modals, tabs and feedback

Three primitives, used everywhere. Don't hand-roll a fourth.

- **[components/ui/modaal.tsx](components/ui/modaal.tsx)** — every dialog. It already does
  focus trap, Escape, backdrop click, body scroll lock (with scrollbar-width compensation)
  and focus restore. Forms live in the body with an `id`; the submit button sits in `voet`
  and targets it with `form="..."`.
  - **The backdrop must never scroll.** It is `overflow-hidden` and centres a panel capped
    at `max-h-full`; the panel is a flex column whose header and footer are `shrink-0` and
    whose body is `min-h-0 overflow-y-auto`. That keeps the title and the buttons pinned
    and scrolls only the fields. Letting the backdrop scroll instead drags the header and
    footer off-screen and puts the scrollbar on the whole viewport.
  - Widths are deliberately modest: `sm` for confirms, `md` for single-column forms, `lg`
    only where a form genuinely needs two columns.
- **[components/ui/oortjies.tsx](components/ui/oortjies.tsx)** — in-page tabs, following the
  ARIA tabs pattern with arrow-key navigation. Used by Lidmate, Kategese and Instellings.
- **[components/ui/melding.tsx](components/ui/melding.tsx)** — toasts. Wrap every mock
  action in `DEMO(...)` so the wording stays honest: nothing is persisted yet, and the
  toast says so. Delete `DEMO` once Server Actions land.

Shared forms live in `components/modale/`. `LidmaatModaal` serves both "Nuwe lidmaat" and
"Wysig" — pass `lid` to edit.

**Overflow trap:** setting only `overflow-x-auto` makes `overflow-y` compute to `auto`
too — the spec won't let one axis be `visible` while the other isn't. One stray pixel
(a `-mb-px` on a tab, say) then produces a useless vertical scrollbar. Pair it with
`overflow-y-hidden`, and use `.scrollbar-none` when the scroll should work but not show.

**Escaping trap:** `&apos;` is only correct in JSX *text*. Inside a string prop
(`beskrywing="…"`) or any JS string it renders literally as `&apos;`. Afrikaans is full of
`'n`, so this bites often — check the rendered page, not just the lint.

## Mobile

The kerkraad reads this on phones between meetings, so every page and every modal is
built mobile-first. Verified with headless Chrome at 320 / 360 / 390 / 768 px: **no page
scrolls horizontally and no touch target is under 44 px.** Keep it that way.

- **The sidebar is a drawer under `lg`.** [components/kerk/sy-balk.tsx](components/kerk/sy-balk.tsx)
  renders one nav list in two shells — a static column at `lg`, an off-canvas drawer below
  it with focus trap, Escape, scroll lock and auto-close on route change. The open state
  lives in [components/kerk/skil.tsx](components/kerk/skil.tsx) so the layout stays a
  Server Component. The hamburger is in `BoBalk`.
- **Modals are bottom sheets on phones.** Same `Modaal`, no second component: it aligns to
  `items-end` with a grab handle and `rounded-t-2xl` under `sm`, and centres from `sm` up.
  The footer is `flex-col-reverse` there, so the primary action — last in the DOM — sits
  on top, under the thumb, and every footer button goes full-width.
- **Wide tables go in [`Tabelrol`](components/ui/tabel.tsx)**, never a bare
  `overflow-x-auto`. A plain scroller gives no hint that there is more to the right; this
  one fades the overflowing edge and says so once in words. The table stays a real
  `<table>` — don't rebuild these as card lists.

### Three traps specific to this

- **`min-h-11` is not 44 px here.** Tailwind sizes are rem-based and the mobile root is
  15.5px, so `min-h-11` computes to 42.6 px — just under the target. The touch floor is a
  real `min-height: 44px` in a `@media (pointer: coarse)` block in `globals.css`; that
  block is the single authority. Use a `[44px]` arbitrary value if you ever need it inline.
- **A field under 16px makes iOS Safari zoom the page in and never zoom back out.** At the
  15.5px mobile root, `text-sm` is 13.6px — so `globals.css` forces `font-size: 16px` on
  every `input`/`select`/`textarea` under `40rem`. `Invoer` also sets it, but the global
  rule is what covers the fields that don't go through `components/ui/vorm.tsx`.
- **`min-height` on a button does nothing if its only child is inline.** A `Kenteken`
  inside a filter chip left the button at 23px despite the rule. Give the button
  `inline-flex items-center`.

**Scale** is still one lever — `html { font-size }`, now 17.5px on desktop and 15.5px
under `40rem`. Reach for that before overriding sizes per component.

Mobile keyboards come from `Invoer`: it maps `type` to the right `inputMode` /
`autoCapitalize` / `spellCheck` centrally, so `type="email"` is enough. An explicit prop at
the call site still wins.

`viewport-fit=cover` is on, so use `.veilig-kant` / `.veilig-onder` / `.veilig-bo` on
anything that touches a screen edge. Pinch-zoom is deliberately left enabled — this is an
older congregation; never add `maximum-scale`.

## Conventions

- Server Components by default. `'use client'` only where interactivity demands it, and
  as far down the tree as possible.
- Mutations go through Server Actions with Zod validation.
- Every schema change is a migration in `supabase/migrations/`. No changes through the
  Supabase dashboard — they won't survive to production.
- Dates: store `timestamptz`, display `af-ZA` / `Africa/Johannesburg` (`1 Januarie 2026`).
- **POPIA applies.** Real families' ID numbers, addresses, children's details, phone
  numbers and pastoral notes. Don't log PII, don't ship it to third-party services, think
  hard before adding any analytics script.

## Structure

```
proxy.ts                    # auth gate + session refresh (NOT middleware.ts)
app/
  (publiek)/registreer/     # the ONLY public route
  (auth)/teken-in/
  (dash)/
    layout.tsx              # sidebar shell
    loading.tsx             # Trek kruis-laaier
    dashboard/  lidmate/  gesinne/  wyke/
    kategese/   kalender/ dokumentasie/
    verslae/    kommunikasie/ soek/ argief/ instellings/
components/
  ui/kruis-laaier.tsx       # KruisLaaier + VolbladLaaier
  ui/basis.tsx              # Knop, Kenteken, Paneel, Leeg, Vordering
  ui/tabel.tsx              # Tabelrol — rolhouer + randverdowwing vir breë tabelle
  kerk/                     # skil (nav-laai se toestand), sy-balk, bo-balk,
                            # bladsy-kop, stat-teel, lidmaat-avatar,
                            # status-kenteken, glas-boog, grafieke
lib/
  mock/                     # SPOTDATA — delete once Supabase is wired
    tipes.ts                #   domain types, mirror the coming schema
    data.ts                 #   the records themselves
    index.ts                #   query helpers — keep signatures Supabase-shaped
  glas.ts                   # palette hexes for SVG/charts (NOT a client module)
  nav.ts                    # the 12 sidebar items
  format.ts                 # af-ZA dates + age maths — use these, always
  utils.ts                  # cn()
  supabase/{client,server}.ts
  database.types.ts         # generated — never hand-edit
supabase/migrations/        # not created yet
docs/base44-reference/      # screenshots + inventory of the app we're replacing
```

Components and files are named in Afrikaans (`sy-balk`, `bladsy-kop`), matching the
enum-value rule — they're domain vocabulary. Library-facing identifiers stay English.

### Dev-only auth bypass

[proxy.ts](proxy.ts) lets requests through when the Supabase env vars are missing, so the
shell is viewable before the database exists. It **throws** in production instead. Don't
remove the production guard, and delete the whole branch once auth is wired up.

## Deviations from Base44

Deliberate, not oversights:

- **Households become a real entity** (see Domain model).
- **Argief stays a filtered view**, not a separate store — matches what Base44 actually does.
- **Admin merges into Instellings** as a role-gated tab. Two separate settings areas is noise.
- **Soek & Filter stays as a page** — its saved filters, quick chips and CSV export earn it.
  Add a Cmd-K palette for quick navigation on top, rather than replacing it.
- **Fix the age maths.** Base44's Dashboard and Verslae disagree with each other on the
  same data (Kinders 2 vs 0, Seniors 5 vs 0). One shared, tested helper computes ages and
  buckets everywhere.
- **Real transactional email** (Resend or similar) instead of whatever Base44 does.
  WhatsApp stays a `wa.me` deep link unless the gemeente wants to pay for the Business API —
  be upfront that bulk WhatsApp is not free.
