# Given–When–Then — Stresszlabda Webshop

> Státusz: **ELFOGADVA — 2026-07-14, btoth** · A `spec.md` követelményeinek
> elfogadási szcenáriói. Minden szcenárió gépileg ellenőrizhető viselkedést ír le;
> az implementációs tasknak legalább a saját szcenárióit teszttel kell lefednie.

## A. Terméklista (F1)

**A1 — Minden termék látszik**
- Given: a katalógusban 5 termék van
- When: a látogató a Termékek oldalra navigál
- Then: mind az 5 termék megjelenik névvel, árral és termékoldal-linkkel

**A2 — Szűrés keménységre**
- Given: a Termékek oldalon vagyok
- When: a „puha" keménység-szűrőt választom
- Then: csak a puha besorolású termékek látszanak, a többi nem

**A3 — Rendezés árra**
- Given: a Termékek oldalon vagyok
- When: „ár szerint növekvő" rendezést választok
- Then: a termékek 1 490 → 4 490 Ft sorrendben jelennek meg

## B. Termékoldal (S3)

**B1 — Termék részletei**
- Given: a katalógusban létezik a `gel` termék
- When: a `/termekek/gel` oldalra navigálok
- Then: látom a nevét, teljes leírását, árát (`1 990 Ft`) és a „Kosárba" gombot

**B2 — Ismeretlen termék**
- Given: nincs `nemletezik` slugú termék
- When: a `/termekek/nemletezik` oldalra navigálok
- Then: 404-es „nem található" oldalt kapok

## C. Kosár (F2)

**C1 — Hozzáadás**
- Given: üres a kosaram
- When: a Klasszikus stresszlabdát a kosárba teszem
- Then: a kosárban 1 tétel van, 1 db, tételösszeg 1 490 Ft

**C2 — Darabszám növelése**
- Given: a kosaramban 1 db Klasszikus stresszlabda van
- When: a darabszámot 3-ra állítom
- Then: a tételösszeg 4 470 Ft

**C3 — Tétel törlése**
- Given: a kosaramban 2 különböző tétel van
- When: az egyiket törlöm
- Then: csak a másik marad, az összegzés újraszámolódik

**C4 — Kosár megmarad újratöltés után**
- Given: a kosaramban tételek vannak
- When: újratöltöm az oldalt
- Then: a kosár tartalma változatlan

## D. Szállítási költség (F3)

**D1 — Díjköteles rendelés**
- Given: a kosár tételösszege 9 999 Ft
- When: megnézem az összegzést
- Then: szállítási költség 1 490 Ft, fizetendő 11 489 Ft

**D2 — Ingyenes szállítás határa (pontosan a küszöbön)**
- Given: a kosár tételösszege pontosan 10 000 Ft
- When: megnézem az összegzést
- Then: a szállítás ingyenes (0 Ft), fizetendő 10 000 Ft

**D3 — Küszöb felett**
- Given: a kosár tételösszege 13 470 Ft (3 × Antistressz szett)
- When: megnézem az összegzést
- Then: a szállítás ingyenes, fizetendő 13 470 Ft

## E. Pénztár és rendelés (F4)

**E1 — Üres kosárral nincs pénztár**
- Given: üres a kosaram
- When: a pénztár oldalra próbálok lépni
- Then: nem indul rendelés; a kosár/terméklista felé terel az oldal

**E2 — Hiányzó kötelező mező**
- Given: a pénztárban vagyok kitöltetlen e-mail mezővel
- When: beküldöm az űrlapot
- Then: mezőszintű hibaüzenetet kapok, rendelés nem jön létre

**E3 — Érvénytelen e-mail**
- Given: a pénztárban az e-mail mező értéke `nem-email`
- When: beküldöm az űrlapot
- Then: az e-mail mezőnél hibaüzenet, rendelés nem jön létre

**E4 — Sikeres rendelés**
- Given: a kosaramban 1 db Gél stresszlabda van, és minden kötelező mezőt
  érvényesen kitöltöttem
- When: beküldöm az űrlapot
- Then: a rendelés tárolódik (tételek, összegek, vevőadatok, időpont),
  rendelés-azonosítót kapok, visszaigazoló képernyő jelenik meg, a kosár kiürül

**E5 — A rendelés a beküldéskori árakat rögzíti**
- Given: sikeres rendelést adtam le
- When: a katalógusban később árat módosítanak
- Then: a tárolt rendelés összegei változatlanok

## F. Tartalom (F5)

**F1 — Értékajánlatok a főoldalon**
- Given: a főoldalon vagyok
- When: betölt az oldal
- Then: látszik a 4 értékajánlat (1–2 munkanap, ingyenes kiszállítás 10 000 Ft
  felett, 14 napos visszaküldés, minőségi anyagok)

**F2 — Kapcsolat**
- Given: a Kapcsolat oldalon vagyok
- When: betölt az oldal
- Then: látszik az e-mail, a telefonszám és a nyitvatartás
