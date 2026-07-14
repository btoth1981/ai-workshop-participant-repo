"use client";

import { useState } from "react";

import { ProductCard } from "@/components/product-card";
import { ProductFilters } from "@/components/product-filters";
import { products } from "@/lib/catalog";
import {
  filterByFirmness,
  sortByPrice,
  type FirmnessFilter,
  type PriceSortDirection,
} from "@/lib/product-filtering";

// Product list page (spec S2, F1, scenarios A1–A3): all five catalog
// products on cards, filtered by firmness and sorted by price. The page is a
// Client Component because the filter state lives client-side (plan §2:
// "statikus + kliens-szűrő"); it still prerenders statically at build time.

export default function ProductsPage() {
  const [firmness, setFirmness] = useState<FirmnessFilter>("all");
  const [sort, setSort] = useState<PriceSortDirection>("asc");

  const visibleProducts = sortByPrice(
    filterByFirmness(products, firmness),
    sort,
  );

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-10">
      <h1 className="text-3xl font-semibold">Termékek</h1>
      <ProductFilters
        firmness={firmness}
        onFirmnessChange={setFirmness}
        sort={sort}
        onSortChange={setSort}
      />
      <ul className="grid list-none grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visibleProducts.map((product) => (
          <li key={product.slug}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </main>
  );
}
