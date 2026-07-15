# Adoption 30–60–90 — az operating model bevezetése csapat-szinten

STATUS: ELFOGADVA — 2026-07-15, btoth · SOURCE_SHA: dbf5729 · RUN_DATE: 2026-07-15
Mérce: toolkit/checklists/legacy-adoption.md — „egy csapat, egy repo, mérhető
kapuk; bővítés csak ismételhető evidence és dokumentált fallback után".

## Kiindulás (ma bizonyított képességek)

Két nap alatt, egy repóban: spec-first lánc 14 merged PR-ral, maker/reviewer
szétválasztás, védett main, evidence-fegyelem, élő E2E-bizonyítás, legacy-
belépési módszer (karakterizáció+mutáció). Ez a pilot-minta — ezt visszük át.

## 0–30 nap — Pilot egy éles csapatban

- Egy csapat + EGY éles repo kiválasztása (emberi döntés: melyik).
- A hordozható csomag átvitele: AGENTS.md-váz, engineering-standards (link!),
  spec-sablonok, evidence-sablon, branch-védelem + CI-kapuk.
- Szereprend felállása: spec-gazda, standard-gazda, review-gazda, CI-gazda,
  kivétel-gazda — névvel (checklist: „define ownership").
- **Cserepróba** a model-harness-eval szerint (második harness egy lezárt
  taskon) — a modell-függetlenség bizonyítása.
- Mérés indul (kvóta NÉLKÜL, csak trend): átfutási idő, kiszökött hibák,
  review-találatok, agent-költség/task.
- Kilépési kapu a 30. napon: ≥5 teljes láncú PR (spec→RUG→merge→evidence)
  a pilot-repóban; fallback dokumentálva (a csapat vissza tud állni a
  korábbi munkamódra egyetlen döntéssel).

## 31–60 nap — Mélyítés, még mindig egy csapat

- Legacy-belépés élesben: a csapat egy valódi legacy-komponensén
  karakterizáció + seam + entry-plan (a C7-minta szerint; stop-szabályokkal).
- Integrációs szint CI-ba (a T9-minta általánosítása: eldobható DB-branch
  a pipeline-ban).
- Vegyes harness-pár a review-ban (maker ≠ reviewer HARNESS-szinten is) —
  a monokultúra-kockázat lezárása.
- RUG-metrika-visszatekintés: mely megállapítás-típusok ismétlődnek →
  szabályként az AGENTS.md-be (a fájl erre való).
- Kilépési kapu: a pilot-mérőszámok 30 napos trendje nem romlik; legalább
  egy legacy-szelet strangler-úton, rollback-próbával.

## 61–90 nap — Kontrollált bővítés

- Második csapat/repo onboardolása — a pilot-csapat mentorál; a csomagot
  a pilot ISMÉTELHETŐ evidence-e viszi, nem mandátum.
- Szervezeti szabálykönyv: a repo-szintű AGENTS.md-k közös magja kiemelve
  (de a standard továbbra is repo-szinten linkelt, nem központi másolat).
- Kivétel-folyamat élesítése: mikor szabad kaput kerülni (soha „csendben" —
  mindig dokumentált emberi döntéssel), ki hagyhatja jóvá.
- Kilépési kapu a 90. napon: két csapat, két repo, azonos evidence-fegyelem;
  döntés a szélesebb kiterjesztésről CSAK a mérőszámok és a két pilot
  evidence-e alapján.

## Végig érvényes elvek

- Metrika ≠ kvóta: a mérőszám tanulásra van, nem teljesítmény-elszámolásra.
- Minden bővítési lépésnek van fallbackje; a bővítés emberi döntés.
- Az evidence-fegyelem nem opció: ami nincs dokumentálva parancs+kimenet
  szinten, az nem történt meg.

## Emberi döntések e terv elfogadásához

1. A terv elfogadása (DRAFT → ELFOGADVA).
2. Pilot-csapat és -repo kijelölése (0–30 nap indítófeltétele).
3. A szerep-gazdák megnevezése.
