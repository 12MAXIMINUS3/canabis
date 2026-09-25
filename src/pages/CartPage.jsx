import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Cart, Info, Minus, Plus, Tag, Truck, X } from '../components/Icons';
import { EASE, Reveal } from '../components/Motion';
import Thumb from '../components/Thumb';
import { MIX_MATCH, PRICING, formatPrice, useCart } from '../context/CartContext';

/** Full-page cart. The drawer is for quick edits; this is the considered view. */
export default function CartPage() {
  const { lines, count, subtotal, discount, afterDiscount, shipping, total, eligibleUnits, setQty, remove, clear } =
    useCart();

  const belowMinimum = afterDiscount > 0 && afterDiscount < PRICING.minimumOrder;
  const toFreeShipping = Math.max(0, PRICING.freeShippingAt - afterDiscount);
  const toBundle = Math.max(0, MIX_MATCH.minItems - eligibleUnits);

  if (lines.length === 0) {
    return (
      <div className="shell flex flex-col items-center gap-5 py-28 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-3xl bg-leaf-100 text-leaf-700">
          <Cart className="h-7 w-7" />
        </span>
        <h1 className="text-3xl font-extrabold">Your cart is empty</h1>
        <p className="max-w-sm text-sm leading-relaxed text-ink-500">
          Nothing in here yet. Bundles of four or more save {MIX_MATCH.percentOff}%, if you are deciding where to start.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link to="/shop" className="btn btn-lg btn-primary">
            Browse the shop
          </Link>
          <Link to="/mix-and-match" className="btn btn-lg btn-secondary">
            Build a bundle
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="shell pt-10 sm:pt-14">
      <Reveal>
        <p className="eyebrow">Cart</p>
        <h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">
          Your cart <span className="text-ink-400">({count})</span>
        </h1>
      </Reveal>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-start lg:gap-12">
        {/* Lines */}
        <section>
          <ul className="space-y-4">
            <AnimatePresence initial={false}>
              {lines.map((line) => (
                <motion.li
                  key={line.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 40 }}
                  transition={{ duration: 0.25, ease: EASE }}
                  className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center"
                >
                  <Thumb
                    category={line.category}
                    src={line.imageUrl}
                    alt={line.name}
                    seed={line.id}
                    glyphClass="h-5 w-5"
                    className="h-28 w-full shrink-0 rounded-2xl sm:h-24 sm:w-24"
                  />

                  <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <Link
                        to={`/product/${line.id}`}
                        className="font-display text-base font-bold transition-colors hover:text-leaf-700"
                      >
                        {line.name}
                      </Link>
                      <p className="text-xs text-ink-400">{line.size}</p>
                      {MIX_MATCH.categories.includes(line.category) && (
                        <p className="mt-1.5 inline-flex items-center gap-1.5 text-[11px] font-semibold text-leaf-700">
                          <Tag className="h-3.5 w-3.5" />
                          Counts toward Mix &amp; Match
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="inline-flex items-center rounded-full border border-ink-900/10">
                        <button
                          type="button"
                          onClick={() => setQty(line.id, line.qty - 1)}
                          aria-label={`Decrease quantity of ${line.name}`}
                          className="grid h-9 w-9 place-items-center rounded-full text-ink-500 transition-colors hover:bg-ink-900/5"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold tabular-nums">{line.qty}</span>
                        <button
                          type="button"
                          onClick={() => setQty(line.id, line.qty + 1)}
                          aria-label={`Increase quantity of ${line.name}`}
                          className="grid h-9 w-9 place-items-center rounded-full text-ink-500 transition-colors hover:bg-ink-900/5"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <span className="w-20 text-right font-display text-base font-bold tabular-nums">
                        {formatPrice(line.price * line.qty)}
                      </span>

                      <button
                        type="button"
                        onClick={() => remove(line.id)}
                        aria-label={`Remove ${line.name}`}
                        className="rounded-full p-1.5 text-ink-400 transition-colors hover:bg-ink-900/5 hover:text-ink-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/shop" className="btn btn-md btn-secondary">
              Keep shopping
            </Link>
            <button type="button" onClick={clear} className="btn btn-md btn-ghost">
              Clear cart
            </button>
          </div>

          {/* Nudges */}
          <div className="mt-8 space-y-3">
            {toBundle > 0 && (
              <Link
                to="/mix-and-match"
                className="flex items-center gap-3 rounded-2xl border border-leaf-700/15 bg-leaf-50 p-4 text-sm text-leaf-900 transition-colors hover:bg-leaf-100"
              >
                <Tag className="h-5 w-5 shrink-0 text-leaf-700" />
                <span>
                  Add <span className="font-bold">{toBundle} more eligible item{toBundle === 1 ? '' : 's'}</span> to take{' '}
                  {MIX_MATCH.percentOff}% off those lines.
                </span>
                <ArrowRight className="ml-auto h-4 w-4 shrink-0" />
              </Link>
            )}
            {toFreeShipping > 0 && (
              <div className="flex items-center gap-3 rounded-2xl bg-sand-100 p-4 text-sm text-ink-600">
                <Truck className="h-5 w-5 shrink-0 text-leaf-700" />
                <span>
                  <span className="font-bold">{formatPrice(toFreeShipping)}</span> away from free discreet shipping.
                </span>
              </div>
            )}
          </div>
        </section>

        {/* Summary */}
        <aside className="lg:sticky lg:top-28">
          <div className="card p-6">
            <h2 className="font-display text-lg font-bold">Order summary</h2>

            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-500">Subtotal</dt>
                <dd className="font-semibold tabular-nums">{formatPrice(subtotal)}</dd>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-leaf-700">
                  <dt className="font-medium">Mix &amp; Match ({MIX_MATCH.percentOff}%)</dt>
                  <dd className="font-semibold tabular-nums">−{formatPrice(discount)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-ink-500">Shipping</dt>
                <dd className="font-semibold tabular-nums">{shipping === 0 ? 'Free' : formatPrice(shipping)}</dd>
              </div>
              <div className="flex justify-between border-t border-ink-900/10 pt-3">
                <dt className="font-display text-base font-bold">Total</dt>
                <dd className="font-display text-2xl font-extrabold tabular-nums">{formatPrice(total)}</dd>
              </div>
            </dl>

            <p className="mt-2 text-xs text-ink-400">Taxes calculated at checkout. ID checked on delivery.</p>

            {belowMinimum ? (
              <div className="mt-5 flex items-start gap-2.5 rounded-2xl bg-clay/10 p-4 text-xs leading-relaxed text-clay">
                <Info className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  Minimum order is {formatPrice(PRICING.minimumOrder)}. Add{' '}
                  <span className="font-bold">{formatPrice(PRICING.minimumOrder - afterDiscount)}</span> more to check
                  out.
                </span>
              </div>
            ) : null}

            <Link
              to="/checkout"
              aria-disabled={belowMinimum}
              onClick={(e) => belowMinimum && e.preventDefault()}
              className={`btn btn-lg btn-primary mt-5 w-full ${belowMinimum ? 'pointer-events-none opacity-50' : ''}`}
            >
              Checkout
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-4 space-y-2 px-2 text-xs text-ink-400">
            <p>Plain, odour-sealed packaging with no branding.</p>
            <p>Tracked courier, adult signature required.</p>
            <p>Lab certificate for your exact lot in the box.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
