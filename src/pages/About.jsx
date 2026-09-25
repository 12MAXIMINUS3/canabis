import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  Beaker,
  ChevronDown,
  IdCard,
  Leaf,
  Lock,
  Package,
  Scale,
  ShieldCheck,
  Sprout,
  Truck,
} from '../components/Icons';
import { EASE, Reveal, StaggerGrid, StaggerItem } from '../components/Motion';
import SectionHeading from '../components/SectionHeading';
import Thumb from '../components/Thumb';
import Newsletter from '../components/Newsletter';

const VALUES = [
  {
    Icon: Sprout,
    title: 'Small lots, always',
    copy: 'We buy what a grower can actually watch over. When a lot is gone, it is gone rather than stretched.',
  },
  {
    Icon: Beaker,
    title: 'Numbers before adjectives',
    copy: 'Potency, terpenes and contaminant screens are published for every batch, not just the flattering ones.',
  },
  {
    Icon: Package,
    title: 'Boring on the outside',
    copy: 'Plain boxes, sealed for odour, no branding. What you order is nobody else’s business.',
  },
  {
    Icon: Scale,
    title: 'Legal, not loophole',
    copy: 'Age gates, possession limits and provincial rules are constraints we design around, not obstacles.',
  },
];

const PROCESS = [
  {
    step: '01',
    title: 'Source',
    copy: 'We visit every grow we buy from and taste the lot before we commit to it. Roughly one in six makes the shelf.',
    image: '/images/brand/process-source.jpg',
    alt: 'Rows of cannabis plants in a commercial greenhouse',
  },
  {
    step: '02',
    title: 'Cure',
    copy: 'Flower rests two to three weeks in controlled humidity. It costs us time and it is the difference you notice.',
    image: '/images/brand/process-cure.jpg',
    alt: 'Cured flower resting in a sealed glass jar',
  },
  {
    step: '03',
    title: 'Test',
    copy: 'An independent lab screens each lot for cannabinoids, terpenes, pesticides, solvents, metals and microbials.',
    image: '/images/brand/process-test.jpg',
    alt: 'A cannabis sample weighed into a lab tube',
  },
  {
    step: '04',
    title: 'Pack & ship',
    copy: 'Orders are packed the same day, sealed against odour, and handed to a tracked courier with adult signature.',
    image: '/images/brand/process-pack.jpg',
    alt: 'A plain cardboard parcel being sealed with tape',
  },
];

// Generic roles rather than invented people — no names, no portraits, just the work.
const TEAM = [
  {
    role: 'Head of sourcing',
    focus: 'Visits the farms, argues about cure times.',
    image: '/images/team/sourcing.jpg',
    alt: 'Young cannabis plants under greenhouse glass',
  },
  {
    role: 'Quality lead',
    focus: 'Reads every certificate of analysis line by line.',
    image: '/images/team/quality.jpg',
    alt: 'Laboratory testing bench with sample tubes',
  },
  {
    role: 'Fulfilment lead',
    focus: 'Owns the promise that the box arrives quietly.',
    image: '/images/team/fulfilment.jpg',
    alt: 'A packing desk with a plain box, tape and scissors',
  },
  {
    role: 'Support lead',
    focus: 'Answers within a day, in plain language.',
    image: '/images/team/support.jpg',
    alt: 'A headset resting on a laptop at a tidy desk',
  },
];

const FAQ = [
  {
    q: 'Where do you ship, and how fast?',
    a: 'Canada-wide by tracked courier. Most urban addresses see delivery in one to two business days; rural and northern routes take three to five. Orders over $99 ship free.',
  },
  {
    q: 'What does the package look like?',
    a: 'A plain corrugated box with a printed shipping label and no branding, product names or scent. Contents are double-sealed in odour-barrier bags.',
  },
  {
    q: 'Can I return an order?',
    a: 'Unopened, sealed products can be returned within 14 days for a refund minus shipping. Opened cannabis products cannot be resold, so we handle those case by case — if a lot is not right, tell us and we will make it right.',
  },
  {
    q: 'Why is THC shown as a percentage for some products and milligrams for others?',
    a: 'Percentages describe how much of a dried flower or extract is THC by weight. Milligrams describe a fixed dose in something you swallow. They are not comparable numbers, so we never mix them in one figure.',
  },
  {
    q: 'How is my age verified?',
    a: 'You confirm 19+ before entering the store, again at checkout, and the courier checks government-issued photo ID at the door. Nobody signs on your behalf.',
  },
  {
    q: 'Do you store my payment details?',
    a: 'No. Payments are processed by an encrypted third-party provider and we keep only the last four digits for order lookup.',
  },
];

const POLICIES = [
  {
    id: 'shipping',
    Icon: Truck,
    title: 'Shipping & Returns',
    copy: 'Tracked Canada-wide delivery in 1–3 business days, free over $99. Sealed products are returnable within 14 days; opened cannabis products are handled case by case.',
  },
  {
    id: 'privacy',
    Icon: Lock,
    title: 'Privacy Policy',
    copy: 'We collect the minimum needed to fulfil an order and verify age. We do not sell, rent or share your data with advertisers, and payment details never touch our servers.',
  },
  {
    id: 'terms',
    Icon: Scale,
    title: 'Terms of Service',
    copy: 'Orders are capped at the legal personal possession limit of 30 g dried equivalent. Products are for personal use by adults 19+ and may not be resold or shipped onward.',
  },
  {
    id: 'age',
    Icon: IdCard,
    title: 'Age Verification',
    copy: 'A 19+ confirmation is required to browse, a second confirmation at checkout, and government-issued photo ID on delivery. We do not market to anyone under 19.',
  },
  {
    id: 'responsible',
    Icon: ShieldCheck,
    title: 'Responsible Use',
    copy: 'Start low and go slow, especially with edibles, which can take 90 minutes to take effect. Never drive impaired. Keep everything sealed and out of reach of children and pets.',
  },
];

