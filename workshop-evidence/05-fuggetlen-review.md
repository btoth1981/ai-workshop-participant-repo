# 05 – Független review (RUG) — T1 / PR #1

> Kelt: 2026-07-14 · A napirend C4-blokkjának kimenete: készítői SHA, elfogadott/
> elutasított review-megállapítások, javítási SHA és újraellenőrzési eredmény.
> Szereposztás: a makert és a reviewert két KÜLÖN agent-kontextus adta; a reviewer
> friss kontextusból, kizárólag a repó tartalmából (spec, standard, diff) dolgozott,
> és minden állítást maga ellenőrzött parancsokkal. A maker nem validálta önmagát.

## A lánc

| Elem | Érték |
|---|---|
| Munkadarab | T1 — Terméktörzs és pénzformázás (Linear STR-5, PR #1) |
| **Készítői SHA** | `56ac5c7` |
| Review-ítélet | **APPROVE** — 0 blocker, 0 major, 2 minor, 2 nit |
| Emberi döntés a megállapításokról | #1, #2, #4 elfogadva javításra; #3 (nit) átjegyezve a T4-re (STR-8) |
| **Javítási SHA** | `7dce6b1` |
| **Újraellenőrzés** | **FIXES VERIFIED** — nincs fennmaradó kifogás |
| Merge (emberi kapu) | squash-merge a `main`-re: `6c6f870` (PR #1, branch törölve) |

## A reviewer által futtatott ellenőrzések (1. kör, `56ac5c7`)

- `git diff main...<branch>` → 5 fájl, +176/−8, scope tiszta (csak T1-fájlok + jóváhagyott spec-módosítás)
- `npm run typecheck` / `lint` / `test` → exit 0/0/0 (10 teszt zöld)
- NBSP-állítás kódpont-szinten igazolva: forrás U+00A0 (1 db), tesztek U+00A0 (13 db)
- Mind az 5 termék minden mezője kézzel egyeztetve a spec §3-mal — pontos egyezés

## Megállapítások és sorsuk

| # | Súly | Megállapítás | Emberi döntés | Eredmény |
|---|---|---|---|---|
| 1 | minor | name/description nincs tesztben bebetonozva | javítandó | teljes spec §3 tábla deep-equal assert, táblázat-sorrendben |
| 2 | minor | `products` mutálható | javítandó | `Product` mezők + tömb `readonly` |
| 3 | nit | magyar címke → `Firmness` enum leképezés dokumentálatlan | T4-re átjegyezve | STR-8 leírásába emelve (szűrő-szemantikával) |
| 4 | nit | `-0`/`±Infinity` nincs explicit tesztelve | javítandó | 3 új teszteset (`-0` → `"0 Ft"` NBSP-vel, ±Infinity → TypeError) |

## Újraellenőrzés (2. kör, `56ac5c7..7dce6b1`)

- Diff-scope: pontosan a 3 érintett fájl, túllépés nélkül
- #1/#2/#4 tételesen igazolva (a `-0` teszt várt sztringje kódpontonként:
  U+0030 U+00A0 U+0046 U+0074 — valódi NBSP)
- Kapuk: exit 0/0/0, **11 teszt** zöld
- Záró ítélet: **FIXES VERIFIED — a PR mergelhető**

## Tanulság (menet közben elkapott hiba)

A javítás első futásában a maker új tesztsora sima szóközzel bukott
(`'0 Ft' ≠ '0 Ft'` — láthatatlan NBSP-eltérés): a kapu pontosan azt a
hibaosztályt fogta meg élesben, amit a 03-as negatív próba bizonyított.

## Szerephatárok ebben a blokkban

- Ember: döntött a megállapítások elfogadásáról/átjegyzéséről és a merge-ről.
- Maker agent: implementált, javított, kapukat futtatott — de nem ítélkezett.
- Független reviewer agent: friss kontextusból bizonyítékokkal review-zott és
  újraellenőrzött — de nem módosított kódot.

## Következő emberi döntés

A T2 (STR-6, kosár-logika) és/vagy T3 (STR-7, alap-layout) indítása — a T1
merge-ével mindkettő blokkolása feloldódott.
