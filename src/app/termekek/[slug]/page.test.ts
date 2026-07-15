import { describe, expect, it } from "vitest";

import { products } from "@/lib/catalog";

import { generateStaticParams } from "./page";

// Scenarios B1/B2 (data level): every catalog product gets a prerendered
// page and nothing else does — unknown slugs fall through to notFound()
// (getProduct's unknown-slug behavior is covered in catalog.test.ts).
describe("product page generateStaticParams", () => {
  it("returns exactly the five catalog slugs", () => {
    const params = generateStaticParams();
    expect(params).toHaveLength(5);
    expect(params.map((p) => p.slug).sort()).toEqual(
      ["fejleszto", "gel", "klasszikus", "smiley", "szett"],
    );
  });

  it("stays in sync with the catalog as the single source of truth", () => {
    expect(generateStaticParams()).toEqual(
      products.map((product) => ({ slug: product.slug })),
    );
  });
});
