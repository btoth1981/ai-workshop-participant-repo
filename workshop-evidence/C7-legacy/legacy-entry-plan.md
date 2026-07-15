# Legacy-entry-plan — OrderTotalsService (LegacyShop minta)

STATUS: ELFOGADVA — 2026-07-15, btoth · SOURCE_SHA: 30649ba ·
RUN_DATE: 2026-07-15 · Alap: toolkit/legacy-playbook (characterize → seam →
strangle → csak utána refaktor) + checklists/legacy-adoption.md

## 1. SEAM (hol nyúlunk a rendszerhez)

**Teszt-seam (már kihasználva):** a `LoadOrderRows` és `GetFirstOrderYear`
virtual metódusok — subclass-to-test. Ez a legolcsóbb varrat: a DB-hívások
felülírhatók tesztduplával úgy, hogy az üzleti logika egyetlen sora sem
változik. A 3 karakterizációs teszt erre épül (01-karakterizacio.md).

**Kivágási seam (következő lépés):** YARP reverse proxy a monolit előtt —
a varrat egy konfigfájl. Első route: `/statements/*` → modern szolgáltatás;
`{**catch-all}` → minden más marad a legacy-n. A route-precedencia garantálja,
hogy csak a kivágott szelet érintett.

## 2. MINIMUM VÁLTOZTATÁS (az első szelet)

1. Proxy beékelése tiszta pass-through-ként (nulla viselkedésváltozás) —
   önmagában deployolható, ellenőrizhető lépés.
2. A havi kimutatás számítása modern szolgáltatásba (a webshop-stack
   mintájára: tiszta, unit-tesztelt függvények + vékony IO), a pinelt
   viselkedés 1:1 reprodukálásával — **a bugokkal együtt** (a rejtett-óra
   hűségszabály és a kupon-sorrend is marad, amíg az ember másként nem dönt).
3. A SQL-iker (`usp_CalculateOrderTotals`) pinelése tSQLt-vel
   (`sql/tsqlt-template.sql`) MIELŐTT a proc kiváltása szóba kerül — a
   szabályok két helyen élnek, mindkét példányt hálóba kell fogni.
4. Régi és új út párhuzamos futtatása szintetikus reprezentatív adatokon;
   a karakterizációs számok bírálnak. Route-átvágás csak számegyezés után.

NEM csináljuk: teljes újraírás; a legacy kód törlése (az mindig az UTOLSÓ
lépés); viselkedés-„javítás" spec-döntés nélkül; séma-változtatás az első
szeletben (nincs rá szükség — csak olvas).

## 3. STOP-SZABÁLY (mikor állunk meg azonnal)

- Ha egy viselkedés nem tehető determinisztikusan pinelhetővé (újabb rejtett
  óra/kultúra/globális állapot bukkan fel) → STOP, előbb a seam bővítése.
- Ha egy snapshot jóváhagyott viselkedés-döntés NÉLKÜL változna → STOP,
  emberi kapu (a karakterizáció nem helyesség-állítás, de a változtatása
  mindig emberi döntés).
- Ha a C# és a SQL-iker számai eltérnek egymástól → STOP: előbb emberi
  döntés kell arról, MELYIK a kanonikus viselkedés — ezt agent nem döntheti el.
- Ha a párhuzamos futásban a régi és új út eltér és az eltérés oka 30 percen
  belül nem azonosítható → STOP, vissza az elemzéshez (nincs „majd jó lesz").

## 4. ROLLBACK

- **Route-szint (elsődleges):** a YARP-konfigban a `/statements` route
  visszamutatása a legacy clusterre — egyetlen konfigváltás, a legacy app
  újra-deploya nélkül; a catch-all végig érintetlen.
- **Adat-szint:** az első szelet csak olvas, séma nem változik → nincs
  adat-rollback-igény. Ha későbbi szelet sémát érintene: előtte backup +
  kompatibilis (expand-contract) migráció + dual-write terv a checklist
  szerint — enélkül a szelet nem indulhat.
- **Teljes visszavonulás:** a proxy kivétele — a monolit pontosan úgy fut,
  mint a beavatkozás előtt.

## 5. Emberi döntések ebben a tervben

1. E terv elfogadása (DRAFT → ELFOGADVA). ✔ 2026-07-15
2. Az első kivágandó route megerősítése (/statements — javaslat).
3. A megörökölt bugok sorsa (rejtett-óra hűségszabály, kupon-sorrend):
   megtartás 1:1 vagy spec-szintű javítás — szeletenként, pinelés UTÁN.
4. Séma-érintő szelet esetén a migrációs/rollback-terv külön jóváhagyása.
