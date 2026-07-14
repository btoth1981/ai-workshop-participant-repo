# 03 – Negatív próba (a kapuk hibát is fognak)

> Kelt: 2026-07-14 · Készítette: coding agent (Claude Code) · C2-kimenet:
> ellenőrző parancsok sikeres ÉS hibás próbája. A zöld kapu önmagában nem
> bizonyíték — azt is bizonyítani kell, hogy a kapu PIROSRA vált, ha hibát lát.
> A rontások lokálisak voltak, commit nem készült belőlük; a munkafa a próbák
> után bizonyítottan tiszta.

## Ellenőrzési mód

### 1. Szándékos típushiba → typecheck-kapu
- Beavatkozás: `src/lib/utils.ts` — a `cn` visszatérési típusa `number`-re
  hamisítva, miközben `string`-et ad vissza.
- Pontos parancs: `npm run typecheck`
- Várt, megfigyelhető eredmény: nem nulla exit kód, TS-hibaüzenetek.
- Tényleges eredmény: **exit kód 1**; 4+ `error TS2322` a `utils.ts`-ben ÉS a
  fogyasztó `card.tsx`-ben (`Type 'number' is not assignable to type 'string'`)
  — a hiba a hívási helyeken is terjed, a kapu a teljes hatást jelzi.
- Állapot: ELLENŐRZÖTT

### 2. Szándékos viselkedésváltozás → teszt-kapu
- Beavatkozás: `src/lib/utils.ts` — a `cn` kimenetéhez `" broken"` fűzve
  (típushelyes, tehát a typecheck NEM fogná; csak a teszt).
- Pontos parancs: `npm run test`
- Várt, megfigyelhető eredmény: nem nulla exit kód, bukó assertion.
- Tényleges eredmény: **exit kód 1**; `FAIL src/lib/utils.test.ts` —
  `AssertionError: expected 'a c broken' to be 'a c'`; `Tests 1 failed (1)`.
- Állapot: ELLENŐRZÖTT

### 3. Visszaállítás után minden kapu zöld
- Beavatkozás: mindkét rontás visszaállítva; `git diff --stat src/` üres
  (a munkafa a kiinduló állapottal azonos).
- Pontos parancs: `npm run typecheck; npm run lint; npm run test` (exit kódok
  külön rögzítve)
- Várt, megfigyelhető eredmény: mindhárom exit kód 0.
- Tényleges eredmény: `typecheck=0 lint=0 test=0`; `Tests 1 passed (1)`.
- Állapot: ELLENŐRZÖTT

## Következtetés

- A typecheck- és a teszt-kapu bizonyítottan piros hibás állapotban és zöld
  helyes állapotban — a kapuk jelzésének mostantól van bizonyító ereje.
- A két próba szándékosan különböző hibaosztályt fed: az 1. a típusrendszert
  (fordítási idő), a 2. a viselkedést (futásidő) — a 2. típushelyes hiba, amit
  CSAK a teszt fog el, ez mutatja, miért nem elég a typecheck egyedül.
- Maradék korlát: a tesztkészlet ma egyetlen mintateszt — a kapu mechanizmusa
  bizonyított, a LEFEDETTSÉG nem. Az üzleti viselkedés bizonyítása a T1–T8
  taskok szcenárió-tesztjeivel épül fel (lásd `docs/spec/tasks.md`).

## Szerephatárok ebben a lépésben

- Ember: elrendelte a negatív próbát („mehet"); a C2-csomag commitját külön
  hagyja jóvá.
- Coding agent: elvégezte a rontás → piros → visszaállítás → zöld ciklust,
  exit kódokkal dokumentálva; a rontásokat nem commitolta.

## Következő emberi döntés

A C2-csomag (bővített `AGENTS.md`, átvett `docs/engineering-standards.md`,
ez az evidence) commitjának és pusholásának jóváhagyása.
