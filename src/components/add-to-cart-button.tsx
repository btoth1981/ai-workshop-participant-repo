"use client";

import { useCart } from "@/components/cart-provider";
import { Button } from "@/components/ui/button";

// "Kosárba" button (spec F2: add to cart from both the product list and the
// product page). A tiny client island so the pages that host it can stay
// server-rendered/static.

type AddToCartButtonProps = {
  slug: string;
  /**
   * Product name for the accessible label — several "Kosárba" buttons can
   * share a page (product list), so each needs a distinguishing name.
   */
  productName: string;
};

export function AddToCartButton({ slug, productName }: AddToCartButtonProps) {
  const { addToCart } = useCart();
  return (
    <Button
      aria-label={`Kosárba: ${productName}`}
      onClick={() => addToCart(slug)}
    >
      Kosárba
    </Button>
  );
}
