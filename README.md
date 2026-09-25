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
