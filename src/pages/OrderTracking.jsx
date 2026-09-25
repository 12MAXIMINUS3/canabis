import { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Check, Package, Search, Truck } from '../components/Icons';
import { EASE, Reveal } from '../components/Motion';
import PageHero from '../components/PageHero';
import { trackedOrder } from '../data/content';
import { useToast } from '../context/ToastContext';
import { trackOrder } from '../context/CatalogContext';
import { formatPrice } from '../context/CartContext';

/**
 * Real order lookup, backed by the `track_order` database function, which only
 * returns a row when the order number AND the email both match — so the form
 * cannot be used to walk through other people's order numbers.
 *
 * The seeded demo order (NL-48213) is still recognised without an email, so the
 * page has something to show before you have placed one.
 */

/** Builds a delivery timeline from an order status. */
function stepsFor(status) {
  const sequence = [
    { label: 'Order received', detail: 'Payment confirmed' },
    { label: 'Packed', detail: 'Sealed in plain packaging, lab sheet enclosed' },
    { label: 'Handed to courier', detail: 'Tracked, signature required' },
    { label: 'In transit', detail: 'On its way to you' },
    { label: 'Delivered', detail: 'ID checked at the door' },
  ];
  const reached = { Received: 1, Packed: 2, Shipped: 3, 'In transit': 4, Delivered: 5 }[status] ?? 1;
  return sequence.map((step, i) => ({ ...step, done: i < reached }));
}

