-- Order storage schema (docs/spec/plan.md §4, spec F4 / §6.4).
-- Source-of-truth copy of the DDL applied on 2026-07-15 to the Vercel-managed
-- Neon project autumn-hill-73068152, database neondb, default branch.
-- Idempotent (CREATE TABLE IF NOT EXISTS) so it can be re-applied safely.
-- All money columns are whole HUF integers (plan §3 — no floating-point money).

CREATE TABLE IF NOT EXISTS orders (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  timestamptz NOT NULL DEFAULT now(),
  name        text NOT NULL,
  email       text NOT NULL,
  phone       text NOT NULL,
  postal_code text NOT NULL,
  city        text NOT NULL,
  street      text NOT NULL,
  subtotal    integer NOT NULL,        -- Ft
  shipping    integer NOT NULL,        -- Ft
  total       integer NOT NULL         -- Ft
);

CREATE TABLE IF NOT EXISTS order_items (
  id           bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_id     uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_slug text NOT NULL,
  product_name text NOT NULL,          -- name at submission time (E5)
  unit_price   integer NOT NULL,       -- price at submission time (E5)
  quantity     integer NOT NULL CHECK (quantity BETWEEN 1 AND 99)
);
