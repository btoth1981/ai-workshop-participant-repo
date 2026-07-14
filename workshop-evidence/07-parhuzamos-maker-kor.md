# 07 – Párhuzamos maker-kör: T2 + T3 (két maker, két független reviewer)

> Kelt: 2026-07-14 · Emberi döntés: „párhuzamosan mehet a kettő". Két maker-agent
> dolgozott egyszerre, izolált git worktree-kben, közös főágat nem érintve; mindkét
> munkadarabot külön, friss kontextusú RUG-reviewer ítélte meg. A merge-öket az
> ember egyenként hagyta jóvá — már a C5-ös branch-védelem kapuján át.

## A két lánc

| | T2 — Kosár-logika (STR-6) | T3 — Layout + statikus oldalak (STR-7) |
|---|---|---|
| Maker | maker-t2 (izolált worktree) | maker-t3 (izolált worktree) |
| Branch | `btoth/str-6-...` | `btoth/str-7-...` |
| Készítői SHA | `dca6791` | `3e65fc0` |
| PR | #3 | #4 |
| Kapuk (maker) | 0/0/0 — 31 teszt (20 új) | 0/0/0/0 build-del — 17 teszt (6 új) |
| Reviewer | rug-reviewer-t2 (friss kontextus) | rug-reviewer-t3 (friss kontextus) |
| Ítélet | **APPROVE** — 0 javítandó, 1 info-nit | **APPROVE** — 2 minor, 1 nit, 0 javítandó |
| Emberi döntések | merge jóváhagyva | márkanév: „Stresszlabda Shop" marad (minor #6); merge jóváhagyva |
| Merge (squash) | `a9795b6` | `0b1c1b7` (előtte kötelező branch-frissítés: strict check) |
| Linear | STR-6 → Done | STR-7 → Done |

## Reviewer-megállapítások és sorsuk

- **T2 nit (info):** `orderTotal(0)` üres kosárra 1 490 Ft szállítást adna — a
  szabály korrekt alkalmazása; az üres-kosár-terelés az E1/T8 felelőssége.
  Nem igényelt javítást.
- **T3 minor #6 (márkanév):** a maker „Stresszlabda Shop"-ot használt; a spec
  címe „Stresszlabda Webshop", a brief törzsszövege viszont maga is
  „Stresszlabda Shop"-ot ír. **Emberi döntés: a „Stresszlabda Shop" marad** —
  a döntés a `DESIGN-GUIDELINE.md` Brand szakaszába került (ugyanebben a PR-ban).
- **T3 minor #7 (adat-szintű tesztek):** a DOM-szintű teszthez Testing Library
  kellene — új függőség, emberi jóváhagyás nélkül a maker helyesen NEM vitte be;
  az F1/F2 lefedés adat-szintű (a lapok a konstansokat 1:1 renderelik). A
  reviewer elfogadhatónak ítélte. A Testing Library bevezetése nyitott emberi
  döntés marad (plan §5).
- **T3 nit #8:** kiemelt termékek = a katalógus első három eleme (a spec
  hallgat); dokumentált content-döntés, a kártyák szándékosan nem linkelnek a
  még nem létező termékoldalra (T5).

## Mit bizonyított ez a kör

1. **Párhuzamosíthatóság:** a feature-szintű szeparáció (T2: tiszta lib, T3:
   app-oldalak) valós párhuzamos agent-munkát engedett, konfliktus nélkül.
2. **A kapu élesben:** a T2 merge után a T3 branché lemaradt; a strict
   status-check kikényszerítette a frissítést és az újra-zöldet a merge előtt.
3. **Szerephatárok:** maker ≠ reviewer ≠ döntéshozó — a két reviewer mindent
   maga futtatott (npm ci + 4 kapu, worktree-ben), az ember csak a
   döntési pontokon lépett be (megállapítások sorsa, márkanév, merge).

## Következő emberi döntés

A T4 (terméklista + szűrés) PR-jának review utáni sorsa; valamint a T7 emberi
kapuja (`@neondatabase/serverless` driver-jóváhagyás), amely a T2 lezárultával
megnyitható.
