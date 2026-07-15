import { describe, expect, it } from "vitest";

import { type Cart } from "./cart";
import { CART_STORAGE_KEY, parseCart, serializeCart } from "./cart-storage";

// Scenario coverage: C4 (cart survives a reload) at the data level — the
// serialize→parse round trip is exactly what a reload does to the cart.
// The DOM side (provider reading/writing localStorage) stays untested here;
// DOM-level tests are deferred by recorded human decision (plan §5).

describe("serializeCart / parseCart round trip", () => {
  it("C4: a serialized cart parses back unchanged", () => {
    const cart: Cart = [
      { slug: "klasszikus", quantity: 2 },
      { slug: "szett", quantity: 99 },
    ];
    expect(parseCart(serializeCart(cart))).toEqual(cart);
  });

  it("round-trips the empty cart", () => {
    expect(parseCart(serializeCart([]))).toEqual([]);
  });
});

describe("parseCart tolerance", () => {
  it("returns an empty cart when nothing is stored (null)", () => {
    expect(parseCart(null)).toEqual([]);
  });

  it("returns an empty cart for corrupt JSON", () => {
    expect(parseCart("{not json")).toEqual([]);
    expect(parseCart("")).toEqual([]);
  });

  it("returns an empty cart for valid JSON that is not an array", () => {
    expect(parseCart('{"slug":"gel","quantity":1}')).toEqual([]);
    expect(parseCart('"gel"')).toEqual([]);
    expect(parseCart("42")).toEqual([]);
    expect(parseCart("null")).toEqual([]);
  });

  it("drops lines whose slug is not in the catalog, keeps the rest", () => {
    const raw = JSON.stringify([
      { slug: "nemletezik", quantity: 3 },
      { slug: "gel", quantity: 1 },
    ]);
    expect(parseCart(raw)).toEqual([{ slug: "gel", quantity: 1 }]);
  });

  it("drops malformed lines (non-objects, missing/invalid fields)", () => {
    const raw = JSON.stringify([
      "gel",
      null,
      { quantity: 2 },
      { slug: "gel" },
      { slug: 5, quantity: 2 },
      { slug: "gel", quantity: "2" },
      { slug: "klasszikus", quantity: 1 },
    ]);
    expect(parseCart(raw)).toEqual([{ slug: "klasszikus", quantity: 1 }]);
  });
});

describe("parseCart quantity normalization (cart.ts clamp semantics)", () => {
  it("clamps out-of-range quantities into [1, 99]", () => {
    const raw = JSON.stringify([
      { slug: "gel", quantity: 0 },
      { slug: "klasszikus", quantity: -5 },
      { slug: "szett", quantity: 150 },
    ]);
    expect(parseCart(raw)).toEqual([
      { slug: "gel", quantity: 1 },
      { slug: "klasszikus", quantity: 1 },
      { slug: "szett", quantity: 99 },
    ]);
  });

  it("keeps the exact bounds 1 and 99", () => {
    const raw = JSON.stringify([
      { slug: "gel", quantity: 1 },
      { slug: "szett", quantity: 99 },
    ]);
    expect(parseCart(raw)).toEqual([
      { slug: "gel", quantity: 1 },
      { slug: "szett", quantity: 99 },
    ]);
  });

  it("truncates fractional quantities, then clamps", () => {
    const raw = JSON.stringify([
      { slug: "gel", quantity: 2.7 },
      { slug: "klasszikus", quantity: 0.4 },
    ]);
    expect(parseCart(raw)).toEqual([
      { slug: "gel", quantity: 2 },
      { slug: "klasszikus", quantity: 1 },
    ]);
  });

  it("drops non-finite numeric quantities (NaN/Infinity are not repairable)", () => {
    // JSON cannot encode NaN/Infinity directly; a hand-crafted string can
    // still smuggle them in as null via JSON.stringify, so build raw by hand.
    const raw = '[{"slug":"gel","quantity":null}]';
    expect(parseCart(raw)).toEqual([]);
  });
});

describe("parseCart shape guarantees", () => {
  it("keeps only the first line of a duplicated slug", () => {
    const raw = JSON.stringify([
      { slug: "gel", quantity: 2 },
      { slug: "gel", quantity: 7 },
    ]);
    expect(parseCart(raw)).toEqual([{ slug: "gel", quantity: 2 }]);
  });

  it("strips unknown extra properties from stored lines", () => {
    const raw = JSON.stringify([
      { slug: "gel", quantity: 2, priceHuf: 1, injected: true },
    ]);
    expect(parseCart(raw)).toEqual([{ slug: "gel", quantity: 2 }]);
  });
});

describe("CART_STORAGE_KEY", () => {
  it("is versioned so a format change can start from a clean key", () => {
    expect(CART_STORAGE_KEY).toMatch(/\.v\d+$/);
  });
});
