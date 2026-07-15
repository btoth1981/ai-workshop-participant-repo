"use client";

import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
} from "react";

import { addItem, removeItem, setQuantity, type Cart } from "@/lib/cart";
import {
  CART_STORAGE_KEY,
  parseCart,
  serializeCart,
} from "@/lib/cart-storage";

// Client-side cart state shared through React context (plan §3), mounted once
// in the root layout. All cart mutations delegate to the pure functions in
// src/lib/cart.ts — this file adds only state sharing and localStorage sync.
//
// The cart is held in a small module-level store consumed via
// useSyncExternalStore, because localStorage is an external system and the
// repo's react-hooks lint rules (set-state-in-effect) reject the
// setState-in-useEffect alternative. This is also hydration-safe (scenario
// C4 without an SSR mismatch): the server render and the hydration render
// both use the empty server snapshot, and React swaps in the persisted cart
// read through the cart-storage codec immediately after hydration.

const EMPTY_CART: Cart = [];

/** In-memory cart; null until the first client-side read from storage. */
let storedCart: Cart | null = null;
const listeners = new Set<() => void>();

function readCart(): Cart {
  if (storedCart === null) {
    try {
      storedCart = parseCart(window.localStorage.getItem(CART_STORAGE_KEY));
    } catch {
      // Storage unavailable (e.g. blocked) — behave like an empty store.
      storedCart = EMPTY_CART;
    }
  }
  return storedCart;
}

function writeCart(next: Cart) {
  storedCart = next;
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, serializeCart(next));
  } catch {
    // Storage unavailable — the cart still works for this page view.
  }
  for (const listener of listeners) {
    listener();
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

// getSnapshot caches via storedCart, so repeated calls return the same
// reference (a useSyncExternalStore requirement). The server snapshot is the
// empty cart: storage does not exist on the server.
const getSnapshot = () => readCart();
const getServerSnapshot = () => EMPTY_CART;

type CartContextValue = {
  cart: Cart;
  /** False on the server and during hydration, true once storage was read. */
  hydrated: boolean;
  /** Adds one unit of a catalog product (spec F2, scenario C1). */
  addToCart: (slug: string) => void;
  /** Sets a line's quantity; cart.ts clamps it to [1, 99] (scenario C2). */
  updateQuantity: (slug: string, quantity: number) => void;
  /** Removes a line (scenario C3). */
  removeFromCart: (slug: string) => void;
  /** Empties the cart, e.g. after a successful order (scenario E4). */
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const cart = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  // Renders false exactly while `cart` is still the server snapshot, so
  // consumers can avoid flashing the empty-cart UI before storage is read.
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  const addToCart = useCallback((slug: string) => {
    writeCart(addItem(readCart(), slug));
  }, []);

  const updateQuantity = useCallback((slug: string, quantity: number) => {
    writeCart(setQuantity(readCart(), slug, quantity));
  }, []);

  const removeFromCart = useCallback((slug: string) => {
    writeCart(removeItem(readCart(), slug));
  }, []);

  const clearCart = useCallback(() => {
    writeCart(EMPTY_CART);
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        hydrated,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a <CartProvider>");
  }
  return context;
}
