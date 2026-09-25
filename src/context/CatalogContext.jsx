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
  // Bumped after an admin saves, to pull the catalogue again.
  const [reloadKey, setReloadKey] = useState(0);

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
  }, [reloadKey]);

  const value = useMemo(() => {
    const byId = Object.fromEntries(products.map((p) => [p.id, p]));
    return {
      products,
      categories,
      status,
      isLive: status === 'supabase',
      loading: status === 'loading',
      categoryBySlug: Object.fromEntries(categories.map((c) => [c.slug, c])),
      refresh: () => setReloadKey((k) => k + 1),
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

/* ---------------- reviews page ---------------- */

/** Featured site reviews, newest first. Falls back to the bundled set. */
export async function fetchFeaturedReviews(fallback) {
  const { data } = await tryQuery((db) =>
    db
      .from('product_reviews')
      .select('author, rating, review_date, body, title, location, product_id')
      .eq('featured', true)
      .order('created_at', { ascending: false }),
  );
  if (!data?.length) return { reviews: fallback, live: false };

  return {
    reviews: data.map((r) => ({
      name: r.author,
      rating: r.rating,
      date: r.review_date,
      text: r.body,
      title: r.title,
      location: r.location,
      productId: r.product_id,
    })),
    live: true,
  };
}

/** Rating average and distribution, computed by the database view. */
export async function fetchReviewSummary(fallback) {
  const { data } = await tryQuery((db) => db.from('review_summary').select('*').single());
  if (!data) return { summary: fallback, live: false };

  const total = Number(data.count) || 1;
  const pct = (n) => Math.round((Number(n) / total) * 100);
  return {
    summary: {
      average: Number(data.average),
      count: Number(data.count),
      distribution: [
        { stars: 5, percent: pct(data.five) },
        { stars: 4, percent: pct(data.four) },
        { stars: 3, percent: pct(data.three) },
        { stars: 2, percent: pct(data.two) },
        { stars: 1, percent: pct(data.one) },
      ],
    },
    live: true,
  };
}
