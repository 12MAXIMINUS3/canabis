import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search } from '../components/Icons';
import { Reveal } from '../components/Motion';
import Accordion from '../components/Accordion';
import PageHero from '../components/PageHero';
import { faqGroups } from '../data/content';

export default function Faq() {
  const [query, setQuery] = useState('');

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return faqGroups;
    return faqGroups
      .map((g) => ({ ...g, items: g.items.filter((i) => `${i.q} ${i.a}`.toLowerCase().includes(q)) }))
      .filter((g) => g.items.length > 0);
  }, [query]);

  const total = groups.reduce((n, g) => n + g.items.length, 0);

  return (
    <>
      <PageHero
        compact
        eyebrow="Support"
        title="Frequently asked questions"
        copy="Ordering, shipping, potency and returns — the things people actually write in about, answered without the legal hedging."
      >
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the FAQ…"
            aria-label="Search frequently asked questions"
            className="field pl-11"
          />
        </div>
      </PageHero>

      <div className="shell pb-8">
        {total === 0 ? (
          <Reveal className="card px-6 py-16 text-center">
            <h2 className="font-display text-xl font-bold">No answer matches “{query}”</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink-500">
              Try a shorter term, or send the question to us directly and we will answer it within a business day.
            </p>
            <Link to="/contact" className="btn btn-md btn-primary mt-6">
              Ask us instead
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[14rem_1fr] lg:gap-14">
            {/* Group index */}
            <nav aria-label="FAQ sections" className="hidden lg:block">
              <div className="sticky top-28">
                <p className="label">Sections</p>
                <ul className="space-y-1">
                  {groups.map((g) => (
                    <li key={g.group}>
                      <a
                        href={`#faq-${g.group.toLowerCase().replace(/[^a-z]+/g, '-')}`}
                        className="block rounded-lg px-3 py-2 text-sm font-medium text-ink-500 transition-colors hover:bg-leaf-50 hover:text-leaf-800"
                      >
                        {g.group}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>

            <div className="space-y-12">
              {groups.map((g) => (
                <section key={g.group} id={`faq-${g.group.toLowerCase().replace(/[^a-z]+/g, '-')}`} className="scroll-mt-28">
                  <Reveal>
                    <h2 className="font-display text-sm font-bold uppercase tracking-[0.16em] text-leaf-700">
                      {g.group}
                    </h2>
                  </Reveal>
                  <Accordion items={g.items} defaultOpen={-1} idPrefix={`faq-${g.group}`} />
                </section>
              ))}
            </div>
          </div>
        )}
      </div>

      <section className="shell pb-8">
        <Reveal className="flex flex-col items-start justify-between gap-6 rounded-4xl bg-ink-900 p-8 text-white sm:flex-row sm:items-center sm:p-10">
          <div>
            <h2 className="font-display text-2xl font-bold text-white">Still stuck?</h2>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-sand-100/70">
              Support reads every message and replies within one business day — faster during weekday afternoons.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link to="/contact" className="btn btn-lg bg-white text-leaf-800 hover:bg-mint-100">
              Contact support
            </Link>
            <Link to="/how-to-order" className="btn btn-lg border border-white/20 text-white hover:bg-white/10">
              How to order
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
