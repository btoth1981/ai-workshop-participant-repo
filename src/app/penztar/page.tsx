import type { Metadata } from "next";

import { CheckoutForm } from "@/components/checkout-form";

// Checkout page (spec S5/F4, plan §2): thin server shell around the client
// form — the cart lives in browser state, so the form (and the empty-cart
// steering, scenario E1) renders on the client via CheckoutForm.

export const metadata: Metadata = {
  title: "Pénztár",
};

export default function CheckoutPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-10">
      <h1 className="text-3xl font-semibold">Pénztár</h1>
      <CheckoutForm />
    </main>
  );
}
