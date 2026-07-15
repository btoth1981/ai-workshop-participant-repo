# Model- és harness-értékelés — mennyire cserélhető az adapter?

STATUS: ELFOGADVA — 2026-07-15, btoth · SOURCE_SHA: dbf5729 · RUN_DATE: 2026-07-15
Mérce: constitution 6. elv — a szerződések nem építhetnek egy konkrét modell
vagy agent-harness sajátosságaira; a coding agent cserélhető adapter.

## Mi bizonyult modell-/harness-függetlennek (a szerződéses réteg)

| Réteg | Miért hordozható |
|---|---|
| Spec-csomag (docs/spec/, 19 szcenárió) | tiszta markdown, mérhető elfogadási feltételek — bármely agent bemenete lehet |
| AGENTS.md 13 szabálya + engineering-standards | eszköz-semleges elvek; a standard kifejezetten „link, ne másold" |
| Gépi kapuk (npm-scriptek + CI + branch-védelem) | a kapu HTTP/CLI-szinten él, nem tud a modellről |
| Evidence-sablon és RUG-protokoll | a „parancs → megfigyelt kimenet → ítélet" formátum modellfüggetlen |
| MCP-kötések (Linear/Neon/Vercel) | szabvány-protokoll; bármely MCP-képes harness használhatja |

## Mi volt a gyakorlatban harness-specifikus (őszinte lista)

- A futtatás VÉGIG egyetlen harness-családban történt (Claude Code; a
  maker/reviewer szétválasztást külön kontextusú subagentek adták). A
  workshop eredeti terve második, független harnesst (Codex) is javasolt —
  ezt az ember döntése alapján subagent-izolációval helyettesítettük.
  A szétválasztás LOGIKAILAG teljesült (a reviewer friss kontextusból,
  csak a repóból dolgozott), de a monokultúra-kockázat (közös vakfolt)
  formálisan nem nulla.
- Worktree-izoláció, agent-indítási mód, hook-ok: harness-adottságok —
  de mind az adapter-rétegben élnek, a szerződéseket nem érintik.

## Cserepróba-forgatókönyv (mivel bizonyítanánk a cserélhetőséget)

1. Válassz egy lezárt taskot (pl. T2 — tiszta függvények, éles DoD).
2. Add oda egy MÁSIK harnessnek (Codex / más CLI-agent) CSAK a repót:
   AGENTS.md + standard + spec + Linear-issue.
3. Mérd: eljut-e zöld kapukig + PR-ig emberi többlet-instrukció nélkül;
   a RUG-review (szintén másik harness) talál-e mást, mint az eredeti.
4. Elfogadás: ha a szerződéses réteg változtatás nélkül elég volt, az
   adapter cserélhető. Minden hiányzó infó = a szerződés rése, nem az agenté.

## Kockázatok és kezelésük

| Kockázat | Kezelés |
|---|---|
| Modell-monokultúra (maker és reviewer közös vakfoltja) | cserepróba + vegyes harness-pár a review-ban (30–60 nap, lásd adoption-terv) |
| Szolgáltatás-kiesés / árváltozás | a szerződéses réteg érintetlen marad; csak az adapter cserél — a cserepróba ezt teszi bizonyítottá |
| Harness-specifikus tudás beszivárgása a szabályokba | AGENTS.md-review negyedévente: eszköznév-említések kigyomlálása |

## Javaslat

A cserepróba (fenti forgatókönyv) kerüljön a 30 napos adoption-ablakba —
addig a modell-függetlenség TERVEZETT, de nem BIZONYÍTOTT állítás.
