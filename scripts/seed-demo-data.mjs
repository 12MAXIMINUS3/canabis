/**
 * Fills the dashboard with believable sample activity: orders across every
 * status, contact messages, newsletter subscribers and vendor applications,
 * spread over the last few weeks.
 *
 *   SUPABASE_PAT=sbp_... SUPABASE_PROJECT_REF=xxxx node scripts/seed-demo-data.mjs
 *
 * Every row is tagged so it can be removed again in one go:
 *
 *   node scripts/seed-demo-data.mjs --clear
 *
 * Names and addresses are invented. Nothing here is a real person.
 */

const PAT = process.env.SUPABASE_PAT;
const REF = process.env.SUPABASE_PROJECT_REF;
if (!PAT || !REF) {
  console.error('Set SUPABASE_PAT and SUPABASE_PROJECT_REF in the environment.');
  process.exit(1);
}

const CLEAR = process.argv.includes('--clear');
const TAG = 'demo.northleaf'; // every seeded email ends with this

async function run(sql, label) {
  const res = await fetch(`https://api.supabase.com/v1/projects/${REF}/database/query`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${PAT}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: sql }),
  });
  const text = await res.text();
  if (!res.ok) {
    console.error(`x ${label} — HTTP ${res.status}\n${text.slice(0, 600)}`);
    process.exit(1);
  }
  console.log(`ok ${label}`);
  return text;
}

const lit = (v) =>
  v === null || v === undefined ? 'null' : typeof v === 'number' ? String(v) : `'${String(v).replace(/'/g, "''")}'`;

/* ---------------- clear ---------------- */

if (CLEAR) {
  await run(
    `delete from public.order_items where order_id in (select id from public.orders where email like '%@${TAG}');
     delete from public.orders where email like '%@${TAG}';
     delete from public.contact_messages where email like '%@${TAG}';
     delete from public.newsletter_subscribers where email like '%@${TAG}';
     delete from public.vendor_applications where email like '%@${TAG}';`,
    'removed all demo rows',
  );
  console.log(await run('select count(*) as orders from public.orders;', 'remaining orders'));
  process.exit(0);
}

/* ---------------- people ---------------- */

const PEOPLE = [
  ['Dana Reyes', 'dana.reyes', 'Kingsport', 'Northern Highlands'],
  ['Joon Kim', 'joon.kim', 'Ashford', 'Eastvale'],
  ['Renee Laurent', 'renee.laurent', 'Brookmere', 'Lakeshore'],
  ['Marta Vance', 'marta.vance', 'Weston', 'Highfield'],
  ['Owen Hart', 'owen.hart', 'Seabright', 'Coastal'],
  ['Priya Sandhu', 'priya.sandhu', 'Elmgrove', 'Midlands'],
  ['Cal Dunne', 'cal.dunne', 'Riverton', 'Westbank'],
  ['Nadia Farrow', 'nadia.farrow', 'Oakhill', 'Northern Highlands'],
  ['Yusuf Ercan', 'yusuf.ercan', 'Stonebridge', 'Eastvale'],
  ['Beth Cole', 'beth.cole', 'Fairmount', 'Lakeshore'],
  ['Ada Nwosu', 'ada.nwosu', 'Clearwater', 'Coastal'],
  ['Tom Verity', 'tom.verity', 'Marchmont', 'Midlands'],
];

const BASKETS = [
  [['aurora-haze', 38, 1], ['sunrise-gummies', 22, 2]],
  [['pacific-fog', 44, 1], ['brass-grinder', 64, 1]],
  [['white-birch', 45, 2], ['unbleached-papers', 14, 1]],
  [['northline-cart', 42, 1], ['twin-peaks-battery', 29, 1]],
  [['clearfield-cbd-oil', 48, 1], ['riverstone-balm', 30, 1]],
  [['glacier-live-rosin', 58, 1]],
  [['shelf-select', 129, 1]],
  [['wildberry-chews', 24, 2], ['citrus-drops', 21, 1], ['honeycomb-bar', 25, 1], ['espresso-bites', 28, 1]],
  [['harbour-kush', 33, 1], ['pocket-grinder', 22, 1]],
  [['stillpoint-capsules', 52, 1]],
  [['midnight-diamonds', 74, 1], ['amber-shatter', 42, 1]],
  [['velvet-elk', 41, 1], ['marble-tray', 58, 1]],
];

