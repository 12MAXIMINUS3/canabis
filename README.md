# NorthLeaf Cannabis — storefront demo

A responsive, animated e-commerce landing page for a **fictional** Canadian cannabis dispensary.
React + Vite + Tailwind CSS + Framer Motion + React Router. Mock data only, no backend.

Everything here is original: all copy, product names, strain descriptions and reviews are invented,
and all imagery is generated inline (CSS gradients + SVG), so there are no third-party assets or brands.

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production bundle in dist/
npm run preview  # serve the built bundle
```

Node 18+ is required.

## Routes

| Route | Page |
| --- | --- |
| `/` | Home |
| `/shop` | Shop — filters, sort, load more; reads `?category=` and `?tag=` |
| `/category/:slug` | Alias that redirects to the filtered shop |
| `/product/:id` | Product detail — photo, potency, effects, reviews, related |
| `/deals` | Every running promotion + fresh drops |
| `/mix-and-match` | Bundle builder with live discount progress |
| `/cart` | Full cart page (the drawer is the quick view) |
| `/checkout` | Validated mock checkout + confirmation |
| `/account` | Dashboard — orders, Leaf Points, details |
| `/how-to-order` | Five-step ordering guide + payment methods |
| `/order-tracking` | Order lookup with delivery timeline (try `NL-48213`) |
| `/shipping` | Shipping zones and return rules |
| `/faq` | Searchable, grouped FAQ |
| `/contact` | Contact form + support details |
| `/about` | Story, values, process, team |
| `/rewards` | Leaf Points tiers + earnings calculator |
| `/reviews` | Rating summary, distribution, filterable reviews |
| `/vendors` | Grower application form |
| `/blog`, `/blog/:slug` | Field Notes index and articles |
| `/privacy`, `/terms`, `/responsible-use` | Policy pages |
| `*` | 404 |

`/shop?category=flower` is a real, shareable URL: selected categories live in the query string.

## Project structure

```
src/
├── main.jsx                  # entry: BrowserRouter + React root
├── App.jsx                   # providers, layout, animated routes
├── index.css                 # Tailwind layers + component classes (.btn, .card, .field, .chip)
├── data/products.js          # mock catalogue, categories, helpers
├── context/
│   ├── CartContext.jsx       # cart reducer, localStorage persistence, drawer state
│   └── ToastContext.jsx      # useToast().push(...) + animated viewport
├── components/
│   ├── AgeGate.jsx           # 19+ modal, acceptance stored in localStorage
│   ├── Header.jsx            # sticky nav, hamburger, cart badge
│   ├── Footer.jsx            # link columns + placeholder social glyphs
│   ├── CartDrawer.jsx        # slide-in cart with quantity steppers
│   ├── ProductCard.jsx       # used by home rail, shop grid, related row
│   ├── CategoryCard.jsx
│   ├── Newsletter.jsx        # email validation + success toast
│   ├── SectionHeading.jsx
│   ├── Rating.jsx
│   ├── Thumb.jsx             # generated SVG artwork (deterministic per id)
│   ├── Motion.jsx            # Reveal, StaggerGrid/StaggerItem, shared easing
│   ├── Icons.jsx             # hand-rolled icon set
│   └── ScrollToTop.jsx
└── pages/
    ├── Home.jsx  Shop.jsx  ProductDetail.jsx  About.jsx  Contact.jsx  NotFound.jsx
