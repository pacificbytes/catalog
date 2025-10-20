import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getServerClient } from "@/lib/supabase/server";

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	
	// Skip middleware for static files and API routes
	if (
		pathname.startsWith("/_next") ||
		pathname.startsWith("/api") ||
		pathname.includes(".")
	) {
		return NextResponse.next();
	}

	// Handle admin routes
	if (pathname.startsWith("/admin")) {
		try {
			const supabase = await getServerClient();
			const { data: { user } } = await supabase.auth.getUser();
			
			if (!user) {
				return NextResponse.redirect(new URL("/login", request.url));
			}
		} catch (error) {
			console.error("Auth middleware error:", error);
			return NextResponse.redirect(new URL("/login", request.url));
		}
	}

	// Handle login page - redirect if already authenticated
	if (pathname === "/login") {
		try {
			const supabase = await getServerClient();
			const { data: { user } } = await supabase.auth.getUser();
			
			if (user) {
				return NextResponse.redirect(new URL("/admin", request.url));
			}
		} catch (error) {
			console.error("Auth middleware error:", error);
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		"/((?!_next/static|_next/image|favicon.ico).*)",
	],
};
