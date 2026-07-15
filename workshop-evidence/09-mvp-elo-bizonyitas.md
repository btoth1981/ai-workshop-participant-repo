# 09 – M1 + M2 mérföldkő és élő végpont-bizonyítás

> Kelt: 2026-07-15 · A második workshopnap kimenete: a taskboard (T1–T8) teljes,
> az MVP élesben, megfigyelt end-to-end bizonyítékkal.

## A nap láncai (T5–T8)

| | T5 termékoldal | T7 Neon+orders | T6 kosár-UI | T8 pénztár |
|---|---|---|---|---|
| Issue | STR-9 | STR-11 | STR-10 | STR-12 |
| Maker SHA | `79d1148` | `701ba96` | `9d3469b` | `68dae40` |
| PR | #8 | #9 | #10 | #11 |
| RUG-ítélet | APPROVE (2 nit) | APPROVE (1 elméleti nit) | APPROVE (3 nit) | APPROVE (2 minor + 1 nit) |
| Merge | `a212d21` | `d681b7e` | `70c2323` | `3beab84` |
| Mérföldkő | — | — | **M1** | **M2** |

T5+T7 párhuzamosan futott (izolált worktree-k); a T7 emberi kapuja 2026-07-15-én
oldódott fel (driver: `@neondatabase/serverless` jóváhagyva; E5 unit-teszt most,
élő Neon-branch elleni integrációs teszt follow-up a C6-ra). Kiemelt review-
bizonyítékok: T7 — élő séma oszlop-szintű egyezése + injection-biztos
paraméterezés; T6 — useSyncExternalStore-deviáció adverzariális igazolása;
T8 — E5 tamper-védelem end-to-end, Neon-driver nincs a kliens-bundle-ben
(`grep .next/static/` üres).

## Élő végpont-próba (production, 2026-07-15, emberi jóváhagyással)

Eszköz: Playwright (scratchpadból, a repó nem változott). Cél:
https://ai-workshop-participant-repo.vercel.app

### 1. Böngésző-oldal
- Pontos parancs: `node live-order-test.mjs` (Playwright/Chromium; lépések:
  /termekek → Kosárba → /kosar → /penztar → űrlap → beküldés → visszaigazolás)
- Várt, megfigyelhető eredmény: teljes rendelési út hibátlanul, orderId a
  visszaigazoló URL-ben, kosár utána üres.
- Tényleges eredmény: `RESULT=PASS` — 5 Kosárba-gomb; kosárban
  `1 490 + 1 490 szállítás = 2 980 Ft` (D1 díjszabály élesben); redirect:
  `/penztar/koszonjuk/7d9b9436-8192-4b98-a3b2-fc14bb2185c2`; az oldal mutatja
  az azonosítót; a kosár a rendelés után üres (E4).
- Állapot: ELLENŐRZÖTT

### 2. Adatbázis-oldal
- Pontos parancs: Neon MCP `run_sql` — `SELECT … FROM orders o JOIN order_items i
  … WHERE o.id = '7d9b9436-8192-4b98-a3b2-fc14bb2185c2'` (csak olvasás)
- Várt, megfigyelhető eredmény: a rendelés a böngészőben látott összegekkel.
- Tényleges eredmény: pontos egyezés — `subtotal=1490, shipping=1490,
  total=2980`; tétel: `klasszikus / „Klasszikus stresszlabda" / unit_price=1490 /
  quantity=1`; a beküldéskori név+ár snapshot-oszlopok (E5) kitöltve;
  `created_at=2026-07-15T13:43:01.531Z`; vevő: „Teszt Elek (workshop
  próbarendelés)" / teszt.elek@example.com (egyértelműen szintetikus adat).
- Állapot: ELLENŐRZÖTT

**Emberi döntés:** a próbarendelés sora evidenciaként a DB-ben marad.

## Mit bizonyít

A spec → issue → maker (izolált worktree) → kapuk → független RUG → emberi
merge → auto-deploy lánc végén az üzleti folyamat élesben, megfigyelten
működik: böngésző → közös validáció → Server Action → szerveroldali újra-árazás
→ atomi Neon-írás → visszaigazolás → kosár-ürítés. A spec mind a 19
given-when-then szcenáriója implementált és review-zott; 97 unit-teszt zöld;
11/11 PR a védett kapun át ment be.

## Nyitva maradt (follow-up)

1. Integrációs teszt élő Neon-branch ellen (emberi döntés: később — C6 blokk)
2. Testing Library / DOM-szintű tesztek (elhalasztva)
3. DESIGN-GUIDELINE vizuális szakaszai (K1) — a bolt ma szemantikus csontváz-UI
4. Ismert nit-ek: cross-tab kosár-szinkron, number-input UX, régi visszaigazoló
   URL újranyitása üríti a kosarat, /termekek üres-állapot (elméleti)

## Következő emberi döntés

A tananyag C6-blokkjának (rendszerellenőrzés) indítása — ennek természetes
része az 1. follow-up (Neon-branch elleni integrációs/contract teszt).
