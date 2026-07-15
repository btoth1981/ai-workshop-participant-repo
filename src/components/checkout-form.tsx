"use client";

import Link from "next/link";
import { useActionState, useState } from "react";

import { submitOrder, type CheckoutState } from "@/app/penztar/actions";
import { useCart } from "@/components/cart-provider";
import { OrderSummary } from "@/components/order-summary";
import { Button, buttonVariants } from "@/components/ui/button";
import { serializeCart } from "@/lib/cart-storage";
import {
  CHECKOUT_FIELDS,
  validateCheckout,
  validateCheckoutField,
  type CheckoutField,
  type CheckoutFieldErrors,
  type CheckoutInput,
} from "@/lib/checkout-validation";

// Checkout form (spec S5/F4, scenarios E1–E4): shipping-details form that
// submits to the submitOrder Server Action via useActionState (per the
// installed Next.js forms guide). Client and server validate with the SAME
// shared rule set from checkout-validation.ts — the client for instant field
// errors, the server authoritatively. The cart travels as a hidden JSON field
// of slugs + quantities only; all pricing happens server-side (E5).
//
// E1: with an empty cart no form is offered — the page steers to the cart /
// product list instead. The cart lives in client state, so the check runs
// here after hydration.

/** Label + input attributes per field; order defines the form layout. */
const FIELD_CONFIG: Record<
  CheckoutField,
  { label: string; type: string; autoComplete: string }
> = {
  name: { label: "Név", type: "text", autoComplete: "name" },
  email: { label: "E-mail", type: "email", autoComplete: "email" },
  phone: { label: "Telefonszám", type: "tel", autoComplete: "tel" },
  postalCode: {
    label: "Irányítószám",
    type: "text",
    autoComplete: "postal-code",
  },
  city: { label: "Település", type: "text", autoComplete: "address-level2" },
  street: {
    label: "Utca, házszám",
    type: "text",
    autoComplete: "street-address",
  },
};

const INITIAL_STATE: CheckoutState = {};

function readInput(form: HTMLFormElement): CheckoutInput {
  const formData = new FormData(form);
  return Object.fromEntries(
    CHECKOUT_FIELDS.map((field) => [field, String(formData.get(field) ?? "")]),
  ) as CheckoutInput;
}

export function CheckoutForm() {
  const { cart, hydrated } = useCart();
  const [state, formAction, pending] = useActionState(
    submitOrder,
    INITIAL_STATE,
  );
  // Client-side errors, keyed per field once that field has been validated
  // (blur, edit-after-error, or a blocked submit). A validated-and-fixed
  // field maps to undefined, which also masks a stale server error for it.
  const [clientErrors, setClientErrors] = useState<CheckoutFieldErrors>({});

  const errorFor = (field: CheckoutField): string | undefined =>
    field in clientErrors ? clientErrors[field] : state.fieldErrors?.[field];

  const validateField = (field: CheckoutField, value: string) => {
    setClientErrors((previous) => ({
      ...previous,
      [field]: validateCheckoutField(field, value),
    }));
  };

  // Instant full-form validation on submit; an invalid form never reaches
  // the server (the action still re-validates for non-browser clients).
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const errors = validateCheckout(readInput(event.currentTarget));
    if (Object.keys(errors).length > 0) {
      event.preventDefault();
      setClientErrors(errors);
    }
  };

  // Until the persisted cart is read (right after mount) render neither
  // state, so a stored cart never flashes the empty-cart steering (E1).
  if (!hydrated) {
    return null;
  }

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-start gap-4">
        <p>A kosarad üres — a rendeléshez előbb tegyél labdát a kosárba.</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/termekek" className={buttonVariants()}>
            Tovább a termékekhez
          </Link>
          <Link
            href="/kosar"
            className={buttonVariants({ variant: "outline" })}
          >
            Vissza a kosárhoz
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <form
        action={formAction}
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col gap-4"
        aria-label="Szállítási adatok"
      >
        {/* Slugs + quantities only — the server re-prices from the catalog. */}
        <input type="hidden" name="cart" value={serializeCart(cart)} />
        {CHECKOUT_FIELDS.map((field) => {
          const config = FIELD_CONFIG[field];
          const error = errorFor(field);
          const errorId = `${field}-error`;
          return (
            <div key={field} className="flex flex-col gap-1">
              <label htmlFor={field} className="text-sm font-medium">
                {config.label}
              </label>
              <input
                id={field}
                name={field}
                type={config.type}
                autoComplete={config.autoComplete}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? errorId : undefined}
                onBlur={(event) => validateField(field, event.target.value)}
                onChange={(event) => {
                  // Re-validate while typing only once the field has an
                  // error, so the message clears as soon as it is fixed.
                  if (errorFor(field)) {
                    validateField(field, event.target.value);
                  }
                }}
                className="h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive"
              />
              {error && (
                <p id={errorId} className="text-sm text-destructive">
                  {error}
                </p>
              )}
            </div>
          );
        })}
        {state.formError && (
          <p aria-live="polite" className="text-sm text-destructive">
            {state.formError}
          </p>
        )}
        <p className="text-sm text-muted-foreground">
          Fizetés utánvéttel, a csomag átvételekor — online fizetés nincs.
        </p>
        <div>
          <Button type="submit" disabled={pending}>
            {pending ? "Rendelés rögzítése…" : "Megrendelem (utánvét)"}
          </Button>
        </div>
      </form>
      <OrderSummary cart={cart} />
    </div>
  );
}
