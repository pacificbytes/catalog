-- Fixed RLS Policies (Run this in Supabase SQL Editor)
-- This fixes the infinite recursion issue

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can read their own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can manage all users" ON public.users;
DROP POLICY IF EXISTS "Managers can create products" ON public.products;
DROP POLICY IF EXISTS "Managers can update products" ON public.products;
DROP POLICY IF EXISTS "Admins can delete products" ON public.products;
DROP POLICY IF EXISTS "Managers can manage product images" ON public.product_images;
DROP POLICY IF EXISTS "Users can read their own audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "System can insert audit logs" ON public.audit_logs;

-- Create simplified policies without circular references
CREATE POLICY "Users can read their own profile" ON public.users
	FOR SELECT USING (auth.jwt() ->> 'email' = email);

CREATE POLICY "Authenticated users can manage users" ON public.users
	FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage products" ON public.products
	FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage product images" ON public.product_images
	FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage audit logs" ON public.audit_logs
	FOR ALL USING (auth.role() = 'authenticated');

-- Insert default admin user if not exists
INSERT INTO public.users (email, name, role) VALUES 
('admin@chaharprinting.com', 'Admin User', 'admin')
ON CONFLICT (email) DO NOTHING;
