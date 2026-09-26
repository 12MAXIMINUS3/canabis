import { Link } from 'react-router-dom';
import { Reveal } from '../components/Motion';
import PageHero from '../components/PageHero';
import { legalDocs } from '../data/content';

const SIBLINGS = [
  { key: 'privacy', to: '/privacy', label: 'Privacy Policy' },
  { key: 'terms', to: '/terms', label: 'Terms of Service' },
  { key: 'responsible-use', to: '/responsible-use', label: 'Responsible Use' },
];

/** Privacy, Terms and Responsible Use share one layout; `doc` picks the copy from content.js. */
export default function Legal({ doc }) {
  const { eyebrow, title, updated, intro, sections } = legalDocs[doc];

  return (
    <div>
      <PageHero eyebrow={eyebrow} title={title} copy={intro} compact>
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">Last updated {updated}</p>
      </PageHero>

      <div className="shell grid gap-10 pt-6 lg:grid-cols-[220px_1fr] lg:gap-16">
        <nav aria-label="Legal pages" className="lg:sticky lg:top-28 lg:self-start">
          <ul className="flex flex-wrap gap-2 lg:flex-col">
            {SIBLINGS.map((s) => (
              <li key={s.key}>
                <Link
                  to={s.to}
                  aria-current={s.key === doc ? 'page' : undefined}
                  className={`chip ${s.key === doc ? 'chip-active' : 'hover:border-leaf-700/40'}`}
                >
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <article className="max-w-3xl space-y-10">
          {sections.map((s, i) => (
            <Reveal key={s.heading} delay={Math.min(i, 3) * 0.04}>
              <h2 className="text-xl font-extrabold">
                <span className="mr-3 font-display text-sm font-bold text-leaf-600 tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {s.heading}
              </h2>
              <p className="mt-3 text-base leading-relaxed text-ink-500">{s.text}</p>
            </Reveal>
          ))}
          <p className="border-t border-ink-900/10 pt-6 text-sm text-ink-400">
            Questions about this page?{' '}
            <Link to="/contact" className="font-semibold text-leaf-700 hover:underline">
              Contact us
            </Link>
            . CanabisLeafHub is a fictional storefront; this text is illustrative, not legal advice.
          </p>
        </article>
      </div>
    </div>
  );
}
