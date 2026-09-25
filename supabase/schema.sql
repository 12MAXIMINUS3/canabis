-- NorthLeaf Cannabis — database schema
-- Apply with: node scripts/supabase-setup.mjs (or paste into the Supabase SQL editor).
--
-- Security model: the browser only ever uses the anon key, so every table has RLS on.
--   * catalogue tables  → anyone may read, nobody may write
--   * submission tables → anyone may insert, nobody may read back
--   * orders            → anyone may insert; reading requires the order number AND the
--                         email it was placed with, via the track_order() function below
-- Nothing here lets an anonymous visitor enumerate other people's data.

create extension if not exists pgcrypto;

/* ---------------------------------------------------------------- */
/* Catalogue                                                         */
/* ---------------------------------------------------------------- */

create table if not exists public.categories (
  slug        text primary key,
  name        text not null,
  description text,
  meta        text,
  image_url   text,
  sort_order  integer not null default 0
);

create table if not exists public.products (
  id           text primary key,
  name         text not null,
  category     text references public.categories (slug) on update cascade on delete set null,
  type         text,
  price        numeric(10, 2) not null check (price >= 0),
  size         text,
  thc          numeric(6, 2) not null default 0,
  cbd          numeric(6, 2) not null default 0,
  unit         text not null default '%',
  thc_tier     text not null default 'none' check (thc_tier in ('none', 'low', 'mid', 'high')),
  cbd_tier     text not null default 'none' check (cbd_tier in ('none', 'low', 'mid', 'high')),
  rating       numeric(2, 1) not null default 0,
  review_count integer not null default 0,
  in_stock     boolean not null default true,
  badge        text,
  blurb        text,
  description  text,
  effects      text[] not null default '{}',
  usage        text,
  terpenes     text[] not null default '{}',
  image_url    text,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now()
);

create index if not exists products_category_idx on public.products (category);
create index if not exists products_in_stock_idx on public.products (in_stock);

create table if not exists public.product_reviews (
  id          uuid primary key default gen_random_uuid(),
  product_id  text not null references public.products (id) on delete cascade,
  author      text not null,
  rating      smallint not null check (rating between 1 and 5),
  review_date text,
  body        text not null,
  created_at  timestamptz not null default now()
);

create index if not exists product_reviews_product_idx on public.product_reviews (product_id);

/* ---------------------------------------------------------------- */
/* Form submissions                                                  */
/* ---------------------------------------------------------------- */

create table if not exists public.newsletter_subscribers (
  id         uuid primary key default gen_random_uuid(),
  email      text not null unique,
  source     text,
  created_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  subject    text not null,
  message    text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.vendor_applications (
  id         uuid primary key default gen_random_uuid(),
  farm       text not null,
  contact    text not null,
  email      text not null,
  province   text not null,
  product_type text,
  volume     text,
  notes      text not null,
  created_at timestamptz not null default now()
);

/* ---------------------------------------------------------------- */
/* Orders                                                            */
/* ---------------------------------------------------------------- */

create table if not exists public.orders (
  id           uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  email        text not null,
  full_name    text not null,
  phone        text,
  address      text not null,
  city         text not null,
  province     text not null,
  postal_code  text not null,
  payment_method text not null,
  subtotal     numeric(10, 2) not null,
  discount     numeric(10, 2) not null default 0,
  shipping     numeric(10, 2) not null default 0,
  total        numeric(10, 2) not null,
  status       text not null default 'Received',
  created_at   timestamptz not null default now()
);

create table if not exists public.order_items (
  id         uuid primary key default gen_random_uuid(),
  order_id   uuid not null references public.orders (id) on delete cascade,
  product_id text,
  name       text not null,
  size       text,
  unit_price numeric(10, 2) not null,
  quantity   integer not null check (quantity > 0)
);

create index if not exists order_items_order_idx on public.order_items (order_id);

/* ---------------------------------------------------------------- */
/* Row Level Security                                                */
/* ---------------------------------------------------------------- */

alter table public.categories             enable row level security;
alter table public.products               enable row level security;
alter table public.product_reviews        enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.contact_messages       enable row level security;
alter table public.vendor_applications    enable row level security;
alter table public.orders                 enable row level security;
alter table public.order_items            enable row level security;

-- Catalogue: world-readable, never writable from the browser.
drop policy if exists "catalogue is public" on public.categories;
create policy "catalogue is public" on public.categories for select to anon, authenticated using (true);

drop policy if exists "catalogue is public" on public.products;
create policy "catalogue is public" on public.products for select to anon, authenticated using (true);

drop policy if exists "catalogue is public" on public.product_reviews;
create policy "catalogue is public" on public.product_reviews for select to anon, authenticated using (true);

-- Submissions: write-only. A visitor can post one but cannot read anybody's, including their own.
drop policy if exists "anyone may subscribe" on public.newsletter_subscribers;
create policy "anyone may subscribe" on public.newsletter_subscribers for insert to anon, authenticated with check (true);

drop policy if exists "anyone may write in" on public.contact_messages;
create policy "anyone may write in" on public.contact_messages for insert to anon, authenticated with check (true);

drop policy if exists "anyone may apply" on public.vendor_applications;
create policy "anyone may apply" on public.vendor_applications for insert to anon, authenticated with check (true);

-- Orders: insert only. Reading goes through track_order(), which demands the email.
drop policy if exists "anyone may place an order" on public.orders;
create policy "anyone may place an order" on public.orders for insert to anon, authenticated with check (true);

drop policy if exists "anyone may add order lines" on public.order_items;
create policy "anyone may add order lines" on public.order_items for insert to anon, authenticated with check (true);

/* ---------------------------------------------------------------- */
/* Order lookup                                                      */
/* ---------------------------------------------------------------- */

-- Returns a single order only when the number and email both match, so the
-- endpoint cannot be used to walk through order numbers.
create or replace function public.track_order(p_order_number text, p_email text)
returns table (
  order_number text,
  status       text,
  total        numeric,
  created_at   timestamptz,
  items        jsonb
)
language sql
security definer
set search_path = public
as $$
  select
    o.order_number,
    o.status,
    o.total,
    o.created_at,
    coalesce(
      jsonb_agg(jsonb_build_object('name', i.name, 'quantity', i.quantity)) filter (where i.id is not null),
      '[]'::jsonb
    ) as items
  from public.orders o
  left join public.order_items i on i.order_id = o.id
  where upper(trim(o.order_number)) = upper(trim(p_order_number))
    and lower(trim(o.email)) = lower(trim(p_email))
  group by o.id, o.order_number, o.status, o.total, o.created_at;
$$;

revoke all on function public.track_order(text, text) from public;
grant execute on function public.track_order(text, text) to anon, authenticated;
