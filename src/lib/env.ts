export const env = {
	publicSupabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
	publicSupabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
	adminEmail: process.env.ADMIN_EMAIL ?? "",
};

export function assertEnv() {
	if (!env.publicSupabaseUrl || !env.publicSupabaseAnonKey) {
		throw new Error("Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
	}
}
