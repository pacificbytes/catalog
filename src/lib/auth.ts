import { getServerClient } from "@/lib/supabase/server";
import { env } from "@/lib/env";

export async function isAdmin(): Promise<boolean> {
	try {
		const supabase = await getServerClient();
		const { data: { user } } = await supabase.auth.getUser();

		if (!user?.email) return false;

		// First try to check users table
		try {
			const { data: userData } = await supabase
				.from('users')
				.select('role, is_active')
				.eq('email', user.email)
				.single();

			return userData?.role === 'admin' && userData?.is_active === true;
		} catch {
			// Fallback to environment variable if users table doesn't exist
			return env.adminEmail ? user.email === env.adminEmail : false;
		}
	} catch {
		return false;
	}
}

export async function isManager(): Promise<boolean> {
	try {
		const supabase = await getServerClient();
		const { data: { user } } = await supabase.auth.getUser();

		if (!user?.email) return false;

		// First try to check users table
		try {
			const { data: userData } = await supabase
				.from('users')
				.select('role, is_active')
				.eq('email', user.email)
				.single();

			return (userData?.role === 'manager' || userData?.role === 'admin') && userData?.is_active === true;
		} catch {
			// Fallback to environment variable if users table doesn't exist
			return env.adminEmail ? user.email === env.adminEmail : false;
		}
	} catch {
		return false;
	}
}

export async function getCurrentUser() {
	try {
		const supabase = await getServerClient();
		const { data: { user } } = await supabase.auth.getUser();
		
		if (!user?.email) return null;
		
		// First try to get from users table
		try {
			const { data: userData } = await supabase
				.from('users')
				.select('*')
				.eq('email', user.email)
				.single();
			
			return userData;
		} catch {
			// Fallback to auth user if users table doesn't exist
			return {
				id: user.id,
				email: user.email,
				name: user.email?.split('@')[0] || 'User',
				role: env.adminEmail && user.email === env.adminEmail ? 'admin' : 'manager',
				is_active: true,
				created_at: user.created_at,
				updated_at: user.updated_at
			};
		}
	} catch {
		return null;
	}
}