function FaqItem({ item, isOpen, onToggle, index }) {
  return (
    <div className="border-b border-ink-900/10">
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={`faq-panel-${index}`}
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
            id={`faq-panel-${index}`}
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

export default function About() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="space-y-24 pt-10 sm:space-y-28 sm:pt-14">
      {/* Story */}
      <section className="shell grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <Reveal>
          <p className="eyebrow">
            <Leaf className="h-3.5 w-3.5" />
            Our story
          </p>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight sm:text-5xl">
            We started NorthLeaf because good cannabis was being sold badly
          </h1>
          <p className="mt-5 text-base leading-relaxed text-ink-500">
            The legal market solved safety and mostly ignored taste, honesty and dignity. Products arrived dry, labels
            said little, and packaging announced itself to everyone in the building.
          </p>
          <p className="mt-4 text-base leading-relaxed text-ink-500">
            Our mission is narrow on purpose: carry fewer products, know each one properly, publish the numbers, and get
            it to the door without anyone else needing to know. That is the whole company.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/shop" className="btn btn-lg btn-primary">
              See what we carry
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/contact" className="btn btn-lg btn-secondary">
              Talk to us
            </Link>
          </div>
        </Reveal>

        {/* Abstract illustrative composition instead of a photo */}
        <Reveal delay={0.1} className="relative">
          <Thumb
            src="/images/brand/about-grow.jpg"
            alt="Cannabis plants growing under glass in a greenhouse"
            category="flower"
            seed="about-hero"
            priority
            glyphClass="h-9 w-9"
            className="aspect-[5/4] w-full rounded-4xl shadow-soft"
          />
          <div className="absolute -bottom-6 -left-4 w-44 rounded-3xl border border-white/60 bg-white/90 p-4 shadow-lift backdrop-blur sm:-left-8 sm:w-52">
            <p className="font-display text-3xl font-extrabold text-leaf-800">1 in 6</p>
            <p className="mt-1 text-xs leading-snug text-ink-500">
              lots we sample actually make it onto the shelf
            </p>
          </div>
        </Reveal>
      </section>

      {/* Values */}
      <section className="shell">
        <SectionHeading
          eyebrow="What we hold to"
          title="Four rules we do not bend"
          copy="They cost us margin in obvious, measurable ways. We keep them anyway."
        />
        <StaggerGrid className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map(({ Icon, title, copy }) => (
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

      {/* Process */}
      <section className="bg-ink-900 py-20 text-sand-100">
        <div className="shell">
          <Reveal className="max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-mint-200">
              How it works
            </p>
            <h2 className="mt-4 text-3xl font-extrabold text-white sm:text-4xl">From the grow to your door</h2>
            <p className="mt-3 text-base leading-relaxed text-sand-100/70">
              Four steps, none of them skippable. The slowest one is the one that matters most.
            </p>
          </Reveal>

          <StaggerGrid className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4" stagger={0.1}>
            {PROCESS.map(({ step, title, copy, image, alt }) => (
              <StaggerItem key={step} className="relative">
                <div className="relative overflow-hidden rounded-2xl">
                  <img
                    src={image}
                    alt={alt}
                    loading="lazy"
                    decoding="async"
                    width="700"
                    height="525"
                    className="aspect-[4/3] w-full object-cover transition-transform duration-500 ease-out hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-ink-900/70 px-2.5 py-1 font-display text-xs font-extrabold text-mint-200 backdrop-blur-sm">
                    {step}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-lg font-bold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-sand-100/65">{copy}</p>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* Team */}
      <section className="shell">
        <SectionHeading
          eyebrow="The team"
          title="Eleven people, four jobs that matter"
          copy="We keep roles rather than personalities on this page — the work is what you are buying."
        />
        <StaggerGrid className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map((member, i) => (
            <StaggerItem key={member.role}>
              <div className="card h-full overflow-hidden">
                <Thumb
                  src={member.image}
                  alt={member.alt}
                  category={['flower', 'cbd', 'accessories', 'vapes'][i % 4]}
                  seed={`team-${member.role}`}
                  glyphClass="h-5 w-5"
                  className="aspect-[4/3] w-full"
                />
                <div className="p-5">
                  <h3 className="font-display text-base font-bold">{member.role}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{member.focus}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </section>

      {/* FAQ */}
      <section id="faq" className="shell scroll-mt-28">
        <SectionHeading eyebrow="FAQ" title="The questions we actually get" />
        <div className="mt-8 max-w-3xl">
          {FAQ.map((item, i) => (
            <FaqItem
              key={item.q}
              item={item}
              index={i}
              isOpen={openFaq === i}
              onToggle={() => setOpenFaq(openFaq === i ? -1 : i)}
            />
          ))}
        </div>
      </section>

      {/* Policies — footer links land on these anchors */}
      <section className="shell">
        <SectionHeading eyebrow="Policies" title="The fine print, in plain words" />
        <StaggerGrid className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3" stagger={0.07}>
          {POLICIES.map(({ id, Icon, title, copy }) => (
            <StaggerItem key={id}>
              <div id={id} className="card h-full scroll-mt-28 p-6">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-sand-100 text-leaf-700">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-base font-bold">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{copy}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </section>

      <Newsletter />
    </div>
  );
}
