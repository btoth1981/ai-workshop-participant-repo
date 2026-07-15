"use client";

import { useEffect } from "react";

import { useCart } from "@/components/cart-provider";

// E4 cart-clearing mechanism (recorded decision): the cart is cleared when
// the confirmation page mounts, i.e. AFTER the Server Action's redirect —
// so the cart is emptied only once the order provably exists in the
// database. Clearing before/without a successful save could strand the buyer
// with a lost cart on a failed submit. Re-visiting a confirmation URL clears
// again; for the normal flow the cart is already empty, so this is a no-op.

export function ClearCartOnMount() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return null;
}
