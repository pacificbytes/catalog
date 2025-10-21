-- Add password fields to users table
-- Run this in your Supabase SQL editor

-- Add password_hash field to store hashed passwords
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS password_hash text;

-- Add password_reset_token field for password reset functionality
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS password_reset_token text;

-- Add password_reset_expires field for token expiration
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS password_reset_expires timestamptz;

-- Add last_login field to track user activity
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS last_login timestamptz;

-- Create index for password reset token lookup
CREATE INDEX IF NOT EXISTS idx_users_password_reset_token 
ON public.users(password_reset_token) 
WHERE password_reset_token IS NOT NULL;

-- Update existing users to have a default password (you should change this)
-- This is just for initial setup - users should set their own passwords
UPDATE public.users 
SET password_hash = '$2a$10$rQZ8K9vX8K9vX8K9vX8K9e' -- This is a placeholder hash
WHERE password_hash IS NULL;

-- Add comment to explain the password system
COMMENT ON COLUMN public.users.password_hash IS 'Bcrypt hashed password for user authentication';
COMMENT ON COLUMN public.users.password_reset_token IS 'Token for password reset functionality';
COMMENT ON COLUMN public.users.password_reset_expires IS 'Expiration time for password reset token';
COMMENT ON COLUMN public.users.last_login IS 'Timestamp of user last login';
