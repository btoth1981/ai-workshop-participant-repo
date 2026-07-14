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

  it("matches the approved spec §3 table exactly (all fields, table order)", () => {
    expect(products).toEqual([
      {
        slug: "klasszikus",
        name: "Klasszikus stresszlabda",
        description: "Puha hab, kézre álló méret, egyszínű",
        priceHuf: 1_490,
        firmness: ["soft"],
      },
      {
        slug: "gel",
        name: "Gél stresszlabda",
        description: "Rugalmas gél töltet, extra lágy tapintás",
        priceHuf: 1_990,
        firmness: ["soft"],
      },
      {
        slug: "smiley",
        name: "Smiley stresszlabda",
        description: "Vidám mosolygós minta, tökéletes ajándék",
        priceHuf: 1_790,
        firmness: ["medium"],
      },
      {
        slug: "szett",
        name: "Antistressz szett (3 db)",
        description: "Három különböző keménységű labda csomagban",
        priceHuf: 4_490,
        firmness: ["soft", "medium", "firm"],
      },
      {
        slug: "fejleszto",
        name: "Fejlesztő labda",
        description: "Erősebb ellenállás, kézerő fejlesztéshez",
        priceHuf: 2_490,
        firmness: ["firm"],
      },
    ]);
  });

  it("keeps every price a positive whole HUF integer", () => {
    for (const product of products) {
      expect(Number.isInteger(product.priceHuf)).toBe(true);
      expect(product.priceHuf).toBeGreaterThan(0);
    }
  });

  it("finds a product by slug and returns undefined for unknown slugs", () => {
    expect(getProduct("gel")?.name).toBe("Gél stresszlabda");
    expect(getProduct("nemletezik")).toBeUndefined();
  });
});
