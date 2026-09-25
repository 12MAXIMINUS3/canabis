import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from './Icons';
import { EASE } from './Motion';
import Thumb from './Thumb';

/** Featured-category tile: generated artwork, name, one line of copy, Browse link. */
export default function CategoryCard({ category }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: EASE }}
      className="group card h-full overflow-hidden transition-shadow duration-300 hover:shadow-lift"
    >
      <Link to={`/shop?category=${category.slug}`} className="flex h-full flex-col">
        <Thumb
          category={category.slug}
          src={category.imageUrl}
          alt={`${category.name} — ${category.description}`}
          seed={`cat-${category.slug}`}
          glyphClass="h-7 w-7"
          className="aspect-[16/10] w-full transition-transform duration-500 ease-out group-hover:scale-[1.05]"
        />

        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="font-display text-lg font-bold">{category.name}</h3>
            <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">{category.meta}</span>
          </div>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{category.description}</p>

          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-leaf-700">
            Browse
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
