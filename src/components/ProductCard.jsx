import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Cart, Check } from './Icons';
import { EASE } from './Motion';
import Rating from './Rating';
import Thumb from './Thumb';
import { useCatalog } from '../context/CatalogContext';
import { formatPrice, useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

/**
 * Product card used by the home rail, the shop grid and the related-products row.
 * `detailed` adds the potency bars, category line and stock note that the shop
 * page wants but the compact home rail does not.
 */
export default function ProductCard({ product, detailed = false, className = '' }) {
  const { add, lines } = useCart();
  const { categoryBySlug } = useCatalog();
  const { push } = useToast();
  const inCart = lines.find((l) => l.id === product.id);

  const handleAdd = () => {
    if (!product.inStock) {
      push('We will let you know', { tone: 'info', detail: `${product.name} is back within days, not weeks.` });
      return;
    }
    add(product, 1);
    push('Added to cart', { detail: `${product.name} · ${formatPrice(product.price)}` });
  };

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: EASE }}
      className={`group card relative flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-lift ${className}`}
    >
      <Link to={`/product/${product.id}`} className="relative block" tabIndex={-1} aria-hidden="true">
        <Thumb
          product={product}
          className="aspect-[4/3] w-full transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
      </Link>

      {/* Badges float above the artwork */}
      <div className="pointer-events-none absolute left-3 top-3 flex flex-wrap gap-1.5">
        {product.badge && (
          <span className="rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-leaf-800 shadow-soft">
            {product.badge}
          </span>
        )}
        {!product.inStock && (
          <span className="rounded-full bg-ink-900/85 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
            Out of stock
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        {detailed && (
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-leaf-700">
            {categoryBySlug[product.category]?.name ?? product.category}
          </p>
        )}

        <h3 className="font-display text-base font-bold leading-snug">
          <Link to={`/product/${product.id}`} className="transition-colors hover:text-leaf-700">
            {product.name}
          </Link>
        </h3>
        <p className="mt-0.5 text-xs text-ink-400">
          {product.type} · {product.size}
        </p>

        <Rating value={product.rating} count={product.reviewCount} className="mt-2" />

        {detailed && <p className="mt-2.5 text-sm leading-relaxed text-ink-500">{product.blurb}</p>}

        {/* Potency read-out */}
        <dl className="mt-3 flex gap-2 text-[11px]">
          <div className="flex-1 rounded-lg bg-leaf-50 px-2.5 py-1.5">
            <dt className="font-semibold uppercase tracking-wide text-leaf-700">THC</dt>
            <dd className="font-bold tabular-nums text-ink-800">
              {product.thc}
              {product.unit}
            </dd>
          </div>
          <div className="flex-1 rounded-lg bg-sand-100 px-2.5 py-1.5">
            <dt className="font-semibold uppercase tracking-wide text-ink-500">CBD</dt>
            <dd className="font-bold tabular-nums text-ink-800">
              {product.cbd}
              {product.unit}
            </dd>
          </div>
        </dl>

        <div className="mt-4 flex items-center justify-between gap-3 pt-1">
          <span className="font-display text-lg font-extrabold tabular-nums">{formatPrice(product.price)}</span>
          <button
            type="button"
            onClick={handleAdd}
            className={`btn btn-md px-4 ${!product.inStock || inCart ? 'btn-secondary' : 'btn-primary'}`}
            aria-label={
              product.inStock ? `Add ${product.name} to cart` : `Notify me when ${product.name} is back in stock`
            }
          >
            {product.inStock ? (
              <>
                {inCart ? <Check className="h-4 w-4" /> : <Cart className="h-4 w-4" />}
                {inCart ? `In cart (${inCart.qty})` : 'Add to Cart'}
              </>
            ) : (
              'Notify me'
            )}
          </button>
        </div>
      </div>
    </motion.article>
  );
}
