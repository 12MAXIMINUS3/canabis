import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Lock, Package, Truck } from '../components/Icons';
import { EASE, Reveal, StaggerGrid, StaggerItem } from '../components/Motion';
import PageHero from '../components/PageHero';
import SectionHeading from '../components/SectionHeading';
import { orderSteps, paymentMethods } from '../data/content';
import { PRICING, formatPrice } from '../context/CartContext';

const QUICK_FACTS = [
  { Icon: Package, value: formatPrice(PRICING.minimumOrder), label: 'minimum order' },
  { Icon: Truck, value: formatPrice(PRICING.freeShippingAt), label: 'free shipping threshold' },
  { Icon: Lock, value: '1pm ET', label: 'same-day dispatch cut-off' },
];

export default function HowToOrder() {
  return (
    <div className="space-y-20 sm:space-y-24">
      <PageHero
        eyebrow="How to order"
        title="Five steps from browsing to your door"
        copy="No membership fees, no phone calls. If you have ordered anything online before, you already know how this works — here are the details that are specific to us."
        image="/images/editorial/how-to-order.jpg"
        alt="Hands packing an order into a cardboard box"
        actions={
          <>
            <Link to="/shop" className="btn btn-lg btn-primary">
              Start shopping
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/faq" className="btn btn-lg btn-secondary">
              Read the FAQ
            </Link>
          </>
        }
      />

      <section className="shell">
        <StaggerGrid className="grid gap-4 sm:grid-cols-3">
          {QUICK_FACTS.map(({ Icon, value, label }) => (
            <StaggerItem key={label}>
              <div className="card flex items-center gap-4 p-5">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-leaf-100 text-leaf-700">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-display text-2xl font-extrabold tabular-nums">{value}</p>
                  <p className="text-sm text-ink-500">{label}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </section>

      <section className="shell">
        <SectionHeading eyebrow="The process" title="What happens, in order" />
        <ol className="relative mt-10 space-y-6 before:absolute before:bottom-6 before:left-[27px] before:top-6 before:w-px before:bg-leaf-200 sm:before:left-[31px]">
          {orderSteps.map(({ step, title, copy }, i) => (
            <motion.li
              key={step}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.45, delay: i * 0.05, ease: EASE }}
              className="relative flex gap-5"
            >
              <span className="relative z-10 grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-leaf-700 font-display text-lg font-extrabold text-white shadow-soft sm:h-16 sm:w-16">
                {step}
              </span>
              <div className="card flex-1 p-5 sm:p-6">
                <h3 className="font-display text-lg font-bold">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{copy}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </section>

      <section className="shell">
        <SectionHeading
          eyebrow="Payment"
          title="Ways to pay"
          copy="Payment details never touch our servers — both methods are handled by the provider directly."
        />
        <StaggerGrid className="mt-10 grid gap-5 md:grid-cols-3">
          {paymentMethods.map((m) => (
            <StaggerItem key={m.name}>
              <div className="card h-full p-6">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-base font-bold">{m.name}</h3>
                  <span className="chip shrink-0">{m.fee}</span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">{m.detail}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </section>

      <Reveal as="section" className="shell">
        <div className="flex flex-col items-start gap-5 rounded-4xl bg-leaf-800 p-8 text-white sm:flex-row sm:items-center sm:justify-between sm:p-10">
          <div>
            <h2 className="text-2xl font-extrabold text-white">Already ordered?</h2>
            <p className="mt-1 text-sm text-mint-100/80">Your order number and email are all you need to see where it is.</p>
          </div>
          <Link to="/order-tracking" className="btn btn-lg bg-white text-leaf-800 hover:bg-mint-100">
            Track an order
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
