import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Book, Clock } from '../components/Icons';
import { EASE, Reveal, StaggerGrid, StaggerItem } from '../components/Motion';
import PageHero from '../components/PageHero';
import Newsletter from '../components/Newsletter';
import { blogPosts } from '../data/content';

export default function Blog() {
  const categories = useMemo(() => ['All', ...new Set(blogPosts.map((p) => p.category))], []);
  const [active, setActive] = useState('All');

  const [featured, ...rest] = blogPosts;
  const list = active === 'All' ? rest : blogPosts.filter((p) => p.category === active);

  return (
    <>
      <PageHero
        compact
        eyebrow="The Field Notes"
        title="Guides, explainers and the odd look behind the curtain"
        copy="Written by the people who buy and test what we sell. No listicles, no affiliate links."
      />

      {/* Featured post */}
      {active === 'All' && (
        <section className="shell">
          <Reveal>
            <Link
              to={`/blog/${featured.slug}`}
              className="group grid overflow-hidden rounded-4xl bg-white shadow-soft ring-1 ring-ink-900/5 transition-shadow duration-300 hover:shadow-lift lg:grid-cols-2"
            >
              <div className="relative overflow-hidden">
                <img
                  src={featured.image}
                  alt={featured.alt}
                  width="900"
                  height="600"
                  className="aspect-[16/10] h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 lg:aspect-auto"
                />
                <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-leaf-800">
                  Latest
                </span>
              </div>
              <div className="flex flex-col justify-center p-8 sm:p-10">
                <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-leaf-700">
                  {featured.category}
                  <span className="flex items-center gap-1 text-ink-400">
                    <Clock className="h-3.5 w-3.5" />
                    {featured.readTime}
                  </span>
                </p>
                <h2 className="mt-4 font-display text-3xl font-extrabold leading-tight">{featured.title}</h2>
                <p className="mt-3 text-base leading-relaxed text-ink-500">{featured.excerpt}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-leaf-700">
                  Read the piece
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          </Reveal>
        </section>
      )}

      {/* Filters + grid */}
      <section className="shell mt-14">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setActive(c)}
                aria-pressed={active === c}
                className={`chip ${active === c ? 'chip-active' : 'hover:border-leaf-400 hover:text-leaf-800'}`}
              >
                {c}
              </button>
            ))}
          </div>
          <p className="flex items-center gap-2 text-sm text-ink-500">
            <Book className="h-4 w-4 text-leaf-600" />
            {list.length} article{list.length === 1 ? '' : 's'}
          </p>
        </div>

        <StaggerGrid key={active} className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.07} amount={0.05}>
          {list.map((post) => (
            <StaggerItem key={post.slug}>
              <motion.article
                whileHover={{ y: -6 }}
                transition={{ duration: 0.25, ease: EASE }}
                className="card group h-full overflow-hidden transition-shadow duration-300 hover:shadow-lift"
              >
                <Link to={`/blog/${post.slug}`} className="flex h-full flex-col">
                  <img
                    src={post.image}
                    alt={post.alt}
                    loading="lazy"
                    decoding="async"
                    width="900"
                    height="600"
                    className="aspect-[3/2] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                  <div className="flex flex-1 flex-col p-5">
                    <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-wider text-leaf-700">
                      {post.category}
                      <span className="text-ink-400">{post.readTime}</span>
                    </p>
                    <h2 className="mt-2 font-display text-lg font-bold leading-snug">{post.title}</h2>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-500">{post.excerpt}</p>
                    <p className="mt-4 text-xs text-ink-400">{post.date}</p>
                  </div>
                </Link>
              </motion.article>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </section>

      <div className="mt-24">
        <Newsletter />
      </div>
    </>
  );
}
