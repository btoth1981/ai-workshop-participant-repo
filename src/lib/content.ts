// Page content master data — the machine-readable form of docs/spec/spec.md
// §F5 (home-page value propositions and contact details). Keeping the copy in
// a typed module lets scenarios F1 and F2 be covered at the data level
// without a DOM testing library (no new dependencies).

export type ValueProposition = {
  readonly title: string;
  readonly description: string;
};

/**
 * The four approved value propositions shown on the home page (spec F5,
 * scenario F1). Order follows the spec; the copy carries the exact approved
 * facts (1–2 munkanap, 10 000 Ft threshold, 14 days, quality materials).
 */
export const valuePropositions: readonly ValueProposition[] = [
  {
    title: "Gyors szállítás",
    description: "1–2 munkanapon belül kézbesítjük a rendelésed.",
  },
  {
    title: "Ingyenes kiszállítás",
    description: "10 000 Ft feletti rendelésnél a szállítás ingyenes.",
  },
  {
    title: "14 napos visszaküldés",
    description: "Ha mégsem válik be, kérdés nélkül visszaküldheted.",
  },
  {
    title: "Minőségi anyagok",
    description: "Tartós, kézre álló labdák, hosszú élettartamra tervezve.",
  },
];

/** Contact details for the /kapcsolat page (spec F5, scenario F2). */
export const contact = {
  email: "info@stresszlabdashop.hu",
  phone: "+36 1 234 5678",
  openingHours: "H–P 9:00–17:00",
} as const;
