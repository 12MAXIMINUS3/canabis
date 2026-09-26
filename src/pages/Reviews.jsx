import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Check, ShieldCheck } from '../components/Icons';
import { EASE, Reveal, StaggerGrid, StaggerItem } from '../components/Motion';
import PageHero from '../components/PageHero';
import Rating from '../components/Rating';
import { reviewSummary as fallbackSummary, siteReviews as fallbackReviews } from '../data/content';
import { fetchFeaturedReviews, fetchReviewSummary, useCatalog } from '../context/CatalogContext';

const FILTERS = [
  { value: 'all', label: 'All reviews' },
  { value: '5', label: '5 star' },
  { value: '4', label: '4 star' },
];

export default function Reviews() {
  const [filter, setFilter] = useState('all');
  const { getProduct } = useCatalog();

  // Live reviews, with the bundled set showing until they arrive.
  const [siteReviews, setSiteReviews] = useState(fallbackReviews);
  const [reviewSummary, setReviewSummary] = useState(fallbackSummary);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [r, s] = await Promise.all([
        fetchFeaturedReviews(fallbackReviews),
        fetchReviewSummary(fallbackSummary),
      ]);
      if (cancelled) return;
      setSiteReviews(r.reviews);
      setReviewSummary(s.summary);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const shown = useMemo(
    () => (filter === 'all' ? siteReviews : siteReviews.filter((r) => String(r.rating) === filter)),
    [filter, siteReviews],
  );

  return (
    <>
      <PageHero
        compact
        eyebrow="Reviews"
        title="What customers say, unedited"
        copy="Every review here comes from a verified order. We do not remove the critical ones — they are usually the most useful."
      />

      {/* Summary */}
      <section className="shell">
        <Reveal className="grid gap-8 rounded-4xl bg-white p-8 shadow-soft ring-1 ring-ink-900/5 sm:p-10 lg:grid-cols-[auto_1fr_auto] lg:items-center lg:gap-14">
          <div className="text-center lg:text-left">
            <p className="font-display text-6xl font-extrabold text-leaf-800 tabular-nums">
              {reviewSummary.average.toFixed(1)}
            </p>
            <Rating value={reviewSummary.average} showValue={false} size="h-5 w-5" className="mt-2 justify-center lg:justify-start" />
            <p className="mt-2 text-xs text-ink-400">{reviewSummary.count.toLocaleString()} verified reviews</p>
          </div>

          <dl className="space-y-2">
            {reviewSummary.distribution.map((row) => (
              <div key={row.stars} className="flex items-center gap-3">
                <dt className="w-10 shrink-0 text-xs font-semibold text-ink-500 tabular-nums">{row.stars} ★</dt>
                <dd className="flex flex-1 items-center gap-3">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-sand-200">
                    <motion.div
                      className="h-full rounded-full bg-leaf-600"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${row.percent}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: EASE }}
                    />
                  </div>
                  <span className="w-9 shrink-0 text-right text-xs text-ink-400 tabular-nums">{row.percent}%</span>
                </dd>
              </div>
            ))}
          </dl>

          <div className="rounded-3xl bg-leaf-50 p-6 text-sm leading-relaxed text-leaf-900">
            <ShieldCheck className="h-6 w-6 text-leaf-700" />
            <p className="mt-3 font-semibold">Verified purchases only</p>
            <p className="mt-1 text-ink-500">
              A review can only be left from an order that shipped. No incentives, no gifted product.
            </p>
          </div>
        </Reveal>
      </section>

      {/* Filter + list */}
      <section className="shell mt-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setFilter(f.value)}
                aria-pressed={filter === f.value}
                className={`chip ${filter === f.value ? 'chip-active' : 'hover:border-leaf-400 hover:text-leaf-800'}`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <p className="text-sm text-ink-500">
            Showing <span className="font-semibold text-ink-800">{shown.length}</span> reviews
          </p>
        </div>

        <StaggerGrid key={filter} className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3" stagger={0.06} amount={0.05}>
          {shown.map((review) => (
            <StaggerItem key={`${review.name}-${review.title}`}>
              <article className="card flex h-full flex-col p-6">
                <div className="flex items-start justify-between gap-3">
                  <Rating value={review.rating} showValue={false} />
                  <span className="text-xs text-ink-400">{review.date}</span>
                </div>

                <h2 className="mt-3 font-display text-base font-bold leading-snug">{review.title}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-600">{review.text}</p>

                <footer className="mt-5 border-t border-ink-900/5 pt-4">
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-leaf-100 font-display text-xs font-bold text-leaf-800">
                      {review.name.slice(0, 1)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-display text-sm font-bold">{review.name}</p>
                      <p className="truncate text-[11px] text-ink-400">{review.location}</p>
                    </div>
                  </div>
                  <p className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-leaf-700">
                    <Check className="h-3.5 w-3.5" />
                    Verified purchase · {review.product ?? getProduct(review.productId)?.name ?? 'CanabisLeafHub'}
                  </p>
                </footer>
              </article>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </section>

      <section className="shell mt-16">
        <Reveal className="flex flex-col items-start justify-between gap-6 rounded-4xl bg-leaf-800 p-8 text-white sm:flex-row sm:items-center sm:p-10">
          <div>
            <h2 className="font-display text-2xl font-bold text-white">Find out for yourself</h2>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-mint-100/80">
              Start with a small order. The lab sheet in the box will tell you more than any review here.
            </p>
          </div>
          <Link to="/shop" className="btn btn-lg bg-white text-leaf-800 hover:bg-mint-100">
            Browse the shop
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </section>
    </>
  );
}
