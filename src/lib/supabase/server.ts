import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { env } from "@/lib/env";

export async function getServerClient() {
	const cookieStore = await cookies();
	return createServerClient(env.publicSupabaseUrl, env.publicSupabaseAnonKey, {
		cookies: {
			get(name: string) {
				return cookieStore.get(name)?.value;
			},
			// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
			set(_name: string, _value: string, _options: any) {
				// Cookies can only be modified in Server Actions or Route Handlers
				// For server components, we only read cookies
			},
			// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
			remove(_name: string, _options: any) {
				// Cookies can only be modified in Server Actions or Route Handlers
				// For server components, we only read cookies
			},
		},
	});
}
