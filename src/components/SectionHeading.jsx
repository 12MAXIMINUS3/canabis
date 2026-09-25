import { Reveal } from './Motion';

/** Shared section header: eyebrow + title + supporting line, with an optional right-hand action. */
export default function SectionHeading({ eyebrow, title, copy, action, align = 'left', className = '' }) {
  const centered = align === 'center';
  return (
    <Reveal
      className={`flex flex-col gap-4 ${
        centered ? 'items-center text-center' : 'md:flex-row md:items-end md:justify-between'
      } ${className}`}
    >
      <div className={centered ? 'max-w-2xl' : 'max-w-2xl'}>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">{title}</h2>
        {copy && <p className="mt-3 text-base leading-relaxed text-ink-500">{copy}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </Reveal>
  );
}
