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
