import { describe, expect, it } from "vitest";

import { contact, valuePropositions } from "./content";

// Scenario F1 (data level): the home page renders `valuePropositions`
// verbatim, so asserting on the data proves exactly the four approved value
// propositions of docs/spec/spec.md §F5 are present — no more, no less.
describe("value propositions (scenario F1)", () => {
  it("contains exactly the four approved value propositions", () => {
    expect(valuePropositions).toHaveLength(4);
    expect(valuePropositions.map((v) => v.title)).toEqual([
      "Gyors szállítás",
      "Ingyenes kiszállítás",
      "14 napos visszaküldés",
      "Minőségi anyagok",
    ]);
  });

  it("carries the approved facts of each proposition", () => {
    const texts = valuePropositions.map((v) => `${v.title} ${v.description}`);
    // Fast delivery within 1–2 business days.
    expect(texts[0]).toContain("1–2 munkanap");
    // Free shipping above the 10 000 Ft threshold.
    expect(texts[1]).toContain("10 000 Ft felett");
    // 14-day return policy.
    expect(texts[2]).toContain("14 napos visszaküldés");
    // Quality materials.
    expect(texts[3].toLowerCase()).toContain("minőségi anyagok");
  });

  it("has a non-empty title and description on every proposition", () => {
    for (const proposition of valuePropositions) {
      expect(proposition.title.trim()).not.toBe("");
      expect(proposition.description.trim()).not.toBe("");
    }
  });
});

// Scenario F2 (data level): the /kapcsolat page renders `contact` verbatim,
// so the e-mail, phone number and opening hours must match spec §F5 exactly.
describe("contact details (scenario F2)", () => {
  it("matches the approved e-mail address exactly", () => {
    expect(contact.email).toBe("info@stresszlabdashop.hu");
  });

  it("matches the approved phone number exactly", () => {
    expect(contact.phone).toBe("+36 1 234 5678");
  });

  it("matches the approved opening hours exactly", () => {
    expect(contact.openingHours).toBe("H–P 9:00–17:00");
  });
});
