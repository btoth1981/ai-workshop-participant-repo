import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { products } from "@/lib/catalog";
import { valuePropositions } from "@/lib/content";
import { formatHuf } from "@/lib/format";

// Home page (spec S1, F5): intro, the four approved value propositions,
// featured products and a CTA to the product list. Tone follows the brief
// (docs/stresszlabda-webshop.md): friendly, calming, playful.

// Featured selection: the first three catalog products. The spec does not
// name specific featured items; changing this list is a content decision.
const featuredProducts = products.slice(0, 3);

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-12 px-4 py-10">
      <section aria-labelledby="intro-heading" className="flex flex-col gap-4">
        <h1 id="intro-heading" className="text-3xl font-semibold">
          Szorítsd, gyúrd, lazíts!
        </h1>
        <p className="max-w-prose text-muted-foreground">
          A Stresszlabda Shop kézre álló, minőségi stresszoldó labdákat kínál
          diákoknak, irodai dolgozóknak és mindenkinek, aki egy kis nyugalomra
          vágyik a nap közepén. Termékeink segítenek a feszültség
          levezetésében, a koncentráció javításában és a kézizmok
          erősítésében.
        </p>
        <Button className="w-fit" render={<Link href="/termekek" />}>
          Termékek megtekintése
        </Button>
      </section>

      <section aria-labelledby="value-props-heading" className="flex flex-col gap-4">
        <h2 id="value-props-heading" className="text-xl font-semibold">
          Miért minket válassz?
        </h2>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {valuePropositions.map((proposition) => (
            <li key={proposition.title}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>{proposition.title}</CardTitle>
                  <CardDescription>{proposition.description}</CardDescription>
                </CardHeader>
              </Card>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="featured-heading" className="flex flex-col gap-4">
        <h2 id="featured-heading" className="text-xl font-semibold">
          Kiemelt termékeink
        </h2>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {featuredProducts.map((product) => (
            <li key={product.slug}>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>{product.name}</CardTitle>
                  <CardDescription>{formatHuf(product.priceHuf)}</CardDescription>
                </CardHeader>
              </Card>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
