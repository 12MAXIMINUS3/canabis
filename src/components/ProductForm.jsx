import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown, Info, Package, X } from './Icons';
import { EASE } from './Motion';
import Thumb from './Thumb';
import { categories, potencyTiers } from '../data/products';
import { createProduct, deleteProduct, idIsFree, saveProduct, slugify } from '../context/AdminContext';
import { formatPrice } from '../context/CartContext';

/**
 * Add / edit a product.
 *
 * Opens over the dashboard with the product's current values, or blank for a new
 * one. Two things are worth knowing:
 *
 *  - The id doubles as the product's URL (/product/aurora-haze), so it is
 *    generated from the name for new products, checked for collisions, and then
 *    frozen once the product exists — changing it would break a live link.
 *  - Everything is validated here *and* constrained by the database, so a bad
 *    value cannot get through by tampering with the form.
 */

const BLANK = {
  id: '',
  name: '',
  category: 'flower',
  type: '',
  price: '',
  size: '',
  thc: '',
  cbd: '',
  unit: '%',
  thcTier: 'mid',
  cbdTier: 'none',
  rating: 4.5,
  reviewCount: 0,
  inStock: true,
  badge: '',
  blurb: '',
  description: '',
  effects: '',
  usage: '',
  terpenes: '',
  imageUrl: '',
};

const TIERS = potencyTiers.filter((t) => t.value !== 'any');

/** Product -> form values. Arrays become comma-separated text for editing. */
const toForm = (p) =>
  !p
    ? { ...BLANK }
    : {
        ...BLANK,
        ...p,
        price: String(p.price ?? ''),
        thc: String(p.thc ?? ''),
        cbd: String(p.cbd ?? ''),
        badge: p.badge ?? '',
        usage: p.usage ?? '',
        imageUrl: p.imageUrl ?? '',
        effects: (p.effects ?? []).join(', '),
        terpenes: (p.terpenes ?? []).join(', '),
      };

function Field({ label, hint, error, children, className = '' }) {
  return (
    <div className={className}>
      <label className="label flex items-baseline justify-between gap-2">
        <span>{label}</span>
        {hint && <span className="font-normal normal-case tracking-normal text-ink-400">{hint}</span>}
      </label>
      {children}
      {error && (
        <p role="alert" className="mt-1.5 text-xs font-medium text-clay">
          {error}
        </p>
      )}
    </div>
  );
}

