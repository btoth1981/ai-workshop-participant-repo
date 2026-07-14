# Repo-helyzetkép

> Kelt: 2026-07-14 · Készítette: coding agent (Claude Code) · Kód nem módosult;
> a diagnózis csak olvasásból és ellenőrző parancsokból származik.

## A repo célja

A Wenova AI-Assisted Development Workshop résztvevői munkarepója: egy szándékosan
minimális Next.js (App Router) + TypeScript + Tailwind + shadcn/ui váz, amelyet a
nap során kell agent-ready fejlesztési rendszerré alakítani (mission, repo-szabályok,
kanonikus standard, spec-kapu, RUG, mechanikus ellenőrzések). A rendszer validációs
munkadarabja a kitalált **KK-Regisztráció** üzleti kérés (jelentkezés névvel és
e-maillel, 48 órás kizáró lemondási ablak, duplikátum-védelem). Jelen állapotában
a repo **technikai hordozó**, nem kész operating modell. (Forrás: `README.md`.)

## Amit az agent feltételezhet

- A stack: Next.js `16.2.10`, React `19.2.4`, TypeScript `^5`, Tailwind `^4`,
  shadcn/ui lokális forrásként, Vitest `^4.1.10`. (Forrás: `package.json`,
  `src/components/ui/`.)
- A négy gépi kapu (`typecheck`, `lint`, `test`, `build`) definiált és lokálisan
  zöld; CI-ból push-ra és PR-re automatikusan lefut. (Forrás: `package.json`
  scripts, `.github/workflows/ci.yml`, lenti parancseredmények.)
- A repo publikus GitHub-remote-tal rendelkezik és a `main` szinkronban van vele:
  `https://github.com/btoth1981/ai-workshop-participant-repo`. (Forrás:
  `git remote -v`, `git branch -vv`.)
- Négy MCP-szerver van bekötve (Linear, GitHub, Neon, Vercel); a Linear, Neon és
  Vercel OAuth-hitelesítése ebben a sessionben megtörtént. (Forrás: `.mcp.json`,
  `/mcp` parancs kimenete a sessionben.)
