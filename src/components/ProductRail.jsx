import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from './Icons';
import ProductCard from './ProductCard';
import { StaggerGrid, StaggerItem } from './Motion';

/**
 * Horizontal product rail for phones, a plain grid from `lg` up.
 *
 * On a phone one card fills the width — a sliced second card just reads as a
 * broken layout — so the rail carries arrows and a position indicator to say
 * plainly that there is more to the right. Swiping still works; the arrows are
 * there for people who do not think to try.
 */
export default function ProductRail({ products, columns = 'lg:grid-cols-3' }) {
  const railRef = useRef(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [index, setIndex] = useState(0);

  const sync = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft >= max - 4);
    // Card width plus gap, so the dots track which card is centred.
    const step = el.firstElementChild?.getBoundingClientRect().width ?? el.clientWidth;
    setIndex(Math.round(el.scrollLeft / (step + 16)));
  }, []);

  useEffect(() => {
    const el = railRef.current;
    if (!el) return undefined;
    sync();
    el.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    return () => {
      el.removeEventListener('scroll', sync);
      window.removeEventListener('resize', sync);
    };
  }, [sync]);

  const scrollBy = (direction) => {
    const el = railRef.current;
    if (!el) return;
    const step = (el.firstElementChild?.getBoundingClientRect().width ?? el.clientWidth) + 16;
    el.scrollBy({ left: direction * step, behavior: 'smooth' });
  };

  return (
    <div className="relative">
      <StaggerGrid
        ref={railRef}
        className={`no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:px-6 lg:mx-auto lg:grid lg:max-w-7xl lg:gap-5 lg:overflow-visible lg:px-8 ${columns}`}
        stagger={0.07}
      >
        {products.map((product) => (
          <StaggerItem
            key={product.id}
            /* One full card per screen on a phone: 100vw minus the two 16px gutters. */
            className="w-[calc(100vw-2rem)] shrink-0 snap-center sm:w-[19rem] lg:w-auto"
          >
            <ProductCard product={product} className="h-full" />
          </StaggerItem>
        ))}
      </StaggerGrid>

      {/* Arrows + position. Hidden once the grid takes over at lg. */}
      <div className="mt-1 flex items-center justify-between px-4 sm:px-6 lg:hidden">
        <div className="flex gap-1.5" aria-hidden="true">
          {products.map((p, i) => (
            <span
              key={p.id}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? 'w-6 bg-leaf-700' : 'w-1.5 bg-leaf-700/25'
              }`}
            />
          ))}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            disabled={atStart}
            aria-label="Previous product"
            className="grid h-11 w-11 place-items-center rounded-full border border-ink-900/10 bg-white text-ink-700 shadow-soft transition-opacity disabled:opacity-30"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            disabled={atEnd}
            aria-label="Next product"
            className="grid h-11 w-11 place-items-center rounded-full border border-ink-900/10 bg-white text-ink-700 shadow-soft transition-opacity disabled:opacity-30"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
