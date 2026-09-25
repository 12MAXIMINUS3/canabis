import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Check, Package, Search, Truck } from '../components/Icons';
import { EASE, Reveal } from '../components/Motion';
import PageHero from '../components/PageHero';
import { trackedOrder } from '../data/content';
import { useToast } from '../context/ToastContext';

/**
 * Mock order lookup. The demo recognises one order number (NL-48213) with any
 * email; anything else produces the "not found" state so both paths are visible.
 */
export default function OrderTracking() {
  const [form, setForm] = useState({ order: '', email: '' });
  const [status, setStatus] = useState('idle'); // idle | searching | found | missing
  const [error, setError] = useState('');
  const { push } = useToast();

  const submit = async (e) => {
    e.preventDefault();
    if (!form.order.trim()) {
      setError('Enter the order number from your confirmation email.');
      return;
    }
    setError('');
    setStatus('searching');
    await new Promise((r) => setTimeout(r, 600));

    if (form.order.trim().toUpperCase().replace(/\s/g, '') === trackedOrder.id) {
      setStatus('found');
      push('Order found', { detail: `${trackedOrder.id} — ${trackedOrder.eta}` });
    } else {
      setStatus('missing');
    }
  };

  return (
    <>
      <PageHero
        compact
        eyebrow="Order tracking"
        title="Where is my parcel?"
        copy="Enter the order number from your confirmation email. Tracking usually goes live within an hour of the courier collecting it."
        image="/images/editorial/tracking.jpg"
        alt="Parcels waiting on a front porch"
      />

      <div className="shell grid gap-10 pb-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
        {/* Lookup form */}
        <Reveal>
          <form onSubmit={submit} noValidate className="card p-6 sm:p-8">
            <h2 className="font-display text-lg font-bold">Look up an order</h2>
            <p className="mt-1 text-sm text-ink-500">
              Demo tip: try <code className="rounded bg-sand-100 px-1.5 py-0.5 font-semibold">NL-48213</code>.
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
                Email on the order <span className="normal-case text-ink-400">(optional)</span>
              </label>
              <input
                id="order-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.ca"
                className="field"
              />
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
            {status === 'found' && (
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
                    <p className="font-display text-2xl font-extrabold">{trackedOrder.id}</p>
                  </div>
                  <span className="chip border-leaf-700 bg-leaf-700 text-white">Delivered</span>
                </div>

                <dl className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-sand-100 p-4">
                    <dt className="text-[11px] font-bold uppercase tracking-wider text-ink-500">Carrier</dt>
                    <dd className="mt-0.5 text-sm font-semibold">{trackedOrder.carrier}</dd>
                  </div>
                  <div className="rounded-2xl bg-sand-100 p-4">
                    <dt className="text-[11px] font-bold uppercase tracking-wider text-ink-500">Tracking</dt>
                    <dd className="mt-0.5 text-sm font-semibold tabular-nums">{trackedOrder.tracking}</dd>
                  </div>
                </dl>

                {/* Timeline */}
                <ol className="mt-8 space-y-0">
                  {trackedOrder.steps.map((step, i) => (
                    <motion.li
                      key={step.label}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.08 * i, duration: 0.3, ease: EASE }}
                      className="relative flex gap-4 pb-6 last:pb-0"
                    >
                      {i < trackedOrder.steps.length - 1 && (
                        <span aria-hidden="true" className="absolute left-[13px] top-7 h-full w-px bg-leaf-200" />
                      )}
                      <span className="relative z-10 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-leaf-600 text-white">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <p className="font-display text-sm font-bold">{step.label}</p>
                          <p className="text-xs text-ink-400 tabular-nums">{step.date}</p>
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
                  <h2 className="font-display text-xl font-bold">No order with that number</h2>
                  <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink-500">
                    Check the confirmation email — order numbers look like NL-48213. If it still will not find it, we
                    can look it up by email address.
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
