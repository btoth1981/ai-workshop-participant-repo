import { describe, expect, it } from "vitest";

import { formatHuf } from "./format";

// Spec §5: Hungarian thousands grouping + "Ft" (e.g. `4 490 Ft`). The group
// and suffix separator is a non-breaking space (U+00A0) so amounts never
// wrap mid-number in the UI.
describe("formatHuf", () => {
  it("formats amounts below 1000 without grouping", () => {
    expect(formatHuf(999)).toBe("999 Ft");
    expect(formatHuf(0)).toBe("0 Ft");
  });

  it("groups thousands with a non-breaking space", () => {
    expect(formatHuf(1_490)).toBe("1 490 Ft");
    expect(formatHuf(4_490)).toBe("4 490 Ft");
    expect(formatHuf(10_000)).toBe("10 000 Ft");
    expect(formatHuf(1_234_567)).toBe("1 234 567 Ft");
  });

  it("keeps the sign in front of grouped negative amounts", () => {
    expect(formatHuf(-1_490)).toBe("-1 490 Ft");
  });

  it("rejects non-integer amounts (money is whole HUF by contract)", () => {
    expect(() => formatHuf(12.5)).toThrow(TypeError);
    expect(() => formatHuf(Number.NaN)).toThrow(TypeError);
  });
});
