import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  Plus,
  Trash,
  Cart,
  Check,
  ChevronDown,
  Gift,
  Leaf,
  Lock,
  Mail,
  Package,
  Search,
  Sprout,
  User,
} from '../components/Icons';
import { EASE } from '../components/Motion';
import { formatPrice } from '../context/CartContext';
import { useCatalog } from '../context/CatalogContext';
import ProductForm from '../components/ProductForm';
import Thumb from '../components/Thumb';
import {
  ORDER_STATUSES,
  fetchApplications,
  fetchMessages,
  fetchOrderItems,
  fetchOrders,
  fetchStats,
  fetchSubscribers,
  updateOrderStatus,
  updateProduct,
  deleteProduct,
  useAdmin,
} from '../context/AdminContext';
import { useToast } from '../context/ToastContext';

/**
 * Admin dashboard at /admin.
 *
 * Access is enforced by the database, not by this file: every query below is
 * subject to Row Level Security and returns nothing unless the signed-in email
 * is on the admin_users allowlist. The UI gate is only there to avoid showing
 * an empty screen to someone who has no business here.
 */

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'orders', label: 'Orders' },
  { id: 'products', label: 'Products' },
  { id: 'messages', label: 'Messages' },
  { id: 'vendors', label: 'Vendors' },
  { id: 'subscribers', label: 'Subscribers' },
];

const shortDate = (iso) =>
  new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });

const dateTime = (iso) =>
  new Date(iso).toLocaleString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

const STATUS_STYLE = {
  Received: 'border-clay/30 bg-clay/10 text-clay',
  Packed: 'border-leaf-700/20 bg-leaf-50 text-leaf-700',
  Shipped: 'border-leaf-700/20 bg-leaf-50 text-leaf-700',
  'In transit': 'border-leaf-700/20 bg-leaf-50 text-leaf-700',
  Delivered: 'border-leaf-700 bg-leaf-700 text-white',
  Refunded: 'border-ink-900/10 bg-sand-100 text-ink-500',
};

/* ------------------------------------------------------------------ */
/* Sign in                                                             */
/* ------------------------------------------------------------------ */

