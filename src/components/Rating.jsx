import { Star } from './Icons';

/** Five-star display. Rounds to the nearest whole star for the glyphs, but keeps the exact number in text. */
export default function Rating({ value, count, className = '', showValue = true, size = 'h-3.5 w-3.5' }) {
  const filled = Math.round(value);
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="flex text-clay" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star key={i} filled={i <= filled} className={`${size} ${i <= filled ? '' : 'text-sand-300'}`} />
        ))}
      </div>
      <span className="text-xs text-ink-400">
        <span className="sr-only">Rated </span>
        {showValue && <span className="font-semibold text-ink-600 tabular-nums">{value.toFixed(1)}</span>}
        <span className="sr-only"> out of 5</span>
        {typeof count === 'number' && <span> ({count})</span>}
      </span>
    </div>
  );
}
