import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { getProduct, products } from "@/lib/catalog";
import { formatHuf } from "@/lib/format";
import { firmnessLabels } from "@/lib/product-filtering";

// Product detail page (spec S3, scenarios B1–B2): name, full description,
// gross price and the "Kosárba" button for a single catalog product. All five
// pages prerender statically at build time via generateStaticParams (plan §2);
// an unknown slug falls through to notFound() and renders the 404 page (B2).

/** One page per catalog product — exported so tests can pin the slug list. */
export function generateStaticParams(): { slug: string }[] {
  return products.map((product) => ({ slug: product.slug }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) {
    // The page render calls notFound(); no product metadata to contribute.
    return {};
  }
  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) {
    notFound();
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-10">
      <div className="grid gap-8 md:grid-cols-2">
        {/* Neutral image placeholder until real assets exist (spec §6.3),
            consistent with product-card. */}
        <div aria-hidden="true" className="h-64 rounded-lg bg-muted" />
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-semibold">{product.name}</h1>
          <p className="text-sm text-muted-foreground">
            Keménység:{" "}
            {product.firmness
              .map((level) => firmnessLabels[level])
              .join(" · ")}
          </p>
          <p>{product.description}</p>
          <p className="text-2xl font-medium">{formatHuf(product.priceHuf)}</p>
          <div className="flex flex-col gap-2">
            {/* Scenario B1 requires the "Kosárba" button to be visible here.
                Wiring it to cart state is T6 scope (cart-provider does not
                exist yet), so it renders disabled with an accessible note
                until T6 lands. */}
            <Button disabled aria-describedby="kosarba-hamarosan">
              Kosárba
            </Button>
            <p
              id="kosarba-hamarosan"
              className="text-sm text-muted-foreground"
            >
              Hamarosan: a kosár funkció még készül.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
