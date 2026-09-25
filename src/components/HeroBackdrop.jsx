import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

/**
 * Hero backdrop, in two layers.
 *
 *  1. A crossfading photo slideshow. Always present, costs about 40 KB, and is
 *     what mobile, slow connections and reduced-motion visitors actually see.
 *  2. A muted looping video, faded in on top once the browser confirms it can
 *     play. Only fetched on wide screens and decent connections.
 *
 * Because the video sits *over* a working backdrop, every failure mode — a
 * blocked autoplay, a dead file, a phone on 3G — simply leaves the slideshow
 * showing. There is no blank frame and nothing to detect.
 */

const SLIDES = [
  '/images/brand/hero-card.jpg',
  '/images/categories/flower.jpg',
  '/images/brand/process-source.jpg',
  '/images/editorial/mix-match.jpg',
  '/images/products/glacier-live-rosin.jpg',
  '/images/categories/concentrates.jpg',
];

const VIDEO_HD = '/video/hero-leaves.mp4';
const VIDEO_SD = '/video/hero-leaves-sd.mp4';

const HOLD_MS = 5200; // how long each photo is held
const FADE = 1.6; // crossfade, seconds

/** Wide screen, motion allowed, and not on a metered or slow connection. */
function useWantsVideo(reduceMotion) {
  const [wants, setWants] = useState(false);

  useEffect(() => {
    if (reduceMotion) {
      setWants(false);
      return undefined;
    }

    const conn = navigator.connection;
    const cheapConnection =
      conn && (conn.saveData === true || /^(slow-)?2g$/.test(conn.effectiveType ?? ''));
    if (cheapConnection) return undefined;

    const wide = window.matchMedia('(min-width: 1024px)');
    const sync = () => setWants(wide.matches);
    sync();
    wide.addEventListener?.('change', sync);
    return () => wide.removeEventListener?.('change', sync);
  }, [reduceMotion]);

  return wants;
}

export default function HeroBackdrop() {
  const reduceMotion = useReducedMotion();
  const wantsVideo = useWantsVideo(reduceMotion);
  const [index, setIndex] = useState(0);
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef(null);

  // Pick the lighter file when the browser reports a mid-tier connection.
  const source =
    typeof navigator !== 'undefined' && /^3g$/.test(navigator.connection?.effectiveType ?? '')
      ? VIDEO_SD
      : VIDEO_HD;

  // Warm the next photo so a crossfade never lands on a blank frame.
  useEffect(() => {
    const next = new Image();
    next.src = SLIDES[(index + 1) % SLIDES.length];
  }, [index]);

  // Stop cycling photos once the video has taken over — no wasted work.
  useEffect(() => {
    if (reduceMotion || videoReady) return undefined;
    const timer = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), HOLD_MS);
    return () => clearInterval(timer);
  }, [reduceMotion, videoReady]);

  // Some browsers ignore the autoplay attribute but allow a muted play() call.
  useEffect(() => {
    if (!wantsVideo || !videoRef.current) return;
    const play = videoRef.current.play();
    if (play?.catch) play.catch(() => setVideoReady(false));
  }, [wantsVideo]);

  const slide = SLIDES[index];

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* layer 1 — photographs */}
      <AnimatePresence initial={false}>
        <motion.div
          key={slide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : FADE, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <motion.img
            src={slide}
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

      {/* layer 2 — video, only once it is genuinely playing */}
      {wantsVideo && (
        <video
          ref={videoRef}
          src={source}
          poster={SLIDES[0]}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onCanPlay={() => setVideoReady(true)}
          onError={() => setVideoReady(false)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1600ms] ease-out ${
            videoReady ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      {/* Readability wash. Heaviest behind the headline, clearing to the right so
          the footage actually reads. If the type ever feels weak, raise the
          first two stops — that is the only knob needed. */}
      <div className="absolute inset-0 bg-gradient-to-r from-sand-50/95 via-sand-50/80 to-sand-50/40 lg:to-sand-50/20" />
      {/* vertical blend into the page below */}
      <div className="absolute inset-0 bg-gradient-to-b from-sand-50/70 via-transparent to-sand-50" />
      {/* a breath of brand colour over the imagery */}
      <div className="absolute inset-0 bg-leaf-50/30 mix-blend-multiply" />

      {/* the leaf motif */}
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

      <div className="absolute -left-32 -top-40 h-[30rem] w-[30rem] rounded-full bg-mint-300/25 blur-3xl" />
      <div className="absolute -right-24 top-10 h-[26rem] w-[26rem] rounded-full bg-leaf-200/25 blur-3xl" />

      {/* ticks, shown only while the photos are the ones moving */}
      {!reduceMotion && !videoReady && (
        <div className="absolute bottom-6 left-4 flex gap-1.5 sm:left-6 lg:left-8">
          {SLIDES.map((s, i) => (
            <span
              key={s}
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