const STATUSES = ['Delivered', 'Delivered', 'Delivered', 'Delivered', 'In transit', 'Shipped', 'Packed', 'Received', 'Refunded'];
const PAYMENTS = ['Interac e-Transfer', 'Interac e-Transfer', 'Credit card'];

const FREE_SHIPPING_AT = 99;
const FLAT_SHIPPING = 15;
const MIX_MIN = 4;
const MIX_PCT = 15;
const MIX_CATEGORIES = new Set(['flower', 'edibles', 'vapes', 'concentrates']);

// Only needed to work out which lines qualify for the bundle discount.
const { products } = await import(new URL('../src/data/products.js', import.meta.url).href);
const categoryOf = Object.fromEntries(products.map((p) => [p.id, p.category]));
const nameOf = Object.fromEntries(products.map((p) => [p.id, p.name]));
const sizeOf = Object.fromEntries(products.map((p) => [p.id, p.size]));

const orders = [];
let orderNo = 48400;

for (let i = 0; i < 26; i += 1) {
  const [fullName, handle, city, region] = PEOPLE[i % PEOPLE.length];
  const basket = BASKETS[i % BASKETS.length];
  const daysAgo = Math.floor(i * 1.6) + (i % 3);

  const subtotal = basket.reduce((sum, [, price, qty]) => sum + price * qty, 0);
  const eligibleUnits = basket
    .filter(([id]) => MIX_CATEGORIES.has(categoryOf[id]))
    .reduce((n, [, , qty]) => n + qty, 0);
  const eligibleValue = basket
    .filter(([id]) => MIX_CATEGORIES.has(categoryOf[id]))
    .reduce((sum, [, price, qty]) => sum + price * qty, 0);
  const discount = eligibleUnits >= MIX_MIN ? Math.round(eligibleValue * MIX_PCT) / 100 : 0;
  const afterDiscount = subtotal - discount;
  const shipping = afterDiscount >= FREE_SHIPPING_AT ? 0 : FLAT_SHIPPING;

  orders.push({
    number: `NL-${orderNo++}`,
    email: `${handle}@${TAG}`,
    fullName,
    city,
    region,
    postal: `K${(i % 9) + 1}A ${(i % 9) + 1}B${(i % 9) + 1}`,
    payment: PAYMENTS[i % PAYMENTS.length],
    status: STATUSES[i % STATUSES.length],
    subtotal,
    discount,
    shipping,
    total: afterDiscount + shipping,
    daysAgo,
    basket,
  });
}

const orderValues = orders
  .map(
    (o) => `(${lit(o.number)}, ${lit(o.email)}, ${lit(o.fullName)}, ${lit(`${(o.number.slice(-3))} Alder Way`)},
      ${lit(o.city)}, ${lit(o.region)}, ${lit(o.postal)}, ${lit(o.payment)},
      ${o.subtotal}, ${o.discount}, ${o.shipping}, ${o.total}, ${lit(o.status)}, now() - interval '${o.daysAgo} days')`,
  )
  .join(',\n  ');

await run(
  `insert into public.orders (order_number, email, full_name, address, city, province, postal_code,
     payment_method, subtotal, discount, shipping, total, status, created_at)
   values
  ${orderValues}
   on conflict (order_number) do nothing;`,
  `seeded ${orders.length} orders`,
);

const itemValues = orders
  .flatMap((o) =>
    o.basket.map(
      ([id, price, qty]) =>
        `((select id from public.orders where order_number = ${lit(o.number)}), ${lit(id)},
          ${lit(nameOf[id] ?? id)}, ${lit(sizeOf[id] ?? '')}, ${price}, ${qty})`,
    ),
  )
  .join(',\n  ');

await run(
  `delete from public.order_items where order_id in (select id from public.orders where email like '%@${TAG}');
   insert into public.order_items (order_id, product_id, name, size, unit_price, quantity)
   values
  ${itemValues};`,
  'seeded order items',
);

/* ---------------- messages ---------------- */

