import { NextResponse } from "next/server";
import { getAuthServerClient } from "@/lib/supabase/auth-server";

export async function POST() {
	const supabase = await getAuthServerClient();
	await supabase.auth.signOut();
	
	// Get the base URL from environment or construct it from headers
	const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
		process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
		"http://localhost:3000";
	
	return NextResponse.redirect(new URL("/login", baseUrl));
}
