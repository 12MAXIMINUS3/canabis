-- Order placement, revised.
--
-- Inserting straight from the browser needed a RETURNING clause to get the new
-- id, and RETURNING requires a SELECT policy — which would have let anyone read
-- every order in the table. Instead the whole placement happens inside one
-- security-definer function: the browser gets back only the order number, and
-- the direct insert policies are withdrawn.
--
-- The order number is issued by a sequence server-side, so a client cannot pick
-- its own or collide with someone else's.

create sequence if not exists public.order_number_seq start with 48300;

-- Withdraw the direct-insert policies; everything now goes through create_order().
drop policy if exists "anyone may place an order" on public.orders;
drop policy if exists "anyone may add order lines" on public.order_items;

create or replace function public.create_order(p_order jsonb, p_items jsonb)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order_number text;
  v_order_id     uuid;
  v_item         jsonb;
  v_count        integer;
begin
  -- Validation. These run as the table owner, so they are the only gate.
  if coalesce(trim(p_order ->> 'email'), '') = '' then
    raise exception 'email is required';
  end if;

  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'an order needs at least one item';
  end if;

  if jsonb_array_length(p_items) > 50 then
    raise exception 'too many items';
  end if;

  if (p_order ->> 'total')::numeric < 0 then
    raise exception 'total cannot be negative';
  end if;

  v_order_number := 'NL-' || nextval('public.order_number_seq')::text;

  insert into public.orders (
    order_number, email, full_name, phone, address, city, province, postal_code,
    payment_method, subtotal, discount, shipping, total
  )
  values (
    v_order_number,
    lower(trim(p_order ->> 'email')),
    trim(p_order ->> 'full_name'),
    nullif(trim(coalesce(p_order ->> 'phone', '')), ''),
    trim(p_order ->> 'address'),
    trim(p_order ->> 'city'),
    trim(p_order ->> 'province'),
    upper(trim(p_order ->> 'postal_code')),
    p_order ->> 'payment_method',
    coalesce((p_order ->> 'subtotal')::numeric, 0),
    coalesce((p_order ->> 'discount')::numeric, 0),
    coalesce((p_order ->> 'shipping')::numeric, 0),
    coalesce((p_order ->> 'total')::numeric, 0)
  )
  returning id into v_order_id;

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    select count(*) into v_count from public.products where id = v_item ->> 'product_id';

    insert into public.order_items (order_id, product_id, name, size, unit_price, quantity)
    values (
      v_order_id,
      case when v_count > 0 then v_item ->> 'product_id' else null end,
      v_item ->> 'name',
      v_item ->> 'size',
      coalesce((v_item ->> 'unit_price')::numeric, 0),
      greatest(1, least(99, coalesce((v_item ->> 'quantity')::integer, 1)))
    );
  end loop;

  return v_order_number;
end;
$$;

revoke all on function public.create_order(jsonb, jsonb) from public;
grant execute on function public.create_order(jsonb, jsonb) to anon, authenticated;
