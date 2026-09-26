import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Cart, ChevronDown, Menu, Tag, User, X } from './Icons';
import { LogoMark } from './Logo';
import { EASE } from './Motion';
import { NAV } from './NavMenu';
import { useCart } from '../context/CartContext';
import { MIX_MATCH } from '../context/CartContext';

/** Flattens a nav entry's links, whether it uses `links` or grouped `columns`. */
const flatLinks = (item) => item.links ?? item.columns?.flatMap((c) => c.links) ?? [];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openIndex, setOpenIndex] = useState(null); // desktop dropdown
  const [openMobile, setOpenMobile] = useState(null); // mobile accordion
  const { count, openCart } = useCart();
  const { pathname, search } = useLocation();
  const closeTimer = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close everything on navigation.
  useEffect(() => {
    setMenuOpen(false);
    setOpenIndex(null);
    setOpenMobile(null);
  }, [pathname, search]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  // Escape closes an open dropdown.
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpenIndex(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Small delay on close so the pointer can travel into the panel.
  const openMenu = (i) => {
    clearTimeout(closeTimer.current);
    setOpenIndex(i);
  };
  const scheduleClose = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenIndex(null), 120);
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled || menuOpen || openIndex !== null
          ? 'border-b border-ink-900/5 bg-sand-50/90 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      {/* Promo bar */}
      <div className="bg-leaf-800 text-white">
        <div className="shell flex h-10 items-center justify-center gap-2 text-xs font-semibold sm:text-[13px]">
          <Tag className="h-3.5 w-3.5 text-mint-300" />
          <span className="truncate">
            Any {MIX_MATCH.minItems} for {MIX_MATCH.percentOff}% off · Free discreet shipping over $99
          </span>
          <Link to="/deals" className="hidden shrink-0 underline underline-offset-2 hover:text-mint-200 sm:inline">
            See deals
          </Link>
        </div>
      </div>

      <div className="shell flex h-16 items-center justify-between gap-4 sm:h-[4.5rem]">
        <Link to="/" className="group flex shrink-0 items-center gap-2.5" aria-label="NorthLeaf Cannabis — home">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-leaf-700 shadow-soft transition-transform duration-300 group-hover:-rotate-6">
            <LogoMark className="h-5 w-5" />
          </span>
          <span className="font-display text-xl font-extrabold tracking-tight text-ink-900">
            North<span className="text-leaf-600">Leaf</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden flex-1 items-center justify-center xl:flex" aria-label="Main">
          <ul className="flex items-center">
            {NAV.map((item, i) => {
              const links = flatLinks(item);
              const hasMenu = links.length > 0;
              const isOpen = openIndex === i;

              return (
                <li
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => hasMenu && openMenu(i)}
                  onMouseLeave={scheduleClose}
                >
                  <NavLink
                    to={item.to}
                    onClick={() => setOpenIndex(null)}
                    onFocus={() => hasMenu && openMenu(i)}
                    aria-expanded={hasMenu ? isOpen : undefined}
                    className={({ isActive }) =>
                      `flex items-center gap-1 whitespace-nowrap px-3 py-2 text-[13px] font-bold uppercase tracking-wide transition-colors ${
                        isActive || isOpen ? 'text-leaf-800' : 'text-ink-600 hover:text-ink-900'
                      }`
                    }
                  >
                    {item.label}
                    {hasMenu && (
                      <ChevronDown
                        className={`h-3.5 w-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                      />
                    )}
                  </NavLink>

                  <AnimatePresence>
                    {hasMenu && isOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.18, ease: EASE }}
                        className={`absolute left-1/2 top-full z-50 -translate-x-1/2 pt-2 ${
                          item.columns ? 'w-[30rem]' : 'w-60'
                        }`}
                      >
                        <div
                          className={`rounded-2xl border border-ink-900/5 bg-white p-3 shadow-lift ${
                            item.columns ? 'grid grid-cols-2 gap-1' : ''
                          }`}
                        >
                          {item.columns
                            ? item.columns.map((col) => (
                                <div key={col.title} className="p-2">
                                  <p className="px-2 pb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-ink-400">
                                    {col.title}
                                  </p>
                                  <ul>
                                    {col.links.map((link) => (
                                      <li key={link.label}>
                                        <Link
                                          to={link.to}
                                          className="block rounded-lg px-2 py-1.5 text-sm font-medium text-ink-600 transition-colors hover:bg-leaf-50 hover:text-leaf-800"
                                        >
                                          {link.label}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))
                            : links.map((link) => (
                                <Link
                                  key={link.label}
                                  to={link.to}
                                  className="block rounded-lg px-3 py-2 text-sm font-medium text-ink-600 transition-colors hover:bg-leaf-50 hover:text-leaf-800"
                                >
                                  {link.label}
                                </Link>
                              ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            to="/account"
            aria-label="My account"
            className="btn btn-ghost hidden h-10 w-10 place-items-center rounded-full sm:grid"
          >
            <User className="h-5 w-5" />
          </Link>

          <button type="button" onClick={openCart} className="btn btn-md btn-secondary" aria-label={`Open cart, ${count} items`}>
            <Cart className="h-4 w-4" />
            <span className="hidden sm:inline">Cart</span>
            <span className="tabular-nums">({count})</span>
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="btn btn-ghost grid h-10 w-10 place-items-center rounded-full xl:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile sheet */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id="mobile-nav"
            aria-label="Mobile"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="overflow-hidden border-t border-ink-900/5 bg-sand-50/97 backdrop-blur-xl xl:hidden"
          >
            <div className="shell max-h-[70vh] overflow-y-auto py-3">
              <ul className="flex flex-col">
                <li>
                  <Link to="/" className="block rounded-xl px-3 py-3 text-base font-semibold text-ink-700">
                    Home
                  </Link>
                </li>

                {NAV.map((item, i) => {
                  const links = flatLinks(item);
                  const isOpen = openMobile === i;

                  if (links.length === 0) {
                    return (
                      <li key={item.label}>
                        <Link to={item.to} className="block rounded-xl px-3 py-3 text-base font-semibold text-ink-700">
                          {item.label}
                        </Link>
                      </li>
                    );
                  }

                  return (
                    <li key={item.label} className="border-b border-ink-900/5 last:border-0">
                      <button
                        type="button"
                        onClick={() => setOpenMobile(isOpen ? null : i)}
                        aria-expanded={isOpen}
                        className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-base font-semibold text-ink-700"
                      >
                        {item.label}
                        <ChevronDown
                          className={`h-4 w-4 text-ink-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                        />
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.ul
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: EASE }}
                            className="overflow-hidden pb-2"
                          >
                            {links.map((link) => (
                              <li key={link.label}>
                                <Link
                                  to={link.to}
                                  className="block rounded-lg py-2 pl-6 pr-3 text-sm font-medium text-ink-500 hover:text-leaf-800"
                                >
                                  {link.label}
                                </Link>
                              </li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </li>
                  );
                })}

                <li className="mt-2 flex gap-3 px-3 pb-2">
                  <Link to="/account" className="btn btn-md btn-secondary flex-1">
                    <User className="h-4 w-4" />
                    Account
                  </Link>
                  <Link to="/cart" className="btn btn-md btn-primary flex-1">
                    <Cart className="h-4 w-4" />
                    Cart ({count})
                  </Link>
                </li>
              </ul>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
