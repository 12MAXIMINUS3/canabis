import { useState } from 'react';
import { ArrowRight, Mail } from './Icons';
import { Reveal } from './Motion';
import { useToast } from '../context/ToastContext';
import { subscribeToNewsletter } from '../context/CatalogContext';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Newsletter signup. Validates the address locally and confirms with a toast. */
export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const { push } = useToast();

  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email.trim())) {
      setError('Enter an email address we can actually reach.');
      return;
    }
    setError('');
    setBusy(true);
    const result = await subscribeToNewsletter(email, 'newsletter');
    setBusy(false);

    if (!result.ok) {
      setError('Something went wrong on our end. Try again in a moment.');
      return;
    }
    setEmail('');
    push(result.duplicate ? 'You are already on the list' : 'Subscribed to newsletter', {
      detail: result.duplicate
        ? 'No need to sign up twice.'
        : 'Drop notices and restocks, about twice a month.',
    });
  };

  return (
    <section className="shell">
      <Reveal className="relative overflow-hidden rounded-4xl bg-leaf-800 px-6 py-12 text-white sm:px-12 sm:py-16">
        {/* Abstract leaf-vein backdrop, drawn inline so there is no image to license */}
        <svg
          aria-hidden="true"
          viewBox="0 0 800 400"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 h-full w-full opacity-[0.16]"
        >
          <defs>
            <linearGradient id="nl-vein" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#bdf5dd" />
              <stop offset="100%" stopColor="#bdf5dd" stopOpacity="0" />
            </linearGradient>
          </defs>
          <g fill="none" stroke="url(#nl-vein)" strokeWidth="1.4">
            <path d="M-40 380C180 300 340 200 420 20" />
            {Array.from({ length: 9 }).map((_, i) => (
              <path key={i} d={`M${70 + i * 42} ${352 - i * 36}C${150 + i * 50} ${300 - i * 34} ${240 + i * 54} ${300 - i * 40} ${330 + i * 48} ${250 - i * 30}`} />
            ))}
            <circle cx="660" cy="120" r="150" />
            <circle cx="700" cy="300" r="90" />
          </g>
        </svg>

        <div className="relative grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-mint-200">
              <Mail className="h-3.5 w-3.5" />
              Drop list
            </p>
            <h2 className="mt-4 text-3xl font-extrabold text-white sm:text-4xl">Know about new batches first</h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-mint-100/80">
              Small-batch flower sells out in days. Join the list for restock notices, lab results and the occasional
              members-only price. No more than two emails a month.
            </p>
          </div>

          <form onSubmit={submit} noValidate className="md:justify-self-end md:w-full md:max-w-sm">
            <label htmlFor="newsletter-email" className="label text-mint-200">
              Email address
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                id="newsletter-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                placeholder="you@example.ca"
                aria-invalid={Boolean(error)}
                aria-describedby={error ? 'newsletter-error' : undefined}
                className="field flex-1 border-white/15 bg-white/10 text-white placeholder:text-white/40 focus:border-mint-300"
              />
              <button type="submit" disabled={busy} className="btn btn-md bg-white px-6 text-leaf-800 hover:bg-mint-100">
                {busy ? 'Subscribing…' : 'Subscribe'}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            {error && (
              <p id="newsletter-error" role="alert" className="mt-2 text-xs font-medium text-sand-200">
                {error}
              </p>
            )}
            <p className="mt-3 text-xs text-mint-100/60">
              Legal age only. Unsubscribe in one click. We never sell your address.
            </p>
          </form>
        </div>
      </Reveal>
    </section>
  );
}