const MESSAGES = [
  ['Dana Reyes', 'dana.reyes', 'Order status', 'Hi — my order says packed but tracking has not moved since Tuesday. Could you check whether it actually went out?'],
  ['Joon Kim', 'joon.kim', 'Lab results request', 'Could you send the certificate of analysis for the Pacific Fog lot in order NL-48401? I keep a record of what I buy.'],
  ['Renee Laurent', 'renee.laurent', 'Product question', 'Are the Sunrise Gummies vegan? The listing mentions pectin but I wanted to be sure about the rest.'],
  ['Owen Hart', 'owen.hart', 'Returns', 'The battery in my starter kit will not hold a charge past a day. Happy to send it back if you can tell me where.'],
  ['Priya Sandhu', 'priya.sandhu', 'Something else', 'Just a thank you — the packaging really is unmarked. My building manager handed it over without a second glance.'],
  ['Cal Dunne', 'cal.dunne', 'Product question', 'Any chance the Driftwood all-in-one is coming in a full gram? I would buy two.'],
  ['Beth Cole', 'beth.cole', 'Order status', 'Can I add the Trailhead balm to order NL-48408 before it ships, or is it too late?'],
];

await run(
  `insert into public.contact_messages (name, email, subject, message, created_at)
   values
  ${MESSAGES.map((m, i) => `(${lit(m[0])}, ${lit(`${m[1]}@${TAG}`)}, ${lit(m[2])}, ${lit(m[3])}, now() - interval '${i * 2 + 1} days')`).join(',\n  ')};`,
  `seeded ${MESSAGES.length} contact messages`,
);

/* ---------------- subscribers ---------------- */

const subs = PEOPLE.flatMap(([, handle], i) => [
  `(${lit(`${handle}@${TAG}`)}, ${lit(i % 3 === 0 ? 'newsletter' : i % 3 === 1 ? 'checkout' : 'blog')}, now() - interval '${i * 3 + 2} days')`,
]);

await run(
  `insert into public.newsletter_subscribers (email, source, created_at)
   values
  ${subs.join(',\n  ')}
   on conflict (email) do nothing;`,
  `seeded ${subs.length} subscribers`,
);

/* ---------------- vendor applications ---------------- */

const VENDORS = [
  ['Wychwood Growers', 'Sam Okafor', 'sam.okafor', 'Northern Highlands', 'Flower', '6 kg', 'Single-room indoor, 21-day cure, full panel from an independent lab dated three weeks ago. Two cultivars ready, a third in week six.'],
  ['Cold Creek Farm', 'Ines Barros', 'ines.barros', 'Lakeshore', 'Concentrates', '2 kg', 'Fresh-frozen ice-water hash, six-bag wash, full-melt grade. We press to order and can hold material frozen until you need it.'],
  ['Halewood Botanicals', 'Ruth Ng', 'ruth.ng', 'Coastal', 'CBD', '400 units', 'Broad-spectrum topicals made in small batches. Non-detect THC on every lot, certificates available going back two years.'],
  ['Stonebridge Glass', 'Ivo Petrov', 'ivo.petrov', 'Eastvale', 'Accessories', '250 pieces', 'Hand-blown pipes and stash jars, borosilicate, annealed properly. Happy to send samples before you commit.'],
];

await run(
  `insert into public.vendor_applications (farm, contact, email, province, product_type, volume, notes, created_at)
   values
  ${VENDORS.map((v, i) => `(${lit(v[0])}, ${lit(v[1])}, ${lit(`${v[2]}@${TAG}`)}, ${lit(v[3])}, ${lit(v[4])}, ${lit(v[5])}, ${lit(v[6])}, now() - interval '${i * 4 + 3} days')`).join(',\n  ')};`,
  `seeded ${VENDORS.length} vendor applications`,
);

/* ---------------- report ---------------- */

console.log(
  '\n' +
    (await run(
      `select (select count(*) from public.orders) as orders,
              (select round(sum(total)) from public.orders) as revenue,
              (select count(*) from public.contact_messages) as messages,
              (select count(*) from public.newsletter_subscribers) as subscribers,
              (select count(*) from public.vendor_applications) as applications;`,
      'verified',
    )),
);
console.log('\nRemove it all again with:  node scripts/seed-demo-data.mjs --clear');