export default function ProductForm({ product, onClose, onSaved, onDeleted }) {
  const isNew = !product;
  const [values, setValues] = useState(() => toForm(product));
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const firstField = useRef(null);

  useEffect(() => firstField.current?.focus(), []);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && !busy && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose, busy]);

  const set = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setValues((prev) => {
      const next = { ...prev, [field]: value };
      // A new product's id follows its name until the product exists.
      if (field === 'name' && isNew) next.id = slugify(value);
      return next;
    });
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  };

  // Live preview of the card the shopper will see.
  const preview = useMemo(
    () => ({
      id: values.id || 'preview',
      name: values.name || 'Product name',
      category: values.category,
      imageUrl: values.imageUrl,
    }),
    [values.id, values.name, values.category, values.imageUrl],
  );

  const validate = async () => {
    const e = {};
    if (values.name.trim().length < 2) e.name = 'Give the product a name.';
    if (!values.id) e.id = 'The web address cannot be empty.';
    else if (!/^[a-z0-9-]+$/.test(values.id)) e.id = 'Lower-case letters, numbers and hyphens only.';
    if (values.type.trim().length < 2) e.type = 'What format is it? e.g. Indica, Ceramic cartridge.';
    if (values.size.trim().length < 1) e.size = 'How much is in the pack?';

    const price = Number(values.price);
    if (!values.price || Number.isNaN(price) || price <= 0) e.price = 'Enter a price above zero.';
    else if (price > 10000) e.price = 'That looks like a typo.';

    for (const key of ['thc', 'cbd']) {
      const n = Number(values[key]);
      if (values[key] !== '' && (Number.isNaN(n) || n < 0)) e[key] = 'Must be zero or more.';
      else if (values.unit === '%' && n > 100) e[key] = 'A percentage cannot exceed 100.';
    }

    if (values.blurb.trim().length < 5) e.blurb = 'One short line for the card.';
    if (values.description.trim().length < 20) e.description = 'A little more detail, please.';

    if (isNew && values.id && !e.id && !(await idIsFree(values.id))) {
      e.id = 'A product already uses that address. Try another.';
    }
    return e;
  };

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    const found = await validate();
    setErrors(found);
    if (Object.keys(found).length) {
      setBusy(false);
      document.getElementById(`pf-${Object.keys(found)[0]}`)?.focus();
      return;
    }

    const { error } = isNew ? await createProduct(values) : await saveProduct(product.id, values);
    setBusy(false);

    if (error) {
      setErrors({ name: error.message });
      return;
    }
    onSaved(values, isNew);
  };

  const remove = async () => {
    setBusy(true);
    const { error } = await deleteProduct(product.id);
    setBusy(false);
    if (error) {
      setErrors({ name: error.message });
      return;
    }
    onDeleted(product);
  };

  const input = (field, props = {}) => ({
    id: `pf-${field}`,
    value: values[field],
    onChange: set(field),
    'aria-invalid': Boolean(errors[field]),
    className: `field ${errors[field] ? 'border-clay/60' : ''}`,
    ...props,
  });

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[70] overflow-y-auto bg-ink-900/60 p-0 backdrop-blur-sm sm:p-6"
        onMouseDown={(e) => e.target === e.currentTarget && !busy && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.3, ease: EASE }}
          role="dialog"
          aria-modal="true"
          aria-label={isNew ? 'Add a product' : `Edit ${product.name}`}
          className="mx-auto min-h-full w-full max-w-3xl bg-sand-50 shadow-lift sm:min-h-0 sm:rounded-4xl"
        >
          {/* Header stays put while the form scrolls */}
          <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-ink-900/5 bg-sand-50/95 px-5 py-4 backdrop-blur sm:rounded-t-4xl sm:px-7">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-leaf-700 text-white">
                <Package className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <h2 className="truncate font-display text-lg font-bold">
                  {isNew ? 'Add a product' : values.name || product.name}
                </h2>
                <p className="truncate text-xs text-ink-400">
                  {isNew ? 'It goes live on the shop as soon as you save.' : `/product/${product.id}`}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              aria-label="Close"
              className="btn btn-ghost grid h-10 w-10 shrink-0 place-items-center rounded-full"
            >
              <X className="h-4 w-4" />
            </button>
          </header>

          <form onSubmit={submit} noValidate className="px-5 py-6 sm:px-7">
            {/* Identity */}
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Name" error={errors.name}>
                <input ref={firstField} type="text" placeholder="Aurora Haze" {...input('name')} />
              </Field>

              <Field
                label="Web address"
                hint={isNew ? 'from the name' : 'fixed once live'}
                error={errors.id}
              >
                <div className="flex items-center gap-1.5">
                  <span className="shrink-0 text-xs text-ink-400">/product/</span>
                  <input type="text" disabled={!isNew} {...input('id', { className: `field ${errors.id ? 'border-clay/60' : ''} ${!isNew ? 'bg-sand-100 text-ink-400' : ''}` })} />
                </div>
              </Field>

              <Field label="Category">
                <div className="relative">
                  <select {...input('category', { className: 'field appearance-none pr-10' })}>
                    {categories.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                </div>
              </Field>

              <Field label="Format" hint="shown under the name" error={errors.type}>
                <input type="text" placeholder="Indica · Ceramic cartridge · Topical" {...input('type')} />
              </Field>

              <Field label="Price" error={errors.price}>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-ink-400">$</span>
                  <input type="number" step="0.01" min="0" placeholder="38.00" {...input('price', { className: `field pl-8 ${errors.price ? 'border-clay/60' : ''}` })} />
                </div>
              </Field>

              <Field label="Pack size" error={errors.size}>
                <input type="text" placeholder="3.5 g · 10 x 5 mg · 30 mL" {...input('size')} />
              </Field>
            </div>

            {/* Potency */}
            <div className="mt-8 rounded-3xl bg-white p-5 shadow-soft">
              <div className="flex items-start gap-2.5">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-leaf-600" />
                <p className="text-xs leading-relaxed text-ink-500">
                  Use <strong>%</strong> for anything inhaled and <strong>mg</strong> for anything swallowed. The
                  shop filters on the tiers rather than the raw numbers, because the two units are not comparable.
                </p>
              </div>

              <div className="mt-5 grid gap-5 sm:grid-cols-3">
                <Field label="Unit">
                  <div className="relative">
                    <select {...input('unit', { className: 'field appearance-none pr-10' })}>
                      <option value="%">% (inhaled)</option>
                      <option value="mg">mg (swallowed)</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                  </div>
                </Field>
                <Field label={`THC (${values.unit})`} error={errors.thc}>
                  <input type="number" step="0.1" min="0" placeholder="22.4" {...input('thc')} />
                </Field>
                <Field label={`CBD (${values.unit})`} error={errors.cbd}>
                  <input type="number" step="0.1" min="0" placeholder="0.2" {...input('cbd')} />
                </Field>
              </div>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <Field label="THC tier" hint="used by the shop filter">
                  <div className="relative">
                    <select {...input('thcTier', { className: 'field appearance-none pr-10' })}>
                      {TIERS.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                  </div>
                </Field>
                <Field label="CBD tier" hint="used by the shop filter">
                  <div className="relative">
                    <select {...input('cbdTier', { className: 'field appearance-none pr-10' })}>
                      {TIERS.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                  </div>
                </Field>
              </div>
            </div>

            {/* Copy */}
            <div className="mt-8 grid gap-5">
              <Field label="One-line blurb" hint="appears on the card" error={errors.blurb}>
                <input type="text" placeholder="Bright citrus terpenes with a clean finish." {...input('blurb')} />
              </Field>
              <Field label="Description" hint="the product page" error={errors.description}>
                <textarea rows={4} placeholder="What it smells like, how it was grown, who it suits." {...input('description')} />
              </Field>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Effects" hint="comma separated">
                  <input type="text" placeholder="Uplifted, Focused, Social" {...input('effects')} />
                </Field>
                <Field label="Terpenes" hint="comma separated">
                  <input type="text" placeholder="Limonene, Pinene" {...input('terpenes')} />
                </Field>
              </div>
              <Field label="How to use it" hint="optional">
                <input type="text" placeholder="Start with one short inhale and wait five minutes." {...input('usage')} />
              </Field>
            </div>

            {/* Image + flags */}
            <div className="mt-8 grid gap-5 sm:grid-cols-[1fr_auto] sm:items-start">
              <div className="grid gap-5">
                <Field label="Image path" hint="a file in /public/images/products, or a full URL">
                  <input type="text" placeholder="/images/products/aurora-haze.jpg" {...input('imageUrl')} />
                </Field>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Badge" hint="optional, e.g. Best seller">
                    <input type="text" placeholder="Top shelf" {...input('badge')} />
                  </Field>
                  <Field label="Availability">
                    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-ink-900/10 bg-white px-4 py-3">
                      <span className="text-sm font-semibold text-ink-700">In stock</span>
                      <span className="relative inline-flex h-6 w-11 shrink-0 items-center">
                        <input type="checkbox" checked={values.inStock} onChange={set('inStock')} className="peer sr-only" />
                        <span className="h-6 w-11 rounded-full bg-sand-300 transition-colors duration-200 peer-checked:bg-leaf-600" />
                        <span className="absolute left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 peer-checked:translate-x-5" />
                      </span>
                    </label>
                  </Field>
                </div>
              </div>

              {/* What the shopper will see */}
              <div className="sm:w-44">
                <p className="label">Preview</p>
                <div className="overflow-hidden rounded-2xl border border-ink-900/5 bg-white shadow-soft">
                  <Thumb product={preview} category={values.category} className="aspect-[4/3] w-full" glyphClass="h-6 w-6" />
                  <div className="p-3">
                    <p className="truncate font-display text-sm font-bold">{values.name || 'Product name'}</p>
                    <p className="truncate text-[11px] text-ink-400">{values.type || 'Format'}</p>
                    <p className="mt-1 font-display text-base font-extrabold">
                      {values.price ? formatPrice(Number(values.price)) : '$0.00'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-9 flex flex-col-reverse gap-3 border-t border-ink-900/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
              {!isNew ? (
                confirmDelete ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-ink-500">Delete for good?</span>
                    <button type="button" onClick={remove} disabled={busy} className="btn btn-md bg-clay text-white hover:opacity-90">
                      Yes, delete
                    </button>
                    <button type="button" onClick={() => setConfirmDelete(false)} className="btn btn-md btn-ghost">
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button type="button" onClick={() => setConfirmDelete(true)} disabled={busy} className="btn btn-md btn-ghost text-clay">
                    Delete product
                  </button>
                )
              ) : (
                <span />
              )}

              <div className="flex gap-3">
                <button type="button" onClick={onClose} disabled={busy} className="btn btn-md btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={busy} className="btn btn-md btn-primary">
                  {busy ? 'Saving…' : isNew ? 'Add product' : 'Save changes'}
                  {!busy && <Check className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
