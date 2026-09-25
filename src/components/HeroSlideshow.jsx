import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

/**
 * Cinematic backdrop for the hero: a slow crossfade between cannabis photographs,
 * each drifting gently (a Ken Burns pan) so the section feels alive without a
 * video file to download.
 *
 * Readability comes first — a light wash sits over the photos, heaviest on the
 * left where the headline is, so the dark type keeps its contrast. If the viewer
 * has asked for reduced motion we hold a single still frame instead of cycling.
 */

const SLIDES = [
  { src: '/images/brand/hero-card.jpg', alt: '' },
  { src: '/images/categories/flower.jpg', alt: '' },
  { src: '/images/brand/process-source.jpg', alt: '' },
  { src: '/images/editorial/mix-match.jpg', alt: '' },
  { src: '/images/products/glacier-live-rosin.jpg', alt: '' },
  { src: '/images/categories/concentrates.jpg', alt: '' },
];

const HOLD_MS = 5200; // time each photo is on screen
const FADE = 1.6; // crossfade seconds

export default function HeroSlideshow() {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  // Warm the next image so the crossfade never shows a blank frame.
  useEffect(() => {
    const next = new Image();
    next.src = SLIDES[(index + 1) % SLIDES.length].src;
  }, [index]);

  useEffect(() => {
    if (reduceMotion) return undefined;
    const timer = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), HOLD_MS);
    return () => clearInterval(timer);
  }, [reduceMotion]);

  const slide = SLIDES[index];

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* photos */}
      <AnimatePresence initial={false}>
        <motion.div
          key={slide.src}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : FADE, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <motion.img
            src={slide.src}
            alt=""
            initial={reduceMotion ? false : { scale: 1.08, x: 0, y: 0 }}
            animate={reduceMotion ? false : { scale: 1.16, x: -14, y: -10 }}
            transition={{ duration: (HOLD_MS + FADE * 1000) / 1000, ease: 'linear' }}
            className="h-full w-full object-cover"
            loading="eager"
            decoding="async"
          />
        </motion.div>
      </AnimatePresence>

      {/* Readability wash. Heaviest behind the headline, clearing to the right so
          the photography actually reads. If the type ever feels weak against a
          busy photo, raise the first two stops — that is the only knob needed. */}
      <div className="absolute inset-0 bg-gradient-to-r from-sand-50/95 via-sand-50/80 to-sand-50/40 lg:to-sand-50/20" />
      {/* vertical blend so the section melts into the page below */}
      <div className="absolute inset-0 bg-gradient-to-b from-sand-50/70 via-transparent to-sand-50" />
      {/* a breath of brand colour over the photography */}
      <div className="absolute inset-0 bg-leaf-50/30 mix-blend-multiply" />

      {/* the leaf motif, kept from the original backdrop */}
      <svg
        className="absolute inset-0 h-full w-full opacity-70"
        style={{
          maskImage: 'linear-gradient(to bottom, black, transparent 78%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black, transparent 78%)',
        }}
      >
        <defs>
          <pattern id="leaf-tile" width="128" height="128" patternUnits="userSpaceOnUse" patternTransform="rotate(12)">
            <path
              d="M24 104c0-42 29-73 84-78 5 55-33 84-68 84H24Z"
              fill="none"
              stroke="#0f6251"
              strokeOpacity="0.08"
              strokeWidth="1.5"
            />
            <path d="M24 104c21-24 45-39 74-50" fill="none" stroke="#0f6251" strokeOpacity="0.06" strokeWidth="1.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#leaf-tile)" />
      </svg>

      {/* soft colour bloom, as before */}
      <div className="absolute -left-32 -top-40 h-[30rem] w-[30rem] rounded-full bg-mint-300/25 blur-3xl" />
      <div className="absolute -right-24 top-10 h-[26rem] w-[26rem] rounded-full bg-leaf-200/25 blur-3xl" />

      {/* progress ticks, bottom-left, so the rotation reads as deliberate */}
      {!reduceMotion && (
        <div className="absolute bottom-6 left-4 flex gap-1.5 sm:left-6 lg:left-8">
          {SLIDES.map((s, i) => (
            <span
              key={s.src}
              className={`h-1 rounded-full transition-all duration-500 ${
                i === index ? 'w-7 bg-leaf-700/70' : 'w-2.5 bg-leaf-700/25'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
