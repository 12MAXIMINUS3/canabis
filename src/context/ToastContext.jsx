import { createContext, useCallback, useContext, useMemo, useRef, useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Info, X } from '../components/Icons';

/**
 * Minimal toast system: useToast().push('Added to cart') from anywhere.
 * Toasts self-dismiss after 3s and stack bottom-right (bottom-centre on mobile).
 */

const ToastContext = createContext(null);
const DURATION = 3000;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const push = useCallback(
    (message, options = {}) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const toast = { id, message, tone: options.tone ?? 'success', detail: options.detail };
      // Keep at most three on screen so the corner never fills up.
      setToasts((prev) => [...prev.slice(-2), toast]);
      timers.current.set(
        id,
        setTimeout(() => dismiss(id), options.duration ?? DURATION),
      );
      return id;
    },
    [dismiss],
  );

  // Clear pending timers if the provider ever unmounts.
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const value = useMemo(() => ({ push, dismiss }), [push, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

function ToastViewport({ toasts, onDismiss }) {
  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[70] flex flex-col items-center gap-2 p-4 sm:inset-x-auto sm:right-0 sm:items-end sm:p-6"
    >
      <AnimatePresence initial={false}>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border border-white/10 bg-ink-900/95 p-3.5 pr-2.5 text-white shadow-lift backdrop-blur"
          >
            <span
              className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full ${
                toast.tone === 'info' ? 'bg-sand-300/25 text-sand-200' : 'bg-mint-400/20 text-mint-300'
              }`}
            >
              {toast.tone === 'info' ? <Info className="h-3.5 w-3.5" /> : <Check className="h-3.5 w-3.5" />}
            </span>
            <div className="min-w-0 flex-1 py-0.5">
              <p className="text-sm font-semibold leading-snug">{toast.message}</p>
              {toast.detail && <p className="mt-0.5 text-xs text-white/60">{toast.detail}</p>}
            </div>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              aria-label="Dismiss notification"
              className="rounded-full p-1.5 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}
