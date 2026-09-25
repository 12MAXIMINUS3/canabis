import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Search, Sliders, X } from '../components/Icons';
import { EASE, StaggerGrid, StaggerItem } from '../components/Motion';
import ProductCard from '../components/ProductCard';
import { potencyTiers } from '../data/products';
import { useCatalog } from '../context/CatalogContext';

const PAGE_SIZE = 12; // shows a full category (10) without a 'load more' click

const SORTS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'rating', label: 'Top rated' },
  { value: 'potency', label: 'Strongest first' },
];

// maxPrice null = no cap. The ceiling depends on the catalogue, which loads at runtime.
const DEFAULTS = { maxPrice: null, thc: 'any', cbd: 'any', inStockOnly: false, sort: 'featured', q: '' };

export default function Shop() {
  // Selected categories live in the URL, so /shop?category=flower is shareable
  // and the links from the home page and footer just work.
  const { products, categories, priceBounds, loading } = useCatalog();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategories = searchParams.getAll('category');
  // `?tag=indica` narrows to a sub-type — the header's category dropdowns use it.
  const tag = (searchParams.get('tag') ?? '').toLowerCase();

  const [filters, setFilters] = useState(DEFAULTS);
  const maxPrice = filters.maxPrice ?? priceBounds.max;
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [panelOpen, setPanelOpen] = useState(false);

  const set = (patch) => setFilters((prev) => ({ ...prev, ...patch }));

  const toggleCategory = (slug) => {
    const next = selectedCategories.includes(slug)
      ? selectedCategories.filter((s) => s !== slug)
      : [...selectedCategories, slug];
    const params = new URLSearchParams();
    next.forEach((s) => params.append('category', s));
    setSearchParams(params, { replace: true });
  };

  const resetAll = () => {
    setFilters(DEFAULTS);
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  const results = useMemo(() => {
    const query = filters.q.trim().toLowerCase();

    const filtered = products.filter((p) => {
      if (selectedCategories.length && !selectedCategories.includes(p.category)) return false;
      if (tag && !`${p.type} ${p.name} ${p.effects.join(' ')}`.toLowerCase().includes(tag)) return false;
      if (p.price > maxPrice) return false;
      if (filters.thc !== 'any' && p.thcTier !== filters.thc) return false;
      if (filters.cbd !== 'any' && p.cbdTier !== filters.cbd) return false;
      if (filters.inStockOnly && !p.inStock) return false;
      if (query) {
        const haystack = `${p.name} ${p.type} ${p.blurb} ${p.effects.join(' ')}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });

    const sorted = [...filtered];
    switch (filters.sort) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'potency':
        // Compare within a unit; percentages outrank milligrams.
        sorted.sort((a, b) => (b.unit === '%' ? b.thc : b.thc / 10) - (a.unit === '%' ? a.thc : a.thc / 10));
        break;
      default:
        break;
    }
    return sorted;
    // `products` and `maxPrice` belong here: the catalogue arrives from Supabase
    // after the first render, and the price cap depends on it.
  }, [products, maxPrice, selectedCategories.join(','), tag, filters]);

  // Any filter change starts the list over at one page.
  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [selectedCategories.join(','), tag, filters]);

  const activeCount =
    selectedCategories.length +
    (filters.maxPrice != null && filters.maxPrice < priceBounds.max ? 1 : 0) +
    (filters.thc !== 'any' ? 1 : 0) +
    (filters.cbd !== 'any' ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0) +
    (filters.q ? 1 : 0);

  const shown = results.slice(0, visible);

  const filterPanel = (
    <div className="space-y-7">
      {/* Category */}
      <fieldset>
        <legend className="label">Category</legend>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => {
            const active = selectedCategories.includes(c.slug);
            return (
              <button
                key={c.slug}
                type="button"
                onClick={() => toggleCategory(c.slug)}
                aria-pressed={active}
                className={`chip ${active ? 'chip-active' : 'hover:border-leaf-400 hover:text-leaf-800'}`}
              >
                {c.name}
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Price */}
      <div>
        <label htmlFor="max-price" className="label">
          Max price
          <span className="ml-2 font-bold normal-case tracking-normal text-leaf-700 tabular-nums">
            ${maxPrice}
          </span>
        </label>
        <input
          id="max-price"
          type="range"
          min={priceBounds.min}
          max={priceBounds.max}
          step={1}
          value={maxPrice}
          onChange={(e) => set({ maxPrice: Number(e.target.value) })}
          className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-sand-200 accent-leaf-700"
        />
        <div className="mt-1.5 flex justify-between text-[11px] text-ink-400 tabular-nums">
          <span>${priceBounds.min}</span>
          <span>${priceBounds.max}</span>
        </div>
      </div>

      {/* Potency */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="thc-tier" className="label">
            THC level
          </label>
          <div className="relative">
            <select
              id="thc-tier"
              value={filters.thc}
              onChange={(e) => set({ thc: e.target.value })}
              className="field appearance-none pr-9"
            >
              {potencyTiers.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          </div>
        </div>
        <div>
          <label htmlFor="cbd-tier" className="label">
            CBD level
          </label>
          <div className="relative">
            <select
              id="cbd-tier"
              value={filters.cbd}
              onChange={(e) => set({ cbd: e.target.value })}
              className="field appearance-none pr-9"
            >
              {potencyTiers.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          </div>
        </div>
      </div>

      {/* In stock */}
      <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-ink-900/10 bg-white px-4 py-3">
        <span className="text-sm font-semibold text-ink-700">In stock only</span>
        <span className="relative inline-flex h-6 w-11 shrink-0 items-center">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) => set({ inStockOnly: e.target.checked })}
            className="peer sr-only"
          />
          <span className="h-6 w-11 rounded-full bg-sand-300 transition-colors duration-200 peer-checked:bg-leaf-600" />
          <span className="absolute left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 peer-checked:translate-x-5" />
        </span>
      </label>

      {activeCount > 0 && (
        <button type="button" onClick={resetAll} className="btn btn-md btn-ghost w-full">
          <X className="h-4 w-4" />
          Clear {activeCount} filter{activeCount > 1 ? 's' : ''}
        </button>
      )}
    </div>
  );

  return (
    <div className="shell pt-10 sm:pt-14">
      {/* Page head */}
      <div className="max-w-2xl">
        <p className="eyebrow">Shop</p>
        <h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">The whole shelf</h1>
        <p className="mt-3 text-base leading-relaxed text-ink-500">
          {products.length} products, each with its lab results attached. Filter by format, price or potency — and note
          that THC is shown as a percentage for inhalables and in milligrams for anything you swallow.
        </p>
      </div>

      {/* Search + sort + mobile filter toggle */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            type="search"
            value={filters.q}
            onChange={(e) => set({ q: e.target.value })}
            placeholder="Search strains, effects, formats…"
            aria-label="Search products"
            className="field pl-11"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setPanelOpen((v) => !v)}
            aria-expanded={panelOpen}
            className="btn btn-md btn-secondary flex-1 lg:hidden"
          >
            <Sliders className="h-4 w-4" />
            Filters
            {activeCount > 0 && (
              <span className="grid h-5 w-5 place-items-center rounded-full bg-leaf-700 text-[11px] font-bold text-white">
                {activeCount}
              </span>
            )}
          </button>

          <div className="relative flex-1 sm:flex-none">
            <select
              value={filters.sort}
              onChange={(e) => set({ sort: e.target.value })}
              aria-label="Sort products"
              className="field appearance-none pr-10 sm:w-52"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[17rem_1fr] lg:gap-10">
        {/* Sidebar (desktop) */}
        <aside className="hidden lg:block">
          <div className="sticky top-28 card p-5">
            <h2 className="mb-5 flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wider">
              <Sliders className="h-4 w-4 text-leaf-700" />
              Filters
            </h2>
            {filterPanel}
          </div>
        </aside>

        {/* Collapsible panel (mobile) */}
        <AnimatePresence>
          {panelOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="overflow-hidden lg:hidden"
            >
              <div className="card p-5">{filterPanel}</div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <section aria-live="polite">
          <p className="mb-5 text-sm text-ink-500">
            Showing <span className="font-semibold text-ink-800">{shown.length}</span> of{' '}
            <span className="font-semibold text-ink-800">{results.length}</span> products
          </p>

          {results.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="card flex flex-col items-center gap-4 px-6 py-16 text-center"
            >
              <span className="grid h-16 w-16 place-items-center rounded-3xl bg-sand-100 text-ink-400">
                <Search className="h-7 w-7" />
              </span>
              <div>
                <h2 className="font-display text-xl font-bold">Nothing matches those filters</h2>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink-500">
                  Try widening the price range, relaxing the potency levels, or clearing the search term.
                </p>
              </div>
              <button type="button" onClick={resetAll} className="btn btn-md btn-primary">
                Clear all filters
              </button>
            </motion.div>
          ) : (
            <>
              <StaggerGrid
                key={`${selectedCategories.join(',')}-${tag}-${filters.sort}`}
                className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
                stagger={0.06}
                amount={0.05}
              >
                {shown.map((product) => (
                  <StaggerItem key={product.id}>
                    <ProductCard product={product} detailed className="h-full" />
                  </StaggerItem>
                ))}
              </StaggerGrid>

              {visible < results.length && (
                <div className="mt-10 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setVisible((v) => v + PAGE_SIZE)}
                    className="btn btn-lg btn-secondary"
                  >
                    Load more ({results.length - visible} left)
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
