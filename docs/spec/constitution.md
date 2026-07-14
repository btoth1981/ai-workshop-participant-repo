# Constitution — Stresszlabda Webshop

> Státusz: **ELFOGADVA — 2026-07-14, btoth** · Forrás-brief: `docs/stresszlabda-webshop.md`
> Ez a fájl a projekt megváltoztathatatlan alapelveit rögzíti. Minden spec, terv
> és task ennek van alárendelve; ütközés esetén a constitution győz.

## Misszió

Egyszerű, gyors, megbízható webshop stresszlabdák bemutatására és megrendelésére.
A projekt egyben a workshop operating modelljének validációs munkadarabja: minden
változás a spec → implementáció → gépi kapuk → független review → evidence úton
megy végig.

## Alapelvek

1. **Spec-first.** Feature-munka csak elfogadott spec-csomagból indulhat. A spec
   mondja meg a MIT, a `DESIGN-GUIDELINE.md` a HOGYAN NÉZ KI, a terv a HOGYAN.
2. **Gépi kapuk kötelezőek.** Semmi sem „kész", amíg nem zöld:
   `npm run typecheck && npm run lint && npm run test` (CI-ban + build is).
3. **Egyszerűség.** Nincs új library, minta vagy absztrakció, amíg a feladat
   valóban nem igényli (AGENTS.md 3. szabály). Egy implementáció ⇒ nincs interface.
4. **UI csak shadcn/ui-ból.** Építőelem a `src/components/ui/`-ból; új komponens
   a hivatalos `npx shadcn@latest add` úton érkezik.
5. **Angol kód.** Kód, kommentek, commit-üzenetek angolul (a dokumentáció lehet
   magyar).
6. **Modell- és toolfüggetlenség.** A szerződések (spec, DoD, kapuk, evidence)
   nem építhetnek egy konkrét modell vagy agent-harness sajátosságaira.
7. **Evidence.** Minden állítást megfigyelhető parancseredmény támaszt alá;
   az evidenciák a `workshop-evidence/` alatt élnek.
8. **Szerephatárok.** A modell javasol; a coding agent a jóváhagyott scope-on
   belül végrehajt és bizonyít; az ember dönt a scope-ról és a kapuknál;
   a független ellenőrző (második harness / CI) review-z — a maker önmagát
   nem validálja.

## Nem tárgyalható korlátok

- Valódi fizetési integráció **nincs** (kitalált bolt) — a pénztár rendelési
  szándékot rögzít, pénzmozgás nélkül.
- Titok (connection string, token) soha nem kerül a repóba; `.env` gitignored.
- A `main`-re csak zöld kapukkal kerülhet változás.

## Kötött infrastruktúra

- GitHub: `btoth1981/ai-workshop-participant-repo` (CI: typecheck/lint/test/build)
- Vercel: `stressballs/ai-workshop-participant-repo` (auto-deploy pushra/PR-re)
- Neon Postgres: `Stressballs` (`steep-bar-94391898`)
- Linear: `ai-workshop-participant-repo` projekt — az issue-k a munkadarab-specek
