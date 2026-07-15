import { describe, expect, it } from "vitest";

import {
  CHECKOUT_FIELDS,
  INVALID_EMAIL_MESSAGE,
  parseCartPayload,
  toCustomer,
  validateCheckout,
  validateCheckoutField,
  type CheckoutInput,
} from "./checkout-validation";

// Scenario coverage: E2 (missing required field) and E3 (invalid e-mail) of
// docs/spec/given-when-then.md at the shared-rule-set level — the SAME
// functions run on the client (instant errors) and in the Server Action
// (authoritative), so covering them here covers both sides (plan §3).
// parseCartPayload is the strict form-payload → Cart parser used by the
// Server Action; a bad payload must be rejected, never repaired.

const validInput: CheckoutInput = {
  name: "Teszt Elek",
  email: "teszt.elek@example.com",
  phone: "+36 30 123 4567",
  postalCode: "1111",
  city: "Budapest",
  street: "Minta utca 1.",
};

describe("validateCheckout — required fields (E2)", () => {
  it("accepts a fully valid input (no errors)", () => {
    expect(validateCheckout(validInput)).toEqual({});
  });

  it.each(CHECKOUT_FIELDS)(
    "flags a missing %s with a Hungarian field-level message",
    (field) => {
      const input = { ...validInput, [field]: "" };
      const errors = validateCheckout(input);
      expect(Object.keys(errors)).toEqual([field]);
      expect(errors[field]).toBeTruthy();
      // Hungarian copy, not a technical string.
      expect(errors[field]).toMatch(/^Add meg /);
    },
  );

  it("treats whitespace-only input as missing", () => {
    const errors = validateCheckout({ ...validInput, name: "   " });
    expect(errors.name).toBeTruthy();
  });

  it("reports every invalid field at once", () => {
    const errors = validateCheckout({
      ...validInput,
      name: "",
      phone: "",
    });
    expect(Object.keys(errors).sort()).toEqual(["name", "phone"]);
  });
});

describe("validateCheckout — e-mail format (E3)", () => {
  it.each(["nem-email", "hianyzo-kukac.hu", "kukac@nincs-pont", "a b@c.hu"])(
    "rejects %s with the format message",
    (email) => {
      const errors = validateCheckout({ ...validInput, email });
      expect(errors.email).toBe(INVALID_EMAIL_MESSAGE);
    },
  );

  it("prefers the required message over the format message when empty", () => {
    const errors = validateCheckout({ ...validInput, email: "" });
    expect(errors.email).not.toBe(INVALID_EMAIL_MESSAGE);
    expect(errors.email).toBeTruthy();
  });

  it("accepts a plain valid address", () => {
    expect(validateCheckout(validInput)).toEqual({});
  });
});

describe("validateCheckoutField — single-field variant for instant errors", () => {
  it("mirrors the whole-form rules per field", () => {
    expect(validateCheckoutField("name", "Teszt Elek")).toBeUndefined();
    expect(validateCheckoutField("name", " ")).toMatch(/^Add meg /);
    expect(validateCheckoutField("email", "nem-email")).toBe(
      INVALID_EMAIL_MESSAGE,
    );
    expect(
      validateCheckoutField("email", "teszt@example.com"),
    ).toBeUndefined();
  });
});

describe("toCustomer", () => {
  it("trims every field and preserves the values", () => {
    const customer = toCustomer({
      name: "  Teszt Elek  ",
      email: " teszt.elek@example.com ",
      phone: " +36 30 123 4567 ",
      postalCode: " 1111 ",
      city: " Budapest ",
      street: " Minta utca 1. ",
    });
    expect(customer).toEqual({
      name: "Teszt Elek",
      email: "teszt.elek@example.com",
      phone: "+36 30 123 4567",
      postalCode: "1111",
      city: "Budapest",
      street: "Minta utca 1.",
    });
  });
});

describe("parseCartPayload — strict form-payload parser", () => {
  it("parses a valid payload into cart items", () => {
    const raw = JSON.stringify([
      { slug: "gel", quantity: 1 },
      { slug: "szett", quantity: 2 },
    ]);
    expect(parseCartPayload(raw)).toEqual([
      { slug: "gel", quantity: 1 },
      { slug: "szett", quantity: 2 },
    ]);
  });

  it("copies only slug and quantity — injected fields are dropped", () => {
    const raw = JSON.stringify([
      { slug: "gel", quantity: 1, priceHuf: 1, admin: true },
    ]);
    expect(parseCartPayload(raw)).toEqual([{ slug: "gel", quantity: 1 }]);
  });

  it("rejects a missing or non-string payload", () => {
    expect(parseCartPayload(null)).toBeNull();
    expect(parseCartPayload(undefined)).toBeNull();
    expect(parseCartPayload(42)).toBeNull();
  });

  it("rejects corrupt JSON", () => {
    expect(parseCartPayload("{nope")).toBeNull();
  });

  it("rejects non-array and empty-array payloads (E1 server backstop)", () => {
    expect(parseCartPayload(JSON.stringify({ slug: "gel" }))).toBeNull();
    expect(parseCartPayload(JSON.stringify([]))).toBeNull();
  });

  it("rejects malformed entries instead of repairing them", () => {
    expect(parseCartPayload(JSON.stringify(["gel"]))).toBeNull();
    expect(parseCartPayload(JSON.stringify([null]))).toBeNull();
    expect(parseCartPayload(JSON.stringify([{ quantity: 1 }]))).toBeNull();
    expect(
      parseCartPayload(JSON.stringify([{ slug: "", quantity: 1 }])),
    ).toBeNull();
    expect(parseCartPayload(JSON.stringify([{ slug: "gel" }]))).toBeNull();
    expect(
      parseCartPayload(JSON.stringify([{ slug: "gel", quantity: "1" }])),
    ).toBeNull();
    expect(
      parseCartPayload(JSON.stringify([{ slug: "gel", quantity: 1.5 }])),
    ).toBeNull();
  });

  it("one bad entry rejects the whole payload", () => {
    const raw = JSON.stringify([
      { slug: "gel", quantity: 1 },
      { slug: "szett", quantity: NaN }, // serializes to null
    ]);
    expect(parseCartPayload(raw)).toBeNull();
  });
});
