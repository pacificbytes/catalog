# 🔐 Admin Account Setup Guide

## ✅ Secure User Management System

The admin system uses a secure two-step process for user creation that doesn't require service role keys:

## 🔧 Environment Setup (Required First)

Before creating users, you need to set up your environment variables:

1. **Create `.env.local` file** in the web directory
2. **Add the following variables:**

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Admin Configuration  
ADMIN_EMAIL=your_admin_email@example.com
```

3. **Get your Supabase keys:**
   - Go to your Supabase Dashboard
   - Navigate to Settings > API
   - Copy the Project URL and anon key

## 👥 User Creation Process

### Step 1: Create User in Web App Dashboard

1. **Go to**: `http://localhost:3000/admin/users`
2. **Click "Add User"**
3. **Fill in the details:**
   - **Email**: `user@example.com`
   - **Name**: User Name
   - **Role**: Select "admin" or "manager"
4. **Click "Create User"**

This creates the user in the custom users table with the specified role.

### Step 2: Create User in Supabase Dashboard

1. **Go to your Supabase Dashboard**
2. **Navigate to Authentication → Users**
3. **Click "Add User"**
4. **Fill in the details:**
   - **Email**: Use the same email from Step 1
   - **Password**: Choose a secure password
   - **Email Confirmed**: ✅ Check this box
5. **Click "Create User"**

### Step 3: Test Login

1. **Go to**: `http://localhost:3000/login`
2. **Use the credentials** you created in Supabase Dashboard
3. **Should redirect to**: `/admin`

The system will automatically sync the user data and apply the correct role permissions.

## 🔍 How the System Works

### Authentication Flow:
1. **Login** → Supabase Auth validation
2. **Supabase Auth** → Creates session cookie
3. **Application** → Checks/syncs user in custom `users` table
4. **Role Check** → Allows access to admin panel based on role

### Why This Approach is More Secure:
- **No Service Role Key**: Doesn't bypass RLS policies
- **Manual Auth Creation**: Only admins can create auth users
- **Role-Based Access**: Proper permission system
- **Audit Trail**: All actions are logged

## 🎯 Benefits of This Approach

- **Enhanced Security**: No service role key required
- **Proper RLS**: Respects Row Level Security policies
- **Manual Control**: Only authorized users can create auth accounts
- **Role Management**: Clear separation of admin/manager permissions
- **Audit Logging**: Complete action tracking

## 🔧 Role Management

- **Admin Role**: Full access including user management and settings
- **Manager Role**: Product management, no user management or settings access
- **Role Changes**: Can be updated in the admin panel or database

### Admin-Only Features:
- **Settings Page**: System configuration and security settings
- **User Management**: Create, edit, and delete users
- **Export & Backup**: Data export and system information
- **Product Deletion**: Only admins can delete products

### Manager Access:
- **Products**: Create, edit, and change status of products
- **Categories**: Manage product categories
- **Dashboard**: View system statistics
- **No Product Deletion**: Managers cannot delete products (admin-only)

## 🚨 Troubleshooting

### "User not allowed" Error
This error should no longer occur with the new approach.

### User Can't Log In
Make sure you've completed both steps:
1. Created user in web app dashboard
2. Created user in Supabase Dashboard with same email

### Environment Variables Not Loading
If environment variables aren't being loaded:

**Solution:**
1. Make sure `.env.local` is in the `/web` directory (not root)
2. Restart your development server
3. Check for typos in variable names
4. Ensure no spaces around the `=` sign
