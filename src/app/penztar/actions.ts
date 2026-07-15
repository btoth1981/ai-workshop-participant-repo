"use server";

// Checkout Server Action — spec S5/F4, scenarios E1–E4, plan §2–§3.
//
// The client payload carries ONLY product slugs and quantities plus the
// customer fields; every name, unit price and total is recomputed server-side
// from the catalog by buildOrder (E5 + tamper protection, plan §7). Input is
// re-validated here with the same shared rule set the form uses — a Server
// Action is a public POST endpoint, so the client is never trusted.
//
// Payment: none is taken — the order records a cash-on-delivery ("utánvét")
// intent only (spec §2 out-of-scope decision). The orders schema deliberately
// has no payment column, so there is nothing to store; the confirmation page
// communicates the utánvét terms to the buyer.
//
// No module-level environment access: saveOrder reads DATABASE_URL lazily at
// call time, so `next build` succeeds without a configured database.

import { redirect } from "next/navigation";

import {
  CHECKOUT_FIELDS,
  parseCartPayload,
  toCustomer,
  validateCheckout,
  type CheckoutFieldErrors,
  type CheckoutInput,
} from "@/lib/checkout-validation";
import { buildOrder, saveOrder } from "@/lib/orders";

/** Action result consumed by useActionState in the checkout form. */
export type CheckoutState = {
  /** Per-field validation errors (E2–E3); the order was NOT created. */
  fieldErrors?: CheckoutFieldErrors;
  /** Form-level error (unreadable cart or failed write); no order created. */
  formError?: string;
};

export async function submitOrder(
  _prevState: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  const input = Object.fromEntries(
    CHECKOUT_FIELDS.map((field) => [field, String(formData.get(field) ?? "")]),
  ) as CheckoutInput;

  // Server-side re-validation with the shared rule set (E2, E3).
  const fieldErrors = validateCheckout(input);
  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  // Strict payload parse; an empty or malformed cart never becomes an order
  // (E1 server-side backstop — the page-level steering is client UX only).
  const cart = parseCartPayload(formData.get("cart"));
  if (!cart) {
    return {
      formError:
        "A kosár tartalma nem olvasható. Frissítsd az oldalt, és próbáld újra.",
    };
  }

  let orderId: string;
  try {
    // Re-prices every line from the catalog and computes the totals (E5);
    // throws on an unknown slug or an out-of-contract quantity.
    const order = buildOrder(cart, toCustomer(input));
    // Single atomic insert — on failure no order row exists.
    orderId = await saveOrder(order);
  } catch {
    return {
      formError:
        "Nem sikerült rögzíteni a rendelést. Kérjük, próbáld újra kicsit később.",
    };
  }

  // Outside the try block: redirect() throws a control-flow exception that
  // must not be swallowed by the catch above (Next.js server-actions guide).
  redirect(`/penztar/koszonjuk/${orderId}`);
}
