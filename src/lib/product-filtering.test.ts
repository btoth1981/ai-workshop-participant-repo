import { describe, expect, it } from "vitest";

import { products } from "./catalog";
import {
  filterByFirmness,
  firmnessLabels,
  sortByPrice,
} from "./product-filtering";

describe("filterByFirmness", () => {
  // Scenario A1: no filter selected → all five catalog products are listed.
  it('returns all 5 products for the "all" filter (A1)', () => {
    const result = filterByFirmness(products, "all");
    expect(result).toHaveLength(5);
    expect(result).toEqual(products);
  });

  // Scenario A2: a product matches when its firmness array CONTAINS the
  // selected level — the "szett" bundle carries all three, so it matches
  // every level (spec §3).
  it('keeps exactly klasszikus, gel and szett for "soft" (A2)', () => {
    expect(filterByFirmness(products, "soft").map((p) => p.slug)).toEqual([
      "klasszikus",
      "gel",
      "szett",
    ]);
  });

  it('keeps exactly smiley and szett for "medium" (A2)', () => {
    expect(filterByFirmness(products, "medium").map((p) => p.slug)).toEqual([
      "smiley",
      "szett",
    ]);
  });

  it('keeps exactly szett and fejleszto for "firm" (A2)', () => {
    expect(filterByFirmness(products, "firm").map((p) => p.slug)).toEqual([
      "szett",
      "fejleszto",
    ]);
  });
});

describe("sortByPrice", () => {
  // Scenario A3: ascending price order 1 490 → 4 490 Ft.
  it("sorts ascending: 1490, 1790, 1990, 2490, 4490 (A3)", () => {
    expect(sortByPrice(products, "asc").map((p) => p.priceHuf)).toEqual([
      1_490, 1_790, 1_990, 2_490, 4_490,
    ]);
  });

  it("sorts descending as the exact reverse (A3)", () => {
    expect(sortByPrice(products, "desc").map((p) => p.priceHuf)).toEqual([
      4_490, 2_490, 1_990, 1_790, 1_490,
    ]);
  });

  it("does not mutate the input array (A3)", () => {
    const before = products.map((p) => p.slug);
    sortByPrice(products, "asc");
    sortByPrice(products, "desc");
    expect(products.map((p) => p.slug)).toEqual(before);
  });

  it("keeps catalog order for equal prices (stable sort)", () => {
    const tied = [
      { ...products[0], slug: "first", priceHuf: 1_000 },
      { ...products[1], slug: "second", priceHuf: 1_000 },
    ];
    expect(sortByPrice(tied, "asc").map((p) => p.slug)).toEqual([
      "first",
      "second",
    ]);
    expect(sortByPrice(tied, "desc").map((p) => p.slug)).toEqual([
      "first",
      "second",
    ]);
  });
});

describe("firmnessLabels", () => {
  // The single source of the Hungarian firmness labels (RUG carry-over
  // from T1, recorded on STR-8).
  it("maps soft→puha, medium→közepes, firm→erős", () => {
    expect(firmnessLabels).toEqual({
      soft: "puha",
      medium: "közepes",
      firm: "erős",
    });
  });
});
