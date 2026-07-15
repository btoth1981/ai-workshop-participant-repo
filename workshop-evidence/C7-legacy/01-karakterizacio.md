# C7 – Karakterizációs futások és mutációs próba

STATUS: VERIFIED · SOURCE_SHA (participant repo): 30649ba · LABOR:
toolkit/legacy-playbook/sample másolata a scratchpadban (a közös forrás
érintetlen) · KÖRNYEZET: .NET SDK 10.0.302 (a C7-hez telepítve, emberi
jóváhagyással) · RUN_DATE: 2026-07-15

## A vizsgált legacy kód

`LegacyShop.OrderTotalsService.BuildMonthlyStatement` — szándékosan romlott
minta: adatelérés + üzleti szabályok + formázás egy metódusban; rejtett
statikus cache; mágikus szabályok (5+ db → 10% csoportkedvezmény; TAVASZ10
kupon → −1000 Ft; negatív sor → 0); hűség-kedvezmény a MAI naptól számítva
(rejtett óra); ÁFA inline (×1,27); kultúrafüggő kimenet. SQL-iker:
`usp_CalculateOrderTotals.sql` (cursor + temp tábla + GETDATE).

## 1. Három karakterizációs eredmény (parancs: dotnet test)

Baseline: **Passed! Failed: 0, Passed: 3, Total: 3**

| # | Teszt | Mit pinel |
|---|---|---|
| 1 | PlainOrder_NewCustomer | sima rendelés, kedvezmények nélkül (12 000 + 2×3 500) |
| 2 | GroupDiscountAndCoupon_LoyalCustomer | 5 db → −10%, TAVASZ10 → −1000, 3+ éves hűség → −2%, ÁFA; Nettó 34 300 / Bruttó 43 561 Ft |
| 3 | CouponBelowZero_ClampsToZero | kupon a sorösszeg alá vinné → 0-ra vágás |

A determinizmus kulcsai (a tesztek így kezelik a csapdákat): a hűség-év a MAI
évhez képest relatívan horgonyzott (rejtett óra); a kultúra hu-HU-ra fixált;
a teszt-ügyfél-ID-k különbözőek (a statikus cache miatt).

## 2. Mutációs próba (a védőháló bizonyító ereje)

- Beavatkozás: `0.9m` → `0.85m` (csoportkedvezmény mágikus száma) a
  scratchpad-másolatban.
- Eredmény: **Failed: 1, Passed: 2** — PONTOSAN a
  `GroupDiscountAndCoupon_LoyalCustomer` snapshot bukott, bájtpontos diff-fel:

```
- Netto: 34 300 Ft        + Netto: 32 340 Ft
- Brutto: 43 561 Ft       + Brutto: 41 072 Ft
```

- A snapshot nevén nevezte az eltört viselkedést (a másik két szcenárió zöld
  maradt — a bukás lokalizált és beszédes).
- Visszaállítás után: **Passed: 3/3** — a munkapéldány ismét a pinelt
  viselkedést adja.

## Következtetés

A karakterizációs háló kész és bizonyítottan fog: bármely szándékolatlan
viselkedésváltozás névvel és számszerű diff-fel bukik meg. Refaktor/modernizáció
CSAK e háló mögött indulhat — a belépési terv: `legacy-entry-plan.md`.
