import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Cart, Minus, Plus, Tag, Truck, X } from './Icons';
import { EASE } from './Motion';
import Thumb from './Thumb';
import { MIX_MATCH, PRICING, formatPrice, useCart } from '../context/CartContext';

export default function CartDrawer() {
  const { lines, count, subtotal, discount, afterDiscount, eligibleUnits, setQty, remove, clear, isOpen, closeCart } =
    useCart();

  // Escape closes the drawer; body scroll is frozen while it is open.
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => e.key === 'Escape' && closeCart();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, closeCart]);

  const remaining = Math.max(0, PRICING.freeShippingAt - afterDiscount);
  const progress = Math.min(100, (afterDiscount / PRICING.freeShippingAt) * 100);
  const unitsToBundle = MIX_MATCH.minItems - eligibleUnits;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="cart-scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeCart}
            className="fixed inset-0 z-[60] bg-ink-900/50 backdrop-blur-sm"
          />

          <motion.aside
            key="cart-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.38, ease: EASE }}
            className="fixed inset-y-0 right-0 z-[65] flex w-full max-w-md flex-col bg-sand-50 shadow-lift"
          >
            <header className="flex items-center justify-between border-b border-ink-900/5 px-5 py-4">
              <h2 className="flex items-center gap-2 font-display text-lg font-bold">
                <Cart className="h-5 w-5 text-leaf-700" />
                Your cart
                <span className="text-ink-400">({count})</span>
              </h2>
              <button
                type="button"
                onClick={closeCart}
                aria-label="Close cart"
                className="btn btn-ghost grid h-9 w-9 place-items-center rounded-full"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
                <span className="grid h-16 w-16 place-items-center rounded-3xl bg-leaf-100 text-leaf-700">
                  <Cart className="h-7 w-7" />
                </span>
                <div>
                  <p className="font-display text-lg font-bold">Nothing here yet</p>
                  <p className="mt-1 text-sm text-ink-500">Add a few things and they will wait for you here.</p>
                </div>
                <Link to="/shop" onClick={closeCart} className="btn btn-md btn-primary">
                  Browse the shop
                </Link>
              </div>
            ) : (
              <>
                <ul className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
                  <AnimatePresence initial={false}>
                    {lines.map((line) => (
                      <motion.li
                        key={line.id}
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 40 }}
                        transition={{ duration: 0.25, ease: EASE }}
                        className="flex gap-3 rounded-2xl border border-ink-900/5 bg-white p-3"
                      >
                        <Thumb
                          category={line.category}
                          src={line.imageUrl}
                          alt={line.name}
                          seed={line.id}
                          glyphClass="h-4 w-4"
                          className="h-20 w-20 shrink-0 rounded-xl"
                        />

                        <div className="flex min-w-0 flex-1 flex-col">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <Link
                                to={`/product/${line.id}`}
                                onClick={closeCart}
                                className="block truncate font-display text-sm font-bold hover:text-leaf-700"
                              >
                                {line.name}
                              </Link>
                              <p className="text-xs text-ink-400">{line.size}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => remove(line.id)}
                              aria-label={`Remove ${line.name}`}
                              className="rounded-full p-1 text-ink-400 transition-colors hover:bg-ink-900/5 hover:text-ink-700"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          <div className="mt-auto flex items-center justify-between pt-2">
                            <div className="inline-flex items-center rounded-full border border-ink-900/10">
                              <button
                                type="button"
                                onClick={() => setQty(line.id, line.qty - 1)}
                                aria-label={`Decrease quantity of ${line.name}`}
                                className="grid h-8 w-8 place-items-center rounded-full text-ink-500 transition-colors hover:bg-ink-900/5"
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="w-7 text-center text-sm font-semibold tabular-nums">{line.qty}</span>
                              <button
                                type="button"
                                onClick={() => setQty(line.id, line.qty + 1)}
                                aria-label={`Increase quantity of ${line.name}`}
                                className="grid h-8 w-8 place-items-center rounded-full text-ink-500 transition-colors hover:bg-ink-900/5"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <span className="text-sm font-bold tabular-nums">{formatPrice(line.price * line.qty)}</span>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>

                <footer className="border-t border-ink-900/5 bg-white px-5 py-4">
                  {/* Free-shipping progress */}
                  <div className="mb-4">
                    <p className="flex items-center gap-2 text-xs font-medium text-ink-500">
                      <Truck className="h-4 w-4 text-leaf-600" />
                      {remaining > 0 ? (
                        <>
                          <span className="font-semibold text-ink-700">{formatPrice(remaining)}</span> away from free
                          discreet shipping
                        </>
                      ) : (
                        <span className="font-semibold text-leaf-700">Free discreet shipping unlocked</span>
                      )}
                    </p>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-sand-200">
                      <motion.div
                        className="h-full rounded-full bg-leaf-600"
                        initial={false}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.4, ease: EASE }}
                      />
                    </div>
                  </div>

                  {/* Mix & Match: either the saving, or how close the cart is to it */}
                  {discount > 0 ? (
                    <div className="mb-3 flex items-center justify-between rounded-xl bg-leaf-50 px-3 py-2 text-xs">
                      <span className="flex items-center gap-1.5 font-semibold text-leaf-800">
                        <Tag className="h-3.5 w-3.5" />
                        Mix &amp; Match {MIX_MATCH.percentOff}% off
                      </span>
                      <span className="font-bold tabular-nums text-leaf-800">−{formatPrice(discount)}</span>
                    </div>
                  ) : (
                    eligibleUnits > 0 && (
                      <Link
                        to="/mix-and-match"
                        onClick={closeCart}
                        className="mb-3 flex items-center gap-1.5 rounded-xl bg-sand-100 px-3 py-2 text-xs text-ink-600 transition-colors hover:bg-sand-200"
                      >
                        <Tag className="h-3.5 w-3.5 text-leaf-600" />
                        Add {unitsToBundle} more eligible item{unitsToBundle === 1 ? '' : 's'} for {MIX_MATCH.percentOff}% off
                      </Link>
                    )
                  )}

                  <div className="flex items-baseline justify-between">
                    <span className="text-sm text-ink-500">Subtotal</span>
                    <span className="font-display text-2xl font-extrabold tabular-nums">
                      {discount > 0 && (
                        <s className="mr-2 text-sm font-medium text-ink-400">{formatPrice(subtotal)}</s>
                      )}
                      {formatPrice(afterDiscount)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-ink-400">Taxes calculated at checkout. ID checked on delivery.</p>

                  <Link to="/checkout" onClick={closeCart} className="btn btn-lg btn-primary mt-4 w-full">
                    Checkout
                  </Link>
                  <button type="button" onClick={clear} className="btn btn-md btn-ghost mt-1 w-full">
                    Clear cart
                  </button>
                </footer>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
