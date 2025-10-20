import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getServerClient } from "@/lib/supabase/server";
import { env } from "@/lib/env";
import Link from "next/link";

export default async function AdminLayout({ children }: { children: ReactNode }) {
	const supabase = await getServerClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user || (env.adminEmail && user.email !== env.adminEmail)) {
		redirect("/login");
	}

	return (
		<div className="min-h-screen bg-slate-50">
			<div className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
				<div className="container mx-auto px-4">
					<div className="flex items-center justify-between h-16">
						<div className="flex items-center space-x-8">
							<Link href="/admin" className="flex items-center space-x-2">
								<div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
									<span className="text-white font-bold text-sm">A</span>
								</div>
								<span className="text-xl font-semibold text-slate-900">Admin Panel</span>
							</Link>
							<nav className="flex space-x-1">
								<Link href="/admin" className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors">
									Dashboard
								</Link>
								<Link href="/admin/products" className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors">
									Products
								</Link>
								<Link href="/admin/products/new" className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors">
									Add Product
								</Link>
							</nav>
						</div>
						<div className="flex items-center space-x-4">
							<div className="text-sm text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
								{user.email}
							</div>
							<form action="/auth/signout" method="post">
								<button className="text-sm text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors" type="submit">
									Sign out
								</button>
							</form>
						</div>
					</div>
				</div>
			</div>
			<div className="container mx-auto px-4 py-8">
				{children}
			</div>
		</div>
	);
}
