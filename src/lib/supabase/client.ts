import { createBrowserClient } from "@supabase/ssr";
import { env } from "@/lib/env";

let browserClient: ReturnType<typeof createBrowserClient> | null = null;

export function getBrowserClient() {
	if (!browserClient) {
		browserClient = createBrowserClient(
			env.publicSupabaseUrl,
			env.publicSupabaseAnonKey
		);
	}
	return browserClient;
}
