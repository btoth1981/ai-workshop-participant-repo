# C6 következtetés — rendszerellenőrzés a böngészőtől az adatbázisig

STATUS: VERIFIED · SOURCE_SHA: 665bdedf2b0cb14c05c2a18439437eb345ba3d6b ·
ENVIRONMENT: lokális next start + eldobható Neon-branch · ADAPTER:
br-proud-glitter-ats5mp18 · RUN_DATE: 2026-07-15

## Mit támaszt alá az egyes rétegek bizonyítéka

| Réteg | Mit bizonyít | Mit NEM bizonyít |
|---|---|---|
| Unit (97 zöld) | üzleti szabályok: árazás, kosár, szállítási küszöb (D2 határ), validáció, rendelés-összeállítás (E5) | IO-t, hálózatot, DB-t nem érint |
| Contract (2 zöld, valódi adapter) | a saveOrder írás→visszaolvasás szerződése; DB CHECK invariáns él | UI-t, HTTP-határt nem érint |
| Action-határ (siker+hiba) | szerveroldali validáció + újra-árazás + redirect; hibás input nem ír | csak 1-1 utat járt be, nem teljes kombinatorikát |
| UI (2 screenshot) | a felhasználói út vizuálisan a várt állapotokat adja | a képek önmagukban nem gépi assertök |
| Adat (előtte/utána) | +2 sikeres rekord, 0 a hibából; production érintetlen | hosszú távú konzisztenciát, versenyhelyzetet nem |

## A futás közben talált valódi hibák és kezelésük

1. **Környezet-drift (valódi lelet):** a fő munkakönyvtár node_modules-a
   lemaradt a lockfile-tól (a T7 worktree-ben települt a driver) → unit-futás
   exit 1. Javítás: `npm ci`, újrafutás zöld. Tanulság szabályként: merge/pull
   után `npm ci` a fő munkakönyvtárban is.
2. **A tesztíró tévedése (nem a rendszeré):** az átmeneti contract-teszt rossz
   mezőnevet várt (subtotal vs. subtotalHuf) → első futás piros, javítás után
   zöld. A piros→zöld ciklus itt is a kapu bizonyító erejét mutatja.

## Maradék rendszerkockázatok

- A contract-teszt átmeneti fájlként futott — nincs a repo tesztkészletében
  (T9 follow-up: állandó integrációs teszt TEST_DATABASE_URL + CI-beli
  Neon-branch létrehozással).
- Versenyhelyzetek (egyidejű rendelések), terhelés, idő-/lokálfüggés nem
  vizsgált.
- A UI-hibautak közül csak az érvénytelen e-mail futott; a többi mező
  hibaútjai unit-szinten fedettek, E2E-szinten nem.
- DOM-szintű komponens-tesztek továbbra is elhalasztva (Testing Library döntés).
- us-east-1 DB-régió vs. EU-felhasználók latency (nyitott emberi döntés).

## Következő lépés

T9 issue: állandó Neon-branch elleni integrációs teszt a repo készletébe;
valamint az AGENTS.md bővítése a "merge után npm ci" szabállyal.
