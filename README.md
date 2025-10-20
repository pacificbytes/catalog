# Chahar Printing Press

A modern product catalogue with admin, built with Next.js + Supabase.

## Features
- Product catalogue with multiple photos per product
- Search, sort, and pagination
- Product detail page with image gallery
- Admin (single admin) to add/edit/delete products
- Image upload to Supabase Storage
- Import/Export products (JSON, CSV)

## Stack
- Next.js (App Router, TypeScript, Tailwind)
- Supabase (Postgres, RLS, Auth, Storage)
- Hosted on Vercel (free tier)

## Local setup
1. Create a Supabase project (`https://supabase.com`).
2. In Database, run the SQL in `supabase/schema.sql` to create tables and policies.
3. **IMPORTANT - Storage Setup:**
   - Go to Supabase Dashboard > Storage
   - Create a new bucket named `product-images`
   - Set it as **PUBLIC** (not private)
   - Run the storage policies from `supabase/schema.sql` (the RLS policies for storage.objects)
4. In Authentication, create an email/password user with the admin email you plan to use.
5. Copy `.env.example` to `.env.local` and set values:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` (e.g., http://localhost:3000)
   - `ADMIN_EMAIL` (email of your single admin user)
6. Install deps and run:

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`. Login at `/login`. Admin at `/admin`.

## Troubleshooting Images
If images are broken:
1. **Check Storage Bucket**: Ensure `product-images` bucket exists and is PUBLIC
2. **Check RLS Policies**: Run the storage policies from `supabase/schema.sql`
3. **Check URLs**: Image URLs should look like `https://[project].supabase.co/storage/v1/object/public/product-images/...`
4. **Test Upload**: Try uploading a new image in admin to verify storage is working

## Deploy
1. Push this repo to GitHub.
2. Import to Vercel. Set environment variables on Vercel Project Settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` (your Vercel URL, e.g., https://your-app.vercel.app)
   - `ADMIN_EMAIL`
3. In Supabase, ensure Storage bucket `product-images` exists and is public.
4. Re-run `supabase/schema.sql` if needed to set RLS policies.

Zero-downtime deploys are handled by Vercel. Supabase free tier covers database, auth and storage.
