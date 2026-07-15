import { describe, expect, it } from "vitest";

import {
  type Cart,
  cartSubtotal,
  MAX_QUANTITY,
  MIN_QUANTITY,
  orderTotal,
  SHIPPING_FEE_HUF,
  shippingFee,
} from "./cart";
import { getProduct } from "./catalog";
import { buildOrder, type Customer } from "./orders";

// Scenario coverage: E5 of docs/spec/given-when-then.md (the order captures
// submission-time names and prices) at UNIT level, per the human decision of
// 2026-07-15 — saveOrder (the IO half) is exercised by live-branch
// integration tests in a recorded follow-up, not here.
//
// E5's change-resistance is guaranteed by construction: CartItem carries no
// price or name, so buildOrder can only take them from the catalog at the
// moment it runs. The tests assert that the captured values equal the current
// catalog values and are stored per item; once persisted, a later catalog
// edit has nothing to overwrite.

const customer: Customer = {
  name: "Teszt Elek",
  email: "teszt.elek@example.com",
  phone: "+36 30 123 4567",
  postalCode: "1111",
  city: "Budapest",
  street: "Minta utca 1.",
};

describe("buildOrder — E5: submission-time snapshot", () => {
  it("captures product name and unit price from the catalog for every item", () => {
    const cart: Cart = [
      { slug: "gel", quantity: 1 },
      { slug: "szett", quantity: 2 },
    ];
    const order = buildOrder(cart, customer);

    expect(order.items).toEqual([
      {
        productSlug: "gel",
        productName: "Gél stresszlabda",
        unitPriceHuf: 1_990,
        quantity: 1,
      },
      {
        productSlug: "szett",
        productName: "Antistressz szett (3 db)",
        unitPriceHuf: 4_490,
        quantity: 2,
      },
    ]);

    // The snapshot is exactly the catalog at submission time — each item
    // stores its own name and unit price (order_items columns, E5).
    for (const item of order.items) {
      const product = getProduct(item.productSlug);
      expect(item.productName).toBe(product?.name);
      expect(item.unitPriceHuf).toBe(product?.priceHuf);
    }
  });

  it("takes prices only from the catalog — cart items cannot carry a price", () => {
    // Tamper protection by construction: even a cart line with an injected
    // "price" field cannot influence the order — buildOrder never reads it.
    const tampered = [
      { slug: "klasszikus", quantity: 1, priceHuf: 1 },
    ] as unknown as Cart;
    const order = buildOrder(tampered, customer);
    expect(order.items[0].unitPriceHuf).toBe(1_490);
    expect(order.subtotalHuf).toBe(1_490);
  });

  it("captures the customer details verbatim", () => {
    const order = buildOrder([{ slug: "gel", quantity: 1 }], customer);
    expect(order.customer).toEqual(customer);
  });
});

describe("buildOrder — totals consistent with cart.ts", () => {
  it("below the free-shipping threshold: subtotal + flat fee", () => {
    const cart: Cart = [{ slug: "klasszikus", quantity: 2 }]; // 2 980 Ft
    const order = buildOrder(cart, customer);

    expect(order.subtotalHuf).toBe(cartSubtotal(cart));
    expect(order.subtotalHuf).toBe(2_980);
    expect(order.shippingHuf).toBe(SHIPPING_FEE_HUF);
    expect(order.totalHuf).toBe(2_980 + SHIPPING_FEE_HUF);
  });

  it("at/above the threshold: shipping is free (D2/D3 rule via shippingFee)", () => {
    const cart: Cart = [{ slug: "szett", quantity: 3 }]; // 13 470 Ft
    const order = buildOrder(cart, customer);

    expect(order.subtotalHuf).toBe(13_470);
    expect(order.shippingHuf).toBe(0);
    expect(order.totalHuf).toBe(13_470);
  });

  it("delegates to the cart.ts pricing functions (no duplicated rules)", () => {
    const cart: Cart = [
      { slug: "fejleszto", quantity: 3 },
      { slug: "smiley", quantity: 1 },
    ];
    const order = buildOrder(cart, customer);

    expect(order.subtotalHuf).toBe(cartSubtotal(cart));
    expect(order.shippingHuf).toBe(shippingFee(order.subtotalHuf));
    expect(order.totalHuf).toBe(orderTotal(order.subtotalHuf));
  });
});

describe("buildOrder — validation", () => {
  it("throws on an empty cart (E1 backstop: no order without items)", () => {
    expect(() => buildOrder([], customer)).toThrow(/empty cart/i);
  });

  it("throws on an unknown product slug", () => {
    const corrupt: Cart = [{ slug: "nemletezik", quantity: 1 }];
    expect(() => buildOrder(corrupt, customer)).toThrow(
      /unknown product slug/i,
    );
  });

  it("accepts the exact quantity bounds shared with cart.ts", () => {
    const cart: Cart = [
      { slug: "klasszikus", quantity: MIN_QUANTITY },
      { slug: "gel", quantity: MAX_QUANTITY },
    ];
    const order = buildOrder(cart, customer);
    expect(order.items[0].quantity).toBe(MIN_QUANTITY);
    expect(order.items[1].quantity).toBe(MAX_QUANTITY);
  });

  it("throws on out-of-bounds quantities (corrupt cart state, like cart.ts fail-loud policy)", () => {
    // cart.ts clamps raw user input, but a Cart value violating the CartItem
    // contract at checkout is corrupt/tampered state → fail loud, matching
    // the DB CHECK (quantity BETWEEN 1 AND 99).
    expect(() =>
      buildOrder([{ slug: "gel", quantity: MIN_QUANTITY - 1 }], customer),
    ).toThrow(RangeError);
    expect(() =>
      buildOrder([{ slug: "gel", quantity: MAX_QUANTITY + 1 }], customer),
    ).toThrow(RangeError);
  });

  it("throws on a non-integer quantity (programming error, same as cart.ts)", () => {
    expect(() =>
      buildOrder([{ slug: "gel", quantity: 1.5 }], customer),
    ).toThrow(TypeError);
  });
});
