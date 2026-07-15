import Link from "next/link";

import { AddToCartButton } from "@/components/add-to-cart-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Product } from "@/lib/catalog";
import { formatHuf } from "@/lib/format";

// Product card for the product list (spec F1, scenario A1): name, short
// description, gross price and a link to the product page. Real product
// images arrive later (spec §6.3), so a neutral placeholder block stands in.

export function ProductCard({ product }: { product: Product }) {
  return (
    <Card>
      {/* Neutral image placeholder until real assets exist (spec §6.3). */}
      <div
        aria-hidden="true"
        className="mx-(--card-spacing) h-32 rounded-lg bg-muted"
      />
      <CardHeader>
        <CardTitle>
          <Link
            href={`/termekek/${product.slug}`}
            className="hover:underline focus-visible:underline"
          >
            {product.name}
          </Link>
        </CardTitle>
        <CardDescription>{product.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-between gap-2">
        <p className="font-medium">{formatHuf(product.priceHuf)}</p>
        {/* Spec F2: products can be added to the cart from the list too. */}
        <AddToCartButton slug={product.slug} productName={product.name} />
      </CardContent>
    </Card>
  );
}
