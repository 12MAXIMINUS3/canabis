import { useEffect, useState } from 'react';
import { Cookie, Crystal, Droplet, Grid, Leaf, Pen } from './Icons';

/**
 * Product / category imagery.
 *
 * Renders the real photograph when one is supplied (products and categories
 * both carry an `imageUrl`, and callers can pass `src` directly). Photos live in
 * `public/images/…` and are licensed under the Pexels licence — see CREDITS.md.
 *
 * If an image is missing or fails to load, it falls back to generated artwork:
 * a category gradient with soft blobs whose positions come from a hash of the
 * id, so the layout never collapses into an empty box.
 */

const ART = {
  flower: { from: '#0f6251', to: '#45b494', glyph: Leaf, tone: 'dark' },
  edibles: { from: '#a8542a', to: '#e2a877', glyph: Cookie, tone: 'dark' },
  vapes: { from: '#11414f', to: '#3fa79b', glyph: Pen, tone: 'dark' },
  concentrates: { from: '#8a6420', to: '#e0b25f', glyph: Crystal, tone: 'dark' },
  cbd: { from: '#2dbd9a', to: '#d7f2e7', glyph: Droplet, tone: 'light' },
  accessories: { from: '#5d564b', to: '#c4b598', glyph: Grid, tone: 'dark' },
};

const FALLBACK = { from: '#104e42', to: '#7bd0b4', glyph: Leaf, tone: 'dark' };

/** Tiny stable string hash → non-negative int. */
function hash(text = '') {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export default function Thumb({
  product,
  category,
  src,
  alt,
  seed,
  className = '',
  glyphClass = 'h-9 w-9',
  imgClassName = '',
  priority = false,
  children,
}) {
  const slug = product?.category ?? category ?? 'flower';
  const photo = src ?? product?.imageUrl ?? '';
  const [failed, setFailed] = useState(false);

  // A new photo deserves a fresh attempt.
  useEffect(() => setFailed(false), [photo]);

  const label = alt ?? product?.name ?? slug;

  if (photo && !failed) {
    return (
      <div className={`relative overflow-hidden bg-sand-100 ${className}`}>
        <img
          src={photo}
          alt={label}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onError={() => setFailed(true)}
          className={`h-full w-full object-cover ${imgClassName}`}
        />
        {children}
      </div>
    );
  }

  /* ---- generated fallback ---- */

  const art = ART[slug] ?? FALLBACK;
  const Glyph = art.glyph;
  const h = hash(seed ?? product?.id ?? slug);
  const angle = 115 + (h % 90);
  const blobA = { cx: 70 + (h % 140), cy: 60 + ((h >> 3) % 90), r: 90 + ((h >> 5) % 60) };
  const blobB = { cx: 250 + ((h >> 7) % 120), cy: 180 + ((h >> 9) % 90), r: 70 + ((h >> 11) % 70) };
  const tilt = ((h >> 13) % 40) - 20;
  const onLight = art.tone === 'light';

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ backgroundImage: `linear-gradient(${angle}deg, ${art.from}, ${art.to})` }}
      role="img"
      aria-label={`${label} illustration`}
    >
      <svg
        viewBox="0 0 400 300"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <radialGradient id={`glow-${h}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity={onLight ? 0.55 : 0.4} />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
          <pattern
            id={`arcs-${h}`}
            width="46"
            height="46"
            patternUnits="userSpaceOnUse"
            patternTransform={`rotate(${tilt})`}
          >
            <path
              d="M0 46C0 20.6 20.6 0 46 0"
              fill="none"
              stroke={onLight ? '#0f6251' : '#ffffff'}
              strokeOpacity="0.14"
              strokeWidth="1"
            />
          </pattern>
        </defs>

        <rect width="400" height="300" fill={`url(#arcs-${h})`} />
        <circle {...blobA} fill={`url(#glow-${h})`} className="animate-drift-slow" />
        <circle {...blobB} fill={`url(#glow-${h})`} className="animate-drift" />
        <ellipse
          cx={blobB.cx - 60}
          cy={blobA.cy + 40}
          rx="130"
          ry="90"
          fill={onLight ? '#0f6251' : '#042420'}
          fillOpacity="0.1"
        />
      </svg>

      <div
        className={`absolute bottom-3 left-3 grid place-items-center rounded-2xl p-2 backdrop-blur-[2px] ${
          onLight ? 'bg-leaf-900/10 text-leaf-900' : 'bg-white/15 text-white'
        }`}
      >
        <Glyph className={glyphClass} />
      </div>

      {children}
    </div>
  );
}
