-- Users table for role management
create table if not exists public.users (
	id uuid primary key default gen_random_uuid(),
	email text unique not null,
	name text not null,
	role text not null default 'manager' check (role in ('admin', 'manager')),
	is_active boolean not null default true,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

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
	created_by uuid references public.users(id),
	updated_by uuid references public.users(id),
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

-- Audit logs table for tracking all actions
create table if not exists public.audit_logs (
	id uuid primary key default gen_random_uuid(),
	user_id uuid references public.users(id),
	user_email text not null,
	action text not null, -- 'create', 'update', 'delete', 'publish', 'archive', etc.
	resource_type text not null, -- 'product', 'user', 'image', etc.
	resource_id uuid,
	resource_name text, -- Name of the resource for easier reading
	old_values jsonb, -- Previous values for updates
	new_values jsonb, -- New values for updates
	ip_address text,
	user_agent text,
	created_at timestamptz not null default now()
);

-- Indexes
create index if not exists users_email_idx on public.users(email);
create index if not exists users_role_idx on public.users(role);
create index if not exists products_status_idx on public.products(status);
create index if not exists products_slug_idx on public.products(slug);
create index if not exists products_created_by_idx on public.products(created_by);
create index if not exists products_updated_by_idx on public.products(updated_by);
create index if not exists product_images_product_idx on public.product_images(product_id);
create index if not exists audit_logs_user_id_idx on public.audit_logs(user_id);
create index if not exists audit_logs_action_idx on public.audit_logs(action);
create index if not exists audit_logs_resource_type_idx on public.audit_logs(resource_type);
create index if not exists audit_logs_created_at_idx on public.audit_logs(created_at);

-- Row Level Security
alter table public.users enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.audit_logs enable row level security;

-- Policies: public read for published products only; authenticated users can manage based on role
create policy "Public read published products" on public.products
	for select using (status = 'published');

create policy "Public read product images by product" on public.product_images
	for select using (exists (
		select 1 from public.products p where p.id = product_id and p.status = 'published'
	));

-- Users policies (simplified to avoid circular references)
create policy "Users can read their own profile" on public.users
	for select using (auth.jwt() ->> 'email' = email);

create policy "Authenticated users can manage users" on public.users
	for all using (auth.role() = 'authenticated');

-- Products policies - simplified to avoid circular references
create policy "Authenticated users can manage products" on public.products
	for all using (auth.role() = 'authenticated');

-- Product images policies
create policy "Authenticated users can manage product images" on public.product_images
	for all using (auth.role() = 'authenticated');

-- Audit logs policies
create policy "Authenticated users can manage audit logs" on public.audit_logs
	for all using (auth.role() = 'authenticated');

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

-- Insert default admin user (update with your actual admin email)
INSERT INTO public.users (email, name, role) VALUES 
('admin@chaharprinting.com', 'Admin User', 'admin')
ON CONFLICT (email) DO NOTHING;
