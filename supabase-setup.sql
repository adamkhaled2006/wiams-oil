-- بدّل الإيميل إذا لزم
create table if not exists public.store_settings (
  id bigint primary key,
  store_name text,
  tagline text,
  hero_title text,
  hero_subtitle text,
  whatsapp_number text,
  primary_color text,
  accent_color text,
  hero_note text
);

alter table public.store_settings add column if not exists instagram_url text;
alter table public.store_settings add column if not exists snapchat_url text;
alter table public.store_settings add column if not exists tiktok_url text;
alter table public.store_settings add column if not exists facebook_url text;
alter table public.store_settings add column if not exists telegram_url text;
alter table public.store_settings add column if not exists hero_image_url text;

alter table public.store_settings add column if not exists logo_url text;
alter table public.store_settings add column if not exists slider_images text;
alter table public.store_settings add column if not exists hero_image_1_url text;
alter table public.store_settings add column if not exists hero_image_2_url text;
alter table public.store_settings add column if not exists hero_image_3_url text;
alter table public.store_settings add column if not exists hero_image_4_url text;

insert into public.store_settings (
  id, store_name, tagline, hero_title, hero_subtitle, whatsapp_number, primary_color, accent_color, hero_note, hero_image_url
)
values (
  1,
  'متجر ويام',
  'زيوت عطرية، عطور، مباخر ومزهريات بلمسة فاخرة',
  'روائح فاخرة ومنتجات مميزة تصل لزبونك بسهولة',
  'متجر احترافي مع سلة، طلبات، مخزون، حالة Sold Out، ولوحة تحكم بسيطة.',
  '',
  '#6f4e37',
  '#d8c1a8',
  'شحن أنيق وتجربة فاخرة',
  'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1600&q=80'
)
on conflict (id) do nothing;

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select auth.email() = 'adamkhaled0568@gmail.com';
$$;

alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.store_settings enable row level security;

drop policy if exists "public can read products" on public.products;
create policy "public can read products"
on public.products for select
using (true);

drop policy if exists "admin can manage products" on public.products;
create policy "admin can manage products"
on public.products for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "public can insert orders" on public.orders;
create policy "public can insert orders"
on public.orders for insert
with check (true);

drop policy if exists "admin can read and manage orders" on public.orders;
create policy "admin can read and manage orders"
on public.orders for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "public can insert order items" on public.order_items;
create policy "public can insert order items"
on public.order_items for insert
with check (true);

drop policy if exists "admin can read and manage order items" on public.order_items;
create policy "admin can read and manage order items"
on public.order_items for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "public can read store settings" on public.store_settings;
create policy "public can read store settings"
on public.store_settings for select
using (true);

drop policy if exists "admin can manage store settings" on public.store_settings;
create policy "admin can manage store settings"
on public.store_settings for all
using (public.is_admin())
with check (public.is_admin());

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "public can read product images" on storage.objects;
create policy "public can read product images"
on storage.objects for select
using (bucket_id = 'product-images');

drop policy if exists "admin can upload product images" on storage.objects;
create policy "admin can upload product images"
on storage.objects for insert
with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "admin can update product images" on storage.objects;
create policy "admin can update product images"
on storage.objects for update
using (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "admin can delete product images" on storage.objects;
create policy "admin can delete product images"
on storage.objects for delete
using (bucket_id = 'product-images' and public.is_admin());


create or replace function public.decrement_product_stock(order_id_input bigint, items_input jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  item jsonb;
  product_row public.products%rowtype;
  requested_qty integer;
  affected_rows integer;
begin
  if items_input is null or jsonb_typeof(items_input) <> 'array' then
    raise exception 'items_input must be a JSON array';
  end if;

  for item in select * from jsonb_array_elements(items_input)
  loop
    requested_qty := greatest(coalesce((item->>'qty')::integer, 0), 0);
    if requested_qty <= 0 then
      continue;
    end if;

    select * into product_row
    from public.products
    where id = (item->>'product_id')::bigint
    for update;

    if not found then
      raise exception 'المنتج غير موجود';
    end if;

    if coalesce(product_row.sold_out, false) or coalesce(product_row.stock, 0) < requested_qty then
      raise exception 'الكمية المطلوبة من % غير متوفرة', coalesce(product_row.name, 'المنتج');
    end if;

    update public.products
    set
      stock = greatest(coalesce(stock, 0) - requested_qty, 0),
      sold_out = case when greatest(coalesce(stock, 0) - requested_qty, 0) <= 0 then true else coalesce(sold_out, false) end
    where id = product_row.id;

    GET DIAGNOSTICS affected_rows = ROW_COUNT;
    if affected_rows = 0 then
      raise exception 'فشل تحديث المخزون';
    end if;
  end loop;
end;
$$;

grant execute on function public.decrement_product_stock(bigint, jsonb) to anon, authenticated;