- Az agent működési szabályai: `AGENTS.md` (dizájnhoz `DESIGN-GUIDELINE.md`,
  UI-elem csak `src/components/ui/`-ból, egyszerűség, angol kód/commit, kapuk
  zöldre futtatása a „kész" előtt), plusz Next.js-munkánál a
  `node_modules/next/dist/docs/` a verzióhelyes dokumentáció. (Forrás: `AGENTS.md`.)
- Nincs titok a repóban és nem is kell még: `.env.example` üres, `DATABASE_URL`
  a nap adatbázis-blokkjában kerül be. (Forrás: `.env.example`, `.gitignore`.)

## Amit az agent nem feltételezhet

- **Semmilyen vizuális döntést**: a `DESIGN-GUIDELINE.md` minden érdemi szakasza
  (brand, színek, tipográfia, layout, komponens-szabályok, tiltások) üres
  placeholder — az üres szakasz azt jelzi, hogy a döntés nyitott, nem azt, hogy
  szabad a pálya.
- **A munkadarab tartalmát**: nincs `docs/spec/` csomag, nincs Linear-issue-hoz
  kötött spec; a KK-Regisztráció elfogadási feltételei (48 órás ablak pontos
  értelmezése, duplikátum-szabály) nincsenek gépi formában rögzítve.
- **Hogy a zöld kapu üzleti helyességet bizonyít**: a tesztkészlet egyetlen
  `utils` mintateszt; nincs lefedettségi küszöb, branch-védelem, kötelező review
  (RUG) vagy evidence-elvárás a merge-hez.
- **A toolkit elérhetőségét**: a `README.md` a `../toolkit/golden-thread/`
  csomagra hivatkozik, de a szülőmappában nincs `toolkit/` — a kanonikus standard
  és a spec-sablonok forrása innen nem érhető el.
- **Deploy- és adatbázis-célt**: Neon-projekt/branch és linkelt Vercel-projekt
  nincs; a preview-deploy + branchelt DB ígéret még egyetlen erőforráson sem áll.
- **GitHub MCP-hozzáférést**: a GitHub MCP-végpont OAuth-ja Claude Code-ból nem
  működik (nincs dynamic client registration) — GitHub-műveletre a `gh` CLI a
  járható út. (Forrás: `.mcp.json` `$comment`.)

## Ellenőrzési mód

### 1. Típusellenőrzés
- Pontos parancs: `npm run typecheck`
- Várt, megfigyelhető eredmény: `tsc --noEmit` hibaüzenet nélkül, 0 exit kód.
- Tényleges eredmény: nincs hibakimenet, exit kód 0.
- Állapot: ELLENŐRZÖTT

### 2. Lint
- Pontos parancs: `npm run lint`
- Várt, megfigyelhető eredmény: ESLint hibajelzés nélkül, 0 exit kód.
- Tényleges eredmény: nincs hibakimenet, exit kód 0.
- Állapot: ELLENŐRZÖTT

### 3. Tesztek
- Pontos parancs: `npm run test`
- Várt, megfigyelhető eredmény: Vitest zölden fut le, 0 exit kód.
- Tényleges eredmény: `Test Files 1 passed (1)`, `Tests 1 passed (1)`, exit kód 0
  — a zöld egyetlen mintatesztet jelent, nem üzleti lefedettséget.
- Állapot: ELLENŐRZÖTT

### 4. CI a remote-on
- Pontos parancs: `gh run list --repo btoth1981/ai-workshop-participant-repo --limit 3`
- Várt, megfigyelhető eredmény: a `main`-re push-olt commit CI-futása `success`.
- Tényleges eredmény: `completed success … CI main push` a bootstrap commitra
  (run `29322063886`, 39s).
- Állapot: ELLENŐRZÖTT

### 5. Remote megléte
- Pontos parancs: `git remote -v && git branch -vv`
- Várt, megfigyelhető eredmény: `origin` a GitHub-repóra mutat, `main` követi az
  `origin/main`-t.
- Tényleges eredmény: `origin https://github.com/btoth1981/ai-workshop-participant-repo`,
  `main … [origin/main]`.
- Állapot: ELLENŐRZÖTT

### 6. Éles build
- Pontos parancs: `npm run build`
- Várt, megfigyelhető eredmény: Next.js production build hibátlanul, 0 exit kód.
- Tényleges eredmény: lokálisan ebben a diagnózisban nem futott le; a CI-ban a
  4. pont futása tartalmazta és zöld volt.
- Állapot: ELLENŐRZÖTT (CI-n keresztül; lokális futtatás nem történt)

### 7. Toolkit elérhetősége
- Pontos parancs: `ls ../toolkit`
- Várt, megfigyelhető eredmény: a `toolkit/golden-thread/` csomag elérhető.
- Tényleges eredmény: a könyvtár nem létezik (`NO ../toolkit`).
- Állapot: ISMERETLEN
- Ha ismeretlen: döntési felelős és a tisztázandó kérdés: **tréner / résztvevő** —
  honnan és mikor érhető el a toolkit C1-csomagja (kanonikus standard, spec-sablonok)?

## Ismeretlenek

1. Kérdés: Mi a KK-Regisztráció pontos specifikációja és „kész" definíciója
   (48 órás kizáró határ értelmezése, duplikátum-szabály, elfogadási feltételek)?
   Miért számít: enélkül az agent csak lefordulót tud építeni, helyeset nem; a
   kapuk zöldje semmit nem bizonyít az üzleti viselkedésről.
   Válaszadó szerep: ember (résztvevő mint product owner), a 3. modul
   spec-csomagjának elkészítésével és elfogadásával.
   Addig tiltott feltételezés: bármilyen feature-implementáció vagy adatmodell
   a KK-Regisztrációhoz.

2. Kérdés: Mik a dizájn-döntések (brand, színek, tipográfia, layout, tiltások)?
   Miért számít: az `AGENTS.md` 1. szabálya minden vizuális munkát a
   `DESIGN-GUIDELINE.md`-hez köt, amely jelenleg üres — az agent vagy kitalálna,
   vagy megállna.
   Válaszadó szerep: ember (résztvevő), a dizájn-guideline kitöltésével és
   jóváhagyásával (v0 / Claude Design támogatással).
   Addig tiltott feltételezés: bármilyen szín-, betű- vagy komponensvariáns-döntés;
   UI-munka a kezdőlap cseréjén túl.

3. Kérdés: Hol érhető el a toolkit (kanonikus standard, spec-sablonok,
   RUG-orkesztráció, projektmemória-csomagok)?
   Miért számít: a README szerint az operating modell rétegei állomásonként a
   toolkitből érkeznek; a hivatkozott `../toolkit/` útvonal nem létezik.
   Válaszadó szerep: ember (tréner), a workshop-forrás elérési útjának megadásával.
   Addig tiltott feltételezés: hogy az agent maga írja meg a standardot vagy a
   spec-sablonokat a toolkit helyett.

4. Kérdés: Mi a merge-feltétel a zöld CI-n túl (branch-védelem, kötelező
   független review / RUG, evidence-elvárás)?
   Miért számít: jelenleg bárki (agent is) push-olhat a `main`-re; a
   maker/reviewer szétválasztásnak nincs gépi kikényszerítése.
   Válaszadó szerep: ember (résztvevő), a GitHub branch-védelem és a
   review-szabályok beállításával (C4–C5 blokk).
   Addig tiltott feltételezés: hogy közvetlen `main`-re push elfogadott munkamód
   feature-munkára.

5. Kérdés: Mely Neon-projekthez és Vercel-projekthez kötjük a repót?
   Miért számít: a preview-deploy + branchelt adatbázis lánc enélkül nem létezik;
   az MCP-hitelesítés megvan, de erőforrás nincs.
   Válaszadó szerep: ember (résztvevő), a nap adatbázis- és deploy-blokkjában.
   Addig tiltott feltételezés: adatbázisséma, `DATABASE_URL` vagy deploy-konfiguráció
   létrehozása.

## Szerephatárok

- **Modell:** javaslatot generál (kód, teszt, szöveg, terv, alternatívák); nincs
  közvetlen hatása a repóra, nem futtat és nem ír semmit — cserélhető adapter,
  a működési szerződés nem építhet modell-specifikus prompt-trükkökre.
- **Coding agent:** a jóváhagyott scope-on belül végrehajt: fájlt ír, parancsot
  és kapukat futtat, MCP-t hív (Linear/Neon/Vercel), GitHub-ot `gh` CLI-vel kezel;
  hibánál a scope-on belül javít és a teljes ellenőrzést megismétli; minden
  eredményt megfigyelhető evidenciával (parancs + kimenet) támaszt alá. Nem dönt
  scope-ról, elfogadásról, kockázatról.
- **Ember:** a kapuk tulajdonosa — missiont és scope-ot ad, specet és dizájnt
  fogad el, DoD-t definiál, merge-ről és kockázatvállalásról dönt; feature csak
  az általa elfogadott evidence után indul.
- **Független ellenőrző:** a makertől elkülönített második agent-harness (pl.
  Codex a Claude Code mellett) és/vagy a CI: a maker munkáját friss kontextusból,
  a spec és a standard ellen review-zza (RUG); a maker saját magát nem
  validálhatja. Jelenleg nincs bekötve — a C4–C5 blokk állítja fel.

## Következő emberi döntés

**A KK-Regisztráció spec-csomagjának elkészítése és elfogadása** (3. modul):
az ember rögzíti a 48 órás kizáró lemondási határ pontos értelmezését, a
duplikátum-védelem szabályát és az elfogadási feltételeket, valamint kimondja,
mely kapuk zöldje a merge feltétele. Ez az egy döntés oldja fel az 1., 2. és 4.
ismeretlent; addig az agent olvasás/diagnózis módban marad, feature-implementáció
nem indul.
