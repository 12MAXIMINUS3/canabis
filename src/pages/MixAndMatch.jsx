import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Tag } from '../components/Icons';
import { EASE, Reveal, StaggerGrid, StaggerItem } from '../components/Motion';
import PageHero from '../components/PageHero';
import ProductCard from '../components/ProductCard';
import SectionHeading from '../components/SectionHeading';
import { categories, products } from '../data/products';
import { mixMatchSteps } from '../data/content';
import { MIX_MATCH, formatPrice, useCart } from '../context/CartContext';

export default function MixAndMatch() {
  const { eligibleUnits, discount, openCart } = useCart();
  const [filter, setFilter] = useState('all');

  const eligibleCategories = categories.filter((c) => MIX_MATCH.categories.includes(c.slug));

  const eligibleProducts = useMemo(
    () =>
      products.filter(
        (p) => MIX_MATCH.categories.includes(p.category) && (filter === 'all' || p.category === filter),
      ),
    [filter],
  );

  const remaining = Math.max(0, MIX_MATCH.minItems - eligibleUnits);
  const progress = Math.min(100, (eligibleUnits / MIX_MATCH.minItems) * 100);

  return (
    <>
      <PageHero
        eyebrow="Mix &amp; Match"
        title={`Build any ${MIX_MATCH.minItems} and take ${MIX_MATCH.percentOff}% off`}
        copy="Flower, edibles, vapes or concentrates, in any combination. The discount applies itself in the cart — there is no code to remember."
        image="/images/editorial/mix-match.jpg"
        alt="Cannabis buds, a glass pipe and a lighter on a rustic tray"
        actions={
          <a href="#build" className="btn btn-lg btn-primary">
            Start building
            <ArrowRight className="h-4 w-4" />
          </a>
        }
      />

      {/* How it works */}
      <section className="shell">
        <StaggerGrid className="grid gap-5 md:grid-cols-3" stagger={0.08}>
          {mixMatchSteps.map((step, i) => (
            <StaggerItem key={step.title}>
              <div className="card h-full p-6">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-leaf-100 font-display text-sm font-extrabold text-leaf-800">
                  {i + 1}
                </span>
                <h2 className="mt-4 font-display text-base font-bold">{step.title}</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{step.copy}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </section>

      {/* Live progress */}
      <section className="shell mt-12">
        <Reveal className="sticky top-24 z-30 rounded-3xl bg-ink-900 p-5 text-white shadow-lift sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10 text-mint-300">
                <Tag className="h-5 w-5" />
              </span>
              <div>
                <p className="font-display text-sm font-bold">
                  {remaining > 0
                    ? `${remaining} more eligible item${remaining === 1 ? '' : 's'} to unlock ${MIX_MATCH.percentOff}% off`
                    : `${MIX_MATCH.percentOff}% off is active`}
                </p>
                <p className="text-xs text-sand-100/60">
                  {eligibleUnits} of {MIX_MATCH.minItems} in your cart
                  {discount > 0 && <> · saving {formatPrice(discount)}</>}
                </p>
              </div>
            </div>

            <button type="button" onClick={openCart} className="btn btn-md bg-white text-leaf-800 hover:bg-mint-100">
              View cart
            </button>
          </div>

          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/15">
            <motion.div
              className="h-full rounded-full bg-mint-400"
              initial={false}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.45, ease: EASE }}
            />
          </div>
        </Reveal>
      </section>

      {/* Eligible products */}
      <section id="build" className="shell mt-16 scroll-mt-28">
        <SectionHeading
          eyebrow="Eligible products"
          title="Everything below counts"
          copy="Accessories and CBD topicals are excluded — everything else on this page is fair game."
        />

        <div className="mt-8 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setFilter('all')}
            aria-pressed={filter === 'all'}
            className={`chip ${filter === 'all' ? 'chip-active' : 'hover:border-leaf-400 hover:text-leaf-800'}`}
          >
            All
          </button>
          {eligibleCategories.map((c) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => setFilter(c.slug)}
              aria-pressed={filter === c.slug}
              className={`chip ${filter === c.slug ? 'chip-active' : 'hover:border-leaf-400 hover:text-leaf-800'}`}
            >
              {c.name}
            </button>
          ))}
        </div>

        <StaggerGrid key={filter} className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.06} amount={0.05}>
          {eligibleProducts.map((product) => (
            <StaggerItem key={product.id}>
              <ProductCard product={product} detailed className="h-full" />
            </StaggerItem>
          ))}
        </StaggerGrid>
      </section>

      <section className="shell mt-20">
        <Reveal className="rounded-4xl bg-leaf-50 p-8 sm:p-10">
          <h2 className="font-display text-xl font-bold">The small print, which is genuinely small</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              'The discount applies to eligible lines only, not to accessories or shipping.',
              'It stacks with free shipping over $99 but not with a promo code.',
              'Orders are still capped at the 30 g dried-equivalent possession limit.',
              'Points are earned on the discounted amount you actually pay.',
            ].map((line) => (
              <li key={line} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink-600">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-leaf-600" />
                {line}
              </li>
            ))}
          </ul>
          <Link to="/shop" className="btn btn-md btn-secondary mt-7">
            Browse the full shop
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </section>
    </>
  );
}
