import { motion } from 'framer-motion';

/**
 * Animation vocabulary for the whole site, kept in one file so timing stays
 * consistent. Everything is ~200–450ms with the same ease-out curve, and
 * `<MotionConfig reducedMotion="user">` in App.jsx lets the OS switch it off.
 */

export const EASE = [0.22, 1, 0.36, 1];

/** Fade + rise, played once when the element scrolls into view. */
export function Reveal({ children, delay = 0, y = 22, once = true, amount = 0.25, className, as = 'div', ...rest }) {
  const Tag = motion[as] ?? motion.div;
  return (
    <Tag
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration: 0.5, delay, ease: EASE }}
      className={className}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** Parent for staggered grids: children animate one after another. */
export const staggerParent = (stagger = 0.08, delayChildren = 0.05) => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren } },
});

export const staggerChild = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
};

/** <StaggerGrid> + <StaggerItem> — the pattern used by category & product grids. */
export function StaggerGrid({ children, className, stagger = 0.08, amount = 0.15, ...rest }) {
  return (
    <motion.div
      variants={staggerParent(stagger)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className, ...rest }) {
  return (
    <motion.div variants={staggerChild} className={className} {...rest}>
      {children}
    </motion.div>
  );
}

/** Hover interaction shared by cards: lift a little, settle quickly. */
export const hoverLift = {
  whileHover: { y: -6 },
  whileTap: { y: -2 },
  transition: { duration: 0.25, ease: EASE },
};

/** Page transition used by the route wrapper. */
export const pageFade = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.32, ease: EASE },
};
