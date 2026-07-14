# 08 – Folytatási pont (állapotmentés)

> Kelt: 2026-07-14 ~15:00 · Emberi kérés: „ezt az állapotot mentsd el, hogy innen
> lehessen folytatni". Ez a dokumentum a repo + folyamat teljes pillanatképe;
> egy új agent-session ebből + az `AGENTS.md`-ből indulva folytatni tudja a munkát.

## Hol tartunk — napirend (tananyag)

| Blokk | Állapot | Evidence |
|---|---|---|
| C1 — Szerepek és korlátok | ✅ | 01-helyzetkep.md |
| C2 — Repo felkészítése | ✅ | 02, 03 + AGENTS.md 1–12 + docs/engineering-standards.md |
| C3 — Specifikáció | ✅ | docs/spec/ (5 fájl, ELFOGADVA + 6.5 döntés) |
| C4 — Független review | ✅ | 05 (T1 teljes RUG-lánc) + 07 (párhuzamos kör) |
| C5 — Szabályok és kapuk | ✅ | 06 (branch-védelem, GH006 negatív + PR pozitív eset) |
| C6 — Rendszerellenőrzés | ⬜ következő tananyag-blokk | — |
| C7 — Legacy | ⬜ | — |
| C8 — Bevezetés | ⬜ | — |

## Hol tartunk — munkadarab (Stresszlabda Shop webshop)

Taskok (Linear, Stressballs team, projekt: ai-workshop-participant-repo):

| Task | Issue | Állapot | Merge |
|---|---|---|---|
| T1 terméktörzs + formázás | STR-5 | ✅ Done | 6c6f870 (PR #1, RUG: APPROVE→fix 7dce6b1→VERIFIED) |
| T2 kosár-logika | STR-6 | ✅ Done | a9795b6 (PR #3, RUG: APPROVE) |
| T3 layout + statikus oldalak | STR-7 | ✅ Done | 0b1c1b7 (PR #4, RUG: APPROVE) |
| T4 terméklista + szűrés | STR-8 | ✅ Done | 000e5fb (PR #6, RUG: APPROVE) |
| T5 termékoldal | STR-9 | ⬜ KÖVETKEZŐ — minden blokkolója feloldva | — |
| T6 kosár-UI (M1 mérföldkő) | STR-10 | ⬜ T2+T5 után | — |
| T7 DB-séma + orders (Neon) | STR-11 | ⬜ emberi kapu: `@neondatabase/serverless` driver jóváhagyása MÉG NYITOTT | — |
| T8 pénztár (M2 mérföldkő) | STR-12 | ⬜ T6+T7 után | — |

Main HEAD a mentéskor: `000e5fb` (+ ez a doksi PR-ja). Élő production: főoldal,
/kapcsolat, /termekek (szűrő+rendezés); /termekek/[slug] és /kosar még 404 (T5/T6).

## Infrastruktúra-kötések

- **GitHub:** btoth1981/ai-workshop-participant-repo (publikus). `main` VÉDETT:
  PR + zöld `checks` (CI: typecheck/lint/test/build) kötelező mindenkinek,
  adminnak is; direkt push elutasítva (GH006); strict mód (branch-frissítés
  kell merge előtt).
- **Vercel:** stressballs team / ai-workshop-participant-repo projekt; GitHub
  auto-deploy (push→production, PR→preview).
- **Neon:** Vercel-KEZELT Marketplace-erőforrás `autumn-hill-73068152`
  (PG 17.10, üres — séma a T7-ben). 18 env var Vercel-provisionálva; lokálisan
  `vercel env pull` → `.env.local`. A régi kézi Neon-projekt TÖRÖLVE.
- **Linear:** issue = spec + állapot; MCP-vel írható-olvasható.
- **Toolkit:** `../workshop-source/toolkit/` (standard, sablonok, csomagok).

## Munkamód-szerződés (röviden — a teljes: AGENTS.md 1–12)

- Spec-first: docs/spec/ ELFOGADVA; minden task Linear-issue-ból, feature-branchen
  (branch-név a Linear `gitBranchName` mezőjéből), PR-ral zárul.
- Maker ≠ reviewer: makerek izolált worktree-ben (Agent tool), minden PR-ra
  friss kontextusú független RUG-review agent, bizonyíték-kötelezettséggel.
- Ember dönt: megállapítások sorsa, merge, új függőség, vizuális/brand döntés.
- Commit/push csak explicit emberi kérésre; evidence minden lépésről
  (workshop-evidence/, fix sablon).
- DESIGN-GUIDELINE: Brand kitöltve („Stresszlabda Shop", hangnem); minden más
  vizuális döntés NYITOTT — agent nem találhat ki.

## Nyitott emberi döntések (a folytatás belépési pontjai)

1. **T5 indítása** (STR-9) — kész az indításra, maker-agent flow.
2. **T7 kapu:** `@neondatabase/serverless` driver-függőség jóváhagyása —
   utána T7 a T5-tel párhuzamosan futhat (nem ütköznek).
3. **Testing Library** dev-függőség (DOM-szintű teszt) — eddig elhalasztva,
   adat-szintű lefedés elfogadva (07-es evidence, T3 #7).
4. **DESIGN-GUIDELINE** többi szakasza (színek, tipográfia, …) — a vizuális
   finomhangolás előfeltétele (K1 task).
5. Ismert nem-blokkoló nit-ek: üres-állapot UI a /termekek-en (elméleti),
   per-oldal metadata a kliens-oldalakon.

## Hogyan folytasd (új session receptje)

1. Olvasd: `AGENTS.md` → `docs/engineering-standards.md` → `docs/spec/` →
   ez a fájl.
2. Ellenőrizd a kapukat: `npm run typecheck && npm run lint && npm run test`
   (a mentéskor: mind zöld, 46 teszt).
3. `gh pr list` + `git log --oneline -5` + Linear-státuszok egyeztetése.
4. A fenti nyitott döntések közül az ember mondja meg, melyik indul.
