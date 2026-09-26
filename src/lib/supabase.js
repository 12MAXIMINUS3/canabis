import { createClient } from '@supabase/supabase-js';

/**
 * Supabase client.
 *
 * Both values are safe in the browser. The anon key is public by design — it is
 * shipped inside this bundle and anyone can read it out of the deployed site —
 * and it is worth nothing on its own, because every table is behind Row Level
 * Security. An anonymous visitor may read the catalogue and post a form, and
 * cannot read a single order, message or subscriber, or change any price.
 * Anything that matters requires a signed-in account on the admin allowlist.
 *
 * Environment variables win where they exist, so a fork can point this at its
 * own project without touching code. The defaults below exist so the deployed
 * site works even when a host has no variables set — otherwise the build
 * silently falls back to the bundled sample catalogue with sign-in disabled,
 * which looks like a bug rather than a missing setting.
 *
 * The service_role key is a different matter entirely and must never appear
 * here: it bypasses Row Level Security completely.
 */

const DEFAULT_URL = 'https://ykhbcrdoluybmnhljpdf.supabase.co';
const DEFAULT_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlraGJjcmRvbHV5Ym1uaGxqcGRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAzMjUzMjUsImV4cCI6MjEwNTkwMTMyNX0.F_-7zW0zpIAMQIG9EHt2zWBmARdgvuTamDqoZNEB9EU';

const url = import.meta.env.VITE_SUPABASE_URL || DEFAULT_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_ANON_KEY;

export const isConfigured = Boolean(url && anonKey);

export const supabase = isConfigured
  ? createClient(url, anonKey, {
      // The storefront needs no session, but the staff dashboard does — without
      // persistence an admin is signed out by every page refresh.
      auth: { persistSession: true, autoRefreshToken: true, storageKey: 'northleaf.auth' },
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
