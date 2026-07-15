// Cart persistence codec — pure string↔Cart conversion for localStorage
// (spec F2 "the cart survives a page reload", scenario C4 at the data level).
//
// Deliberately DOM-free: this module takes and returns strings only, so it is
// unit-testable in the plain node Vitest environment. The actual localStorage
// calls live in cart-provider.tsx.
//
// Parsing is forgiving where cart.ts is strict: persisted data is untrusted
// input (stale after catalog changes, hand-edited, or corrupted), so instead
// of throwing we repair — unknown slugs are dropped, quantities are
// normalized to cart.ts's clamp semantics (integer in [1, 99]), and anything
// unreadable degrades to an empty cart. The parsed result therefore always
// satisfies the Cart contract that cart.ts enforces.

import { MAX_QUANTITY, MIN_QUANTITY, type Cart, type CartItem } from "./cart";
import { getProduct } from "./catalog";

/** localStorage key; versioned so a future format change can start fresh. */
export const CART_STORAGE_KEY = "stresszlabda-shop.cart.v1";

export function serializeCart(cart: Cart): string {
  return JSON.stringify(cart);
}

/**
 * Parses a persisted cart string (or null, when nothing is stored yet) into
 * a valid Cart. Never throws; invalid lines are dropped, salvageable
 * quantities are clamped to [MIN_QUANTITY, MAX_QUANTITY].
 */
export function parseCart(raw: string | null): Cart {
  if (raw === null) {
    return [];
  }

  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return []; // corrupt JSON → empty cart
  }
  if (!Array.isArray(data)) {
    return [];
  }

  const items: CartItem[] = [];
  const seen = new Set<string>();
  for (const entry of data) {
    const item = parseLine(entry);
    if (item && !seen.has(item.slug)) {
      seen.add(item.slug); // duplicate slugs: first line wins
      items.push(item);
    }
  }
  return items;
}

// A line survives only if its slug names a real catalog product and its
// quantity is a finite number. Fractional quantities are truncated toward
// zero, then clamped — mirroring cart.ts, where clamping is the policy for
// out-of-range values and only genuine non-numbers are beyond repair.
function parseLine(entry: unknown): CartItem | null {
  if (typeof entry !== "object" || entry === null) {
    return null;
  }
  const { slug, quantity } = entry as { slug?: unknown; quantity?: unknown };
  if (typeof slug !== "string" || !getProduct(slug)) {
    return null;
  }
  if (typeof quantity !== "number" || !Number.isFinite(quantity)) {
    return null;
  }
  const normalized = Math.min(
    Math.max(Math.trunc(quantity), MIN_QUANTITY),
    MAX_QUANTITY,
  );
  return { slug, quantity: normalized };
}
