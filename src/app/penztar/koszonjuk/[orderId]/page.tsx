import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ClearCartOnMount } from "@/components/clear-cart-on-mount";
import { buttonVariants } from "@/components/ui/button";

// Order confirmation (spec F4, scenario E4, plan §2): shows the new order id
// with a short Hungarian thank-you and the cash-on-delivery ("utánvét")
// terms. No database read — the id in the URL comes from the Server Action's
// redirect right after the atomic insert. ClearCartOnMount empties the cart
// here, after the order provably exists (see that component for the recorded
// E4 decision).

export const metadata: Metadata = {
  title: "Köszönjük a rendelésed!",
};

// Order ids are Postgres UUIDs; anything else in the URL is a typo or
// guessing, not a confirmation — render the 404 page instead.
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type Props = {
  params: Promise<{ orderId: string }>;
};

export default async function OrderConfirmationPage({ params }: Props) {
  const { orderId } = await params;
  if (!UUID_PATTERN.test(orderId)) {
    notFound();
  }

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-10">
      <ClearCartOnMount />
      <h1 className="text-3xl font-semibold">Köszönjük a rendelésed!</h1>
      <p className="max-w-prose">
        A rendelésedet rögzítettük. A csomagot utánvéttel, az átvételkor
        fizetheted — addig is: szoríts, gyúrj, lazíts!
      </p>
      <p className="text-sm text-muted-foreground">
        Rendelés-azonosító: <span className="font-mono">{orderId}</span>
      </p>
      <div>
        <Link href="/termekek" className={buttonVariants()}>
          Vissza a termékekhez
        </Link>
      </div>
    </main>
  );
}
