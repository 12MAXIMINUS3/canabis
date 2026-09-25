import { Link } from 'react-router-dom';
import { ArrowRight, IdCard, Package, Truck } from '../components/Icons';
import { Reveal, StaggerGrid, StaggerItem } from '../components/Motion';
import PageHero from '../components/PageHero';
import SectionHeading from '../components/SectionHeading';
import { returnRules, shippingZones } from '../data/content';
import { PRICING, formatPrice } from '../context/CartContext';

const PROMISES = [
  {
    Icon: Package,
    title: 'Unmarked box',
    copy: 'Plain corrugated carton, generic return address, contents double-sealed in odour-barrier bags.',
  },
  {
    Icon: Truck,
    title: 'Tracked end to end',
    copy: 'A tracking number reaches your inbox within an hour of pickup. Every parcel is insured.',
  },
  {
    Icon: IdCard,
    title: 'Signed for by you',
    copy: 'The courier checks government-issued photo ID. Parcels are never left at the door or with a neighbour.',
  },
];

export default function Shipping() {
  return (
    <div className="space-y-20 sm:space-y-24">
      <PageHero
        eyebrow="Shipping & returns"
        title="Delivered discreetly, wherever you are"
        copy={`Flat ${formatPrice(PRICING.flatShipping)} tracked shipping, free on orders over ${formatPrice(
          PRICING.freeShippingAt,
        )}. Orders paid before 1pm ET leave the same business day.`}
        image="/images/editorial/shipping.jpg"
        alt="Stacked cardboard parcels ready for dispatch"
      />

      <section className="shell">
        <StaggerGrid className="grid gap-5 md:grid-cols-3">
          {PROMISES.map(({ Icon, title, copy }) => (
            <StaggerItem key={title}>
              <div className="card h-full p-6">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-leaf-100 text-leaf-700">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-base font-bold">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{copy}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </section>

      <section className="shell">
        <SectionHeading eyebrow="Delivery times" title="How long it takes to reach you" copy="Business days from dispatch." />
        <Reveal className="card mt-10 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-sand-100 text-xs uppercase tracking-wider text-ink-500">
              <tr>
                <th scope="col" className="px-5 py-3 font-semibold">
                  Region
                </th>
                <th scope="col" className="px-5 py-3 font-semibold">
                  Typical time
                </th>
                <th scope="col" className="hidden px-5 py-3 font-semibold sm:table-cell">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-900/5">
              {shippingZones.map((z) => (
                <tr key={z.region}>
                  <th scope="row" className="px-5 py-4 font-display font-bold text-ink-900">
                    {z.region}
                  </th>
                  <td className="px-5 py-4 font-semibold text-leaf-700">{z.time}</td>
                  <td className="hidden px-5 py-4 text-ink-500 sm:table-cell">{z.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
      </section>

      <section id="returns" className="shell scroll-mt-28">
        <SectionHeading
          eyebrow="Returns"
          title="What can come back, and what cannot"
          copy="Federal rules stop opened cannabis from being resold. Within that, we try to be generous."
        />
        <StaggerGrid className="mt-10 grid gap-5 md:grid-cols-2">
          {returnRules.map((r) => (
            <StaggerItem key={r.title}>
              <div className="card h-full p-6">
                <h3 className="font-display text-base font-bold">{r.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{r.copy}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
        <Reveal className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link to="/order-tracking" className="btn btn-lg btn-primary">
            Track an order
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/contact" className="btn btn-lg btn-secondary">
            Start a return
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
