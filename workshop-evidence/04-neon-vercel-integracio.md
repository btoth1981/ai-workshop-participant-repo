# 04 – Neon → Vercel-kezelt integráció

> Kelt: 2026-07-14 · Készítette: coding agent (Claude Code) · Emberi döntés:
> „kössük be a neont, a vercel kezelje a neon-t" + a Marketplace-feltételek
> elfogadása böngészőben.

## Mi változott

| Előtte | Utána |
|---|---|
| Konzolból létrehozott Neon-projekt (`Stressballs`, `steep-bar-94391898`) | **Vercel-kezelt Marketplace-erőforrás** (`autumn-hill-73068152`) |
| `DATABASE_URL` kézzel a lokális `.env`-ben | Env-eket (`DATABASE_URL`, `POSTGRES_*`, `PG*`, `NEON_*` — 18 db) a **Vercel provisionálja** Production + Preview környezetre |
| Lokális szinkron kézi | `vercel env pull` → `.env.local` (gitignored) |
| Preview-DB-branch kézi/MCP terv | A Vercel-kezelt integráció preview-deployonként automatikusan ad DB-branchet |

## Ellenőrzési mód

### 1. Integráció telepítése
- Pontos parancs: `vercel integration add neon --scope stressballs`
- Várt, megfigyelhető eredmény: sikeres provisioning, env-lista.
- Tényleges eredmény: első futás `userActionRequired` (feltétel-elfogadás) —
  az ember böngészőben elfogadta; második futás: 18 env var provisionálva,
  `✓ Updated .env.local file`.
- Állapot: ELLENŐRZÖTT

### 2. Env-ek a Vercel-projekten
- Pontos parancs: `vercel env ls --scope stressballs` (csak nevek, értékek nem)
- Várt, megfigyelhető eredmény: `DATABASE_URL` és társai Production + Preview
  környezetben.
- Tényleges eredmény: 18 változó (`DATABASE_URL`, `DATABASE_URL_UNPOOLED`,
  `POSTGRES_URL`, `POSTGRES_PRISMA_URL`, `PG*`, `NEON_PROJECT_ID`, …) mind
  `Production, Preview` scope-pal.
- Állapot: ELLENŐRZÖTT

### 3. Melyik Neon-projekt kötődött?
- Pontos parancs: `grep -o "NEON_PROJECT_ID=.*" .env.local`
- Várt, megfigyelhető eredmény: a kötött projekt azonosítója.
- Tényleges eredmény: `autumn-hill-73068152` — **új, Vercel-kezelt projekt**,
  NEM a régi `steep-bar-94391898`.
- Állapot: ELLENŐRZÖTT

### 4. Kapcsolat-próba (health check)
- Pontos parancs: Neon MCP `run_sql` — `SELECT 1 AS health, current_database(), version()`
  a `autumn-hill-73068152` projekten
- Várt, megfigyelhető eredmény: sikeres lekérdezés.
- Tényleges eredmény: `health=1`, db=`neondb`, PostgreSQL **17.10** —
  (a régi projekt PG 18 volt; verzióváltás, semmi nem függött tőle).
- Állapot: ELLENŐRZÖTT

## Átvezetett konzisztencia-frissítések

- `.env` — a régi kézi `DATABASE_URL` törölve; mostantól a Vercel a forrás
  (`vercel env pull` → `.env.local`)
- `docs/spec/constitution.md` — kötött infrastruktúra frissítve
- `docs/spec/plan.md` §1 és §4 — env-forrás + driver pontosítva
  (`@neondatabase/serverless` a hivatalos guide szerint), preview-branch
  automatikus
- Linear: projektleírás frissítve; STR-11 (T7) emberi kapujából a
  `DATABASE_URL`-emelés teljesítettre állítva — **maradt: a driver-függőség
  jóváhagyása a T7 elején**

## Maradék kockázat / nyitott pont

- A régi `Stressballs` Neon-projekt (`steep-bar-94391898`, üres, 0 tábla)
  feleslegessé vált — törlése destruktív művelet, **emberi döntés**.
- Az adatbázis üres; a séma a T7-ben jön létre (emberi kapu: driver).

## Következő emberi döntés

1. A régi `steep-bar-94391898` Neon-projekt törölhető-e?
2. E csomag (docs + evidence + .env-csere) commitjának jóváhagyása.
