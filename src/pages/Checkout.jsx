import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, IdCard, Lock, ShieldCheck } from '../components/Icons';
import { EASE, Reveal } from '../components/Motion';
import { MIX_MATCH, PRICING, formatPrice, useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { paymentMethods } from '../data/content';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const POSTAL_RE = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;

const EMPTY = {
  email: '',
  name: '',
  address: '',
  city: '',
  province: 'ON',
  postal: '',
  phone: '',
  payment: paymentMethods[0].name,
  ageConfirmed: false,
};

const PROVINCES = ['AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'NT', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT'];

export default function Checkout() {
  const { lines, subtotal, discount, shipping, total, clear } = useCart();
  const { push } = useToast();
  const navigate = useNavigate();

  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState(null);

  const update = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  };

  const submit = async (e) => {
    e.preventDefault();
    const found = {};
    if (!EMAIL_RE.test(values.email.trim())) found.email = 'We send order updates here.';
    if (values.name.trim().length < 2) found.name = 'Name as it appears on your ID.';
    if (values.address.trim().length < 4) found.address = 'Street address, please.';
    if (values.city.trim().length < 2) found.city = 'Which city?';
    if (!POSTAL_RE.test(values.postal.trim())) found.postal = 'Canadian postal code, like M6G 2X1.';
    if (!values.ageConfirmed) found.ageConfirmed = 'We need this confirmation to ship.';

    setErrors(found);
    if (Object.keys(found).length) {
      document.getElementById(`co-${Object.keys(found)[0]}`)?.focus();
      return;
    }

    setPlacing(true);
    await new Promise((r) => setTimeout(r, 800));
    const orderId = `NL-${Math.floor(40000 + Math.random() * 9999)}`;
    setPlaced({ id: orderId, total });
    setPlacing(false);
    clear();
    push('Order placed', { detail: `${orderId} — demo only, nothing was charged.` });
  };

  const field = (name) => ({
    id: `co-${name}`,
    value: values[name],
    onChange: update(name),
    'aria-invalid': Boolean(errors[name]),
    'aria-describedby': errors[name] ? `co-${name}-error` : undefined,
    className: `field ${errors[name] ? 'border-clay/60' : ''}`,
  });

  const errorFor = (name) =>
    errors[name] ? (
      <p id={`co-${name}-error`} role="alert" className="mt-1.5 text-xs font-medium text-clay">
        {errors[name]}
      </p>
    ) : null;

  /* ---- confirmation ---- */
  if (placed) {
    return (
      <div className="shell py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="mx-auto max-w-lg text-center"
        >
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-leaf-700 text-white">
            <Check className="h-8 w-8" />
          </span>
          <h1 className="mt-6 text-4xl font-extrabold">Order {placed.id}</h1>
          <p className="mt-3 text-base leading-relaxed text-ink-500">
            In a real store you would now have an email with payment instructions and a tracking number to follow. This
            is a demo, so nothing was charged and nothing will ship.
          </p>

          <dl className="mt-8 rounded-3xl bg-white p-6 text-left shadow-soft ring-1 ring-ink-900/5">
            <div className="flex justify-between border-b border-ink-900/10 pb-3">
              <dt className="text-sm text-ink-500">Order total</dt>
              <dd className="font-display text-lg font-bold tabular-nums">{formatPrice(placed.total)}</dd>
            </div>
            <div className="flex justify-between pt-3">
              <dt className="text-sm text-ink-500">Delivery estimate</dt>
              <dd className="text-sm font-semibold">1–3 business days</dd>
            </div>
          </dl>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button type="button" onClick={() => navigate('/order-tracking')} className="btn btn-lg btn-primary">
              Track this order
            </button>
            <Link to="/shop" className="btn btn-lg btn-secondary">
              Keep shopping
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  /* ---- empty cart guard ---- */
  if (lines.length === 0) {
    return (
      <div className="shell flex flex-col items-center gap-5 py-28 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-3xl bg-sand-100 text-ink-400">
          <Lock className="h-7 w-7" />
        </span>
        <h1 className="text-3xl font-extrabold">Nothing to check out</h1>
        <p className="max-w-sm text-sm leading-relaxed text-ink-500">Your cart is empty, so there is nothing to pay for yet.</p>
        <Link to="/shop" className="btn btn-lg btn-primary">
          Browse the shop
        </Link>
      </div>
    );
  }

  return (
    <div className="shell pt-8 sm:pt-12">
      <Link to="/cart" className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-400 hover:text-leaf-700">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to cart
      </Link>

      <Reveal className="mt-6">
        <p className="eyebrow">Checkout</p>
        <h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">Where is it going?</h1>
      </Reveal>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-start lg:gap-12">
        <form onSubmit={submit} noValidate className="space-y-6">
          {/* Contact */}
          <section className="card p-6 sm:p-8">
            <h2 className="font-display text-lg font-bold">Contact</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="co-email" className="label">
                  Email
                </label>
                <input type="email" autoComplete="email" placeholder="you@example.ca" {...field('email')} />
                {errorFor('email')}
              </div>
              <div>
                <label htmlFor="co-phone" className="label">
                  Phone <span className="normal-case text-ink-400">(optional)</span>
                </label>
                <input type="tel" autoComplete="tel" placeholder="For courier updates" {...field('phone')} />
              </div>
            </div>
          </section>

          {/* Shipping */}
          <section className="card p-6 sm:p-8">
            <h2 className="font-display text-lg font-bold">Shipping address</h2>
            <div className="mt-5 grid gap-5">
              <div>
                <label htmlFor="co-name" className="label">
                  Full name
                </label>
                <input type="text" autoComplete="name" placeholder="Jordan Avery" {...field('name')} />
                {errorFor('name')}
              </div>
              <div>
                <label htmlFor="co-address" className="label">
                  Street address
                </label>
                <input type="text" autoComplete="street-address" placeholder="88 Wychwood Lane, Apt 4" {...field('address')} />
                {errorFor('address')}
              </div>
              <div className="grid gap-5 sm:grid-cols-3">
                <div>
                  <label htmlFor="co-city" className="label">
                    City
                  </label>
                  <input type="text" autoComplete="address-level2" placeholder="Toronto" {...field('city')} />
                  {errorFor('city')}
                </div>
                <div>
                  <label htmlFor="co-province" className="label">
                    Province
                  </label>
                  <select {...field('province')} className={`${field('province').className} appearance-none`}>
                    {PROVINCES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="co-postal" className="label">
                    Postal code
                  </label>
                  <input type="text" autoComplete="postal-code" placeholder="M6G 2X1" {...field('postal')} />
                  {errorFor('postal')}
                </div>
              </div>
            </div>
          </section>

          {/* Payment */}
          <section className="card p-6 sm:p-8">
            <h2 className="font-display text-lg font-bold">Payment</h2>
            <div className="mt-5 space-y-3">
              {paymentMethods.map((method) => (
                <label
                  key={method.name}
                  className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors duration-200 ${
                    values.payment === method.name
                      ? 'border-leaf-600 bg-leaf-50'
                      : 'border-ink-900/10 hover:border-leaf-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method.name}
                    checked={values.payment === method.name}
                    onChange={update('payment')}
                    className="mt-1 h-4 w-4 accent-leaf-700"
                  />
                  <span className="flex-1">
                    <span className="flex items-center justify-between gap-3">
                      <span className="font-display text-sm font-bold">{method.name}</span>
                      <span className="text-xs text-ink-400">{method.fee}</span>
                    </span>
                    <span className="mt-0.5 block text-sm text-ink-500">{method.detail}</span>
                  </span>
                </label>
              ))}
            </div>

            <label className="mt-6 flex cursor-pointer items-start gap-3">
              <input
                id="co-ageConfirmed"
                type="checkbox"
                checked={values.ageConfirmed}
                onChange={update('ageConfirmed')}
                className="mt-0.5 h-4 w-4 accent-leaf-700"
              />
              <span className="text-sm leading-relaxed text-ink-600">
                I confirm I am 19 or older and will present government-issued photo ID on delivery.
              </span>
            </label>
            {errorFor('ageConfirmed')}

            <button type="submit" disabled={placing} className="btn btn-lg btn-primary mt-7 w-full">
              {placing ? 'Placing order…' : `Place order · ${formatPrice(total)}`}
            </button>

            <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-ink-400">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-leaf-600" />
              Demo checkout. No payment is taken, no data leaves your browser.
            </p>
          </section>
        </form>

        {/* Summary */}
        <aside className="lg:sticky lg:top-28">
          <div className="card p-6">
            <h2 className="font-display text-lg font-bold">
              Your order <span className="text-ink-400">({lines.length})</span>
            </h2>

            <ul className="mt-5 space-y-3">
              {lines.map((line) => (
                <li key={line.id} className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="min-w-0">
                    <span className="font-medium text-ink-700">{line.name}</span>
                    <span className="text-ink-400"> × {line.qty}</span>
                  </span>
                  <span className="shrink-0 font-semibold tabular-nums">{formatPrice(line.price * line.qty)}</span>
                </li>
              ))}
            </ul>

            <dl className="mt-5 space-y-3 border-t border-ink-900/10 pt-5 text-sm">
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
          </div>

          <div className="mt-4 space-y-2.5 px-2 text-xs text-ink-400">
            <p className="flex items-center gap-2">
              <IdCard className="h-4 w-4 text-leaf-600" />
              ID checked at the door, every time.
            </p>
            <p className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-leaf-600" />
              Card details never touch our servers.
            </p>
            <p>
              Free shipping applies over {formatPrice(PRICING.freeShippingAt)}.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
