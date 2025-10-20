import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { env } from "@/lib/env";

export async function getAuthServerClient() {
	const cookieStore = await cookies();
	return createServerClient(env.publicSupabaseUrl, env.publicSupabaseAnonKey, {
		cookies: {
			get(name: string) {
				return cookieStore.get(name)?.value;
			},
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			set(name: string, value: string, options: any) {
				cookieStore.set({ name, value, ...options });
			},
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			remove(name: string, options: any) {
				cookieStore.set({ name, value: "", ...options });
			},
		},
	});
}
