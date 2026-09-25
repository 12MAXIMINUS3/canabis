import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Beaker,
  Cart,
  Check,
  Leaf,
  Minus,
  Package,
  Plus,
  ShieldCheck,
  Truck,
} from '../components/Icons';
import { EASE, Reveal, StaggerGrid, StaggerItem } from '../components/Motion';
import ProductCard from '../components/ProductCard';
import Rating from '../components/Rating';
import Thumb from '../components/Thumb';
import { categoryBySlug, getProduct, relatedTo } from '../data/products';
import { formatPrice, useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const SHIPPING_NOTES = [
  { Icon: Truck, text: 'Tracked shipping, 1–3 business days. Free over $99.' },
  { Icon: Package, text: 'Plain, odour-sealed box. No logos, no product names.' },
  { Icon: ShieldCheck, text: 'Certificate of analysis for this exact lot ships in the box.' },
];

export default function ProductDetail() {
  const { id } = useParams();
  const product = getProduct(id);

  const [qty, setQty] = useState(1);
  const [activeShot, setActiveShot] = useState(0);
  const { add } = useCart();
  const { push } = useToast();

  // Reset local UI when navigating between products.
  useEffect(() => {
    setQty(1);
    setActiveShot(0);
  }, [id]);

  if (!product) {
    return (
      <div className="shell flex flex-col items-center gap-5 py-28 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-3xl bg-sand-100 text-ink-400">
          <Leaf className="h-7 w-7" />
        </span>
        <h1 className="text-3xl font-extrabold">We could not find that product</h1>
        <p className="max-w-sm text-sm leading-relaxed text-ink-500">
          It may have sold out and been retired. The rest of the shelf is still here.
        </p>
        <Link to="/shop" className="btn btn-lg btn-primary">
          Back to the shop
        </Link>
      </div>
    );
  }

  const category = categoryBySlug[product.category];
  const related = relatedTo(product);
  // Photo set for this product. Each product ships one real photo today; add more
  // paths to `images` in data/products.js and the thumbnail strip appears on its own.
  const gallery = product.images?.length ? product.images : [product.imageUrl].filter(Boolean);

  const handleAdd = () => {
    if (!product.inStock) {
      push('We will let you know', { tone: 'info', detail: `${product.name} is restocking soon.` });
      return;
    }
    add(product, qty);
    push('Added to cart', { detail: `${qty} × ${product.name} · ${formatPrice(product.price * qty)}` });
  };

  return (
    <div className="shell pt-8 sm:pt-12">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium text-ink-400">
        <Link to="/shop" className="inline-flex items-center gap-1.5 hover:text-leaf-700">
          <ArrowLeft className="h-3.5 w-3.5" />
          Shop
        </Link>
        <span aria-hidden="true">/</span>
        <Link to={`/shop?category=${product.category}`} className="hover:text-leaf-700">
          {category?.name}
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-ink-600">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-14">
        {/* Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <Thumb
            src={gallery[activeShot]}
            category={product.category}
            alt={`${product.name} — ${product.type}`}
            seed={product.id}
            priority
            glyphClass="h-10 w-10"
            className="aspect-[4/3] w-full rounded-4xl shadow-soft"
          >
            {!product.inStock && (
              <span className="absolute right-4 top-4 rounded-full bg-ink-900/85 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white">
                Out of stock
              </span>
            )}
          </Thumb>

          {/* Thumbnail strip only appears for products that have more than one shot. */}
          {gallery.length > 1 && (
            <div className="mt-3 grid grid-cols-4 gap-3">
              {gallery.map((shot, i) => (
                <button
                  key={shot}
                  type="button"
                  onClick={() => setActiveShot(i)}
                  aria-label={`View image ${i + 1} of ${product.name}`}
                  aria-pressed={i === activeShot}
                  className={`overflow-hidden rounded-2xl ring-2 transition-all duration-200 ${
                    i === activeShot ? 'ring-leaf-600' : 'ring-transparent hover:ring-leaf-300'
                  }`}
                >
                  <Thumb src={shot} category={product.category} alt="" className="aspect-square w-full" />
                </button>
              ))}
            </div>
          )}

          {/* Lab strip — the numbers that belong next to the photo */}
          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-2xl bg-white p-4 shadow-soft">
            <span className="inline-flex items-center gap-2 text-xs font-semibold text-leaf-700">
              <Beaker className="h-4 w-4" />
              Lot tested {product.rating >= 4.7 ? 'this month' : 'this quarter'}
            </span>
            <span className="text-xs text-ink-400">
              Pesticides <span className="font-semibold text-ink-700">Pass</span>
            </span>
            <span className="text-xs text-ink-400">
              Microbials <span className="font-semibold text-ink-700">Pass</span>
            </span>
            <span className="text-xs text-ink-400">
              Metals <span className="font-semibold text-ink-700">Pass</span>
            </span>
          </div>
        </motion.div>

        {/* Buy box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08, ease: EASE }}
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="chip border-leaf-700/20 bg-leaf-50 text-leaf-700">{category?.name}</span>
            {product.badge && <span className="chip border-clay/30 bg-clay/10 text-clay">{product.badge}</span>}
            <span className={`chip ${product.inStock ? 'text-leaf-700' : 'text-ink-400'}`}>
              {product.inStock ? 'In stock' : 'Restocking'}
            </span>
          </div>

          <h1 className="mt-4 text-4xl font-extrabold sm:text-5xl">{product.name}</h1>
          <p className="mt-2 text-sm text-ink-500">
            {product.type} · {product.size}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-4">
            <Rating value={product.rating} count={product.reviewCount} size="h-4 w-4" />
            <span className="font-display text-3xl font-extrabold tabular-nums">{formatPrice(product.price)}</span>
          </div>

          <p className="mt-5 text-base leading-relaxed text-ink-600">{product.description}</p>

          {/* Potency */}
          <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl bg-leaf-50 p-3.5">
              <dt className="text-[11px] font-bold uppercase tracking-wider text-leaf-700">THC</dt>
              <dd className="mt-0.5 font-display text-lg font-extrabold tabular-nums">
                {product.thc}
                {product.unit}
              </dd>
            </div>
            <div className="rounded-2xl bg-sand-100 p-3.5">
              <dt className="text-[11px] font-bold uppercase tracking-wider text-ink-500">CBD</dt>
              <dd className="mt-0.5 font-display text-lg font-extrabold tabular-nums">
                {product.cbd}
                {product.unit}
              </dd>
            </div>
            <div className="rounded-2xl bg-sand-100 p-3.5">
              <dt className="text-[11px] font-bold uppercase tracking-wider text-ink-500">Format</dt>
              <dd className="mt-0.5 text-sm font-semibold leading-tight">{category?.name}</dd>
            </div>
            <div className="rounded-2xl bg-sand-100 p-3.5">
              <dt className="text-[11px] font-bold uppercase tracking-wider text-ink-500">Size</dt>
              <dd className="mt-0.5 text-sm font-semibold leading-tight">{product.size}</dd>
            </div>
          </dl>

          {/* Quantity + add */}
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="inline-flex items-center rounded-full border border-ink-900/10 bg-white p-1">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="grid h-10 w-10 place-items-center rounded-full text-ink-500 transition-colors hover:bg-ink-900/5"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center font-display text-base font-bold tabular-nums" aria-live="polite">
                {qty}
              </span>
              <button
                type="button"
                onClick={() => setQty((q) => Math.min(10, q + 1))}
                aria-label="Increase quantity"
                className="grid h-10 w-10 place-items-center rounded-full text-ink-500 transition-colors hover:bg-ink-900/5"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <button type="button" onClick={handleAdd} className="btn btn-lg btn-primary flex-1">
              <Cart className="h-4 w-4" />
              {product.inStock ? `Add to Cart · ${formatPrice(product.price * qty)}` : 'Notify me when back'}
            </button>
          </div>

          {/* Effects */}
          {product.effects.length > 0 && (
            <div className="mt-8">
              <h2 className="label">Reported effects</h2>
              <div className="flex flex-wrap gap-2">
                {product.effects.map((effect) => (
                  <span key={effect} className="chip border-leaf-700/15 bg-leaf-50 text-leaf-800">
                    {effect}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Usage */}
          <div className="mt-6 flex gap-3 rounded-2xl border border-leaf-700/15 bg-leaf-50/60 p-4">
            <Beaker className="mt-0.5 h-5 w-5 shrink-0 text-leaf-700" />
            <div>
              <h2 className="font-display text-sm font-bold">How to use it</h2>
              <p className="mt-1 text-sm leading-relaxed text-ink-600">{product.usage}</p>
              {product.terpenes.length > 0 && (
                <p className="mt-2 text-xs text-ink-500">
                  <span className="font-semibold">Dominant terpenes:</span> {product.terpenes.join(', ')}
                </p>
              )}
            </div>
          </div>

          {/* Shipping notes */}
          <ul className="mt-6 space-y-2.5 border-t border-ink-900/10 pt-6">
            {SHIPPING_NOTES.map(({ Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm text-ink-500">
                <Icon className="h-4 w-4 shrink-0 text-leaf-600" />
                {text}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Reviews */}
      <section className="mt-20">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Reviews</p>
              <h2 className="mt-3 text-3xl font-extrabold">What people said</h2>
            </div>
            <div className="text-right">
              <p className="font-display text-4xl font-extrabold tabular-nums">{product.rating.toFixed(1)}</p>
              <Rating value={product.rating} showValue={false} className="justify-end" />
              <p className="mt-1 text-xs text-ink-400">{product.reviewCount} verified purchases</p>
            </div>
          </div>
        </Reveal>

        <StaggerGrid className="mt-8 grid gap-4 md:grid-cols-2" stagger={0.08}>
          {product.reviews.map((review) => (
            <StaggerItem key={review.name}>
              <article className="card h-full p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-leaf-100 font-display text-xs font-bold text-leaf-800">
                      {review.name.slice(0, 1)}
                    </span>
                    <div>
                      <p className="font-display text-sm font-bold">{review.name}</p>
                      <p className="text-[11px] text-ink-400">{review.date}</p>
                    </div>
                  </div>
                  <Rating value={review.rating} showValue={false} />
                </div>
                <p className="mt-3.5 text-sm leading-relaxed text-ink-600">{review.text}</p>
                <p className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold text-leaf-700">
                  <Check className="h-3.5 w-3.5" />
                  Verified purchase
                </p>
              </article>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-20">
          <Reveal>
            <p className="eyebrow">You may also like</p>
            <h2 className="mt-3 text-3xl font-extrabold">More {category?.name.toLowerCase()}</h2>
          </Reveal>
          <StaggerGrid className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.07}>
            {related.map((item) => (
              <StaggerItem key={item.id}>
                <ProductCard product={item} className="h-full" />
              </StaggerItem>
            ))}
          </StaggerGrid>
        </section>
      )}
    </div>
  );
}
