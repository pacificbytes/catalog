"use client";

import { useRouter } from "next/navigation";
import { getBrowserClient } from "@/lib/supabase/client";

export default function SignOutButton() {
	const router = useRouter();
	const supabase = getBrowserClient();

	const handleSignOut = async () => {
		try {
			await supabase.auth.signOut();
			router.push("/login");
		} catch (error) {
			console.error("Signout error:", error);
			// Even if there's an error, redirect to login
			router.push("/login");
		}
	};

	return (
		<button 
			onClick={handleSignOut}
			className="text-sm text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100 transition-all duration-300 ease-out cursor-pointer hover:scale-105 hover:-translate-y-0.5 active:scale-95 active:translate-y-0"
		>
			Sign out
		</button>
	);
}
