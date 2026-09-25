/**
 * Applies supabase/reviews.sql and seeds the featured site reviews.
 *
 *   SUPABASE_PAT=sbp_... SUPABASE_PROJECT_REF=xxxx node scripts/seed-reviews.mjs
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

async function run(sql, label) {
  const res = await fetch(`https://api.supabase.com/v1/projects/${REF}/database/query`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${PAT}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: sql }),
  });
  const text = await res.text();
  if (!res.ok) {
    console.error(`x ${label} — HTTP ${res.status}\n${text.slice(0, 700)}`);
    process.exit(1);
  }
  console.log(`ok ${label}`);
  return text;
}

const lit = (v) =>
  v === null || v === undefined || v === ''
    ? 'null'
    : typeof v === 'number'
      ? String(v)
      : typeof v === 'boolean'
        ? String(v)
        : `'${String(v).replace(/'/g, "''")}'`;

await run(readFileSync(path.join(root, 'supabase/reviews.sql'), 'utf8'), 'review columns + summary view');

const { siteReviews } = await import(new URL('../src/data/content.js', import.meta.url).href);
const { products } = await import(new URL('../src/data/products.js', import.meta.url).href);

const idByName = Object.fromEntries(products.map((p) => [p.name, p.id]));
const rows = siteReviews
  .map((r) => {
    const productId = idByName[r.product];
    if (!productId) {
      console.warn(`   (skipped "${r.title}" — no product named ${r.product})`);
      return null;
    }
    return `(${lit(productId)}, ${lit(r.name)}, ${lit(r.rating)}, ${lit(r.date)}, ${lit(r.text)}, ${lit(r.title)}, ${lit(r.location)}, true)`;
  })
  .filter(Boolean)
  .join(',\n  ');

await run(
  `delete from public.product_reviews where featured;
   insert into public.product_reviews (product_id, author, rating, review_date, body, title, location, featured)
   values
  ${rows};`,
  `seeded ${siteReviews.length} featured reviews`,
);

console.log(
  '\n' +
    (await run(
      `select (select count(*) from public.product_reviews) as total,
              (select count(*) from public.product_reviews where featured) as featured,
              (select average from public.review_summary) as average;`,
      'verified',
    )),
);
