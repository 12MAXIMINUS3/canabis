import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Gift, Tag, Truck } from '../components/Icons';
import { EASE, Reveal, StaggerGrid, StaggerItem } from '../components/Motion';
import PageHero from '../components/PageHero';
import ProductCard from '../components/ProductCard';
import SectionHeading from '../components/SectionHeading';
import { useCatalog } from '../context/CatalogContext';
import { MIX_MATCH, PRICING, formatPrice, useCart } from '../context/CartContext';

export default function Deals() {
  const { subtotal } = useCart();
  const { products } = useCatalog();

  // "On offer" here means anything we have flagged with a badge, plus the last
  // units of a lot — the two things that actually move price in a small shop.
  const flagged = products.filter((p) => p.badge);
  const lastUnits = products.filter((p) => !p.inStock);

  const promos = [
    {
      Icon: Tag,
      kicker: 'Always on',
      title: `Any ${MIX_MATCH.minItems} for ${MIX_MATCH.percentOff}% off`,
      copy: 'Mix flower, edibles, vapes and concentrates however you like. The discount applies itself in the cart.',
      to: '/mix-and-match',
      cta: 'Build a bundle',
      featured: true,
    },
    {
      Icon: Truck,
      kicker: 'Every order',
      title: `Free shipping over ${formatPrice(PRICING.freeShippingAt)}`,
      copy: `Flat ${formatPrice(PRICING.flatShipping)} tracked shipping below that, wherever you are. ${
        subtotal > 0 && subtotal < PRICING.freeShippingAt
          ? `You are ${formatPrice(PRICING.freeShippingAt - subtotal)} away right now.`
          : ''
      }`.trim(),
      to: '/shipping',
      cta: 'Shipping details',
    },
    {
      Icon: Gift,
      kicker: 'Member perk',
      title: 'Up to 6% back in Leaf Points',
      copy: 'Points never expire, redeem from the first dollar, and stack on top of every promotion on this page.',
      to: '/rewards',
      cta: 'See the tiers',
    },
  ];

  return (
    <>
      <PageHero
        compact
        eyebrow="NorthLeaf deals"
        title="Every offer we run, on one page"
        copy="We do not do fake countdowns or struck-through prices. These three run permanently, and the drops below are simply what is fresh."
      />

      {/* Promotions */}
      <section className="shell">
        <StaggerGrid className="grid gap-5 lg:grid-cols-3" stagger={0.08}>
          {promos.map(({ Icon, kicker, title, copy, to, cta, featured }) => (
            <StaggerItem key={title}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ duration: 0.25, ease: EASE }}
                className={`flex h-full flex-col rounded-3xl p-7 transition-shadow duration-300 ${
                  featured ? 'bg-leaf-800 text-white shadow-lift' : 'card hover:shadow-lift'
                }`}
              >
                <span
                  className={`grid h-11 w-11 place-items-center rounded-xl ${
                    featured ? 'bg-white/15 text-mint-200' : 'bg-leaf-100 text-leaf-700'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <p
                  className={`mt-5 text-[11px] font-bold uppercase tracking-[0.14em] ${
                    featured ? 'text-mint-200' : 'text-leaf-700'
                  }`}
                >
                  {kicker}
                </p>
                <h2 className={`mt-2 font-display text-xl font-extrabold ${featured ? 'text-white' : ''}`}>{title}</h2>
                <p className={`mt-2 flex-1 text-sm leading-relaxed ${featured ? 'text-mint-100/80' : 'text-ink-500'}`}>
                  {copy}
                </p>
                <Link
                  to={to}
                  className={`btn btn-md mt-6 ${featured ? 'bg-white text-leaf-800 hover:bg-mint-100' : 'btn-secondary'}`}
                >
                  {cta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </section>

      {/* Fresh drops */}
      <section className="shell mt-24">
        <SectionHeading
          eyebrow="This week"
          title="Fresh on the shelf"
          copy="Recently landed lots and the ones we are happiest with. Small batches, so they move quickly."
          action={
            <Link to="/shop" className="btn btn-md btn-secondary">
              Shop everything
              <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />
        <StaggerGrid className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.06} amount={0.05}>
          {flagged.map((product) => (
            <StaggerItem key={product.id}>
              <ProductCard product={product} detailed className="h-full" />
            </StaggerItem>
          ))}
        </StaggerGrid>
      </section>

      {/* Back in stock soon */}
      {lastUnits.length > 0 && (
        <section className="shell mt-24">
          <SectionHeading
            eyebrow="Restocking"
            title="Sold out, coming back"
            copy="Ask to be notified and you will hear the morning the new lot is tested and listed."
          />
          <StaggerGrid className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.07}>
            {lastUnits.map((product) => (
              <StaggerItem key={product.id}>
                <ProductCard product={product} detailed className="h-full" />
              </StaggerItem>
            ))}
          </StaggerGrid>
        </section>
      )}
    </>
  );
}
