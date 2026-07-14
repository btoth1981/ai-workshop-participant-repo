# Tasks — Stresszlabda Webshop

> Státusz: **ELFOGADVA — 2026-07-14, btoth** · A `plan.md` felbontása
> önállóan szállítható, kapuzott munkadarabokra. Minden task Linear-issue-ként
> indul (projekt: `ai-workshop-participant-repo`), feature-branchen készül,
> PR-ral és zöld kapukkal zárul.
>
> **Közös DoD minden taskra:** `npm run typecheck && npm run lint && npm run test`
> zöld lokálisan és CI-ban; a taskhoz rendelt given-when-then szcenáriók teszttel
> lefedve; független review (RUG) jóváhagyta; preview-deploy megtekinthető.

## 1. ütem — statikus katalógus + kliens-kosár

### T1 — Terméktörzs és pénzformázás
- `src/lib/catalog.ts` (Product típus, 5 termék, keménység-besorolás),
  `src/lib/format.ts` (HUF-formázás)
- Lefedendő szcenáriók: A1 (adat-szint)
- Függőség: —

### T2 — Kosár-logika (tiszta függvények)
- `src/lib/cart.ts`: hozzáadás, darabszám (1–99), törlés, tételösszeg,
  `shippingFee`, fizetendő
- Lefedendő szcenáriók: C1, C2, C3, D1, D2, D3 (unit)
- Függőség: T1

### T3 — Alap-layout és statikus oldalak
- Közös layout (fejléc-navigáció, lábléc), Főoldal (S1, F5), Kapcsolat (S6)
- Lefedendő szcenáriók: F1, F2
- Függőség: T1

### T4 — Terméklista és szűrés
- `/termekek` oldal, `product-card`, `product-filters` (keménység + árrendezés)
- Lefedendő szcenáriók: A1, A2, A3
- Függőség: T1, T3

### T5 — Termékoldal
- `/termekek/[slug]` + `generateStaticParams`, 404 ismeretlen slugra
- Lefedendő szcenáriók: B1, B2
- Függőség: T4

### T6 — Kosár-UI és perzisztencia
- `cart-provider` (localStorage), `/kosar` oldal, kosárba-gombok bekötése,
  összegzés a szállítási szabállyal
- Lefedendő szcenáriók: C1–C4, D1–D3 (UI-szint)
- Függőség: T2, T5

## 2. ütem — rendelés-rögzítés (Neon)

> Kapu a 2. ütem előtt: **emberi jóváhagyás** a DB-driver függőségre és a
> `DATABASE_URL` Vercel-környezetbe emelésére (plan 4. és 6. pont).

### T7 — Adatbázis-séma és rendelés-modul
- `orders` + `order_items` tábla a Neonban (plan 4. pont SQL-je),
  `src/lib/orders.ts` (írás + szerveroldali újra-árazás a katalógusból)
- Lefedendő szcenáriók: E5 (unit/integráció)
- Függőség: T2, emberi kapu

### T8 — Pénztár-űrlap és Server Action
- `/penztar` űrlap + kliens/szerver validáció, rendelés-írás, kosár-ürítés,
  `/penztar/koszonjuk/[orderId]` visszaigazolás; üres kosár → terelés (E1)
- Lefedendő szcenáriók: E1, E2, E3, E4
- Függőség: T6, T7

## Kísérő (nem kód-task)

### K1 — DESIGN-GUIDELINE kitöltése *(emberi feladat, agent-támogatással)*
- Brand/tone, színek, tipográfia, layout, komponens-szabályok, tiltások —
  a brief hangneméből kiindulva; az UI-finomhangolás előfeltétele.

### K2 — Linear-issue-k létrehozása T1–T8-ból
- A spec-csomag elfogadása UTÁN; issue = spec-hivatkozás + szcenárió-lista + DoD.

## Sorrend és mérföldkövek

```
T1 ─→ T2 ─────────────→ T6 ─→ [M1: működő bolt DB nélkül]
  └─→ T3 ─→ T4 ─→ T5 ──┘
[emberi kapu: DB-döntés] ─→ T7 ─→ T8 ─→ [M2: rendelés-rögzítő MVP]
```

- **M1** a spec S1–S4 + F1–F3 + F5 köre — DB nélkül teljes értékű demó.
- **M2** a teljes MVP (S5, F4) — ezzel a spec minden szcenáriója él.
