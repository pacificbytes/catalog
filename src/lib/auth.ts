import { getServerClient } from "@/lib/supabase/server";
import { env } from "@/lib/env";

export async function isAdmin(): Promise<boolean> {
	try {
		const supabase = await getServerClient();
		const { data: { user } } = await supabase.auth.getUser();
		
		if (!user) return false;
		
		// Check if user email matches admin email
		return env.adminEmail ? user.email === env.adminEmail : false;
	} catch {
		return false;
	}
}

export async function getCurrentUser() {
	try {
		const supabase = await getServerClient();
		const { data: { user } } = await supabase.auth.getUser();
		return user;
	} catch {
		return null;
	}
}
