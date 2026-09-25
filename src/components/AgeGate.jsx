import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { IdCard, Leaf, ShieldCheck } from './Icons';
import { EASE } from './Motion';

/**
 * Age gate. Blocks the page on first visit and remembers acceptance in
 * localStorage, so it does not reappear on later navigation or reloads.
 * Clear the `northleaf.age.v1` key (or use a private window) to see it again.
 */

const STORAGE_KEY = 'northleaf.age.v1';

function readAcceptance() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'accepted';
  } catch {
    return false; // storage blocked → gate every visit
  }
}

export default function AgeGate() {
  // 'ask' | 'accepted' | 'declined'
  const [status, setStatus] = useState(() => (readAcceptance() ? 'accepted' : 'ask'));
  const acceptRef = useRef(null);

  const blocking = status !== 'accepted';

  useEffect(() => {
    document.body.style.overflow = blocking ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [blocking]);

  useEffect(() => {
    if (status === 'ask') acceptRef.current?.focus();
  }, [status]);

  const accept = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, 'accepted');
    } catch {
      /* non-fatal: the gate simply returns next visit */
    }
    setStatus('accepted');
  };

  const decline = () => {
    setStatus('declined');
    // Best effort — browsers only honour close() for script-opened windows.
    try {
      window.close();
    } catch {
      /* ignore */
    }
  };

  return (
    <AnimatePresence>
      {blocking && (
        <motion.div
          key="age-gate"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          className="fixed inset-0 z-[80] grid place-items-center overflow-y-auto bg-ink-900/70 p-4 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="age-gate-title"
          aria-describedby="age-gate-copy"
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.4, ease: EASE, delay: 0.05 }}
            className="relative w-full max-w-lg overflow-hidden rounded-4xl bg-sand-50 p-7 text-center shadow-lift sm:p-10"
          >
            {/* soft leaf-tinted glow behind the card content */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-16 -top-24 h-64 w-64 rounded-full bg-mint-300/30 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-leaf-200/40 blur-3xl"
            />

            <div className="relative">
              {status === 'ask' ? (
                <>
                  <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-leaf-700 text-white shadow-soft">
                    <Leaf className="h-7 w-7" />
                  </span>

                  <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-leaf-700">
                    Age verification
                  </p>
                  <h2 id="age-gate-title" className="mt-2 text-3xl font-extrabold sm:text-4xl">
                    You must be 19+ to enter this site.
                  </h2>
                  <p id="age-gate-copy" className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-ink-500">
                    NorthLeaf sells regulated cannabis products. Please confirm you are of legal age in your province or
                    territory before continuing.
                  </p>

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <button ref={acceptRef} type="button" onClick={accept} className="btn btn-lg btn-primary">
                      <ShieldCheck className="h-4 w-4" />
                      I am 19+
                    </button>
                    <button type="button" onClick={decline} className="btn btn-lg btn-secondary">
                      Exit
                    </button>
                  </div>

                  <p className="mt-6 flex items-center justify-center gap-2 text-xs text-ink-400">
                    <IdCard className="h-4 w-4" />
                    Government-issued ID is required on delivery.
                  </p>
                </>
              ) : (
                <>
                  <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-ink-800 text-sand-100">
                    <IdCard className="h-7 w-7" />
                  </span>
                  <h2 id="age-gate-title" className="mt-6 text-3xl font-extrabold">
                    Come back when you are 19+
                  </h2>
                  <p id="age-gate-copy" className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-ink-500">
                    We are not able to show you this store. If you reached this screen by mistake, you can return to the
                    age check.
                  </p>
                  <button type="button" onClick={() => setStatus('ask')} className="btn btn-lg btn-secondary mt-8">
                    Back to age check
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
