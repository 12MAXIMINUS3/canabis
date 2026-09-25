import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { supabase, isConfigured } from '../lib/supabase';

/**
 * Admin session.
 *
 * Signing in is ordinary Supabase auth; being an *admin* is decided entirely by
 * the database, through the is_admin() function and the admin_users allowlist.
 * The flag below only decides what the UI bothers to render — every query is
 * still checked by Row Level Security, so a tampered client gets nothing.
 */

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(isConfigured);

  const verify = useCallback(async (activeSession) => {
    if (!activeSession || !supabase) {
      setIsAdmin(false);
      setChecking(false);
      return;
    }
    const { data, error } = await supabase.rpc('is_admin');
    setIsAdmin(!error && data === true);
    setChecking(false);
  }, []);

  useEffect(() => {
    if (!supabase) {
      setChecking(false);
      return undefined;
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      verify(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      setChecking(true);
      verify(next);
    });

    return () => listener?.subscription?.unsubscribe();
  }, [verify]);

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      isAdmin,
      checking,
      configured: isConfigured,

      signIn: async (email, password) => {
        if (!supabase) return { ok: false, message: 'Supabase is not configured.' };
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });
        if (error) return { ok: false, message: error.message };
        return { ok: true };
      },

      signOut: async () => {
        if (supabase) await supabase.auth.signOut();
        setIsAdmin(false);
      },
    }),
    [session, isAdmin, checking],
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used inside <AdminProvider>');
  return ctx;
}

/* ---------------- admin queries ---------------- */

const guard = async (run) => {
  if (!supabase) return { data: null, error: new Error('Supabase is not configured') };
  const { data, error } = await run(supabase);
  return { data, error };
};

export const fetchStats = () =>
  guard((db) => db.rpc('admin_stats')).then(({ data, error }) => ({ stats: data?.[0] ?? null, error }));

export const fetchOrders = () =>
  guard((db) =>
    db
      .from('orders')
      .select('id, order_number, email, full_name, city, province, total, status, payment_method, created_at')
      .order('created_at', { ascending: false })
      .limit(100),
  );

export const fetchOrderItems = (orderId) =>
  guard((db) => db.from('order_items').select('name, size, unit_price, quantity').eq('order_id', orderId));

export const fetchMessages = () =>
  guard((db) =>
    db.from('contact_messages').select('*').order('created_at', { ascending: false }).limit(100),
  );

export const fetchSubscribers = () =>
  guard((db) =>
    db.from('newsletter_subscribers').select('*').order('created_at', { ascending: false }).limit(200),
  );

export const fetchApplications = () =>
  guard((db) =>
    db.from('vendor_applications').select('*').order('created_at', { ascending: false }).limit(100),
  );

export const updateOrderStatus = (orderNumber, status) =>
  guard((db) => db.from('orders').update({ status }).eq('order_number', orderNumber));

export const updateProduct = (id, patch) =>
  guard((db) => db.from('products').update(patch).eq('id', id));

export const ORDER_STATUSES = ['Received', 'Packed', 'Shipped', 'In transit', 'Delivered', 'Refunded'];
