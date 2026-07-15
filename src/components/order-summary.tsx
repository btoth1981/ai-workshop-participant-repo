import {
  cartSubtotal,
  FREE_SHIPPING_THRESHOLD_HUF,
  orderTotal,
  shippingFee,
  type Cart,
} from "@/lib/cart";
import { formatHuf } from "@/lib/format";

// Cart summary (spec S4/F3, scenarios D1–D3): subtotal + shipping = payable.
// Purely presentational — every amount comes from the already unit-tested
// pure functions in cart.ts, so no money math happens here.

export function OrderSummary({ cart }: { cart: Cart }) {
  const subtotal = cartSubtotal(cart);
  const shipping = shippingFee(subtotal);
  const total = orderTotal(subtotal);

  return (
    <section
      aria-label="Összegzés"
      className="ml-auto flex w-full max-w-sm flex-col gap-2"
    >
      <h2 className="text-lg font-semibold">Összegzés</h2>
      <dl className="flex flex-col gap-1 text-sm">
        <div className="flex justify-between">
          <dt>Tételek összege</dt>
          <dd>{formatHuf(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Szállítási költség</dt>
          <dd>{shipping === 0 ? "Ingyenes" : formatHuf(shipping)}</dd>
        </div>
        <div className="flex justify-between border-t pt-2 text-base font-semibold">
          <dt>Fizetendő</dt>
          <dd>{formatHuf(total)}</dd>
        </div>
      </dl>
      <p className="text-sm text-muted-foreground">
        {formatHuf(FREE_SHIPPING_THRESHOLD_HUF)} feletti rendelésnél a
        szállítás ingyenes.
      </p>
    </section>
  );
}
