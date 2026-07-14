// Product master data — the machine-readable form of docs/spec/spec.md §3.
// Prices are gross consumer prices in whole HUF (integers, never floats).
// Firmness drives the product-list filter (spec F1, scenario A2). The
// assignment is derived from the product descriptions; the "szett" bundle
// contains all three firmness levels, hence the array type.

export type Firmness = "soft" | "medium" | "firm";

export type Product = {
  slug: string;
  name: string;
  description: string;
  /** Gross price in whole HUF. */
  priceHuf: number;
  /** Firmness levels present in the product (bundles may have several). */
  firmness: Firmness[];
};

export const products: Product[] = [
  {
    slug: "klasszikus",
    name: "Klasszikus stresszlabda",
    description: "Puha hab, kézre álló méret, egyszínű",
    priceHuf: 1_490,
    firmness: ["soft"],
  },
  {
    slug: "gel",
    name: "Gél stresszlabda",
    description: "Rugalmas gél töltet, extra lágy tapintás",
    priceHuf: 1_990,
    firmness: ["soft"],
  },
  {
    slug: "smiley",
    name: "Smiley stresszlabda",
    description: "Vidám mosolygós minta, tökéletes ajándék",
    priceHuf: 1_790,
    firmness: ["medium"],
  },
  {
    slug: "szett",
    name: "Antistressz szett (3 db)",
    description: "Három különböző keménységű labda csomagban",
    priceHuf: 4_490,
    firmness: ["soft", "medium", "firm"],
  },
  {
    slug: "fejleszto",
    name: "Fejlesztő labda",
    description: "Erősebb ellenállás, kézerő fejlesztéshez",
    priceHuf: 2_490,
    firmness: ["firm"],
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}
