// Cart logic — pure functions over an immutable cart value (spec F2/F3,
// docs/spec/plan.md §3). The cart is a plain readonly array; every operation
// returns a new array and never mutates its input, so the value can live in
// React state / localStorage without surprises.
//
// Money is whole HUF integers throughout (plan §3 — no floating-point money).
// Prices always come from the catalog (src/lib/catalog.ts); caller-provided
// prices are never trusted (plan §7 — manipulation protection, scenario E5).

import { getProduct } from "./catalog";

export type CartItem = {
  readonly slug: string;
  /** Always an integer within [MIN_QUANTITY, MAX_QUANTITY]. */
  readonly quantity: number;
};

export type Cart = readonly CartItem[];

/** Quantity bounds per spec F2 ("darabszám 1–99"). */
export const MIN_QUANTITY = 1;
export const MAX_QUANTITY = 99;

/** Free shipping at or above this subtotal (spec F3, scenario D2 boundary). */
export const FREE_SHIPPING_THRESHOLD_HUF = 10_000;
/** Flat shipping fee below the threshold (spec F3, decided 2026-07-14). */
export const SHIPPING_FEE_HUF = 1_490;

// Unknown slug policy: THROW. A slug that is not in the catalog means the
// cart state is corrupt (stale localStorage, tampering, or a coding bug) —
// silently ignoring it would let a wrong subtotal reach the order. Fail loud.
function requireProduct(slug: string) {
  const product = getProduct(slug);
  if (!product) {
    throw new Error(`Unknown product slug in cart operation: "${slug}"`);
  }
  return product;
}

// Out-of-range quantity policy: CLAMP to [1, 99]. Out-of-range values are
// expected *user input* (typing "0" or "150" into a quantity field, or
// clicking "+" at 99), not a programming error — clamping keeps the cart in
// a valid state without forcing every UI call site to pre-validate. A
// non-integer quantity, by contrast, IS a programming error (money and
// quantities are integers by contract), so that throws.
function clampQuantity(quantity: number): number {
  if (!Number.isInteger(quantity)) {
    throw new TypeError(`Quantity must be an integer, got ${quantity}`);
  }
  return Math.min(Math.max(quantity, MIN_QUANTITY), MAX_QUANTITY);
}

/**
 * Adds one unit of the product to the cart. An existing line is incremented
 * (capped at MAX_QUANTITY); otherwise a new line with quantity 1 is appended.
 */
export function addItem(cart: Cart, slug: string): Cart {
  requireProduct(slug);
  const existing = cart.find((item) => item.slug === slug);
  if (!existing) {
    return [...cart, { slug, quantity: 1 }];
  }
  return cart.map((item) =>
    item.slug === slug
      ? { ...item, quantity: clampQuantity(item.quantity + 1) }
      : item,
  );
}

/**
 * Sets the quantity of an existing cart line, clamped to [1, 99].
 * Throws if the slug is not in the cart — callers set quantities on lines
 * the user can see, so a missing line is a bug, not user input.
 */
export function setQuantity(cart: Cart, slug: string, quantity: number): Cart {
  if (!cart.some((item) => item.slug === slug)) {
    throw new Error(`Cannot set quantity: "${slug}" is not in the cart`);
  }
  const clamped = clampQuantity(quantity);
  return cart.map((item) =>
    item.slug === slug ? { ...item, quantity: clamped } : item,
  );
}

/**
 * Removes a line from the cart. Removing a slug that is not present is a
 * no-op (idempotent delete — a double click on "remove" must not blow up).
 */
export function removeItem(cart: Cart, slug: string): Cart {
  return cart.filter((item) => item.slug !== slug);
}

/**
 * Sum of line totals in whole HUF. Prices are looked up in the catalog;
 * an unknown slug throws (see requireProduct). Empty cart → 0.
 */
export function cartSubtotal(cart: Cart): number {
  return cart.reduce(
    (sum, item) => sum + requireProduct(item.slug).priceHuf * item.quantity,
    0,
  );
}

/** Shipping rule (spec F3): free at/above the threshold, flat fee below. */
export function shippingFee(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_THRESHOLD_HUF ? 0 : SHIPPING_FEE_HUF;
}

/** Amount payable: subtotal plus the shipping fee derived from it. */
export function orderTotal(subtotal: number): number {
  return subtotal + shippingFee(subtotal);
}
