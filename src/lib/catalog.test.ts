import { describe, expect, it } from "vitest";

import { getProduct, products } from "./catalog";

// Scenario A1 (data level): the catalog carries the five products of
// docs/spec/spec.md §3 with unique slugs and the exact approved prices.
describe("catalog", () => {
  it("contains exactly the five products of the spec", () => {
    expect(products).toHaveLength(5);
    expect(products.map((p) => p.slug).sort()).toEqual([
      "fejleszto",
      "gel",
      "klasszikus",
      "smiley",
      "szett",
    ]);
  });

  it("has unique slugs", () => {
    const slugs = products.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("carries the approved gross prices in whole HUF", () => {
    const priceBySlug = Object.fromEntries(
      products.map((p) => [p.slug, p.priceHuf]),
    );
    expect(priceBySlug).toEqual({
      klasszikus: 1_490,
      gel: 1_990,
      smiley: 1_790,
      szett: 4_490,
      fejleszto: 2_490,
    });
    for (const product of products) {
      expect(Number.isInteger(product.priceHuf)).toBe(true);
      expect(product.priceHuf).toBeGreaterThan(0);
    }
  });

  it("carries the approved firmness classification (spec §6.5)", () => {
    const firmnessBySlug = Object.fromEntries(
      products.map((p) => [p.slug, p.firmness]),
    );
    expect(firmnessBySlug).toEqual({
      klasszikus: ["soft"],
      gel: ["soft"],
      smiley: ["medium"],
      szett: ["soft", "medium", "firm"],
      fejleszto: ["firm"],
    });
  });

  it("finds a product by slug and returns undefined for unknown slugs", () => {
    expect(getProduct("gel")?.name).toBe("Gél stresszlabda");
    expect(getProduct("nemletezik")).toBeUndefined();
  });
});
