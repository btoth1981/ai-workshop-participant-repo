// Money formatting — Hungarian thousands grouping plus the "Ft" suffix
// (spec §5, e.g. `4 490 Ft`). Amounts are whole HUF integers by contract
// (docs/spec/plan.md §3); anything else is a programming error.

/** Non-breaking space (U+00A0) so the grouped number never wraps mid-amount. */
const GROUP_SEPARATOR = " ";

export function formatHuf(amount: number): string {
  if (!Number.isInteger(amount)) {
    throw new TypeError(`formatHuf expects a whole HUF integer, got ${amount}`);
  }
  const grouped = Math.abs(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, GROUP_SEPARATOR);
  const sign = amount < 0 ? "-" : "";
  return `${sign}${grouped}${GROUP_SEPARATOR}Ft`;
}
