-- Admin access.
--
-- Everything public stays exactly as it was: the anon key still cannot read a
-- single order, message or subscriber. Admin rights are granted per signed-in
-- email address, checked against the admin_users allowlist below.
--
-- Adding an admin is two steps and both are deliberate: insert the address here,
-- and create the auth user. Neither can be done with the anon key.

create table if not exists public.admin_users (
  email      text primary key,
  added_at   timestamptz not null default now(),
  note       text
);

alter table public.admin_users enable row level security;
-- No policies at all: the allowlist is invisible and unwritable from the browser.
-- is_admin() reads it with definer rights instead.

/* ---------------------------------------------------------------- */
/* is_admin()                                                        */
/* ---------------------------------------------------------------- */

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users a
    where a.email = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

/* ---------------------------------------------------------------- */
/* Read access for admins                                            */
/* ---------------------------------------------------------------- */

drop policy if exists "admins read orders" on public.orders;
create policy "admins read orders" on public.orders
  for select to authenticated using (public.is_admin());

drop policy if exists "admins read order items" on public.order_items;
create policy "admins read order items" on public.order_items
  for select to authenticated using (public.is_admin());

drop policy if exists "admins read messages" on public.contact_messages;
create policy "admins read messages" on public.contact_messages
  for select to authenticated using (public.is_admin());

drop policy if exists "admins read subscribers" on public.newsletter_subscribers;
create policy "admins read subscribers" on public.newsletter_subscribers
  for select to authenticated using (public.is_admin());

drop policy if exists "admins read applications" on public.vendor_applications;
create policy "admins read applications" on public.vendor_applications
  for select to authenticated using (public.is_admin());

/* ---------------------------------------------------------------- */
/* Write access for admins                                           */
/* ---------------------------------------------------------------- */

-- Catalogue editing. Public read stays governed by the existing select policy.
drop policy if exists "admins write products" on public.products;
create policy "admins write products" on public.products
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins write categories" on public.categories;
create policy "admins write categories" on public.categories
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins write reviews" on public.product_reviews;
create policy "admins write reviews" on public.product_reviews
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Order status updates (Received -> Packed -> Shipped -> Delivered).
drop policy if exists "admins update orders" on public.orders;
create policy "admins update orders" on public.orders
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

/* ---------------------------------------------------------------- */
/* Dashboard counters                                                */
/* ---------------------------------------------------------------- */

-- One round trip for the headline numbers. Returns zeros to non-admins rather
-- than leaking whether rows exist.
create or replace function public.admin_stats()
returns table (
  orders_total     bigint,
  orders_today     bigint,
  revenue_total    numeric,
  messages_total   bigint,
  subscribers_total bigint,
  applications_total bigint,
  products_total   bigint,
  out_of_stock     bigint
)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    return query select 0::bigint, 0::bigint, 0::numeric, 0::bigint, 0::bigint, 0::bigint, 0::bigint, 0::bigint;
    return;
  end if;

  return query
    select
      (select count(*) from public.orders),
      (select count(*) from public.orders where created_at >= date_trunc('day', now())),
      (select coalesce(sum(total), 0) from public.orders),
      (select count(*) from public.contact_messages),
      (select count(*) from public.newsletter_subscribers),
      (select count(*) from public.vendor_applications),
      (select count(*) from public.products),
      (select count(*) from public.products where not in_stock);
end;
$$;

revoke all on function public.admin_stats() from public;
grant execute on function public.admin_stats() to authenticated;

/* ---------------------------------------------------------------- */
/* The allowlist                                                     */
/* ---------------------------------------------------------------- */

insert into public.admin_users (email, note)
values ('mbonevanpersi@gmail.com', 'Owner')
on conflict (email) do nothing;
