# Plan — Stresszlabda Webshop

> Státusz: **ELFOGADVA — 2026-07-14, btoth** · A HOGYAN: technikai terv a
> `spec.md` megvalósítására, a `constitution.md` korlátain belül.

## 1. Architektúra-áttekintés

Next.js App Router (meglévő starter), TypeScript, Tailwind, shadcn/ui.
Két ütem, hogy a DB-blokk előtt is legyen működő, ellenőrizhető termék:

- **1. ütem — statikus katalógus + kliens-kosár:** a katalógus verziókezelt
  TypeScript-modul; a kosár kliensoldali állapot `localStorage`-perzisztenciával.
  Nincs adatbázis-függés.
- **2. ütem — rendelés-rögzítés Neonban:** a pénztár Server Action-nel írja a
  rendelést a Neon Postgresbe. A Neon Vercel-kezelt Marketplace-erőforrás
  (2026-07-14 óta): a `DATABASE_URL`-t és társait a Vercel provisionálja
  minden környezetre; lokális szinkron `vercel env pull`-lal (`.env.local`).

## 2. Útvonalak (App Router)

| Útvonal | Oldal | Render |
|---|---|---|
| `/` | Főoldal (S1) | statikus |
| `/termekek` | Terméklista + szűrés (S2, F1) | statikus + kliens-szűrő |
| `/termekek/[slug]` | Termékoldal (S3) | statikus (`generateStaticParams`) |
| `/kosar` | Kosár (S4, F2, F3) | kliens |
| `/penztar` | Pénztár (S5, F4) | kliens-űrlap + Server Action |
| `/penztar/koszonjuk/[orderId]` | Visszaigazolás (E4) | szerver |
| `/kapcsolat` | Kapcsolat (S6, F5) | statikus |

## 3. Modulok és fájlok

```
src/
  lib/
    catalog.ts          # terméktörzs: Product típus + 5 termék (slug, név,
                        # leírás, ár, keménység) — a spec 3. pontja kódban
    cart.ts             # kosár-logika: tételműveletek, összegzés,
                        # szállításiköltség-szabály (TISZTA függvények — tesztelhető)
    format.ts           # HUF-formázás (ezres tagolás + " Ft")
    orders.ts           # 2. ütem: rendelés-írás/olvasás (Neon)
  components/
    cart-provider.tsx   # kliens-kontextus + localStorage szinkron
    product-card.tsx, product-filters.tsx, cart-line.tsx, order-summary.tsx,
    checkout-form.tsx   # űrlap + validáció
  app/                  # a 2. pont útvonalai
```

- A pénzösszegek **egész forintban** (integer) tárolódnak és számolódnak —
  nincs lebegőpontos pénz.
- A szállítási szabály egyetlen tiszta függvény:
  `shippingFee(subtotal) = subtotal >= 10_000 ? 0 : 1_490` — a D1–D3
  szcenáriók közvetlenül unit-tesztelik.
- Űrlap-validáció: kliens- ÉS szerveroldalon ugyanaz a szabálykészlet
  (név/e-mail/telefon/cím kötelező, e-mail formátum) — új library nélkül,
  egyszerű validátor-függvényekkel (constitution 3. elv).

## 4. Adatmodell (2. ütem, Neon)

```sql
CREATE TABLE orders (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  timestamptz NOT NULL DEFAULT now(),
  name        text NOT NULL,
  email       text NOT NULL,
  phone       text NOT NULL,
  postal_code text NOT NULL,
  city        text NOT NULL,
  street      text NOT NULL,
  subtotal    integer NOT NULL,        -- Ft
  shipping    integer NOT NULL,        -- Ft
  total       integer NOT NULL         -- Ft
);

CREATE TABLE order_items (
  id           bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_id     uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_slug text NOT NULL,
  product_name text NOT NULL,          -- beküldéskori név (E5)
  unit_price   integer NOT NULL,       -- beküldéskori ár (E5)
  quantity     integer NOT NULL CHECK (quantity BETWEEN 1 AND 99)
);
```

DB-hozzáférés: `@neondatabase/serverless` (a Vercel-integráció hivatalos
guide-ja szerint) — **új függőség, emberi jóváhagyást igényel a T7 elején**
(constitution 3. elv alóli kivétel a 2. ütemben). Preview-környezetekhez a
Vercel-kezelt integráció automatikusan ad DB-branchet preview-deployonként.

## 5. Tesztstratégia

- **Unit (Vitest):** `cart.ts` (C1–C3, D1–D3), `format.ts`, validátorok (E2–E3),
  `catalog.ts` konzisztencia (A1: 5 termék, egyedi slugok).
- **Komponens/integráció:** szűrés (A2–A3), kosár-perzisztencia (C4) —
  a meglévő Vitest-tel, szükség esetén Testing Library (új dev-függőség —
  jóváhagyandó).
- **E2E:** out of scope az MVP-ben; a B/E oldalfolyamatokat a review-zó agent
  manuálisan + preview-deployon ellenőrzi.

## 6. Kapuk és bevezetés

- Minden task: feature-branch → PR → CI (typecheck/lint/test/build) zöld →
  független review (RUG) → merge → Vercel auto-deploy.
- A `DESIGN-GUIDELINE.md` kitöltése az UI-finomhangolás előfeltétele; a
  csontváz-UI (szemantikus, shadcn-alap) addig is épülhet.

## 7. Kockázatok

| Kockázat | Kezelés |
|---|---|
| Üres design-guideline → vizuális döntések csúsznak | 1. ütem szemantikus UI-ra szorítkozik; guideline-kitöltés külön emberi lépés |
| Nincsenek termékkép-assetek | placeholder az MVP-ben (spec 6.3 — eldöntve) |
| DB-driver = új függőség | explicit emberi jóváhagyás a 2. ütem elején |
| localStorage-kosár szerveren nem látszik | pénztár a kliensről küldi a tételeket; szerveroldali újra-árazás a katalógusból (E5 + manipuláció-védelem) |
