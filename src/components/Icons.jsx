/**
 * Hand-rolled icon set — no icon library, no third-party marks.
 * Every icon inherits `currentColor` and sizes from Tailwind classes (h-5 w-5 …).
 */

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
};

const Svg = ({ children, className = 'h-5 w-5', ...rest }) => (
  <svg {...base} {...rest} className={className}>
    {children}
  </svg>
);

/* ---- brand / nature ---- */

export const Leaf = (p) => (
  <Svg {...p}>
    <path d="M4 20c0-8 5.5-14 16-15 1 10.5-6.2 16-13 16H4Z" />
    <path d="M4 20C8 15.5 12.5 12.5 18 10.5" />
  </Svg>
);

export const Sprout = (p) => (
  <Svg {...p}>
    <path d="M12 21v-7" />
    <path d="M12 14c0-3.3-2.4-5.6-6-6 .3 3.7 2.6 6 6 6Z" />
    <path d="M12 14c0-4 2.7-6.4 7-7-.3 4.2-3 7-7 7Z" />
  </Svg>
);

/* ---- feature strip ---- */

export const Beaker = (p) => (
  <Svg {...p}>
    <path d="M9 3h6" />
    <path d="M10 3v6.2L5.6 17A2.6 2.6 0 0 0 7.9 21h8.2a2.6 2.6 0 0 0 2.3-3.9L14 9.2V3" />
    <path d="M7.2 15h9.6" />
  </Svg>
);

export const Truck = (p) => (
  <Svg {...p}>
    <path d="M3 7h10v9H3z" />
    <path d="M13 10h4l4 3.5V16h-8" />
    <circle cx="7" cy="18" r="2" />
    <circle cx="17" cy="18" r="2" />
  </Svg>
);

export const Package = (p) => (
  <Svg {...p}>
    <path d="M12 3 3 7.5v9L12 21l9-4.5v-9L12 3Z" />
    <path d="M3 7.5 12 12l9-4.5M12 12v9" />
  </Svg>
);

export const Lock = (p) => (
  <Svg {...p}>
    <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
    <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
    <path d="M12 14.5v2" />
  </Svg>
);

export const ShieldCheck = (p) => (
  <Svg {...p}>
    <path d="M12 3 5 5.5v6c0 4.3 2.9 7.7 7 9.5 4.1-1.8 7-5.2 7-9.5v-6L12 3Z" />
    <path d="m9 12 2.2 2.2L15.5 10" />
  </Svg>
);

export const IdCard = (p) => (
  <Svg {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <circle cx="9" cy="11" r="2" />
    <path d="M6 16c.6-1.3 1.7-2 3-2s2.4.7 3 2M14.5 10h4M14.5 13.5h3" />
  </Svg>
);

export const Scale = (p) => (
  <Svg {...p}>
    <path d="M12 4v16M7 20h10" />
    <path d="M5 8h14M5 8l-2.5 5h5L5 8ZM19 8l-2.5 5h5L19 8Z" />
  </Svg>
);

/* ---- categories ---- */

export const Droplet = (p) => (
  <Svg {...p}>
    <path d="M12 3.5s6 5.9 6 10a6 6 0 0 1-12 0c0-4.1 6-10 6-10Z" />
  </Svg>
);

export const Pen = (p) => (
  <Svg {...p}>
    <rect x="9" y="2.5" width="6" height="19" rx="3" />
    <path d="M9 8h6M12 18.5v1.5" />
  </Svg>
);

export const Crystal = (p) => (
  <Svg {...p}>
    <path d="m12 3 6 5-2.5 12h-7L6 8l6-5Z" />
    <path d="M6 8h12M12 3v17" />
  </Svg>
);

export const Cookie = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M9.5 9.5h.01M14.5 10.5h.01M11 14.5h.01M15 15h.01" strokeWidth="2.4" />
  </Svg>
);

export const Grid = (p) => (
  <Svg {...p}>
    <rect x="3.5" y="3.5" width="7" height="7" rx="1.6" />
    <rect x="13.5" y="3.5" width="7" height="7" rx="1.6" />
    <rect x="3.5" y="13.5" width="7" height="7" rx="1.6" />
    <rect x="13.5" y="13.5" width="7" height="7" rx="1.6" />
  </Svg>
);

/* ---- ui ---- */

export const Cart = (p) => (
  <Svg {...p}>
    <path d="M3 4h2.2l1.6 10.4A2 2 0 0 0 8.8 16h8.6a2 2 0 0 0 2-1.6L21 8H6" />
    <circle cx="10" cy="19.5" r="1.4" />
    <circle cx="18" cy="19.5" r="1.4" />
  </Svg>
);

export const Menu = (p) => (
  <Svg {...p}>
    <path d="M4 7h16M4 12h16M4 17h11" />
  </Svg>
);

export const X = (p) => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Svg>
);

