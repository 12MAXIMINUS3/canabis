import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { isConfigured, rowToCategory, rowToProduct, supabase, tryQuery } from '../lib/supabase';
import {
  categories as fallbackCategories,
  products as fallbackProducts,
} from '../data/products';

/**
 * The product catalogue, loaded once from Supabase and shared by every page.
 *
 * If Supabase is unreachable or unconfigured we serve the bundled mock data
 * instead, so the storefront never renders an empty shelf. `source` says which
 * one is live ('supabase' | 'local'), which the footer shows in dev.
 */

const CatalogContext = createContext(null);

const BEST_SELLER_IDS = [
  'pacific-fog',
  'aurora-haze',
  'northline-cart',
  'sunrise-gummies',
  'glacier-live-rosin',
  'clearfield-cbd-oil',
];

export function CatalogProvider({ children }) {
  const [products, setProducts] = useState(fallbackProducts);
  const [categories, setCategories] = useState(fallbackCategories);
  const [status, setStatus] = useState(isConfigured ? 'loading' : 'local');

  useEffect(() => {
    if (!isConfigured) return undefined;
    let cancelled = false;

    (async () => {
      // Products, categories and reviews in parallel — three small tables.
      const [productRes, categoryRes, reviewRes] = await Promise.all([
        tryQuery((db) => db.from('products').select('*').order('sort_order')),
        tryQuery((db) => db.from('categories').select('*').order('sort_order')),
        tryQuery((db) => db.from('product_reviews').select('*').order('created_at')),
      ]);

      if (cancelled) return;

      if (!productRes.data?.length || !categoryRes.data?.length) {
        setStatus('local'); // keep the bundled data rather than showing nothing
        return;
      }

      const reviewsByProduct = (reviewRes.data ?? []).reduce((acc, r) => {
        (acc[r.product_id] ||= []).push({
          name: r.author,
          rating: r.rating,
          date: r.review_date,
          text: r.body,
        });
        return acc;
      }, {});

      setProducts(productRes.data.map((row) => rowToProduct(row, reviewsByProduct)));
      setCategories(categoryRes.data.map(rowToCategory));
      setStatus('supabase');
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(() => {
    const byId = Object.fromEntries(products.map((p) => [p.id, p]));
    return {
      products,
      categories,
      status,
      isLive: status === 'supabase',
      loading: status === 'loading',
      categoryBySlug: Object.fromEntries(categories.map((c) => [c.slug, c])),
      getProduct: (id) => byId[id],
      bestSellers: BEST_SELLER_IDS.map((id) => byId[id]).filter(Boolean),
      relatedTo: (product, limit = 3) =>
        products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, limit),
      priceBounds: products.reduce(
        (acc, p) => ({ min: Math.min(acc.min, p.price), max: Math.max(acc.max, p.price) }),
        { min: Infinity, max: 0 },
      ),
    };
  }, [products, categories, status]);

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error('useCatalog must be used inside <CatalogProvider>');
  return ctx;
}

/* ---------------- writes ---------------- */

/** Newsletter signup. A repeat address is treated as success, not an error. */
export async function subscribeToNewsletter(email, source = 'site') {
  if (!supabase) return { ok: true, offline: true };
  const { error } = await supabase
    .from('newsletter_subscribers')
    .insert({ email: email.trim().toLowerCase(), source });

  if (error && error.code === '23505') return { ok: true, duplicate: true };
  return { ok: !error, error };
}

export async function sendContactMessage(values) {
  if (!supabase) return { ok: true, offline: true };
  const { error } = await supabase.from('contact_messages').insert({
    name: values.name.trim(),
    email: values.email.trim().toLowerCase(),
    subject: values.subject,
    message: values.message.trim(),
  });
  return { ok: !error, error };
}

export async function submitVendorApplication(values) {
  if (!supabase) return { ok: true, offline: true };
  const { error } = await supabase.from('vendor_applications').insert({
    farm: values.farm.trim(),
    contact: values.contact.trim(),
    email: values.email.trim().toLowerCase(),
    province: values.province.trim(),
    product_type: values.type,
    volume: values.volume?.trim() || null,
    notes: values.notes.trim(),
  });
  return { ok: !error, error };
}

/**
 * Places an order through the create_order() database function.
 *
 * It runs server-side for two reasons: the order number is issued by a sequence
 * rather than chosen by the browser, and the order and its lines are written in
 * one transaction. The browser never gets read access to the orders table — the
 * function hands back only the new order number.
 */
export async function placeOrder({ values, lines, totals }) {
  if (!supabase) {
    return { ok: true, offline: true, orderNumber: `NL-${Math.floor(40000 + Math.random() * 9999)}` };
  }

  const { data, error } = await supabase.rpc('create_order', {
    p_order: {
      email: values.email,
      full_name: values.name,
      phone: values.phone ?? '',
      address: values.address,
      city: values.city,
      province: values.province,
      postal_code: values.postal,
      payment_method: values.payment,
      subtotal: totals.subtotal,
      discount: totals.discount,
      shipping: totals.shipping,
      total: totals.total,
    },
    p_items: lines.map((l) => ({
      product_id: l.id,
      name: l.name,
      size: l.size,
      unit_price: l.price,
      quantity: l.qty,
    })),
  });

  if (error || !data) return { ok: false, error, orderNumber: null };
  return { ok: true, orderNumber: data };
}

/** Order lookup. The database function requires the number AND the email to match. */
export async function trackOrder(orderNumber, email) {
  if (!supabase) return { ok: false, offline: true };
  const { data, error } = await supabase.rpc('track_order', {
    p_order_number: orderNumber.trim(),
    p_email: email.trim(),
  });
  if (error) return { ok: false, error };
  return { ok: Boolean(data?.length), order: data?.[0] ?? null };
}
