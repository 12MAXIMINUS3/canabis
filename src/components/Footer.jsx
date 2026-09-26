import { Link } from 'react-router-dom';
import { SocialCamera, SocialChat, SocialGlobe, SocialPlay } from './Icons';
import { LogoMark } from './Logo';
import { FOOTER_COLUMNS } from './NavMenu';

// Placeholder social links — generic glyphs, no real platform marks or accounts.
const SOCIALS = [
  { label: 'Community', Icon: SocialGlobe },
  { label: 'Photos', Icon: SocialCamera },
  { label: 'Messages', Icon: SocialChat },
  { label: 'Video', Icon: SocialPlay },
];

export default function Footer() {
  return (
    <footer className="mt-24 bg-ink-900 text-sand-100">
      <div className="shell grid gap-12 py-16 lg:grid-cols-[1.4fr_repeat(4,1fr)] lg:gap-8">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-leaf-600">
              <LogoMark className="h-5 w-5" />
            </span>
            <span className="font-display text-xl font-extrabold tracking-tight text-white">
              North<span className="text-mint-400">Leaf</span>
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-sand-100/60">
            A licensed, fictional dispensary built as a design demo. Lab-tested products, plain packaging and
            shipping that arrives when we say it will.
          </p>

          <div className="mt-6 flex gap-2">
            {SOCIALS.map(({ label, Icon }) => (
              <a
                key={label}
                href="#"
                aria-label={`${label} (placeholder link)`}
                onClick={(e) => e.preventDefault()}
                className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-sand-100/70 transition-all duration-200 hover:-translate-y-0.5 hover:border-mint-400/40 hover:text-mint-300"
              >
                <Icon className="h-[18px] w-[18px]" />
              </a>
            ))}
          </div>
        </div>

        {FOOTER_COLUMNS.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-mint-300">{col.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="-mx-2 block rounded px-2 py-1.5 text-sm text-sand-100/70 transition-colors duration-200 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="shell flex flex-col gap-4 py-6 text-xs text-sand-100/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} NorthLeaf Cannabis. A fictional storefront for demonstration purposes.</p>
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>Legal age only</span>
            <span aria-hidden="true">·</span>
            <span>Licence #NL-000-DEMO</span>
            <span aria-hidden="true">·</span>
            <span>Please consume responsibly</span>
            <span aria-hidden="true">·</span>
            <Link to="/admin" className="transition-colors hover:text-mint-300">
              Staff
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
