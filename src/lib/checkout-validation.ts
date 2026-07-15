// Checkout validation — spec F4, scenarios E1–E3, plan §3.
//
// PURE and DOM-free: this single rule set is shared by the checkout form
// (instant field errors on the client) and the /penztar Server Action
// (authoritative re-validation — the server never trusts the client). Plain
// validator functions, no validation library (constitution principle 3).
//
// Only type-only imports from orders.ts/cart.ts are allowed here: the module
// is bundled into the client, and a value import of orders.ts would drag the
// database driver along.

import type { Cart, CartItem } from "./cart";
import type { Customer } from "./orders";

/** The checkout form fields — one per Customer property (spec F4). */
export const CHECKOUT_FIELDS = [
  "name",
  "email",
  "phone",
  "postalCode",
  "city",
  "street",
] as const;

export type CheckoutField = (typeof CHECKOUT_FIELDS)[number];

/** Raw, unvalidated form values (e.g. straight out of FormData). */
export type CheckoutInput = Record<CheckoutField, string>;

/** Field-level Hungarian error messages; a missing key means the field is valid. */
export type CheckoutFieldErrors = Partial<Record<CheckoutField, string>>;

const REQUIRED_MESSAGES: Record<CheckoutField, string> = {
  name: "Add meg a neved.",
  email: "Add meg az e-mail-címed.",
  phone: "Add meg a telefonszámod.",
  postalCode: "Add meg az irányítószámot.",
  city: "Add meg a települést.",
  street: "Add meg az utcát és a házszámot.",
};

export const INVALID_EMAIL_MESSAGE = "Érvénytelen e-mail-cím formátum.";

// Deliberately simple format check (something@something.tld, no whitespace) —
// enough to reject typos like "nem-email" (E3) without a library. The real
// proof of an address is the confirmation e-mail, which is out of scope.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates a single field value; returns the Hungarian error message or
 * undefined when valid. Whitespace-only input counts as missing.
 */
export function validateCheckoutField(
  field: CheckoutField,
  value: string,
): string | undefined {
  const trimmed = value.trim();
  if (trimmed === "") {
    return REQUIRED_MESSAGES[field];
  }
  if (field === "email" && !EMAIL_PATTERN.test(trimmed)) {
    return INVALID_EMAIL_MESSAGE;
  }
  return undefined;
}

/** Validates the whole form; an empty result object means "valid" (E2–E3). */
export function validateCheckout(input: CheckoutInput): CheckoutFieldErrors {
  const errors: CheckoutFieldErrors = {};
  for (const field of CHECKOUT_FIELDS) {
    const error = validateCheckoutField(field, input[field]);
    if (error) {
      errors[field] = error;
    }
  }
  return errors;
}

/** Builds the Customer for buildOrder from already-validated input (trims). */
export function toCustomer(input: CheckoutInput): Customer {
  return {
    name: input.name.trim(),
    email: input.email.trim(),
    phone: input.phone.trim(),
    postalCode: input.postalCode.trim(),
    city: input.city.trim(),
    street: input.street.trim(),
  };
}

/**
 * Parses the hidden "cart" form field (JSON array of {slug, quantity}) into
 * a Cart. STRICT, unlike cart-storage's forgiving parseCart: this payload was
 * produced by our own form moments earlier, so anything malformed or empty is
 * tampering or a bug — reject with null instead of repairing (E1 backstop on
 * the server: an empty payload can never become an order). Only slug and
 * quantity are copied — injected extra fields (e.g. a price) are dropped.
 * Catalog membership and quantity bounds are enforced by buildOrder.
 */
export function parseCartPayload(raw: unknown): Cart | null {
  if (typeof raw !== "string") {
    return null;
  }
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!Array.isArray(data) || data.length === 0) {
    return null;
  }

  const items: CartItem[] = [];
  for (const entry of data) {
    if (typeof entry !== "object" || entry === null) {
      return null;
    }
    const { slug, quantity } = entry as { slug?: unknown; quantity?: unknown };
    if (typeof slug !== "string" || slug === "") {
      return null;
    }
    if (typeof quantity !== "number" || !Number.isInteger(quantity)) {
      return null;
    }
    items.push({ slug, quantity });
  }
  return items;
}
