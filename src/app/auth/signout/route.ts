import { NextResponse } from "next/server";
import { getAuthServerClient } from "@/lib/supabase/auth-server";

export async function POST() {
	const supabase = await getAuthServerClient();
	await supabase.auth.signOut();
	return NextResponse.redirect(new URL("/login", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"));
}
