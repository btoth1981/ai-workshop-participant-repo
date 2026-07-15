# Agent-ready audit — hol tart ez a rendszer

STATUS: ELFOGADVA — 2026-07-15, btoth · SOURCE_SHA: dbf5729 · RUN_DATE: 2026-07-15
Mérce: a README négy AI-natív ismérve. Minden állítás mögött a két nap
evidence-anyaga (workshop-evidence/01–09, C6, C7).

## 1. Gyors, olcsó ciklusok — ✅ ERŐS

- Push → CI (typecheck/lint/test/build) ~40 s; PR → preview-deploy + preview
  DB-branch automatikusan; merge → production percek alatt. Bizonyíték: 14
  merged PR két nap alatt, mindegyik teljes kapu-futással.
- Lokális kapuk: 97 unit teszt ~3 s alatt.
- Rés: az integrációs szint (Neon-branch elleni teszt) még nem CI-automatikus
  (T9 backlog) — ma kézi/laborfutás.

## 2. Feature-szintű szeparáció — ✅ JÓ, kis résekkel

- A T1–T8 vágás bizonyítottan párhuzamosítható volt: T2∥T3 és T5∥T7 makerek
  izolált worktree-kben, konfliktus nélkül; tiszta lib/UI/IO rétegek
  (cart.ts tiszta függvények, vékony saveOrder, közös validációs modul).
- Rés: nincs kikényszerített modul-boundary (pl. lint-szabály az
  import-irányokra); a boundary ma konvenció, nem gépi kapu.

## 3. Teljes AI-integrálhatóság — ✅ ERŐS, egy ismert töréssel

- Minden eszköz gépi interfészen: GitHub (gh CLI), Vercel (CLI+MCP), Neon
  (MCP, branch-elés), Linear (MCP, issue=spec). Az agent a teljes kört
  ember-kattintás nélkül vitte (bizonyíték: a teljes T-lánc + C6-futás).
- Ismert törések, dokumentálva: GitHub MCP OAuth nem megy (→ gh CLI);
  Vercel GitHub App és Marketplace-feltétel elfogadása egyszeri browseres
  emberi lépés volt.

## 4. Szerződések + verifikáció — ✅ ERŐS (a workshop fő terméke)

- Élő lánc: elfogadott spec (19 szcenárió) → Linear-issue → maker → kapuk →
  független RUG-review bizonyítékokkal → emberi merge-kapu → evidence.
- A kapuk mindkét irányban bizonyítottak (negatív próbák: C2, C6-mutáció,
  C7-mutáció; éles fogás: NBSP-tesztbukás, környezet-drift).
- Rés: a DESIGN-GUIDELINE túlnyomórészt üres (csak Brand) — a vizuális
  szerződés hiányzik; DOM-szintű tesztek elhalasztva.

## Összkép és a három legfontosabb következő lépés

A rendszer agent-ready: a négy ismérvből három erős, egy jó. A rések
mind ismertek és issue-ban/checklistában követettek.

1. T9: integrációs szint CI-ba emelése (Neon-branch automatika)
2. DESIGN-GUIDELINE kitöltése (K1) — a vizuális munka szerződésesítése
3. Boundary-szabályok gépi kikényszerítése (import-irány lint)
