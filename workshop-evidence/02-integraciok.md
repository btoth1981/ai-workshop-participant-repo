# 02 – Szolgáltatás-integrációk (Linear · Neon · Vercel)

> Kelt: 2026-07-14 · Készítette: coding agent (Claude Code) · Az emberi döntés:
> „kösd össze a linear, a neon és a vercel pluginokat ezzel [a repóval]".

## Kötések

| Szolgáltatás | Erőforrás | Kötés a repóhoz |
|---|---|---|
| **GitHub** | `btoth1981/ai-workshop-participant-repo` (publikus) | `origin` remote; CI minden push/PR-re |
| **Linear** | Projekt: `ai-workshop-participant-repo` (Stressballs team, `STR`) | Repo-URL + szolgáltatás-kötések a projektleírásban; az issue-k lesznek a specek |
| **Neon** | Projekt: `Stressballs` (`steep-bar-94391898`, aws-eu-central-1, Postgres 18) | `DATABASE_URL` a lokális `.env`-ben (gitignored); default branch: `br-dry-pond-astaywm6` |
| **Vercel** | Projekt: `ai-workshop-participant-repo` (team: `stressballs`) | `vercel link` (`.vercel/`, gitignored) + GitHub git-integráció bekötve |

Linear-projekt: <https://linear.app/stressballs/project/ai-workshop-participant-repo-5a95d14b16a2>

## Ellenőrzési mód

### 1. Vercel-projekt létrejött és linkelt
- Pontos parancs: `vercel project inspect ai-workshop-participant-repo --scope stressballs`
- Várt, megfigyelhető eredmény: a projekt létezik, framework preset Next.js.
- Tényleges eredmény: projekt létrehozva (2026-07-14 12:11), Framework Preset:
  Next.js, Node.js 24.x.
- Állapot: ELLENŐRZÖTT

### 2. GitHub ↔ Vercel git-integráció
- Pontos parancs: `vercel git connect https://github.com/btoth1981/ai-workshop-participant-repo --yes --scope stressballs`
- Várt, megfigyelhető eredmény: `Connected`.
- Tényleges eredmény: `> Connected` (első futásnál hiba — a Vercel GitHub App
  hiányzott; az ember böngészőben telepítette, utána sikeres).
- Állapot: ELLENŐRZÖTT

### 3. Linear-projekt
- Pontos parancs: MCP `save_project` → visszaadott URL megnyitása
- Várt, megfigyelhető eredmény: projekt a Stressballs team alatt, repo-URL-lel.
- Tényleges eredmény: projekt-ID `f2ec8ace-2410-452b-af90-2dfad679382f`, lead
  beállítva, Backlog állapot.
- Állapot: ELLENŐRZÖTT

### 4. Neon connection string
- Pontos parancs: MCP `get_connection_string` (projectId: `steep-bar-94391898`)
- Várt, megfigyelhető eredmény: érvényes pooled Postgres URI.
- Tényleges eredmény: URI kiadva, `.env`-be írva (a fájl gitignored, commitba
  nem kerül).
- Állapot: ELLENŐRZÖTT

### 5. Automatikus deploy push-ra
- Pontos parancs: `git push` után `vercel ls ai-workshop-participant-repo --scope stressballs`
- Várt, megfigyelhető eredmény: a push-hoz tartozó deployment megjelenik.
- Tényleges eredmény: még nem futott — a git-integráció bekötése UTÁNI első
  push fogja először kiváltani.
- Állapot: ISMERETLEN
- Ha ismeretlen: döntési felelős és a tisztázandó kérdés: **ember** — mehet-e
  az első push (pl. ezzel az evidence-fájllal), ami egyben az első automatikus
  deploy-t is elindítja?

## Emberi döntések ebben a lépésben

1. A kötés célpontjai: a meglévő „Stressballs" nevű Linear team / Neon projekt /
   Vercel team (a C0 setup során jöttek létre).
2. A Vercel GitHub App telepítése a `btoth1981` GitHub-fiókra (böngészős,
   egyszeri művelet — agent nem tudta elvégezni).

## Maradék kockázat / nyitott pont

- Az automatikus deploy-lánc (push → Vercel build → élő URL) még nem bizonyított
  (5. ellenőrzés ISMERETLEN) — az első push validálja.
- A Neon `Stressballs` projekt megosztott a korábbi gyakorlattal; ha a napnak
  dedikált DB kell, az külön emberi döntés.
- `DATABASE_URL` csak lokálisan él; Vercel környezeti változóként még nincs
  beállítva — a nap adatbázis-blokkjában kerül sorra.
