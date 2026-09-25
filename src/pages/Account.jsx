import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Check, Gift, IdCard, MapPin, Package, User } from '../components/Icons';
import { EASE, Reveal } from '../components/Motion';
import { formatPrice } from '../context/CartContext';
import { mockAccount, mockOrders } from '../data/content';
import { useToast } from '../context/ToastContext';

const TABS = [
  { id: 'orders', label: 'Orders' },
  { id: 'rewards', label: 'Leaf Points' },
  { id: 'details', label: 'Details' },
];

const STATUS_STYLES = {
  Delivered: 'border-leaf-700/20 bg-leaf-50 text-leaf-700',
  'In transit': 'border-clay/30 bg-clay/10 text-clay',
  Refunded: 'border-ink-900/10 bg-sand-100 text-ink-500',
};

export default function Account() {
  const [tab, setTab] = useState('orders');
  const { push } = useToast();

  const nextTierProgress = Math.round(
    (mockAccount.points / (mockAccount.points + mockAccount.pointsToNextTier)) * 100,
  );

  return (
    <div className="shell pt-10 sm:pt-14">
      {/* Header card */}
      <Reveal className="flex flex-col gap-6 rounded-4xl bg-leaf-800 p-8 text-white sm:flex-row sm:items-center sm:justify-between sm:p-10">
        <div className="flex items-center gap-4">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/15 text-mint-200">
            <User className="h-7 w-7" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-mint-200">
              {mockAccount.tier} member · since {mockAccount.memberSince}
            </p>
            <h1 className="mt-1 font-display text-3xl font-extrabold text-white">{mockAccount.name}</h1>
            <p className="text-sm text-mint-100/70">{mockAccount.email}</p>
          </div>
        </div>

        <div className="rounded-3xl bg-white/10 p-5 sm:min-w-[13rem]">
          <p className="text-xs font-semibold uppercase tracking-wider text-mint-200">Leaf Points</p>
          <p className="mt-1 font-display text-4xl font-extrabold tabular-nums">{mockAccount.points.toLocaleString()}</p>
          <p className="mt-1 text-xs text-mint-100/70">
            worth {formatPrice(mockAccount.points / 100)} off your next order
          </p>
        </div>
      </Reveal>

      <p className="mt-4 text-xs text-ink-400">
        Demo account — no sign-in, and nothing here is stored beyond this page.
      </p>

      {/* Tabs */}
      <div className="mt-8 flex gap-2 border-b border-ink-900/10">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            aria-selected={tab === t.id}
            role="tab"
            className={`relative px-4 py-3 text-sm font-semibold transition-colors ${
              tab === t.id ? 'text-leaf-800' : 'text-ink-500 hover:text-ink-800'
            }`}
          >
            {t.label}
            {tab === t.id && (
              <motion.span
                layoutId="account-tab"
                className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-leaf-700"
                transition={{ duration: 0.3, ease: EASE }}
              />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: EASE }}
          className="mt-8"
        >
          {/* Orders */}
          {tab === 'orders' && (
            <ul className="space-y-4">
              {mockOrders.map((order) => (
                <li key={order.id} className="card p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <h2 className="font-display text-lg font-bold">{order.id}</h2>
                        <span className={`chip ${STATUS_STYLES[order.status] ?? ''}`}>{order.status}</span>
                      </div>
                      <p className="mt-1 text-xs text-ink-400">{order.date}</p>
                    </div>
                    <p className="font-display text-xl font-extrabold tabular-nums">{formatPrice(order.total)}</p>
                  </div>

                  <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1.5 border-t border-ink-900/5 pt-4">
                    {order.items.map((item) => (
                      <li key={item.name} className="text-sm text-ink-600">
                        {item.name} <span className="text-ink-400">× {item.qty}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link to="/order-tracking" className="btn btn-md btn-secondary">
                      <Package className="h-4 w-4" />
                      Track
                    </Link>
                    <Link to="/shop" className="btn btn-md btn-ghost">
                      Reorder
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Rewards */}
          {tab === 'rewards' && (
            <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="card p-6 sm:p-8">
                <h2 className="font-display text-lg font-bold">Progress to Cultivar</h2>
                <p className="mt-1 text-sm text-ink-500">
                  {mockAccount.pointsToNextTier.toLocaleString()} points to go. Tier is reviewed on a rolling twelve
                  months.
                </p>

                <div className="mt-6 h-2 overflow-hidden rounded-full bg-sand-200">
                  <motion.div
                    className="h-full rounded-full bg-leaf-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${nextTierProgress}%` }}
                    transition={{ duration: 0.8, ease: EASE }}
                  />
                </div>
                <div className="mt-2 flex justify-between text-xs text-ink-400">
                  <span>Grower · 4% back</span>
                  <span>Cultivar · 6% back</span>
                </div>

                <dl className="mt-8 grid gap-4 sm:grid-cols-3">
                  {[
                    { label: 'Earned this year', value: '3,120 pts' },
                    { label: 'Redeemed', value: '640 pts' },
                    { label: 'Expiring', value: 'None' },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-2xl bg-sand-100 p-4">
                      <dt className="text-[11px] font-bold uppercase tracking-wider text-ink-500">{stat.label}</dt>
                      <dd className="mt-0.5 font-display text-lg font-extrabold tabular-nums">{stat.value}</dd>
                    </div>
                  ))}
                </dl>

                <Link to="/rewards" className="btn btn-md btn-secondary mt-7">
                  How the tiers work
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="card flex flex-col p-6 sm:p-8">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-leaf-100 text-leaf-700">
                  <Gift className="h-5 w-5" />
                </span>
                <h2 className="mt-4 font-display text-lg font-bold">Your referral code</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-500">
                  They save $15 on a first order, you get $15 in points the day it ships.
                </p>
                <p className="mt-5 rounded-2xl border border-dashed border-leaf-600/40 bg-leaf-50 px-4 py-3 text-center font-display text-lg font-extrabold tracking-wide text-leaf-800">
                  {mockAccount.referralCode}
                </p>
                <button
                  type="button"
                  onClick={() => push('Referral code copied', { detail: 'Demo only — nothing was shared.' })}
                  className="btn btn-md btn-primary mt-4"
                >
                  <Check className="h-4 w-4" />
                  Copy code
                </button>
              </div>
            </div>
          )}

          {/* Details */}
          {tab === 'details' && (
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="card p-6">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-sand-100 text-leaf-700">
                  <MapPin className="h-5 w-5" />
                </span>
                <h2 className="mt-4 font-display text-base font-bold">Shipping address</h2>
                <address className="mt-2 text-sm not-italic leading-relaxed text-ink-500">
                  {mockAccount.name}
                  <br />
                  {mockAccount.address.line1}
                  <br />
                  {mockAccount.address.line2}
                  <br />
                  {mockAccount.address.city}
                </address>
              </div>

              <div className="card p-6">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-sand-100 text-leaf-700">
                  <IdCard className="h-5 w-5" />
                </span>
                <h2 className="mt-4 font-display text-base font-bold">Age verification</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">
                  Verified at sign-up and confirmed on every delivery. Photo ID is checked at the door by the courier —
                  we never store a copy of it.
                </p>
                <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-leaf-700">
                  <Check className="h-3.5 w-3.5" />
                  Age verified
                </p>
              </div>

              <div className="card p-6 sm:col-span-2">
                <h2 className="font-display text-base font-bold">Communication</h2>
                <div className="mt-4 space-y-3">
                  {[
                    { label: 'Order and shipping updates', locked: true },
                    { label: 'Restock and drop notices', locked: false },
                    { label: 'Monthly Field Notes digest', locked: false },
                  ].map((pref) => (
                    <label key={pref.label} className="flex items-center justify-between gap-4 rounded-xl bg-sand-50 px-4 py-3">
                      <span className="text-sm text-ink-600">{pref.label}</span>
                      <input
                        type="checkbox"
                        defaultChecked
                        disabled={pref.locked}
                        className="h-4 w-4 accent-leaf-700 disabled:opacity-50"
                      />
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
