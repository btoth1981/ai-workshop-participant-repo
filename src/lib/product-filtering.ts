// Product list filtering and sorting (spec F1, scenarios A1–A3) as pure
// functions, so the acceptance scenarios are unit-testable without a DOM
// library. The UI components in src/components/ only wire these up.

import type { Firmness, Product } from "./catalog";

/**
 * Single source of the Hungarian UI label mapping for the Firmness enum
 * (RUG carry-over from the T1 review, recorded on STR-8). Every place that
 * shows a firmness level to the user must import this mapping — never
 * re-declare the labels elsewhere.
 */
export const firmnessLabels: Record<Firmness, string> = {
  soft: "puha",
  medium: "közepes",
  firm: "erős",
};

/** "all" disables the firmness filter (spec F1: the filter is optional). */
export type FirmnessFilter = Firmness | "all";

/**
 * Keeps the products that contain the selected firmness level. Per spec §3 a
 * product may carry several levels (the "szett" bundle carries all three), so
 * a product matches when its `firmness` array CONTAINS the selected level.
 */
export function filterByFirmness(
  products: readonly Product[],
  filter: FirmnessFilter,
): readonly Product[] {
  if (filter === "all") {
    return products;
  }
  return products.filter((product) => product.firmness.includes(filter));
}

export type PriceSortDirection = "asc" | "desc";

/**
 * Returns a new array sorted by gross price (scenario A3). Stable (ties keep
 * catalog order) and never mutates the readonly input.
 */
export function sortByPrice(
  products: readonly Product[],
  direction: PriceSortDirection,
): readonly Product[] {
  const sign = direction === "asc" ? 1 : -1;
  return [...products].sort((a, b) => sign * (a.priceHuf - b.priceHuf));
}
