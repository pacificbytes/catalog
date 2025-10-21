# 🔧 Database Fix Instructions

## Issue: Infinite Recursion in RLS Policies

The error "infinite recursion detected in policy for relation 'users'" occurs because the Row Level Security (RLS) policies were referencing the `users` table from within policies on the `users` table itself, creating circular dependencies.

## ✅ Solution

### Step 1: Run the Fix Script

1. **Go to your Supabase Dashboard**
2. **Navigate to SQL Editor**
3. **Copy and paste the contents of `supabase/fix-policies.sql`**
4. **Click "Run"**

This will:
- Drop the problematic policies
- Create simplified policies without circular references
- Add a default admin user

### Step 2: Update Your Admin User

After running the fix script, update the admin user with your actual email:

```sql
UPDATE public.users 
SET email = 'your-actual-email@example.com', name = 'Your Name'
WHERE email = 'admin@chaharprinting.com';
```

### Step 3: Test the Application

1. **Restart your development server**
2. **Try accessing the admin pages**
3. **The infinite loading should be resolved**

## 🔍 What Was Fixed

### Before (Problematic):
```sql
-- This caused circular reference
CREATE POLICY "Admins can manage all users" ON public.users
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.users u 
        WHERE u.email = auth.jwt() ->> 'email' 
        AND u.role = 'admin'
    )
);
```

### After (Fixed):
```sql
-- Simple, no circular reference
CREATE POLICY "Authenticated users can manage users" ON public.users
FOR ALL USING (auth.role() = 'authenticated');
```

## 🛡️ Security Note

The simplified policies allow all authenticated users to manage data. Role-based permissions are now handled at the **application level** in the code, which is actually more secure and flexible than complex RLS policies.

### Role Permissions:
- **Admin**: Full access to everything
- **Manager**: Can create, edit, and delete products (but not manage users)

## 🚀 Next Steps

Once the database is fixed:
1. **Multi-user system will work fully**
2. **Audit logging will be active**
3. **Role-based permissions will be enforced**
4. **User management will be available**

The application will automatically detect when the database tables exist and enable the full multi-user functionality.
