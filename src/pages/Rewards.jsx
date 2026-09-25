import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Gift, Sparkle } from '../components/Icons';
import { EASE, Reveal, StaggerGrid, StaggerItem } from '../components/Motion';
import PageHero from '../components/PageHero';
import SectionHeading from '../components/SectionHeading';
import { rewardFacts, rewardTiers } from '../data/content';
import { useToast } from '../context/ToastContext';

const HOW_IT_WORKS = [
  { title: 'Earn on everything', copy: 'Every dollar spent returns points at your tier rate. Shipping and taxes do not earn, nothing else is excluded.' },
  { title: 'Redeem at any size', copy: '100 points is $1 off. There is no minimum basket and no blackout on sale items.' },
  { title: 'Refer a friend', copy: 'They get $15 off their first order, you get $15 in points the day it ships.' },
];

export default function Rewards() {
  const [spend, setSpend] = useState(120);
  const { push } = useToast();

  return (
    <>
      <PageHero
        eyebrow="Leaf Points"
        title="A rewards programme without the fine print"
        copy="Two to six percent back on every order, points that do not expire, and no tier you can lose by taking a month off."
        image="/images/editorial/rewards.jpg"
        alt="CBD oils and cannabis accessories arranged from above"
        actions={
          <>
            <Link to="/shop" className="btn btn-lg btn-primary">
              Start earning
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/account" className="btn btn-lg btn-secondary">
              View my points
            </Link>
          </>
        }
      />

      {/* Headline facts */}
      <section className="shell">
        <StaggerGrid className="grid gap-5 sm:grid-cols-3" stagger={0.08}>
          {rewardFacts.map((fact) => (
            <StaggerItem key={fact.label}>
              <div className="card h-full p-6">
                <p className="font-display text-3xl font-extrabold text-leaf-800">{fact.value}</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">{fact.label}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </section>

      {/* Tiers */}
      <section className="shell mt-24">
        <SectionHeading
          eyebrow="Tiers"
          title="Three tiers, reached by spending, not by subscribing"
          copy="Tier is based on your last twelve months. Reaching one is permanent for a year from the order that got you there."
        />
        <StaggerGrid className="mt-10 grid gap-5 lg:grid-cols-3" stagger={0.09}>
          {rewardTiers.map((tier) => (
            <StaggerItem key={tier.name}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ duration: 0.25, ease: EASE }}
                className={`flex h-full flex-col rounded-3xl p-7 transition-shadow duration-300 ${
                  tier.featured
                    ? 'bg-leaf-800 text-white shadow-lift ring-1 ring-leaf-700'
                    : 'card hover:shadow-lift'
                }`}
              >
                {tier.featured && (
                  <span className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-mint-200">
                    <Sparkle className="h-3.5 w-3.5" />
                    Most members
                  </span>
                )}
                <h3 className={`font-display text-xl font-extrabold ${tier.featured ? 'text-white' : ''}`}>
                  {tier.name}
                </h3>
                <p className={`mt-1 text-xs font-semibold uppercase tracking-wider ${tier.featured ? 'text-mint-200' : 'text-ink-400'}`}>
                  {tier.threshold}
                </p>
                <p className={`mt-5 font-display text-4xl font-extrabold ${tier.featured ? 'text-white' : 'text-leaf-800'}`}>
                  {tier.rate}
                </p>
                <ul className="mt-6 space-y-2.5">
                  {tier.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-2.5 text-sm">
                      <Check className={`mt-0.5 h-4 w-4 shrink-0 ${tier.featured ? 'text-mint-300' : 'text-leaf-600'}`} />
                      <span className={tier.featured ? 'text-mint-100/90' : 'text-ink-600'}>{perk}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </section>

      {/* Calculator */}
      <section className="shell mt-24">
        <div className="grid gap-10 rounded-4xl bg-white p-8 shadow-soft ring-1 ring-ink-900/5 sm:p-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <p className="eyebrow">
              <Gift className="h-3.5 w-3.5" />
              Work it out
            </p>
            <h2 className="mt-3 text-3xl font-extrabold">What a year of ordering returns</h2>
            <p className="mt-4 text-base leading-relaxed text-ink-500">
              Drag to your rough monthly spend. Points are awarded when an order ships and can be spent on the next one.
            </p>

            <label htmlFor="spend" className="label mt-8">
              Monthly spend
              <span className="ml-2 font-bold normal-case tracking-normal text-leaf-700 tabular-nums">${spend}</span>
            </label>
            <input
              id="spend"
              type="range"
              min="40"
              max="400"
              step="10"
              value={spend}
              onChange={(e) => setSpend(Number(e.target.value))}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-sand-200 accent-leaf-700"
            />
            <div className="mt-1.5 flex justify-between text-[11px] text-ink-400 tabular-nums">
              <span>$40</span>
              <span>$400</span>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="rounded-3xl bg-leaf-50 p-7">
            <dl className="space-y-5">
              {[
                { label: 'Spent over twelve months', value: `$${(spend * 12).toLocaleString()}` },
                {
                  label: 'Tier reached',
                  value: spend * 12 >= 1500 ? 'Cultivar' : spend * 12 >= 500 ? 'Grower' : 'Seedling',
                },
                {
                  label: 'Points earned',
                  value: `${Math.round(spend * 12 * (spend * 12 >= 1500 ? 6 : spend * 12 >= 500 ? 4 : 2)).toLocaleString()} pts`,
                },
              ].map((row) => (
                <div key={row.label} className="flex items-baseline justify-between gap-4 border-b border-leaf-700/10 pb-4">
                  <dt className="text-sm text-ink-500">{row.label}</dt>
                  <dd className="font-display text-lg font-bold tabular-nums">{row.value}</dd>
                </div>
              ))}
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-sm font-semibold text-ink-700">Worth roughly</dt>
                <dd className="font-display text-3xl font-extrabold text-leaf-800 tabular-nums">
                  ${Math.round(spend * 12 * (spend * 12 >= 1500 ? 0.06 : spend * 12 >= 500 ? 0.04 : 0.02))}
                </dd>
              </div>
            </dl>
            <p className="mt-4 text-xs text-ink-400">
              Illustrative only — this is a demo store and no points are actually issued.
            </p>
          </Reveal>
        </div>
      </section>

      {/* How it works + referral */}
      <section className="shell mt-24">
        <SectionHeading eyebrow="The rules" title="All of them, in three lines" />
        <StaggerGrid className="mt-10 grid gap-5 md:grid-cols-3" stagger={0.08}>
          {HOW_IT_WORKS.map((item) => (
            <StaggerItem key={item.title}>
              <div className="card h-full p-6">
                <h3 className="font-display text-base font-bold">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{item.copy}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>

        <Reveal className="mt-10 flex flex-col items-start justify-between gap-6 rounded-4xl bg-ink-900 p-8 text-white sm:flex-row sm:items-center sm:p-10">
          <div>
            <h2 className="font-display text-2xl font-bold text-white">Refer a friend, both get $15</h2>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-sand-100/70">
              Share your code. They save on their first order, you get points the day it ships.
            </p>
          </div>
          <button
            type="button"
            onClick={() => push('Referral code copied', { detail: 'JORDAN-NL15 — demo code, nothing was shared.' })}
            className="btn btn-lg bg-white text-leaf-800 hover:bg-mint-100"
          >
            Copy my code
          </button>
        </Reveal>
      </section>
    </>
  );
}
