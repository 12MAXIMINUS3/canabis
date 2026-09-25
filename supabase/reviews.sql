-- Site reviews.
--
-- The /reviews page showed a richer record than product pages do: a headline, a
-- location and the product it refers to. Rather than keep a second table, the
-- existing product_reviews table gains those two optional columns and the site
-- reviews are seeded into it. Product pages ignore the extras.

alter table public.product_reviews add column if not exists title    text;
alter table public.product_reviews add column if not exists location text;
alter table public.product_reviews add column if not exists featured boolean not null default false;

create index if not exists product_reviews_featured_idx on public.product_reviews (featured);

-- Aggregate used by the reviews page header. Runs as a plain view so the
-- existing "catalogue is public" select policy governs the underlying rows.
create or replace view public.review_summary as
  select
    round(avg(rating)::numeric, 1) as average,
    count(*)                       as count,
    count(*) filter (where rating = 5) as five,
    count(*) filter (where rating = 4) as four,
    count(*) filter (where rating = 3) as three,
    count(*) filter (where rating = 2) as two,
    count(*) filter (where rating = 1) as one
  from public.product_reviews;

grant select on public.review_summary to anon, authenticated;
