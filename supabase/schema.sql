-- Products table
create table if not exists public.products (
	id uuid primary key default gen_random_uuid(),
	slug text unique not null,
	name text not null,
	description text default '',
	price_rupees integer not null check (price_rupees >= 0),
	sku text default '',
	stock integer not null default 0 check (stock >= 0),
	categories text[] not null default '{}',
	tags text[] not null default '{}',
	status text not null default 'published' check (status in ('draft','published','archived')),
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

-- Product images table
create table if not exists public.product_images (
	id uuid primary key default gen_random_uuid(),
	product_id uuid not null references public.products(id) on delete cascade,
	url text not null,
	alt text default '',
	position integer not null default 0 check (position >= 0),
	created_at timestamptz not null default now()
);

-- Indexes
create index if not exists products_status_idx on public.products(status);
create index if not exists products_slug_idx on public.products(slug);
create index if not exists product_images_product_idx on public.product_images(product_id);

-- Row Level Security
alter table public.products enable row level security;
alter table public.product_images enable row level security;

-- Policies: public read for published products only; admin can manage all
-- Replace 'admin@example.com' with your ADMIN_EMAIL or use jwt claims
create policy "Public read published products" on public.products
	for select using (status = 'published');

create policy "Public read product images by product" on public.product_images
	for select using (exists (
		select 1 from public.products p where p.id = product_id and p.status = 'published'
	));

-- Authenticated admin manage (adjust to your auth model as needed)
create policy "Admin all on products" on public.products
	for all
	to authenticated
	using (true)
	with check (true);

create policy "Admin all on product_images" on public.product_images
	for all
	to authenticated
	using (true)
	with check (true);

-- Storage bucket setup (REQUIRED)
-- 1. Go to Supabase Dashboard > Storage
-- 2. Create a new bucket named 'product-images'
-- 3. Set it as PUBLIC (not private)
-- 4. Add the following RLS policies:

-- Allow public read access to product images
CREATE POLICY "Public read access to product images" ON storage.objects
FOR SELECT USING (bucket_id = 'product-images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload product images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to update images
CREATE POLICY "Authenticated users can update product images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to delete images
CREATE POLICY "Authenticated users can delete product images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);
