/**
 * Applies supabase/schema.sql and seeds the catalogue from src/data/products.js.
 *
 * Needs a Supabase personal access token, passed in the environment so it never
 * lands in a file or in shell history:
 *
 *   SUPABASE_PAT=sbp_... SUPABASE_PROJECT_REF=xxxx node scripts/supabase-setup.mjs
 *
 * Safe to run more than once: the schema uses "if not exists" and the seed upserts.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const PAT = process.env.SUPABASE_PAT;
const REF = process.env.SUPABASE_PROJECT_REF;

if (!PAT || !REF) {
  console.error('Set SUPABASE_PAT and SUPABASE_PROJECT_REF in the environment.');
  process.exit(1);
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** Runs SQL through the Management API. */
async function run(sql, label) {
  const res = await fetch(`https://api.supabase.com/v1/projects/${REF}/database/query`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${PAT}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: sql }),
  });
  const text = await res.text();
  if (!res.ok) {
    console.error(`✗ ${label} — HTTP ${res.status}\n${text.slice(0, 800)}`);
    process.exit(1);
  }
  console.log(`✓ ${label}`);
  return text;
}

/** Postgres literal for a JS value. */
const lit = (v) => {
  if (v === null || v === undefined || v === '') return 'null';
  if (typeof v === 'number') return String(v);
  if (typeof v === 'boolean') return v ? 'true' : 'false';
  return `'${String(v).replace(/'/g, "''")}'`;
};

const arr = (values) =>
  values.length ? `array[${values.map(lit).join(', ')}]::text[]` : `'{}'::text[]`;

/* ---------- 1. schema ---------- */

await run(readFileSync(path.join(root, 'supabase/schema.sql'), 'utf8'), 'schema + RLS policies applied');

/* ---------- 2. seed the catalogue ---------- */

const { categories, products } = await import(
  new URL('../src/data/products.js', import.meta.url).href
);

const categoryRows = categories
  .map(
    (c, i) =>
      `(${lit(c.slug)}, ${lit(c.name)}, ${lit(c.description)}, ${lit(c.meta)}, ${lit(c.imageUrl)}, ${i})`,
  )
  .join(',\n  ');

await run(
  `insert into public.categories (slug, name, description, meta, image_url, sort_order)
   values
  ${categoryRows}
   on conflict (slug) do update set
     name = excluded.name,
     description = excluded.description,
     meta = excluded.meta,
     image_url = excluded.image_url,
     sort_order = excluded.sort_order;`,
  `seeded ${categories.length} categories`,
);

const productRows = products
  .map(
    (p, i) => `(
    ${lit(p.id)}, ${lit(p.name)}, ${lit(p.category)}, ${lit(p.type)}, ${lit(p.price)}, ${lit(p.size)},
    ${lit(p.thc)}, ${lit(p.cbd)}, ${lit(p.unit)}, ${lit(p.thcTier)}, ${lit(p.cbdTier)},
    ${lit(p.rating)}, ${lit(p.reviewCount)}, ${lit(p.inStock)}, ${lit(p.badge)},
    ${lit(p.blurb)}, ${lit(p.description)}, ${arr(p.effects)}, ${lit(p.usage)}, ${arr(p.terpenes)},
    ${lit(p.imageUrl)}, ${i})`,
  )
  .join(',');

await run(
  `insert into public.products (
     id, name, category, type, price, size,
     thc, cbd, unit, thc_tier, cbd_tier,
     rating, review_count, in_stock, badge,
     blurb, description, effects, usage, terpenes,
     image_url, sort_order
   ) values ${productRows}
   on conflict (id) do update set
     name = excluded.name, category = excluded.category, type = excluded.type,
     price = excluded.price, size = excluded.size, thc = excluded.thc, cbd = excluded.cbd,
     unit = excluded.unit, thc_tier = excluded.thc_tier, cbd_tier = excluded.cbd_tier,
     rating = excluded.rating, review_count = excluded.review_count, in_stock = excluded.in_stock,
     badge = excluded.badge, blurb = excluded.blurb, description = excluded.description,
     effects = excluded.effects, usage = excluded.usage, terpenes = excluded.terpenes,
     image_url = excluded.image_url, sort_order = excluded.sort_order;`,
  `seeded ${products.length} products`,
);

const reviewRows = products
  .flatMap((p) =>
    (p.reviews ?? []).map(
      (r) => `(${lit(p.id)}, ${lit(r.name)}, ${lit(r.rating)}, ${lit(r.date)}, ${lit(r.text)})`,
    ),
  )
  .join(',\n  ');

// Reviews carry a generated id, so clear and re-insert rather than upsert.
await run(
  `delete from public.product_reviews;
   insert into public.product_reviews (product_id, author, rating, review_date, body)
   values
  ${reviewRows};`,
  'seeded product reviews',
);

/* ---------- 3. report ---------- */

const counts = await run(
  `select
     (select count(*) from public.categories)      as categories,
     (select count(*) from public.products)        as products,
     (select count(*) from public.product_reviews) as reviews;`,
  'verified row counts',
);
console.log('\n' + counts);
