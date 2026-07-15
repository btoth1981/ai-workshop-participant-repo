"use client";

import Link from "next/link";

import { CartLine } from "@/components/cart-line";
import { useCart } from "@/components/cart-provider";
import { OrderSummary } from "@/components/order-summary";
import { buttonVariants } from "@/components/ui/button";

// Cart page (spec S4, F2–F3, scenarios C1–C4, D1–D3): line items with a
// quantity editor and remove button, plus the subtotal/shipping/payable
// summary. Client-rendered (plan §2) because the cart lives in browser state;
// all money math delegates to the pure functions in cart.ts through the
// components below.

export default function CartPage() {
  const { cart, hydrated } = useCart();

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-10">
      <h1 className="text-3xl font-semibold">Kosár</h1>
      {/* Until the persisted cart is read (right after mount) render neither
          state, so a stored cart never flashes the empty message. */}
      {hydrated &&
        (cart.length === 0 ? (
          <div className="flex flex-col items-start gap-4">
            <p>A kosarad üres.</p>
            <Link href="/termekek" className={buttonVariants()}>
              Tovább a termékekhez
            </Link>
          </div>
        ) : (
          <>
            <div>
              {cart.map((item) => (
                <CartLine key={item.slug} item={item} />
              ))}
            </div>
            <OrderSummary cart={cart} />
          </>
        ))}
    </main>
  );
}
