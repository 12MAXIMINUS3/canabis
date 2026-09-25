import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown, Clock, Mail, MapPin, ShieldCheck } from '../components/Icons';
import { EASE, Reveal, StaggerGrid, StaggerItem } from '../components/Motion';
import { useToast } from '../context/ToastContext';
import { sendContactMessage } from '../context/CatalogContext';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const SUBJECTS = ['Order status', 'Product question', 'Returns', 'Lab results request', 'Something else'];

const EMPTY = { name: '', email: '', subject: SUBJECTS[0], message: '' };

const DETAILS = [
  {
    Icon: Mail,
    title: 'Email',
    lines: ['support@northleaf.example', 'Replies within one business day'],
  },
  {
    Icon: Clock,
    title: 'Support hours',
    lines: ['Mon–Fri, 9:00–18:00 ET', 'Sat, 10:00–15:00 ET'],
  },
  {
    Icon: MapPin,
    title: 'Mailing address',
    lines: ['214 Birchway Ave, Suite 3', 'Toronto, ON · Not a retail location'],
  },
];

function validate(values) {
  const errors = {};
  if (values.name.trim().length < 2) errors.name = 'Tell us what to call you.';
  if (!EMAIL_RE.test(values.email.trim())) errors.email = 'Enter an email address we can reply to.';
  if (!values.subject) errors.subject = 'Pick a subject.';
  if (values.message.trim().length < 10) errors.message = 'A little more detail helps — 10 characters minimum.';
  return errors;
}

export default function Contact() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const { push } = useToast();

  const update = (field) => (e) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }));
    // Clear the error for a field as soon as the person starts fixing it.
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  };

  const submit = async (e) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      // Move focus to the first problem so keyboard users are not hunting.
      document.getElementById(`contact-${Object.keys(found)[0]}`)?.focus();
      return;
    }

    setSubmitting(true);
    const result = await sendContactMessage(values);
    setSubmitting(false);

    if (!result.ok) {
      setErrors({ message: 'We could not send that. Please try again in a moment.' });
      return;
    }
    setValues(EMPTY);
    push('Message sent', { detail: 'We reply within one business day.' });
  };

  const fieldError = (field) =>
    errors[field] ? (
      <p id={`contact-${field}-error`} role="alert" className="mt-1.5 text-xs font-medium text-clay">
        {errors[field]}
      </p>
    ) : null;

  const invalidProps = (field) => ({
    'aria-invalid': Boolean(errors[field]),
    'aria-describedby': errors[field] ? `contact-${field}-error` : undefined,
    className: `field ${errors[field] ? 'border-clay/60' : ''}`,
  });

  return (
    <div className="shell pt-10 sm:pt-14">
      <Reveal className="max-w-2xl">
        <p className="eyebrow">Contact</p>
        <h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">Ask us anything</h1>
        <p className="mt-3 text-base leading-relaxed text-ink-500">
          Order questions, product advice, or a request for the full certificate of analysis on a lot you bought — it all
          reaches the same small team.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
        {/* Form */}
        <motion.form
          noValidate
          onSubmit={submit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="card p-6 sm:p-8"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="contact-name" className="label">
                Name
              </label>
              <input
                id="contact-name"
                type="text"
                autoComplete="name"
                value={values.name}
                onChange={update('name')}
                placeholder="Jordan Avery"
                {...invalidProps('name')}
              />
              {fieldError('name')}
            </div>

            <div>
              <label htmlFor="contact-email" className="label">
                Email
              </label>
              <input
                id="contact-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={values.email}
                onChange={update('email')}
                placeholder="you@example.ca"
                {...invalidProps('email')}
              />
              {fieldError('email')}
            </div>
          </div>

          <div className="mt-5">
            <label htmlFor="contact-subject" className="label">
              Subject
            </label>
            <div className="relative">
              <select
                id="contact-subject"
                value={values.subject}
                onChange={update('subject')}
                {...invalidProps('subject')}
                className={`${invalidProps('subject').className} appearance-none pr-10`}
              >
                {SUBJECTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            </div>
            {fieldError('subject')}
          </div>

          <div className="mt-5">
            <label htmlFor="contact-message" className="label">
              Message
            </label>
            <textarea
              id="contact-message"
              rows={6}
              value={values.message}
              onChange={update('message')}
              placeholder="Order number, product name, or just the question."
              {...invalidProps('message')}
            />
            <div className="mt-1.5 flex items-start justify-between gap-4">
              {fieldError('message') ?? (
                <p className="text-xs text-ink-400">Please do not include payment details in a message.</p>
              )}
              <span className="shrink-0 text-xs text-ink-400 tabular-nums">{values.message.trim().length}</span>
            </div>
          </div>

          <button type="submit" disabled={submitting} className="btn btn-lg btn-primary mt-7 w-full sm:w-auto">
            {submitting ? 'Sending…' : 'Send message'}
            {!submitting && <ArrowRight className="h-4 w-4" />}
          </button>

          <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-ink-400">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-leaf-600" />
            Messages are stored securely and only read by the support team.
          </p>
        </motion.form>

        {/* Details */}
        <div>
          <StaggerGrid className="grid gap-4" stagger={0.08}>
            {DETAILS.map(({ Icon, title, lines }) => (
              <StaggerItem key={title}>
                <div className="card flex gap-4 p-5">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-leaf-100 text-leaf-700">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="font-display text-sm font-bold">{title}</h2>
                    {lines.map((line) => (
                      <p key={line} className="mt-0.5 text-sm leading-relaxed text-ink-500">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>

          <Reveal delay={0.15} className="mt-6 overflow-hidden rounded-3xl bg-leaf-800 p-6 text-white">
            <h2 className="font-display text-lg font-bold">Faster than email</h2>
            <p className="mt-2 text-sm leading-relaxed text-mint-100/80">
              Tracking numbers, delivery windows and lab sheets are all in your order confirmation. Most questions are
              answered there before we can type a reply.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-mint-100/90">
              {['Where is my order?', 'What was the THC on my lot?', 'Can I change the delivery date?'].map((q) => (
                <li key={q} className="flex items-center gap-2">
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-mint-300" />
                  {q}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
