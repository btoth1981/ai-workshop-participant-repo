"use client";

import Link from "next/link";

import { useCart } from "@/components/cart-provider";
import { Button } from "@/components/ui/button";
import {
  MAX_QUANTITY,
  MIN_QUANTITY,
  type CartItem,
} from "@/lib/cart";
import { getProduct } from "@/lib/catalog";
import { formatHuf } from "@/lib/format";

// One cart line (spec S4/F2, scenarios C2–C3): product name, unit price,
// quantity editor (1–99), line total and a remove button. Quantity changes
// go through the provider, which delegates to cart.ts setQuantity — the
// clamp to [1, 99] happens there, this component only parses the input.

export function CartLine({ item }: { item: CartItem }) {
  const { updateQuantity, removeFromCart } = useCart();

  // The provider hydrates cart state through the cart-storage codec, which
  // drops unknown slugs, so this lookup cannot miss; the guard keeps the
  // component total in the face of future catalog edits.
  const product = getProduct(item.slug);
  if (!product) {
    return null;
  }

  const quantityInputId = `quantity-${item.slug}`;
  const lineTotal = product.priceHuf * item.quantity;

  const handleQuantityChange = (value: number) => {
    // An empty or unparseable field is a transient typing state, not an
    // intent — ignore it and keep the last valid quantity. Fractional input
    // is truncated because cart.ts quantities are integers by contract.
    if (!Number.isFinite(value)) {
      return;
    }
    updateQuantity(item.slug, Math.trunc(value));
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b py-4">
      <div className="flex flex-col gap-1">
        <Link
          href={`/termekek/${item.slug}`}
          className="font-medium hover:underline focus-visible:underline"
        >
          {product.name}
        </Link>
        <p className="text-sm text-muted-foreground">
          Egységár: {formatHuf(product.priceHuf)}
        </p>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <label
            htmlFor={quantityInputId}
            className="text-sm text-muted-foreground"
          >
            Darabszám
          </label>
          <input
            id={quantityInputId}
            type="number"
            inputMode="numeric"
            min={MIN_QUANTITY}
            max={MAX_QUANTITY}
            value={item.quantity}
            onChange={(event) =>
              handleQuantityChange(event.target.valueAsNumber)
            }
            className="h-8 w-16 rounded-lg border border-input bg-background px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>
        <p className="w-24 text-right font-medium" aria-label="Tételösszeg">
          {formatHuf(lineTotal)}
        </p>
        <Button
          variant="destructive"
          aria-label={`Törlés: ${product.name}`}
          onClick={() => removeFromCart(item.slug)}
        >
          Törlés
        </Button>
      </div>
    </div>
  );
}
