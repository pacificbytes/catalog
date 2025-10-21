-- Test script to verify site_config policies work
-- Run this after applying the fix-policies.sql

-- Test 1: Public read access (should work)
SELECT key, value FROM public.site_config WHERE key = 'company_name';

-- Test 2: Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'site_config';

-- Test 3: Check policies exist
SELECT policyname, tablename, cmd, permissive 
FROM pg_policies 
WHERE schemaname = 'public' AND tablename = 'site_config';

-- Test 4: Verify data exists
SELECT COUNT(*) as config_count FROM public.site_config;
