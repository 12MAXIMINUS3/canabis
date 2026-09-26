/**
 * NorthLeaf identity.
 *
 * The mark is a leaf that reads as a compass needle: pointed at both ends,
 * split down the midrib so one half is light and one is dark, the way a needle
 * is coloured to show which end is north. It says the two halves of the name in
 * one shape, and because it is a single silhouette with one hard contrast edge
 * it still reads at 16px in a browser tab, where an outlined leaf turns to mush.
 *
 * Three pieces:
 *   <LogoMark />  the symbol alone
 *   <LogoBadge /> the symbol on the brand green, for avatars and app icons
 *   <Logo />      badge + wordmark, the normal lockup
 */

/** The symbol. Inherits size from className; colours are fixed so it stays on-brand. */
export function LogoMark({ className = 'h-6 w-6', light = '#7bd0b4', dark = '#effaf6', title }) {
  return (
    <svg viewBox="0 0 32 32" className={className} role={title ? 'img' : 'presentation'} aria-hidden={title ? undefined : true}>
      {title && <title>{title}</title>}
      {/* west half — the duller side of the needle */}
      <path d="M16 3.2C9.2 8 4.8 11.6 4.8 16S9.2 24 16 28.8Z" fill={light} />
      {/* east half — the pointing side */}
      <path d="M16 3.2C22.8 8 27.2 11.6 27.2 16S22.8 24 16 28.8Z" fill={dark} />
      {/* midrib. Heavy enough to hold the two halves apart at 16px, where a
          hairline would disappear and the mark would read as one blob. */}
      <path d="M16 3.2v25.6" stroke="#0e4038" strokeWidth="1.6" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

/** The symbol on brand green, for tabs, avatars and the header. */
export function LogoBadge({ className = 'h-9 w-9', markClassName = 'h-5 w-5' }) {
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-xl bg-leaf-700 shadow-soft ${className}`}
    >
      <LogoMark className={markClassName} />
    </span>
  );
}

/** Badge + wordmark. `tone="light"` for dark backgrounds. */
export default function Logo({ className = '', tone = 'dark', badgeClassName, markClassName }) {
  const onDark = tone === 'light';
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <LogoBadge
        className={`h-9 w-9 ${onDark ? 'bg-leaf-600' : 'bg-leaf-700'} ${badgeClassName ?? ''}`}
        markClassName={markClassName ?? 'h-5 w-5'}
      />
      <span
        className={`font-display text-xl font-extrabold tracking-tight ${onDark ? 'text-white' : 'text-ink-900'}`}
      >
        North<span className={onDark ? 'text-mint-400' : 'text-leaf-600'}>Leaf</span>
      </span>
    </span>
  );
}
