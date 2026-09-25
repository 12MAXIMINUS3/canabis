import { useState } from 'react';
import { ArrowRight, Check, ChevronDown, Sprout } from '../components/Icons';
import { Reveal, StaggerGrid, StaggerItem } from '../components/Motion';
import PageHero from '../components/PageHero';
import SectionHeading from '../components/SectionHeading';
import { vendorCriteria } from '../data/content';
import { useToast } from '../context/ToastContext';
import { submitVendorApplication } from '../context/CatalogContext';

const PRODUCT_TYPES = ['Flower', 'Pre-rolls', 'Concentrates', 'Edibles', 'Vapes', 'CBD', 'Accessories'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const EMPTY = { farm: '', contact: '', email: '', province: '', type: PRODUCT_TYPES[0], volume: '', notes: '' };

export default function Vendors() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const { push } = useToast();

  const update = (field) => (e) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  };

  const submit = async (e) => {
    e.preventDefault();
    const found = {};
    if (values.farm.trim().length < 2) found.farm = 'Tell us what the operation is called.';
    if (values.contact.trim().length < 2) found.contact = 'Who should we reply to?';
    if (!EMAIL_RE.test(values.email.trim())) found.email = 'We need a working email address.';
    if (values.province.trim().length < 2) found.province = 'Which region are you growing in?';
    if (values.notes.trim().length < 20) found.notes = 'A few sentences about the lot, please — 20 characters minimum.';

    setErrors(found);
    if (Object.keys(found).length) {
      document.getElementById(`vendor-${Object.keys(found)[0]}`)?.focus();
      return;
    }

    setSubmitting(true);
    const result = await submitVendorApplication(values);
    setSubmitting(false);

    if (!result.ok) {
      setErrors({ notes: 'We could not submit that. Please try again in a moment.' });
      return;
    }
    setValues(EMPTY);
    push('Application received', { detail: 'Sourcing reviews submissions every Thursday.' });
  };

  const field = (name) => ({
    id: `vendor-${name}`,
    value: values[name],
    onChange: update(name),
    'aria-invalid': Boolean(errors[name]),
    'aria-describedby': errors[name] ? `vendor-${name}-error` : undefined,
    className: `field ${errors[name] ? 'border-clay/60' : ''}`,
  });

  const errorFor = (name) =>
    errors[name] ? (
      <p id={`vendor-${name}-error`} role="alert" className="mt-1.5 text-xs font-medium text-clay">
        {errors[name]}
      </p>
    ) : null;

  return (
    <>
      <PageHero
        eyebrow="Vendors"
        title="Grow something good? We would like to taste it"
        copy="We buy small lots from a short list of growers. No listing fees, no exclusivity, payment on 14-day terms."
        image="/images/editorial/vendors.jpg"
        alt="A hemp field under an open sky"
        actions={
          <a href="#apply" className="btn btn-lg btn-primary">
            Submit a lot
            <ArrowRight className="h-4 w-4" />
          </a>
        }
      />

      {/* What we look for */}
      <section className="shell">
        <SectionHeading
          eyebrow="What we look for"
          title="Four things, and we ask about all of them"
          copy="Roughly one in six lots we sample gets bought. The reasons are almost always the same four."
        />
        <StaggerGrid className="mt-10 grid gap-5 sm:grid-cols-2" stagger={0.08}>
          {vendorCriteria.map((item) => (
            <StaggerItem key={item.title}>
              <div className="card h-full p-6">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-leaf-100 text-leaf-700">
                  <Sprout className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-base font-bold">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{item.copy}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </section>

      {/* Process + form */}
      <section id="apply" className="shell mt-24 scroll-mt-28">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          <Reveal>
            <p className="eyebrow">How it goes</p>
            <h2 className="mt-3 text-3xl font-extrabold">From email to shelf in about six weeks</h2>
            <ol className="mt-8 space-y-6">
              {[
                { n: '1', t: 'You send details', c: 'Strain, harvest date, cure length and a recent full-panel COA.' },
                { n: '2', t: 'We reply within a week', c: 'If it fits, we ask for a sample. If it does not, we tell you why.' },
                { n: '3', t: 'We visit', c: 'Specifically the drying room. Bring us there first.' },
                { n: '4', t: 'We buy the lot', c: 'One purchase order, 14-day terms, your name stays on the listing.' },
              ].map((step) => (
                <li key={step.n} className="flex gap-4">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-leaf-700 font-display text-sm font-extrabold text-white">
                    {step.n}
                  </span>
                  <div>
                    <p className="font-display text-sm font-bold">{step.t}</p>
                    <p className="mt-1 text-sm leading-relaxed text-ink-500">{step.c}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-8 space-y-2.5">
              {['No listing fees', 'No exclusivity clauses', 'Your name on the lot'].map((perk) => (
                <p key={perk} className="flex items-center gap-2 text-sm font-medium text-leaf-800">
                  <Check className="h-4 w-4" />
                  {perk}
                </p>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <form onSubmit={submit} noValidate className="card p-6 sm:p-8">
              <h2 className="font-display text-lg font-bold">Tell us about the lot</h2>
              <p className="mt-1 text-sm text-ink-500">We read every submission and reply within a week.</p>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="vendor-farm" className="label">
                    Farm or company
                  </label>
                  <input type="text" placeholder="Wychwood Growers" {...field('farm')} />
                  {errorFor('farm')}
                </div>
                <div>
                  <label htmlFor="vendor-contact" className="label">
                    Contact name
                  </label>
                  <input type="text" placeholder="Sam Okafor" {...field('contact')} />
                  {errorFor('contact')}
                </div>
                <div>
                  <label htmlFor="vendor-email" className="label">
                    Email
                  </label>
                  <input type="email" placeholder="sam@example.ca" {...field('email')} />
                  {errorFor('email')}
                </div>
                <div>
                  <label htmlFor="vendor-province" className="label">
                    Region
                  </label>
                  <input type="text" placeholder="Region or state" {...field('province')} />
                  {errorFor('province')}
                </div>
              </div>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="vendor-type" className="label">
                    Product type
                  </label>
                  <div className="relative">
                    <select {...field('type')} className={`${field('type').className} appearance-none pr-10`}>
                      {PRODUCT_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                  </div>
                </div>
                <div>
                  <label htmlFor="vendor-volume" className="label">
                    Lot size <span className="normal-case text-ink-400">(optional)</span>
                  </label>
                  <input type="text" placeholder="4 kg" {...field('volume')} />
                </div>
              </div>

              <div className="mt-5">
                <label htmlFor="vendor-notes" className="label">
                  Strain, cure and testing
                </label>
                <textarea
                  rows={5}
                  placeholder="Strain, harvest date, cure length, lab and date of the most recent COA."
                  {...field('notes')}
                />
                {errorFor('notes')}
              </div>

              <button type="submit" disabled={submitting} className="btn btn-lg btn-primary mt-7 w-full sm:w-auto">
                {submitting ? 'Sending…' : 'Submit for review'}
                {!submitting && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>
          </Reveal>
        </div>
      </section>
    </>
  );
}
