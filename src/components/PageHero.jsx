import { motion } from 'framer-motion';
import { EASE } from './Motion';

/**
 * Shared banner for the secondary pages (FAQ, Rewards, Blog, Vendors…).
 * With an `image` it renders a two-column layout; without one it is a compact
 * text header. Keeps every inner page recognisably part of the same site.
 */
export default function PageHero({ eyebrow, title, copy, image, alt, actions, children, compact = false }) {
  const container = { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } } };
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } } };

  return (
    <section className="relative isolate overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-leaf-50 to-sand-50" />
        <div className="absolute -right-24 -top-32 h-96 w-96 rounded-full bg-mint-300/25 blur-3xl animate-drift-slow" />
      </div>

      <div
        className={`shell relative grid gap-10 ${compact ? 'pb-10 pt-12' : 'pb-14 pt-14 sm:pt-20'} ${
          image ? 'lg:grid-cols-[1.05fr_0.95fr] lg:items-center' : ''
        }`}
      >
        <motion.div variants={container} initial="hidden" animate="show" className={image ? '' : 'max-w-3xl'}>
          {eyebrow && (
            <motion.p variants={item} className="eyebrow">
              {eyebrow}
            </motion.p>
          )}
          <motion.h1 variants={item} className="mt-4 text-4xl font-extrabold leading-tight sm:text-5xl">
            {title}
          </motion.h1>
          {copy && (
            <motion.p variants={item} className="mt-4 max-w-2xl text-base leading-relaxed text-ink-500 sm:text-lg">
              {copy}
            </motion.p>
          )}
          {actions && (
            <motion.div variants={item} className="mt-8 flex flex-col gap-3 sm:flex-row">
              {actions}
            </motion.div>
          )}
          {children && (
            <motion.div variants={item} className="mt-8">
              {children}
            </motion.div>
          )}
        </motion.div>

        {image && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
            className="overflow-hidden rounded-4xl shadow-lift"
          >
            <img
              src={image}
              alt={alt ?? ''}
              width="1100"
              height="620"
              className="aspect-[16/10] w-full object-cover"
            />
          </motion.div>
        )}
      </div>
    </section>
  );
}
