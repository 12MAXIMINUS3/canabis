import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Beaker,
  IdCard,
  Leaf,
  Lock,
  Package,
  Scale,
  ShieldCheck,
  Sparkle,
  Truck,
} from '../components/Icons';
import { EASE, Reveal, StaggerGrid, StaggerItem } from '../components/Motion';
import SectionHeading from '../components/SectionHeading';
import CategoryCard from '../components/CategoryCard';
import ProductCard from '../components/ProductCard';
import Newsletter from '../components/Newsletter';
import { useCatalog } from '../context/CatalogContext';

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

/** Abstract leaf-and-gradient backdrop. Pure CSS + inline SVG, nothing licensed. */
function HeroBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-leaf-50 via-sand-50 to-sand-50" />
      <div className="absolute -left-32 -top-40 h-[30rem] w-[30rem] rounded-full bg-mint-300/30 blur-3xl animate-drift-slow" />
      <div className="absolute -right-24 top-10 h-[26rem] w-[26rem] rounded-full bg-leaf-200/40 blur-3xl animate-drift" />
      <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-sand-300/30 blur-3xl" />

      {/* Repeating leaf outline, faded out toward the bottom */}
      <svg className="absolute inset-0 h-full w-full" style={{ maskImage: 'linear-gradient(to bottom, black, transparent 78%)', WebkitMaskImage: 'linear-gradient(to bottom, black, transparent 78%)' }}>
        <defs>
          <pattern id="leaf-tile" width="128" height="128" patternUnits="userSpaceOnUse" patternTransform="rotate(12)">
            <path
              d="M24 104c0-42 29-73 84-78 5 55-33 84-68 84H24Z"
              fill="none"
              stroke="#0f6251"
              strokeOpacity="0.09"
              strokeWidth="1.5"
            />
            <path d="M24 104c21-24 45-39 74-50" fill="none" stroke="#0f6251" strokeOpacity="0.07" strokeWidth="1.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#leaf-tile)" />
      </svg>
    </div>
  );
}

const HERO_STATS = [
  { value: '100%', label: 'Batch lab-tested' },
  { value: '1–3 days', label: 'Canada-wide delivery' },
  { value: '12k+', label: 'Verified reviews' },
];

