import { createClient } from '@supabase/supabase-js';

/**
 * Supabase client.
 *
 * Both values come from .env.local and are safe in the browser: the anon key is
 * public by design and every table is behind Row Level Security, which allows
 * reading the catalogue and inserting form submissions and nothing else.
 *
 * If the variables are missing the client is null rather than throwing, so a
 * fresh clone of the repo still runs against the bundled mock data.
 */

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isConfigured = Boolean(url && anonKey);

export const supabase = isConfigured
  ? createClient(url, anonKey, {
      auth: { persistSession: false },
      global: { headers: { 'x-application-name': 'northleaf-web' } },
    })
  : null;

/**
 * Wraps a Supabase call so a network or policy failure degrades instead of
 * breaking the page. Returns { data, error }.
 */
export async function tryQuery(run, fallback = null) {
  if (!supabase) return { data: fallback, error: new Error('Supabase is not configured') };
  try {
    const { data, error } = await run(supabase);
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    if (import.meta.env.DEV) console.warn('[supabase]', error.message);
    return { data: fallback, error };
  }
}

/** Database row → the camelCase shape the components already expect. */
export function rowToProduct(row, reviewsByProduct = {}) {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    type: row.type,
    price: Number(row.price),
    size: row.size,
    thc: Number(row.thc),
    cbd: Number(row.cbd),
    unit: row.unit,
    thcTier: row.thc_tier,
    cbdTier: row.cbd_tier,
    rating: Number(row.rating),
    reviewCount: row.review_count,
    inStock: row.in_stock,
    badge: row.badge,
    blurb: row.blurb,
    description: row.description,
    effects: row.effects ?? [],
    usage: row.usage,
    terpenes: row.terpenes ?? [],
    imageUrl: row.image_url ?? '',
    reviews: reviewsByProduct[row.id] ?? [],
  };
}

export function rowToCategory(row) {
  return {
    slug: row.slug,
    name: row.name,
    description: row.description,
    meta: row.meta,
    imageUrl: row.image_url ?? '',
  };
}