export const Check = (p) => (
  <Svg {...p} strokeWidth={2.2}>
    <path d="m5 12.5 4.5 4.5L19 7" />
  </Svg>
);

export const Info = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5M12 7.8h.01" strokeWidth="2" />
  </Svg>
);

export const ArrowRight = (p) => (
  <Svg {...p}>
    <path d="M4 12h15M13 6l6 6-6 6" />
  </Svg>
);

export const ArrowLeft = (p) => (
  <Svg {...p}>
    <path d="M20 12H5M11 6l-6 6 6 6" />
  </Svg>
);

export const ChevronDown = (p) => (
  <Svg {...p}>
    <path d="m6 9.5 6 6 6-6" />
  </Svg>
);

export const Plus = (p) => (
  <Svg {...p}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
);

export const Minus = (p) => (
  <Svg {...p}>
    <path d="M5 12h14" />
  </Svg>
);

export const Star = ({ className = 'h-4 w-4', filled = false, ...rest }) => (
  <svg
    {...base}
    {...rest}
    className={className}
    fill={filled ? 'currentColor' : 'none'}
    strokeWidth={filled ? 0 : 1.6}
  >
    <path d="m12 4 2.4 5 5.6.8-4 3.9 1 5.5-5-2.7-5 2.7 1-5.5-4-3.9 5.6-.8L12 4Z" />
  </svg>
);

export const Sliders = (p) => (
  <Svg {...p}>
    <path d="M4 7h10M18 7h2M4 12h4M12 12h8M4 17h9M17 17h3" />
    <circle cx="16" cy="7" r="2" />
    <circle cx="10" cy="12" r="2" />
    <circle cx="15" cy="17" r="2" />
  </Svg>
);

export const Search = (p) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m16 16 4 4" />
  </Svg>
);

export const Mail = (p) => (
  <Svg {...p}>
    <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
    <path d="m4 8 8 5 8-5" />
  </Svg>
);

export const Clock = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7.5V12l3 2" />
  </Svg>
);

export const MapPin = (p) => (
  <Svg {...p}>
    <path d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.5" />
  </Svg>
);

export const Sparkle = (p) => (
  <Svg {...p}>
    <path d="M12 3.5 13.6 9l5.4 1.6-5.4 1.6L12 17.7l-1.6-5.5L5 10.6 10.4 9 12 3.5Z" />
    <path d="M18.5 16.5l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7.7-2Z" />
  </Svg>
);

/* ---- social placeholders (generic shapes, no real brand marks) ---- */

export const SocialGlobe = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M3.5 12h17M12 3.5c2.5 2.4 2.5 14.6 0 17M12 3.5c-2.5 2.4-2.5 14.6 0 17" />
  </Svg>
);

export const SocialCamera = (p) => (
  <Svg {...p}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <path d="M16.8 7.2h.01" strokeWidth="2.4" />
  </Svg>
);

export const SocialChat = (p) => (
  <Svg {...p}>
    <path d="M20 12.5c0 3.6-3.6 6.5-8 6.5-.9 0-1.8-.1-2.6-.4L5 20.5l1.2-3A6.3 6.3 0 0 1 4 12.5C4 8.9 7.6 6 12 6s8 2.9 8 6.5Z" />
  </Svg>
);

export const SocialPlay = (p) => (
  <Svg {...p}>
    <rect x="2.5" y="5" width="19" height="14" rx="4" />
    <path d="m10.5 9.5 4.5 2.5-4.5 2.5v-5Z" />
  </Svg>
);

/* ---- account / editorial ---- */

export const User = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="8.5" r="3.8" />
    <path d="M4.5 20c1.2-3.6 4-5.5 7.5-5.5s6.3 1.9 7.5 5.5" />
  </Svg>
);

export const Gift = (p) => (
  <Svg {...p}>
    <rect x="3.5" y="8.5" width="17" height="4" rx="1" />
    <path d="M5 12.5V20h14v-7.5M12 8.5V20" />
    <path d="M12 8.5C10.5 5 7 4.5 7 6.8S10 8.5 12 8.5ZM12 8.5c1.5-3.5 5-4 5-1.7S14 8.5 12 8.5Z" />
  </Svg>
);

export const Book = (p) => (
  <Svg {...p}>
    <path d="M4 5.5C6.5 4.5 9.5 4.5 12 6c2.5-1.5 5.5-1.5 8-.5v13c-2.5-1-5.5-1-8 .5-2.5-1.5-5.5-1.5-8-.5v-13Z" />
    <path d="M12 6v13" />
  </Svg>
);

export const Tag = (p) => (
  <Svg {...p}>
    <path d="M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7l8.3 8.3a1 1 0 0 1 0 1.4l-7.3 7.3a1 1 0 0 1-1.4 0l-8.3-8.3Z" />
    <circle cx="8" cy="8" r="1.3" />
  </Svg>
);
