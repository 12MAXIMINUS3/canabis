import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from './Icons';
import { EASE } from './Motion';

/** One accordion row. Used by the FAQ page and the About page teaser. */
export default function FaqItem({ item, isOpen, onToggle, id }) {
  return (
    <div className="border-b border-ink-900/10">
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={`faq-panel-${id}`}
          className="flex w-full items-center justify-between gap-4 py-5 text-left font-display text-base font-bold"
        >
          {item.q}
          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${
              isOpen ? 'bg-leaf-700 text-white' : 'bg-sand-100 text-ink-500'
            }`}
          >
            <ChevronDown className="h-4 w-4" />
          </motion.span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`faq-panel-${id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: EASE }}
            className="overflow-hidden"
          >
            <p className="max-w-2xl pb-6 text-sm leading-relaxed text-ink-500">{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