```

## Notes

- **Age gate** stores acceptance under `northleaf.age.v1`. To see it again, clear that key
  (DevTools → Application → Local Storage) or open a private window.
- **Cart** persists under `northleaf.cart.v1`. Checkout is deliberately inert — it only raises a toast.
- **Potency filters** use tiers (`none`/`low`/`mid`/`high`) rather than raw numbers, because THC is a
  percentage for inhalables and milligrams for edibles; those numbers are not comparable.
- **Motion** is centralised in `components/Motion.jsx` and wrapped in `<MotionConfig reducedMotion="user">`,
  so the OS "reduce motion" setting disables animation.
- **Product images**: `Thumb.jsx` draws the artwork. Set `imageUrl` on a product in `data/products.js`
  and that photo is used instead, no other changes needed.

## Images

40 distinct Pexels-licensed photographs live in `public/images/`. No image is reused anywhere in the site. See [CREDITS.md](CREDITS.md) for the full list of source IDs.

## Backend (Supabase)

The storefront reads its catalogue from Supabase and writes real rows for newsletter
signups, contact messages, vendor applications and orders. If the environment variables
are missing it falls back to the bundled mock data in `src/data/products.js`, so a fresh
clone still runs with no setup.

### Setup

```bash
cp .env.example .env.local     # fill in your project URL + anon key
```

Then apply the schema and seed the catalogue:

```bash
SUPABASE_PAT=sbp_... SUPABASE_PROJECT_REF=xxxx node scripts/supabase-setup.mjs
```

The token is only read from the environment — it is never written to a file. Both SQL
files can also be pasted straight into the Supabase SQL editor.

| File | Contents |
| --- | --- |
| `supabase/schema.sql` | Tables, indexes, RLS policies, `track_order()` |
| `supabase/orders.sql` | `create_order()` and the order-number sequence |
| `scripts/supabase-setup.mjs` | Applies both, then seeds products/categories/reviews |

### Security model

Only the anon key reaches the browser, and every table has Row Level Security on:

- **Catalogue** (`products`, `categories`, `product_reviews`) — world-readable, not writable.
- **Submissions** (`newsletter_subscribers`, `contact_messages`, `vendor_applications`) —
  insert-only. A visitor can post one but cannot read anybody's back, including their own.
- **Orders** — no direct insert and no select. Placement goes through `create_order()`,
  a security-definer function that validates input and issues the order number from a
  sequence, so the browser cannot choose its own. Reading goes through `track_order()`,
  which requires the order number **and** the email to match, so order numbers cannot be
  walked through.

Verified against the live project: catalogue writes rejected (42501), orders and order
items not enumerable, wrong email returns zero rows, and both function validations fire.

### Data flow

| Page | Reads | Writes |
| --- | --- | --- |
| Home, Shop, Product, Deals, Mix & Match | `products`, `categories`, `product_reviews` | — |
| Newsletter (footer/home/blog) | — | `newsletter_subscribers` |
| Contact | — | `contact_messages` |
| Vendors | — | `vendor_applications` |
| Checkout | — | `create_order()` → `orders` + `order_items` |
| Order tracking | `track_order()` | — |

## Admin dashboard

`/admin` is a staff area for orders, customer messages, vendor applications,
subscribers and stock. There is a discreet "Staff" link in the footer.

Sign in with a Supabase account whose email appears in the `admin_users` table.

### How access is decided

Being signed in is not enough. `is_admin()` checks the signed-in email against the
`admin_users` allowlist, and every admin policy calls it:

```sql
insert into public.admin_users (email, note) values ('someone@example.com', 'Ops');
```

`admin_users` has RLS enabled and **no policies at all**, so the allowlist itself is
invisible and unwritable from the browser — only the security-definer `is_admin()`
reads it. Removing a row removes access immediately, with no redeploy.

The React route guard only decides what to render. The real boundary is in Postgres:
a signed-in non-admin gets zero rows from every admin table and `admin_stats()`
returns zeros rather than revealing whether data exists. Verified with a throwaway
account — 10/10 isolation checks passed.

### What an admin can do

| Area | Capability |
| --- | --- |
| Overview | Order count, revenue, messages, subscribers, applications, stock |
| Orders | Read every order, expand line items, change status |
| Products | Toggle stock (prices and copy are editable via the same policy) |
| Messages / Vendors / Subscribers | Read submissions, reply by email |

### Adding or removing an admin

1. Add the address: `insert into public.admin_users (email) values ('...');`
2. Create the Supabase auth user (Dashboard → Authentication → Add user).

To revoke, delete the row from `admin_users`. The account can still sign in but sees nothing.

### Managing products

The Products tab lists every product with its photo, price, potency and stock.
**Add product** opens a form; **Edit** opens the same form filled in.

The form covers everything the storefront shows — name, category, format, price,
pack size, THC/CBD with their filter tiers, blurb, description, effects, terpenes,
usage, badge, image path and stock — with a live preview of the resulting card.

Two details worth knowing:

- **The web address is the id.** It is generated from the name for a new product,
  checked for collisions before saving, then frozen once the product exists —
  changing it later would break `/product/<id>` for anyone who bookmarked it.
- **Saving refreshes the storefront catalogue**, so a price change is visible on
  the shop without a redeploy. Products live in Postgres, not in the bundle.

Validation runs in the form *and* is enforced by the database, so a bad value
cannot get through by tampering with the page.

### Demo data

The dashboard is more legible with something in it:

```bash
SUPABASE_PAT=sbp_... SUPABASE_PROJECT_REF=xxxx node scripts/seed-demo-data.mjs
```

That writes 26 orders across every status, plus contact messages, subscribers and
vendor applications, dated over the last few weeks. Every row uses an
`@demo.northleaf` email so it can all be removed again:

```bash
SUPABASE_PAT=... SUPABASE_PROJECT_REF=... node scripts/seed-demo-data.mjs --clear
```

## Deploying to Vercel

Two things are needed beyond pushing the repo.

**1. SPA routing.** React Router handles `/admin`, `/shop` and the rest in the
browser, but a direct request for those paths reaches Vercel's server first, which
looks for a matching file and returns 404. `vercel.json` rewrites every path to
`index.html` so the router can take over. Static files still win: Vercel checks
the filesystem before applying a rewrite, so `/assets/*` and `/images/*` are
served normally.

**2. Environment variables.** `.env.local` is gitignored, so Vercel does not get
the Supabase settings from the repo. Add them in
**Project → Settings → Environment Variables**, for Production, Preview and
Development:

| Name | Value |
| --- | --- |
| `VITE_SUPABASE_URL` | `https://<your-project-ref>.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | your project's anon key |

Vite inlines `VITE_*` variables **at build time**, so adding them is not enough on
its own — redeploy afterwards. Without them the site still runs, but it serves the
bundled sample catalogue and staff sign-in is disabled, because the app has no
database to talk to.
