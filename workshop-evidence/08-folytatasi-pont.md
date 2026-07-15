# 08 – Folytatási pont (állapotmentés)

> Frissítve: 2026-07-15 (workshop-zárás; eredeti mentés: 2026-07-14). Ez a
> dokumentum a repo + folyamat pillanatképe; egy új agent-session ebből + az
> `AGENTS.md`-ből indulva folytatni tudja a munkát.

## Végállapot — napirend (tananyag): C1–C8 MIND KÉSZ ✅

| Blokk | Evidence |
|---|---|
| C1 szerepek/korlátok | 01-helyzetkep.md |
| C2 repo-felkészítés | 02, 03 + AGENTS.md (13 szabály) + docs/engineering-standards.md |
| C3 specifikáció | docs/spec/ (5 fájl, ELFOGADVA, §6 döntésnapló) |
| C4 független review | 05 (T1 teljes RUG-lánc) + 07 (párhuzamos kör) |
| C5 szabályok/kapuk | 06 (branch-védelem: GH006 negatív + PR pozitív eset) |
| C6 rendszerellenőrzés | C6-rendszerellenorzes/ (8 fájl; lelet: környezet-drift → 13. szabály) |
| C7 legacy | C7-legacy/ (3 karakterizáció + mutáció + ELFOGADOTT entry-plan) |
| C8 bevezetés | C8-bevezetes/ (audit + harness-eval + 30–60–90, ELFOGADVA) |

## Végállapot — munkadarab (Stresszlabda Shop)

- **T1–T8: Done** (STR-5…STR-12), M1+M2 mérföldkő élő E2E-bizonyítással
  (09-mvp-elo-bizonyitas.md; próbarendelés `7d9b9436-…` a DB-ben marad).
- **T9 (STR-13): Backlog** — állandó integrációs teszt (TEST_DATABASE_URL +
  CI-beli Neon-branch); emberi kapu az indítás előtt (CI-mechanizmus + secret).
- 15 merged PR, mind a védett kapun át; 97 unit teszt zöld.
- Élő production: https://ai-workshop-participant-repo.vercel.app — teljes
  vásárlási út (böngészés→szűrés→termékoldal→kosár→pénztár→Neon-rendelés).

## Infrastruktúra-kötések (változatlanul érvényes)

- **GitHub:** btoth1981/ai-workshop-participant-repo; `main` VÉDETT (PR +
  zöld `checks` mindenkinek, strict; direkt push → GH006).
- **Vercel:** stressballs/ai-workshop-participant-repo; auto-deploy.
- **Neon:** Vercel-kezelt `autumn-hill-73068152` (`neon-pink-yacht`,
  us-east-1, PG 17.10); `orders`+`order_items` séma (db/schema.sql);
  env-ek Vercel-provisionálva, lokálisan `vercel env pull`. FIGYELEM:
  us-east-1 régió vs. EU-latency — nyitott emberi kérdés.
- **Linear:** Stressballs team / ai-workshop-participant-repo projekt.
- **Toolkit:** `../workshop-source/toolkit/`.
- Lokális gép: .NET 10 SDK telepítve (C7-labor); Playwright a scratchpadban.

## Munkamód-szerződés

A teljes szerződés: AGENTS.md 1–13 (utolsó bővítés: 13. szabály — lockfile-t
érintő merge/pull után `npm ci` a fő munkakönyvtárban). Lényeg: spec-first;
maker ≠ reviewer ≠ ember; commit/push/merge/új függőség/vizuális döntés csak
explicit emberi jóváhagyással; evidence parancs+kimenet szinten.

## Nyitott belépési pontok (mind emberi döntéssel indul)

1. **T9 (STR-13):** integrációs teszt CI-ba — kapu: Neon-branch mechanizmus
   + secret jóváhagyása.
2. **K1:** DESIGN-GUIDELINE kitöltése (csak a Brand van meg) → utána
   vizuális finomhangolás (v0 / Claude Design útvonalak a guideline-ban).
3. **Cserepróba** (model-harness-eval terv): lezárt task újrafuttatása másik
   harness-szel — a modell-függetlenség bizonyítása.
4. **Adoption-terv 2–3. döntése:** pilot-csapat/repo + szerep-gazdák.
5. Kisebb ismert nit-ek: cross-tab kosár-szinkron; number-input UX; régi
   visszaigazoló-URL kosár-ürítése; /termekek üres-állapot; DB-régió.

## Hogyan folytasd (új session receptje)

1. Olvasd: `AGENTS.md` → `docs/engineering-standards.md` → ez a fájl →
   (feladattól függően) docs/spec/ és a releváns evidence.
2. `npm ci` (13. szabály!), majd kapuk: `npm run typecheck && npm run lint
   && npm run test` (záráskor: 97/97 zöld).
3. `gh pr list` + `git log --oneline -5` + Linear-státusz egyeztetés.
4. A fenti belépési pontok közül az ember mondja meg, melyik indul.
