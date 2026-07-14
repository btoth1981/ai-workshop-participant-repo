"use client";

import { Button } from "@/components/ui/button";
import type { Firmness } from "@/lib/catalog";
import {
  firmnessLabels,
  type FirmnessFilter,
  type PriceSortDirection,
} from "@/lib/product-filtering";

// Filter controls for the product list (spec F1, scenarios A2–A3): firmness
// buttons plus a price sort toggle. Controlled component — the list page owns
// the state and does the actual filtering/sorting via product-filtering.ts.

const firmnessOptions: readonly { value: FirmnessFilter; label: string }[] = [
  { value: "all", label: "összes" },
  ...(Object.keys(firmnessLabels) as Firmness[]).map((value) => ({
    value,
    label: firmnessLabels[value],
  })),
];

type ProductFiltersProps = {
  firmness: FirmnessFilter;
  onFirmnessChange: (firmness: FirmnessFilter) => void;
  sort: PriceSortDirection;
  onSortChange: (sort: PriceSortDirection) => void;
};

export function ProductFilters({
  firmness,
  onFirmnessChange,
  sort,
  onSortChange,
}: ProductFiltersProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div role="group" aria-label="Szűrés keménység szerint">
        <p className="mb-2 text-sm text-muted-foreground">Keménység</p>
        <div className="flex flex-wrap gap-2">
          {firmnessOptions.map((option) => (
            <Button
              key={option.value}
              variant={firmness === option.value ? "default" : "outline"}
              aria-pressed={firmness === option.value}
              onClick={() => onFirmnessChange(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>
      <Button
        variant="outline"
        aria-label={`Rendezés ár szerint: ${
          sort === "asc" ? "növekvő" : "csökkenő"
        }. Kattints a váltáshoz.`}
        onClick={() => onSortChange(sort === "asc" ? "desc" : "asc")}
      >
        Ár: {sort === "asc" ? "növekvő" : "csökkenő"}
      </Button>
    </div>
  );
}
