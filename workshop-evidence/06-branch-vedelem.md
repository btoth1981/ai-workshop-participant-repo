# 06 – Döntési feljegyzés és bizonyítás: branch-védelem (C5)

> Kelt: 2026-07-14 · A napirend C5-blokkjának kimenete: döntési feljegyzés és
> ellenőrzés sikeres és negatív esetre.

## Döntési feljegyzés

**Döntés (ember):** a `main` branch védett; közvetlen push senkinek — adminnak
és agentnek sem — nem megengedett. Minden változás (kód ÉS dokumentáció) pull
requesten át érkezik, amelynek zöld kötelező státusz-ellenőrzése van.

**Beállítás** (GitHub branch protection, `gh api` — 2026-07-14):

| Szabály | Érték | Indoklás |
|---|---|---|
| PR kötelező | igen, 0 kötelező GitHub-approval | a tartalmi review-t a RUG (független agent-review) adja, nem a GitHub-approval; szóló repóban a saját PR nem is approvalozható |
| Kötelező státusz-check | `checks` (CI: typecheck+lint+test+build), strict mód | zöld kapu nélkül nincs merge; strict: a branchnek naprakésznek kell lennie a main-nel |
| Adminokra is érvényes | igen (`enforce_admins`) | a kapu csak akkor kapu, ha a tulajdonosra is vonatkozik |
| Force push / branch-törlés | tiltva | történelem-átírás és kapu-megkerülés kizárva |
| Beszélgetés-feloldás kötelező | igen | nyitott review-kommenttel nem lehet mergelni |

**Következmény a munkamódra:** az eddigi „docs commit egyenesen a main-re"
gyakorlat megszűnik; az evidence-fájlok is PR-on át érkeznek. Az `AGENTS.md`
8. szabálya ennek megfelelően frissült.

## Ellenőrzési mód

### 1. Negatív eset — közvetlen push a main-re
- Pontos parancs: `git commit --allow-empty -m "probe: direct push must be rejected" && git push`
- Várt, megfigyelhető eredmény: a remote elutasítja, nem nulla exit kód.
- Tényleges eredmény: **exit 1**; `remote rejected … (protected branch hook
  declined)`; `GH006: Protected branch update failed` — indoklásban mindkét
  szabály: „Changes must be made through a pull request" és „Required status
  check 'checks' is expected". A próba-commit ezután `git reset --hard
  origin/main`-nel eldobva, a lokális main azonos az origin/main-nel (`2ecf70e`).
- Állapot: ELLENŐRZÖTT

### 2. Pozitív eset — változás PR-on át, zöld checkkel
- Pontos parancs: ez a fájl + az `AGENTS.md`-frissítés feature-branchen, PR-ral;
  `gh pr checks` → merge.
- Várt, megfigyelhető eredmény: a PR zöld `checks` státusszal mergelhető, a
  merge után a main tartalmazza a változást.
- Tényleges eredmény: *lásd a PR-t, amely ezt a fájlt szállította — a merge
  ténye önmagában a bizonyíték, mert az 1. pont szerint más út nincs.*
- Állapot: ELLENŐRZÖTT (a merge megtörténtével)

## Maradék kockázat

- A védelem konfigurációját admin API-hívással vissza lehet kapcsolni — ez ellen
  technikai kapu nincs, a szabály szervezeti: a védelem módosítása emberi döntés,
  naplózott döntési feljegyzéssel.
- A `checks` job a CI-definícióból jön; a workflow-fájl módosítása is PR-köteles,
  így a kapu tartalma is review alá esik.

## Következő emberi döntés

E PR merge-ének jóváhagyása (ez egyben a pozitív eset bizonyítása), majd a
T2/T3 indítása.