function SignIn() {
  const { signIn, configured } = useAdmin();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    const res = await signIn(form.email, form.password);
    setBusy(false);
    if (!res.ok) setError(res.message === 'Invalid login credentials' ? 'That email and password do not match.' : res.message);
  };

  return (
    <div className="shell flex min-h-[70vh] items-center justify-center py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE }}
        className="w-full max-w-md"
      >
        <div className="card p-8">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-leaf-700 text-white">
            <Lock className="h-6 w-6" />
          </span>
          <h1 className="mt-5 font-display text-2xl font-extrabold">Staff sign in</h1>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-500">
            This area shows orders and customer messages. Access is limited to approved accounts.
          </p>

          {!configured && (
            <p className="mt-5 rounded-xl bg-clay/10 p-3 text-xs text-clay">
              Supabase is not configured in this build, so sign-in is unavailable.
            </p>
          )}

          <form onSubmit={submit} noValidate className="mt-6">
            <label htmlFor="admin-email" className="label">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              autoComplete="username"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              className="field"
            />

            <label htmlFor="admin-password" className="label mt-5">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              className="field"
            />

            {error && (
              <p role="alert" className="mt-3 text-xs font-medium text-clay">
                {error}
              </p>
            )}

            <button type="submit" disabled={busy || !configured} className="btn btn-lg btn-primary mt-6 w-full">
              {busy ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="mt-5 text-center text-xs text-ink-400">
          <Link to="/" className="hover:text-leaf-700">
            ← Back to the storefront
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Small pieces                                                        */
/* ------------------------------------------------------------------ */

function StatCard({ Icon, label, value, hint }) {
  return (
    <div className="card p-5">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-leaf-100 text-leaf-700">
        <Icon className="h-5 w-5" />
      </span>
      <p className="mt-4 font-display text-3xl font-extrabold tabular-nums">{value}</p>
      <p className="mt-0.5 text-sm text-ink-500">{label}</p>
      {hint && <p className="mt-1 text-xs text-ink-400">{hint}</p>}
    </div>
  );
}

function Empty({ children }) {
  return (
    <div className="card flex flex-col items-center gap-3 px-6 py-16 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-3xl bg-sand-100 text-ink-400">
        <Search className="h-6 w-6" />
      </span>
      <p className="text-sm text-ink-500">{children}</p>
    </div>
  );
}

function Table({ headers, children }) {
  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-ink-900/5 bg-sand-50">
            <tr>
              {headers.map((h) => (
                <th key={h} className="whitespace-nowrap px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-ink-500">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-900/5">{children}</tbody>
        </table>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Dashboard                                                           */
/* ------------------------------------------------------------------ */

function Dashboard() {
  const { user, signOut } = useAdmin();
  const { products, refresh } = useCatalog();
  const [editing, setEditing] = useState(null); // product being edited, or "new"
  const [confirmingDelete, setConfirmingDelete] = useState(null); // product id awaiting confirmation
  const { push } = useToast();

  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [messages, setMessages] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [items, setItems] = useState({});
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [s, o, m, sub, app] = await Promise.all([
      fetchStats(),
      fetchOrders(),
      fetchMessages(),
      fetchSubscribers(),
      fetchApplications(),
    ]);
    setStats(s.stats);
    setOrders(o.data ?? []);
    setMessages(m.data ?? []);
    setSubscribers(sub.data ?? []);
    setApplications(app.data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggleOrder = async (order) => {
    if (expanded === order.id) {
      setExpanded(null);
      return;
    }
    setExpanded(order.id);
    if (!items[order.id]) {
      const { data } = await fetchOrderItems(order.id);
      setItems((prev) => ({ ...prev, [order.id]: data ?? [] }));
    }
  };

  const setStatus = async (order, status) => {
    const { error } = await updateOrderStatus(order.order_number, status);
    if (error) {
      push('Could not update that order', { tone: 'info', detail: error.message });
      return;
    }
    setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status } : o)));
    push('Order updated', { detail: `${order.order_number} → ${status}` });
  };

  const removeProduct = async (product) => {
    const { error } = await deleteProduct(product.id);
    setConfirmingDelete(null);
    if (error) {
      push('Could not delete that product', { tone: 'info', detail: error.message });
      return;
    }
    refresh(); // pull the catalogue again so the shop and this table agree
    load();
    push('Product deleted', { tone: 'info', detail: `${product.name} has been removed from the shop.` });
  };

  const toggleStock = async (product) => {
    const { error } = await updateProduct(product.id, { in_stock: !product.inStock });
    if (error) {
      push('Could not update that product', { tone: 'info', detail: error.message });
      return;
    }
    push('Product updated', {
      detail: `${product.name} is now ${product.inStock ? 'out of stock' : 'in stock'}. Reload to see it on the storefront.`,
    });
  };

  const revenue = Number(stats?.revenue_total ?? 0);

  const counts = useMemo(
    () => ({
      orders: orders.length,
      messages: messages.length,
      vendors: applications.length,
      subscribers: subscribers.length,
    }),
    [orders, messages, applications, subscribers],
  );

  return (
    <div className="shell pt-10 sm:pt-14">
      {/* Header */}
      <div className="flex flex-col gap-5 rounded-4xl bg-ink-900 p-7 text-white sm:flex-row sm:items-center sm:justify-between sm:p-9">
        <div className="flex items-center gap-4">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-leaf-600 text-white">
            <Leaf className="h-6 w-6" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-mint-300">NorthLeaf admin</p>
            <h1 className="mt-0.5 font-display text-2xl font-extrabold text-white">Dashboard</h1>
            <p className="text-sm text-sand-100/60">{user?.email}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => {
              setTab('products');
              setEditing('new');
            }}
            className="btn btn-md bg-mint-400 text-leaf-900 hover:bg-mint-300"
          >
            <Plus className="h-4 w-4" />
            Add product
          </button>
          <button type="button" onClick={load} className="btn btn-md border border-white/20 text-white hover:bg-white/10">
            Refresh
          </button>
          <button type="button" onClick={signOut} className="btn btn-md bg-white text-leaf-800 hover:bg-mint-100">
            Sign out
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-8 flex gap-1 overflow-x-auto border-b border-ink-900/10">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`relative whitespace-nowrap px-4 py-3 text-sm font-semibold transition-colors ${
              tab === t.id ? 'text-leaf-800' : 'text-ink-500 hover:text-ink-800'
            }`}
          >
            {t.label}
            {tab === t.id && (
              <motion.span
                layoutId="admin-tab"
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
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.22, ease: EASE }}
          className="mt-8 pb-8"
        >
          {loading && <p className="text-sm text-ink-400">Loading…</p>}

          {/* Overview */}
          {!loading && tab === 'overview' && (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                  Icon={Cart}
                  label="Orders"
                  value={stats?.orders_total ?? 0}
                  hint={`${stats?.orders_today ?? 0} placed today`}
                />
                <StatCard Icon={Gift} label="Revenue" value={formatPrice(revenue)} hint="All time, before refunds" />
                <StatCard Icon={Mail} label="Messages" value={stats?.messages_total ?? 0} hint="Contact form" />
                <StatCard
                  Icon={Package}
                  label="Products"
                  value={stats?.products_total ?? 0}
                  hint={`${stats?.out_of_stock ?? 0} out of stock`}
                />
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard Icon={User} label="Subscribers" value={stats?.subscribers_total ?? 0} hint="Newsletter list" />
                <StatCard
                  Icon={Sprout}
                  label="Vendor applications"
                  value={stats?.applications_total ?? 0}
                  hint="Awaiting review"
                />
              </div>

              <div className="mt-8">
                <h2 className="font-display text-lg font-bold">Latest orders</h2>
                {orders.length === 0 ? (
                  <div className="mt-4">
                    <Empty>
                      No orders yet. Place one through the storefront checkout and it will appear here.
                    </Empty>
                  </div>
                ) : (
                  <div className="mt-4">
                    <Table headers={['Order', 'Customer', 'Placed', 'Total', 'Status']}>
                      {orders.slice(0, 5).map((o) => (
                        <tr key={o.id}>
                          <td className="px-4 py-3 font-semibold">{o.order_number}</td>
                          <td className="px-4 py-3 text-ink-600">{o.full_name}</td>
                          <td className="px-4 py-3 text-ink-500">{shortDate(o.created_at)}</td>
                          <td className="px-4 py-3 font-semibold tabular-nums">{formatPrice(o.total)}</td>
                          <td className="px-4 py-3">
                            <span className={`chip ${STATUS_STYLE[o.status] ?? ''}`}>{o.status}</span>
                          </td>
                        </tr>
                      ))}
                    </Table>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Orders */}
          {!loading && tab === 'orders' &&
            (orders.length === 0 ? (
              <Empty>No orders yet.</Empty>
            ) : (
              <Table headers={['', 'Order', 'Customer', 'Destination', 'Placed', 'Total', 'Status']}>
                {orders.map((o) => (
                  <>
                    <tr key={o.id} className="hover:bg-sand-50">
                      <td className="px-3 py-3">
                        <button
                          type="button"
                          onClick={() => toggleOrder(o)}
                          aria-label={`Show items in ${o.order_number}`}
                          className="grid h-7 w-7 place-items-center rounded-full text-ink-400 hover:bg-ink-900/5"
                        >
                          <ChevronDown
                            className={`h-4 w-4 transition-transform ${expanded === o.id ? 'rotate-180' : ''}`}
                          />
                        </button>
                      </td>
                      <td className="px-4 py-3 font-semibold">{o.order_number}</td>
                      <td className="px-4 py-3">
                        <p className="text-ink-700">{o.full_name}</p>
                        <p className="text-xs text-ink-400">{o.email}</p>
                      </td>
                      <td className="px-4 py-3 text-ink-500">
                        {o.city}, {o.province}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-ink-500">{dateTime(o.created_at)}</td>
                      <td className="px-4 py-3 font-semibold tabular-nums">{formatPrice(o.total)}</td>
                      <td className="px-4 py-3">
                        <div className="relative">
                          <select
                            value={o.status}
                            onChange={(e) => setStatus(o, e.target.value)}
                            aria-label={`Status of ${o.order_number}`}
                            className="appearance-none rounded-full border border-ink-900/10 bg-white py-1.5 pl-3 pr-8 text-xs font-semibold"
                          >
                            {ORDER_STATUSES.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-400" />
                        </div>
                      </td>
                    </tr>
                    {expanded === o.id && (
                      <tr key={`${o.id}-items`} className="bg-sand-50">
                        <td colSpan={7} className="px-6 py-4">
                          <p className="text-[11px] font-bold uppercase tracking-wider text-ink-500">Items</p>
                          <ul className="mt-2 space-y-1">
                            {(items[o.id] ?? []).map((it) => (
                              <li key={it.name} className="flex justify-between text-sm">
                                <span className="text-ink-600">
                                  {it.name} <span className="text-ink-400">× {it.quantity}</span>
                                </span>
                                <span className="font-semibold tabular-nums">
                                  {formatPrice(it.unit_price * it.quantity)}
                                </span>
                              </li>
                            ))}
                            {!items[o.id]?.length && <li className="text-sm text-ink-400">Loading…</li>}
                          </ul>
                          <p className="mt-3 text-xs text-ink-400">Paid by {o.payment_method}</p>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </Table>
            ))}

          {/* Products */}
          {!loading && tab === 'products' && (
            <>
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-ink-500">
                  <span className="font-semibold text-ink-800">{products.length}</span> products ·{' '}
                  <span className="font-semibold text-ink-800">{products.filter((p) => !p.inStock).length}</span> out
                  of stock
                </p>
                <button type="button" onClick={() => setEditing('new')} className="btn btn-md btn-primary">
                  <Plus className="h-4 w-4" />
                  Add product
                </button>
              </div>

              <Table headers={['Product', 'Category', 'Price', 'Potency', 'Stock', 'Actions']}>
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-sand-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Thumb product={p} category={p.category} className="h-10 w-10 shrink-0 rounded-lg" glyphClass="h-3.5 w-3.5" />
                        <div className="min-w-0">
                          <Link to={`/product/${p.id}`} className="font-semibold hover:text-leaf-700">
                            {p.name}
                          </Link>
                          <p className="text-xs text-ink-400">{p.size}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-ink-500">{p.category}</td>
                    <td className="px-4 py-3 font-semibold tabular-nums">{formatPrice(p.price)}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-ink-500 tabular-nums">
                      {p.thc}
                      {p.unit} THC
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => toggleStock(p)}
                        className={`chip ${p.inStock ? 'border-leaf-700 bg-leaf-700 text-white' : 'border-clay/30 bg-clay/10 text-clay'}`}
                      >
                        {p.inStock ? <Check className="h-3.5 w-3.5" /> : null}
                        {p.inStock ? 'In stock' : 'Out of stock'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      {confirmingDelete === p.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <span className="whitespace-nowrap text-xs text-ink-500">Delete?</span>
                          <button
                            type="button"
                            onClick={() => removeProduct(p)}
                            className="btn btn-md bg-clay px-3 py-1.5 text-xs text-white hover:opacity-90"
                          >
                            Yes
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmingDelete(null)}
                            className="btn btn-md btn-ghost px-3 py-1.5 text-xs"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setEditing(p)}
                            className="btn btn-md btn-secondary px-3 py-1.5 text-xs"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmingDelete(p.id)}
                            aria-label={`Delete ${p.name}`}
                            title={`Delete ${p.name}`}
                            className="grid h-8 w-8 place-items-center rounded-full border border-ink-900/10 text-ink-400 transition-colors hover:border-clay/40 hover:bg-clay/10 hover:text-clay"
                          >
                            <Trash className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </Table>
            </>
          )}

          {/* Messages */}
          {!loading && tab === 'messages' &&
            (messages.length === 0 ? (
              <Empty>No messages yet. Anything sent through the contact form lands here.</Empty>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {messages.map((m) => (
                  <article key={m.id} className="card p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-display text-sm font-bold">{m.name}</p>
                        <a href={`mailto:${m.email}`} className="text-xs text-leaf-700 hover:underline">
                          {m.email}
                        </a>
                      </div>
                      <span className="chip">{m.subject}</span>
                    </div>
                    <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink-600">{m.message}</p>
                    <p className="mt-3 text-xs text-ink-400">{dateTime(m.created_at)}</p>
                  </article>
                ))}
              </div>
            ))}

          {/* Vendors */}
          {!loading && tab === 'vendors' &&
            (applications.length === 0 ? (
              <Empty>No vendor applications yet.</Empty>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {applications.map((a) => (
                  <article key={a.id} className="card p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-display text-sm font-bold">{a.farm}</p>
                        <p className="text-xs text-ink-400">
                          {a.contact} · {a.province}
                        </p>
                      </div>
                      <span className="chip border-leaf-700/20 bg-leaf-50 text-leaf-700">{a.product_type}</span>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-ink-600">{a.notes}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <a href={`mailto:${a.email}`} className="text-xs font-semibold text-leaf-700 hover:underline">
                        Reply <ArrowRight className="inline h-3 w-3" />
                      </a>
                      <p className="text-xs text-ink-400">{shortDate(a.created_at)}</p>
                    </div>
                  </article>
                ))}
              </div>
            ))}

          {/* Subscribers */}
          {!loading && tab === 'subscribers' &&
            (subscribers.length === 0 ? (
              <Empty>Nobody has subscribed yet.</Empty>
            ) : (
              <Table headers={['Email', 'Source', 'Joined']}>
                {subscribers.map((s) => (
                  <tr key={s.id}>
                    <td className="px-4 py-3 font-medium">{s.email}</td>
                    <td className="px-4 py-3 text-ink-500">{s.source ?? '—'}</td>
                    <td className="px-4 py-3 text-ink-500">{shortDate(s.created_at)}</td>
                  </tr>
                ))}
              </Table>
            ))}
        </motion.div>
      </AnimatePresence>

      {editing && (
        <ProductForm
          product={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={(values, wasNew) => {
            setEditing(null);
            refresh(); // pull the catalogue again so the shop and this table agree
            load();
            push(wasNew ? 'Product added' : 'Product saved', { detail: `${values.name} is live on the shop.` });
          }}
          onDeleted={(p) => {
            setEditing(null);
            refresh();
            load();
            push('Product deleted', { tone: 'info', detail: `${p.name} has been removed from the shop.` });
          }}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */

export default function Admin() {
  const { session, isAdmin, checking } = useAdmin();

  if (checking) {
    return (
      <div className="shell flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-ink-400">Checking your access…</p>
      </div>
    );
  }

  if (!session) return <SignIn />;

  // Signed in but not on the allowlist. The database would refuse the queries
  // anyway; this just explains why the screen would otherwise be empty.
  if (!isAdmin) {
    return (
      <div className="shell flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-3xl bg-sand-100 text-ink-400">
          <Lock className="h-7 w-7" />
        </span>
        <h1 className="text-3xl font-extrabold">This account has no admin access</h1>
        <p className="max-w-sm text-sm leading-relaxed text-ink-500">
          You are signed in, but the address is not on the staff list. Ask an owner to add it.
        </p>
        <Link to="/" className="btn btn-lg btn-primary">
          Back to the storefront
        </Link>
      </div>
    );
  }

  return <Dashboard />;
}
