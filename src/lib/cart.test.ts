import { describe, expect, it } from "vitest";

import {
  addItem,
  Cart,
  cartSubtotal,
  MAX_QUANTITY,
  orderTotal,
  removeItem,
  setQuantity,
  shippingFee,
} from "./cart";

// Scenario coverage: C1–C3 (cart operations) and D1–D3 (shipping rule) of
// docs/spec/given-when-then.md, plus the edge cases required by
// docs/engineering-standards.md (boundaries, failures).
//
// Note on D1/D2: every catalog price is a multiple of 10, so a 9 999 Ft
// subtotal cannot be built from real cart contents — those scenarios
// exercise shippingFee/orderTotal directly on the subtotal value, exactly
// as plan §3 prescribes for the pure shipping rule.

describe("addItem", () => {
  it("C1: adding klasszikus to an empty cart yields 1 line, qty 1, subtotal 1 490", () => {
    const cart = addItem([], "klasszikus");
    expect(cart).toEqual([{ slug: "klasszikus", quantity: 1 }]);
    expect(cartSubtotal(cart)).toBe(1_490);
  });

  it("increments the existing line instead of adding a duplicate", () => {
    const cart = addItem(addItem([], "klasszikus"), "klasszikus");
    expect(cart).toEqual([{ slug: "klasszikus", quantity: 2 }]);
  });

  it("caps the incremented quantity at 99", () => {
    const cart: Cart = [{ slug: "gel", quantity: MAX_QUANTITY }];
    expect(addItem(cart, "gel")).toEqual([
      { slug: "gel", quantity: MAX_QUANTITY },
    ]);
  });

  it("throws on a slug that is not in the catalog", () => {
    expect(() => addItem([], "nemletezik")).toThrow(/unknown product slug/i);
  });

  it("returns a new array and leaves the input cart untouched", () => {
    const before: Cart = [{ slug: "gel", quantity: 1 }];
    const after = addItem(before, "gel");
    expect(after).not.toBe(before);
    expect(before).toEqual([{ slug: "gel", quantity: 1 }]);
  });
});

describe("setQuantity", () => {
  it("C2: setting klasszikus from 1 to 3 makes the subtotal 4 470", () => {
    const cart = setQuantity(addItem([], "klasszikus"), "klasszikus", 3);
    expect(cart).toEqual([{ slug: "klasszikus", quantity: 3 }]);
    expect(cartSubtotal(cart)).toBe(4_470);
  });

  it("clamps below-range quantities up to 1", () => {
    const cart: Cart = [{ slug: "gel", quantity: 5 }];
    expect(setQuantity(cart, "gel", 0)).toEqual([{ slug: "gel", quantity: 1 }]);
    expect(setQuantity(cart, "gel", -7)).toEqual([
      { slug: "gel", quantity: 1 },
    ]);
  });

  it("clamps above-range quantities down to 99", () => {
    const cart: Cart = [{ slug: "gel", quantity: 5 }];
    expect(setQuantity(cart, "gel", 150)).toEqual([
      { slug: "gel", quantity: 99 },
    ]);
  });

  it("accepts the exact bounds 1 and 99", () => {
    const cart: Cart = [{ slug: "gel", quantity: 5 }];
    expect(setQuantity(cart, "gel", 1)).toEqual([{ slug: "gel", quantity: 1 }]);
    expect(setQuantity(cart, "gel", 99)).toEqual([
      { slug: "gel", quantity: 99 },
    ]);
  });

  it("throws on a non-integer quantity (programming error, not user input)", () => {
    const cart: Cart = [{ slug: "gel", quantity: 5 }];
    expect(() => setQuantity(cart, "gel", 2.5)).toThrow(TypeError);
  });

  it("throws when the slug is not a line in the cart", () => {
    expect(() => setQuantity([], "gel", 2)).toThrow(/not in the cart/i);
  });

  it("returns a new array and leaves the input cart untouched", () => {
    const before: Cart = [{ slug: "gel", quantity: 1 }];
    const after = setQuantity(before, "gel", 4);
    expect(after).not.toBe(before);
    expect(before).toEqual([{ slug: "gel", quantity: 1 }]);
  });
});

describe("removeItem", () => {
  it("C3: with two different lines, removing one keeps only the other and totals recompute", () => {
    const cart = addItem(addItem([], "klasszikus"), "gel");
    expect(cartSubtotal(cart)).toBe(1_490 + 1_990);

    const remaining = removeItem(cart, "klasszikus");
    expect(remaining).toEqual([{ slug: "gel", quantity: 1 }]);
    expect(cartSubtotal(remaining)).toBe(1_990);
    expect(orderTotal(cartSubtotal(remaining))).toBe(1_990 + 1_490);
  });

  it("is a no-op for a slug that is not in the cart", () => {
    const cart: Cart = [{ slug: "gel", quantity: 1 }];
    expect(removeItem(cart, "klasszikus")).toEqual(cart);
  });

  it("returns a new array and leaves the input cart untouched", () => {
    const before: Cart = [{ slug: "gel", quantity: 1 }];
    removeItem(before, "gel");
    expect(before).toEqual([{ slug: "gel", quantity: 1 }]);
  });
});

describe("cartSubtotal", () => {
  it("is 0 for an empty cart", () => {
    expect(cartSubtotal([])).toBe(0);
  });

  it("uses catalog prices only — an unknown slug in the cart throws", () => {
    const corrupt: Cart = [{ slug: "nemletezik", quantity: 1 }];
    expect(() => cartSubtotal(corrupt)).toThrow(/unknown product slug/i);
  });
});

describe("shipping rule (F3)", () => {
  it("D1: subtotal 9 999 → shipping 1 490, total 11 489", () => {
    expect(shippingFee(9_999)).toBe(1_490);
    expect(orderTotal(9_999)).toBe(11_489);
  });

  it("D2: subtotal exactly 10 000 → shipping 0, total 10 000 (boundary)", () => {
    expect(shippingFee(10_000)).toBe(0);
    expect(orderTotal(10_000)).toBe(10_000);
  });

  it("D3: 3 × szett = 13 470 → shipping free, total 13 470", () => {
    const cart = setQuantity(addItem([], "szett"), "szett", 3);
    const subtotal = cartSubtotal(cart);
    expect(subtotal).toBe(13_470);
    expect(shippingFee(subtotal)).toBe(0);
    expect(orderTotal(subtotal)).toBe(13_470);
  });
});