function Hero() {
  // One parent, staggered children: headline → sub → buttons → stats.
  const container = { hidden: {}, show: { transition: { staggerChildren: 0.11, delayChildren: 0.12 } } };
  const item = { hidden: { opacity: 0, y: 26 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } } };

  return (
    <section className="relative isolate overflow-hidden">
      <HeroBackdrop />

      <div className="shell relative grid gap-14 pb-20 pt-16 sm:pt-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10 lg:pb-28">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.p variants={item} className="eyebrow">
            <Sparkle className="h-3.5 w-3.5" />
            Licensed Canadian retailer
          </motion.p>

          <motion.h1
            variants={item}
            className="mt-5 text-[2.6rem] font-extrabold leading-[1.05] sm:text-6xl lg:text-[4.1rem]"
          >
            Premium Cannabis, <span className="text-gradient">Delivered Discreetly</span> Across Canada
          </motion.h1>

          <motion.p variants={item} className="mt-6 max-w-xl text-lg leading-relaxed text-ink-500">
            Every batch is grown in small lots, third-party lab-tested for potency and purity, and shipped in plain,
            odour-sealed packaging that reaches most of the country in one to three days.
          </motion.p>

          <motion.div variants={item} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link to="/shop" className="btn btn-lg btn-primary">
              Shop Now
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/about" className="btn btn-lg btn-secondary">
              Learn More
            </Link>
          </motion.div>

          <motion.dl variants={item} className="mt-12 grid max-w-lg grid-cols-3 gap-4 border-t border-ink-900/10 pt-6">
            {HERO_STATS.map((stat) => (
              <div key={stat.label}>
                <dt className="font-display text-2xl font-extrabold text-leaf-800 sm:text-3xl">{stat.value}</dt>
                <dd className="mt-1 text-xs leading-snug text-ink-500">{stat.label}</dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        {/* Floating composition: a stylised "shelf" of three cards */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
          className="relative mx-auto w-full max-w-md lg:max-w-none"
        >
          <div className="relative aspect-[4/5] w-full">
            {/* back card */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute right-0 top-4 w-[62%] rotate-6 rounded-3xl border border-white/60 bg-white/70 p-5 shadow-soft backdrop-blur"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-mint-200 text-leaf-800">
                <Beaker className="h-5 w-5" />
              </span>
              <p className="mt-3 font-display text-sm font-bold">Lab report</p>
              <p className="mt-1 text-xs text-ink-500">THC 26.1% · CBD 0.2%</p>
              <div className="mt-3 space-y-1.5">
                {[70, 46, 84].map((w, i) => (
                  <div key={i} className="h-1.5 rounded-full bg-sand-200">
                    <div className="h-full rounded-full bg-leaf-500" style={{ width: `${w}%` }} />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* main card */}
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute bottom-6 left-0 w-[70%] -rotate-3 overflow-hidden rounded-3xl border border-white/60 bg-white shadow-lift"
            >
              <div className="relative aspect-[5/4]">
                <img
                  src="/images/brand/hero-card.jpg"
                  alt="Close-up of cured cannabis flower"
                  width="800"
                  height="640"
                  className="h-full w-full object-cover"
                />
                <span className="absolute bottom-3 left-3 grid place-items-center rounded-2xl bg-white/20 p-2 text-white backdrop-blur-sm">
                  <Leaf className="h-6 w-6" />
                </span>
              </div>
              <div className="p-4">
                <p className="font-display text-sm font-bold">Pacific Fog</p>
                <p className="text-xs text-ink-400">Hybrid · 3.5 g</p>
                <p className="mt-2 font-display text-base font-extrabold">$44.00</p>
              </div>
            </motion.div>

            {/* small pill */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute bottom-24 right-2 flex items-center gap-2 rounded-2xl border border-white/60 bg-white/85 px-4 py-3 shadow-soft backdrop-blur"
            >
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-leaf-100 text-leaf-700">
                <Package className="h-4 w-4" />
              </span>
              <div>
                <p className="text-xs font-bold">Plain packaging</p>
                <p className="text-[11px] text-ink-400">Odour sealed, no branding</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Features strip                                                      */
/* ------------------------------------------------------------------ */

const FEATURES = [
  { Icon: Beaker, title: 'Lab-Tested', copy: 'Every batch screened for potency, pesticides and microbials.' },
  { Icon: Truck, title: 'Fast Shipping', copy: 'Tracked delivery in one to three days across most provinces.' },
  { Icon: Package, title: 'Discreet Packaging', copy: 'Plain, odour-sealed boxes with no logos or product names.' },
  { Icon: Lock, title: 'Secure Checkout', copy: 'Encrypted payments, and we never store your card details.' },
];

function Features() {
  return (
    <section className="shell -mt-6 lg:-mt-12">
      <StaggerGrid className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" stagger={0.07}>
        {FEATURES.map(({ Icon, title, copy }) => (
          <StaggerItem key={title}>
            <motion.div
              whileHover={{ y: -6 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="card h-full p-6 transition-shadow duration-300 hover:shadow-lift"
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-leaf-100 text-leaf-700">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-base font-bold">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{copy}</p>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerGrid>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Trust & compliance                                                  */
/* ------------------------------------------------------------------ */

const COMPLIANCE = [
  {
    Icon: IdCard,
    title: 'Verified at every step',
    copy: 'Age is checked at sign-up, at checkout and again by the courier at your door.',
  },
  {
    Icon: Scale,
    title: 'Provincial limits respected',
    copy: 'Order sizes are capped to the legal personal possession limit of 30 g dried equivalent.',
  },
  {
    Icon: ShieldCheck,
    title: 'Third-party results published',
    copy: 'Each order ships with the certificate of analysis for the exact lot you received.',
  },
  {
    Icon: Leaf,
    title: 'Responsible use, always',
    copy: 'Start low, go slow, never drive impaired, and keep products away from children and pets.',
  },
];

function Compliance() {
  return (
    <section className="shell">
      <div className="grid gap-10 rounded-4xl bg-white p-8 shadow-soft ring-1 ring-ink-900/5 sm:p-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <Reveal>
          <p className="eyebrow">Trust &amp; compliance</p>
          <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">Regulated, tested and honest about it</h2>
          <p className="mt-4 text-base leading-relaxed text-ink-500">
            NorthLeaf is a fictional storefront, but it is modelled on how a licensed Canadian retailer actually has to
            operate: verified age, sealed products, published lab results and no marketing aimed at anyone under 19.
          </p>
          <Link to="/about" className="btn btn-md btn-secondary mt-7">
            Read our standards
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>

        <StaggerGrid className="grid gap-5 sm:grid-cols-2" stagger={0.09}>
          {COMPLIANCE.map(({ Icon, title, copy }) => (
            <StaggerItem key={title} className="flex gap-3.5">
              <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-sand-100 text-leaf-700">
                <Icon className="h-[18px] w-[18px]" />
              </span>
              <div>
                <h3 className="font-display text-sm font-bold">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-500">{copy}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function Home() {
  const { bestSellers, categories } = useCatalog();

  return (
    <>
      <Hero />

      <div className="space-y-24 sm:space-y-28">
        <Features />

        {/* Featured categories */}
        <section className="shell">
          <SectionHeading
            eyebrow="Shop by category"
            title="Find your format"
            copy="Six ways in, from slow-cured flower to a tincture you will barely notice taking."
            action={
              <Link to="/shop" className="btn btn-md btn-secondary">
                View all products
                <ArrowRight className="h-4 w-4" />
              </Link>
            }
          />
          <StaggerGrid className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <StaggerItem key={category.slug}>
                <CategoryCard category={category} />
              </StaggerItem>
            ))}
          </StaggerGrid>
        </section>

        {/* Best sellers — horizontal rail on mobile, grid on large screens */}
        <section>
          <div className="shell">
            <SectionHeading
              eyebrow="Best sellers"
              title="What is moving this month"
              copy="Ranked by reorders, not by margin."
              action={
                <Link to="/shop" className="btn btn-md btn-secondary">
                  Shop all
                  <ArrowRight className="h-4 w-4" />
                </Link>
              }
            />
          </div>

          <StaggerGrid
            className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 sm:px-6 lg:mx-auto lg:grid lg:max-w-7xl lg:grid-cols-3 lg:overflow-visible lg:px-8 xl:grid-cols-3"
            stagger={0.07}
          >
            {bestSellers.map((product) => (
              <StaggerItem key={product.id} className="w-[76vw] shrink-0 snap-start sm:w-[45vw] lg:w-auto">
                <ProductCard product={product} className="h-full" />
              </StaggerItem>
            ))}
          </StaggerGrid>
        </section>

        <Compliance />
        <Newsletter />
      </div>
    </>
  );
}
