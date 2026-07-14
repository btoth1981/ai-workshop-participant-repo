# Spec — Stresszlabda Webshop

> Státusz: **ELFOGADVA — 2026-07-14, btoth** · Forrás-brief: `docs/stresszlabda-webshop.md`
> Ez a fájl a MIT rögzíti. A HOGYAN a `plan.md`-ben, az elfogadási szcenáriók a
> `given-when-then.md`-ben.

## 1. Cél és célközönség

Stresszoldó labdák webshopja diákoknak, irodai dolgozóknak és mindenkinek, aki
feszültséget vezetne le. Hangnem: barátságos, nyugtató, játékos („szorítsd,
gyúrd, lazíts!").

## 2. Terjedelem (scope)

### Benne van (MVP)

| # | Képesség | Leírás |
|---|---|---|
| S1 | Főoldal | Bemutatkozás, értékajánlatok, kiemelt termékek, CTA a terméklistára |
| S2 | Terméklista | Mind az 5 termék kártyákon; szűrés (lásd 4. pont) |
| S3 | Termékoldal | Termékenkénti aloldal: leírás, ár, „Kosárba" gomb |
| S4 | Kosár | Tételek darabszámmal, módosítás/törlés, összegzés, szállítási költség |
| S5 | Pénztár | Szállítási adatok űrlapja, rendelés rögzítése (fizetés nélkül) |
| S6 | Kapcsolat | Elérhetőségek statikus oldala |

### Nincs benne (out of scope — külön emberi döntésig)

- Valódi fizetés (bankkártya, átutalás) — a rendelés „utánvét" jelzéssel rögzül
- Felhasználói fiók, bejelentkezés (vendég-checkout van)
- Admin-felület, készletkezelés, rendeléskezelés
- E-mail-küldés (visszaigazolás)
- Többnyelvűség (csak magyar), több pénznem (csak HUF)
- Keresés (a szűrés elég 5 termékhez)

## 3. Termékkatalógus (kiinduló adat)

| Slug | Név | Leírás | Ár (bruttó) |
|---|---|---|---|
| `klasszikus` | Klasszikus stresszlabda | Puha hab, kézre álló méret, egyszínű | 1 490 Ft |
| `gel` | Gél stresszlabda | Rugalmas gél töltet, extra lágy tapintás | 1 990 Ft |
| `smiley` | Smiley stresszlabda | Vidám mosolygós minta, tökéletes ajándék | 1 790 Ft |
| `szett` | Antistressz szett (3 db) | Három különböző keménységű labda csomagban | 4 490 Ft |
| `fejleszto` | Fejlesztő labda | Erősebb ellenállás, kézerő fejlesztéshez | 2 490 Ft |

Az árak bruttó fogyasztói árak; a katalógus tartalma az ember által szabadon
módosítható törzsadat.

## 4. Funkcionális követelmények

### F1 — Terméklista és szűrés
- Minden termék kártyán: név, rövid leírás, ár, link a termékoldalra.
- Szűrés **keménység** szerint (puha / közepes / erős) és **ár** szerint
  (növekvő/csökkenő rendezés). *(Javaslat — a brief csak „szűrési
  lehetőségeket" mond; elfogadandó.)*

### F2 — Kosár
- Termék hozzáadása a termékoldalról és a terméklistáról.
- Darabszám módosítható (1–99), tétel törölhető.
- A kosár a böngészőben megmarad az oldal újratöltése után is.
- Összegzés: tételek összege + szállítási költség = fizetendő.

### F3 — Szállítási költség
- **10 000 Ft feletti** (≥ 10 000 Ft tételösszeg) rendelésnél a szállítás ingyenes.
- Alatta fix szállítási díj: **1 490 Ft**. *(Javaslat — a brief nem mondja ki;
  elfogadandó.)*

### F4 — Pénztár és rendelés
- Kötelező mezők: név, e-mail, telefonszám, szállítási cím (irányítószám,
  település, utca-házszám).
- Érvénytelen/hiányzó mező esetén mezőszintű hibaüzenet, a rendelés nem jön létre.
- Sikeres beküldéskor a rendelés eltárolódik (tételek, összegek, vevőadatok,
  időpont), a vevő rendelés-azonosítót és visszaigazoló képernyőt kap.
- Üres kosárral a pénztár nem érhető el.

### F5 — Tartalmi elemek
- Értékajánlatok a főoldalon: gyors szállítás (1–2 munkanap), ingyenes
  kiszállítás 10 000 Ft felett, 14 napos visszaküldés, minőségi anyagok.
- Kapcsolat oldal: info@stresszlabdashop.hu · +36 1 234 5678 · H–P 9:00–17:00.

## 5. Nem-funkcionális követelmények

- Mobil-first, reszponzív (a `DESIGN-GUIDELINE.md` szerint — kitöltése előfeltétel
  az UI-finomhangoláshoz).
- Árformátum: magyar ezres tagolás + „Ft" (pl. `4 490 Ft`).
- Alap-akadálymentesség: címkézett űrlapmezők, fókuszálható vezérlők, alt-szövegek.

## 6. Eldöntött kérdések (ember döntötte el — 2026-07-14)

1. F1 szűrő-dimenziók: keménység (puha/közepes/erős) + ár szerinti rendezés. ✔
2. F3 szállítási díj 10 000 Ft alatt: fix **1 490 Ft**. ✔
3. Termékképek: az MVP-ben placeholder-illusztráció; valódi képek később,
   külön lépésben. ✔
4. Rendelés-tárolás: **Neon Postgres** (`orders` + `order_items`, a `plan.md`
   szerint, a 2. ütemben). ✔