export default function OrderTracking() {
  const [params] = useSearchParams();
  const [form, setForm] = useState({ order: params.get('order') ?? '', email: params.get('email') ?? '' });
  const [status, setStatus] = useState('idle'); // idle | searching | found | missing
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const { push } = useToast();

  const lookup = useCallback(
    async (order, email) => {
      if (!order.trim()) {
        setError('Enter the order number from your confirmation email.');
        return;
      }
      setError('');
      setStatus('searching');

      const normalised = order.trim().toUpperCase().replace(/\s/g, '');

      // The seeded sample order, so the page is demonstrable without an account.
      if (normalised === trackedOrder.id) {
        setResult({
          number: trackedOrder.id,
          status: 'Delivered',
          carrier: trackedOrder.carrier,
          tracking: trackedOrder.tracking,
          steps: trackedOrder.steps,
          total: null,
          items: [],
        });
        setStatus('found');
        push('Order found', { detail: `${trackedOrder.id} — ${trackedOrder.eta}` });
        return;
      }

      const res = await trackOrder(order, email);

      if (res.ok && res.order) {
        const o = res.order;
        setResult({
          number: o.order_number,
          status: o.status,
          carrier: 'NorthPost Tracked',
          tracking: `NP${o.order_number.replace(/\D/g, '')} ${new Date(o.created_at).getFullYear()}`,
          steps: stepsFor(o.status),
          total: Number(o.total),
          items: o.items ?? [],
          placedAt: new Date(o.created_at).toLocaleDateString('en-CA', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }),
        });
        setStatus('found');
        push('Order found', { detail: `${o.order_number} — ${o.status}` });
        return;
      }

      setStatus('missing');
    },
    [push],
  );

  // Arriving from checkout with ?order=&email= looks the order up immediately.
  useEffect(() => {
    const order = params.get('order');
    const email = params.get('email');
    if (order && email) lookup(order, email);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = (e) => {
    e.preventDefault();
    lookup(form.order, form.email);
  };

  return (
    <>
      <PageHero
        compact
        eyebrow="Order tracking"
        title="Where is my parcel?"
        copy="Enter the order number and the email you ordered with. Tracking usually goes live within an hour of the courier collecting it."
        image="/images/editorial/tracking.jpg"
        alt="Parcels waiting on a front porch"
      />

      <div className="shell grid gap-10 pb-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
        {/* Lookup form */}
        <Reveal>
          <form onSubmit={submit} noValidate className="card p-6 sm:p-8">
            <h2 className="font-display text-lg font-bold">Look up an order</h2>
            <p className="mt-1 text-sm text-ink-500">
              No order yet? Try the sample: <code className="rounded bg-sand-100 px-1.5 py-0.5 font-semibold">NL-48213</code>
            </p>

            <div className="mt-6">
              <label htmlFor="order-number" className="label">
                Order number
              </label>
              <input
                id="order-number"
                value={form.order}
                onChange={(e) => {
                  setForm({ ...form, order: e.target.value });
                  setError('');
                  setStatus('idle');
                }}
                placeholder="NL-00000"
                aria-invalid={Boolean(error)}
                aria-describedby={error ? 'order-error' : undefined}
                className={`field ${error ? 'border-clay/60' : ''}`}
              />
              {error && (
                <p id="order-error" role="alert" className="mt-1.5 text-xs font-medium text-clay">
                  {error}
                </p>
              )}
            </div>

            <div className="mt-5">
              <label htmlFor="order-email" className="label">
                Email on the order
              </label>
              <input
                id="order-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.ca"
                className="field"
              />
              <p className="mt-1.5 text-xs text-ink-400">
                Required for real orders — it is what proves the order is yours.
              </p>
            </div>

            <button type="submit" disabled={status === 'searching'} className="btn btn-lg btn-primary mt-7 w-full">
              {status === 'searching' ? 'Looking…' : 'Track order'}
              {status !== 'searching' && <Search className="h-4 w-4" />}
            </button>
          </form>

          <div className="mt-6 space-y-2.5 text-sm text-ink-500">
            {[
              'Tracking updates once the courier scans the parcel, not at packing.',
              'Someone 19+ must sign. Couriers will not leave cannabis at the door.',
              'No movement for four business days? Contact us and we open a trace.',
            ].map((line) => (
              <p key={line} className="flex items-start gap-2.5">
                <Truck className="mt-0.5 h-4 w-4 shrink-0 text-leaf-600" />
                {line}
              </p>
            ))}
          </div>
        </Reveal>

        {/* Result */}
        <div>
          <AnimatePresence mode="wait">
            {status === 'found' && result && (
              <motion.div
                key="found"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="card p-6 sm:p-8"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">Order</p>
                    <p className="font-display text-2xl font-extrabold">{result.number}</p>
                    {result.placedAt && <p className="mt-0.5 text-xs text-ink-400">Placed {result.placedAt}</p>}
                  </div>
                  <span className="chip border-leaf-700 bg-leaf-700 text-white">{result.status}</span>
                </div>

                <dl className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-sand-100 p-4">
                    <dt className="text-[11px] font-bold uppercase tracking-wider text-ink-500">Carrier</dt>
                    <dd className="mt-0.5 text-sm font-semibold">{result.carrier}</dd>
                  </div>
                  <div className="rounded-2xl bg-sand-100 p-4">
                    <dt className="text-[11px] font-bold uppercase tracking-wider text-ink-500">
                      {result.total != null ? 'Order total' : 'Tracking'}
                    </dt>
                    <dd className="mt-0.5 text-sm font-semibold tabular-nums">
                      {result.total != null ? formatPrice(result.total) : result.tracking}
                    </dd>
                  </div>
                </dl>

                {result.items.length > 0 && (
                  <ul className="mt-5 space-y-1.5 rounded-2xl bg-leaf-50 p-4">
                    {result.items.map((item) => (
                      <li key={item.name} className="text-sm text-ink-600">
                        {item.name} <span className="text-ink-400">× {item.quantity}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <ol className="mt-8 space-y-0">
                  {result.steps.map((step, i) => (
                    <motion.li
                      key={step.label}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.08 * i, duration: 0.3, ease: EASE }}
                      className="relative flex gap-4 pb-6 last:pb-0"
                    >
                      {i < result.steps.length - 1 && (
                        <span
                          aria-hidden="true"
                          className={`absolute left-[13px] top-7 h-full w-px ${step.done ? 'bg-leaf-200' : 'bg-sand-200'}`}
                        />
                      )}
                      <span
                        className={`relative z-10 grid h-7 w-7 shrink-0 place-items-center rounded-full ${
                          step.done ? 'bg-leaf-600 text-white' : 'border border-sand-300 bg-white text-sand-400'
                        }`}
                      >
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <p className={`font-display text-sm font-bold ${step.done ? '' : 'text-ink-400'}`}>
                            {step.label}
                          </p>
                          {step.date && <p className="text-xs text-ink-400 tabular-nums">{step.date}</p>}
                        </div>
                        <p className="mt-0.5 text-sm text-ink-500">{step.detail}</p>
                      </div>
                    </motion.li>
                  ))}
                </ol>
              </motion.div>
            )}

            {status === 'missing' && (
              <motion.div
                key="missing"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="card flex flex-col items-center gap-4 px-6 py-16 text-center"
              >
                <span className="grid h-16 w-16 place-items-center rounded-3xl bg-sand-100 text-ink-400">
                  <Package className="h-7 w-7" />
                </span>
                <div>
                  <h2 className="font-display text-xl font-bold">No order matched</h2>
                  <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink-500">
                    Both the order number and the email have to match the order exactly. Check the confirmation email —
                    numbers look like NL-48213.
                  </p>
                </div>
                <Link to="/contact" className="btn btn-md btn-primary">
                  Ask support
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            )}

            {(status === 'idle' || status === 'searching') && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex h-full min-h-[18rem] flex-col items-center justify-center gap-3 rounded-4xl border border-dashed border-ink-900/15 px-6 text-center"
              >
                <Truck className="h-8 w-8 text-ink-300" />
                <p className="max-w-xs text-sm text-ink-400">
                  Your delivery timeline will appear here once we find the order.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
