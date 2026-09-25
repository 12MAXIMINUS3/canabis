import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from 'react';

/**
 * Cart state lives here so the header badge, the drawer and every product card
 * read from the same source. Lines are stored as slim snapshots
 * ({ id, name, price, size, category, qty }) rather than whole product objects,
 * so a stale localStorage payload can never resurrect an old description.
 */

const STORAGE_KEY = 'northleaf.cart.v1';

/** Store-wide pricing rules. The drawer, checkout and info pages all read these. */
export const PRICING = {
  freeShippingAt: 99,
  flatShipping: 15,
  minimumOrder: 60,
};

/** Mix & Match: once enough eligible units are in the cart, those lines take a percentage off. */
export const MIX_MATCH = {
  categories: ['flower', 'edibles', 'vapes', 'concentrates'],
  minItems: 4,
  percentOff: 15,
};

/** Totals for a set of cart lines — kept pure so pages can preview a cart that does not exist yet. */
export function priceLines(lines) {
  const subtotal = lines.reduce((sum, l) => sum + l.price * l.qty, 0);
  const eligible = lines.filter((l) => MIX_MATCH.categories.includes(l.category));
  const eligibleUnits = eligible.reduce((n, l) => n + l.qty, 0);
  const eligibleValue = eligible.reduce((sum, l) => sum + l.price * l.qty, 0);
  const discount =
    eligibleUnits >= MIX_MATCH.minItems ? Math.round(eligibleValue * MIX_MATCH.percentOff) / 100 : 0;
  const afterDiscount = subtotal - discount;
  const shipping = afterDiscount === 0 || afterDiscount >= PRICING.freeShippingAt ? 0 : PRICING.flatShipping;
  return { subtotal, eligibleUnits, discount, afterDiscount, shipping, total: afterDiscount + shipping };
}

const CartContext = createContext(null);

function readStoredCart() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Defensive: drop anything that does not look like a line item.
    return parsed
      .filter((l) => l && typeof l.id === 'string' && Number.isFinite(l.price))
      .map((l) => ({ ...l, qty: Math.max(1, Math.min(99, Number(l.qty) || 1)) }));
  } catch {
    return [];
  }
}

function cartReducer(lines, action) {
  switch (action.type) {
    case 'add': {
      const { product, qty } = action;
      const existing = lines.find((l) => l.id === product.id);
      if (existing) {
        return lines.map((l) => (l.id === product.id ? { ...l, qty: Math.min(99, l.qty + qty) } : l));
      }
      return [
        ...lines,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          size: product.size,
          category: product.category,
          imageUrl: product.imageUrl,
          qty,
        },
      ];
    }
    case 'setQty': {
      if (action.qty < 1) return lines.filter((l) => l.id !== action.id);
      return lines.map((l) => (l.id === action.id ? { ...l, qty: Math.min(99, action.qty) } : l));
    }
    case 'remove':
      return lines.filter((l) => l.id !== action.id);
    case 'clear':
      return [];
    default:
      return lines;
  }
}

export function CartProvider({ children }) {
  const [lines, dispatch] = useReducer(cartReducer, undefined, readStoredCart);
  const [isOpen, setIsOpen] = useState(false);

  // Persist on every change.
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* storage unavailable (private mode, blocked cookies) — cart stays in memory */
    }
  }, [lines]);

  const add = useCallback((product, qty = 1) => dispatch({ type: 'add', product, qty }), []);
  const setQty = useCallback((id, qty) => dispatch({ type: 'setQty', id, qty }), []);
  const remove = useCallback((id) => dispatch({ type: 'remove', id }), []);
  const clear = useCallback(() => dispatch({ type: 'clear' }), []);

  const value = useMemo(() => {
    const count = lines.reduce((n, l) => n + l.qty, 0);
    return {
      lines,
      count,
      ...priceLines(lines),
      add,
      setQty,
      remove,
      clear,
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
    };
  }, [lines, add, setQty, remove, clear, isOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}

export const formatPrice = (amount) =>
  new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', minimumFractionDigits: 2 }).format(amount);
