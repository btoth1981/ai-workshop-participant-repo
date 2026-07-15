// Order building and persistence — spec F4 / §6.4, scenario E5, plan §3–§4.
//
// Split by design (plan §5 test strategy, T7 scope):
// - buildOrder is PURE: it re-prices every line from the catalog and computes
//   the totals via the cart.ts functions — unit-testable without a database.
// - saveOrder is thin IO: it inserts the already-built order into Neon via
//   @neondatabase/serverless and returns the new order id. No business logic.
//
// E5 + tamper protection (plan §7): caller-provided prices are NEVER trusted —
// CartItem carries no price at all, so by construction every product name and
// unit price stored on the order comes from a catalog lookup at submission
// time. Later catalog price changes cannot alter a stored order.

import { neon } from "@neondatabase/serverless";

import {
  type Cart,
  cartSubtotal,
  MAX_QUANTITY,
  MIN_QUANTITY,
  orderTotal,
  shippingFee,
} from "./cart";
import { getProduct } from "./catalog";

/** Shipping details from the checkout form (spec F4 required fields). */
export type Customer = {
  readonly name: string;
  readonly email: string;
  readonly phone: string;
  readonly postalCode: string;
  readonly city: string;
  readonly street: string;
};

export type OrderItem = {
  readonly productSlug: string;
  /** Product name captured at submission time (E5). */
  readonly productName: string;
  /** Unit price in whole HUF captured at submission time (E5). */
  readonly unitPriceHuf: number;
  readonly quantity: number;
};

/** A fully priced order record, ready to persist (matches db/schema.sql). */
export type Order = {
  readonly customer: Customer;
  readonly items: readonly OrderItem[];
  readonly subtotalHuf: number;
  readonly shippingHuf: number;
  readonly totalHuf: number;
};

// Quantity policy at the order boundary: THROW, do not clamp. cart.ts clamps
// raw *user input* (typing "150" into a quantity field), but the CartItem
// contract guarantees every stored quantity is already an integer in
// [MIN_QUANTITY, MAX_QUANTITY] — a cart that reaches checkout with an
// out-of-range quantity is corrupt state (tampered localStorage or a bug),
// exactly like an unknown slug, and cart.ts's policy for corrupt state is to
// fail loud. Silently clamping here would charge a total the buyer never saw.
// The database CHECK (quantity BETWEEN 1 AND 99) enforces the same rule.
function requireValidQuantity(quantity: number, slug: string): void {
  if (!Number.isInteger(quantity)) {
    throw new TypeError(
      `Quantity must be an integer, got ${quantity} for "${slug}"`,
    );
  }
  if (quantity < MIN_QUANTITY || quantity > MAX_QUANTITY) {
    throw new RangeError(
      `Quantity must be between ${MIN_QUANTITY} and ${MAX_QUANTITY}, ` +
        `got ${quantity} for "${slug}"`,
    );
  }
}

/**
 * Builds a persistable order from the cart and the customer details.
 * Every line is re-priced from the catalog (name + unit price captured at
 * submission time — E5); totals come from the cart.ts pricing functions.
 * Throws on an empty cart, an unknown slug, or an out-of-contract quantity.
 */
export function buildOrder(items: Cart, customer: Customer): Order {
  if (items.length === 0) {
    throw new Error("Cannot build an order from an empty cart");
  }

  const orderItems: readonly OrderItem[] = items.map((item) => {
    requireValidQuantity(item.quantity, item.slug);
    const product = getProduct(item.slug);
    if (!product) {
      throw new Error(`Unknown product slug in order: "${item.slug}"`);
    }
    return {
      productSlug: product.slug,
      productName: product.name,
      unitPriceHuf: product.priceHuf,
      quantity: item.quantity,
    };
  });

  // cartSubtotal re-prices from the catalog as well — single pricing source.
  const subtotalHuf = cartSubtotal(items);
  return {
    customer,
    items: orderItems,
    subtotalHuf,
    shippingHuf: shippingFee(subtotalHuf),
    totalHuf: orderTotal(subtotalHuf),
  };
}

/**
 * Persists a built order into Neon (orders + order_items) and returns the new
 * order id. The whole write is ONE SQL statement (data-modifying CTE), which
 * Postgres executes atomically — the order row and its items either all land
 * or none do, without needing an explicit transaction over HTTP.
 */
export async function saveOrder(order: Order): Promise<string> {
  // Read the env var lazily so importing this module (e.g. during
  // `next build`) works without a configured database.
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set");
  }
  const sql = neon(databaseUrl);

  const rows = (await sql.query(
    `WITH new_order AS (
       INSERT INTO orders
         (name, email, phone, postal_code, city, street,
          subtotal, shipping, total)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id
     )
     INSERT INTO order_items
       (order_id, product_slug, product_name, unit_price, quantity)
     SELECT new_order.id, item.slug, item.name, item.unit_price, item.quantity
     FROM new_order,
          unnest($10::text[], $11::text[], $12::int[], $13::int[])
            AS item(slug, name, unit_price, quantity)
     RETURNING order_id`,
    [
      order.customer.name,
      order.customer.email,
      order.customer.phone,
      order.customer.postalCode,
      order.customer.city,
      order.customer.street,
      order.subtotalHuf,
      order.shippingHuf,
      order.totalHuf,
      order.items.map((item) => item.productSlug),
      order.items.map((item) => item.productName),
      order.items.map((item) => item.unitPriceHuf),
      order.items.map((item) => item.quantity),
    ],
  )) as { order_id: string }[];

  return rows[0].order_id;
}
