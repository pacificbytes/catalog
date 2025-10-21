import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getServerClient } from "@/lib/supabase/server";
import Link from "next/link";
import { isManager, isAdmin } from "@/lib/auth";
import SignOutButton from "./SignOutButton";

export default async function AdminLayout({ children }: { children: ReactNode }) {
	const userIsManager = await isManager();
	if (!userIsManager) {
		redirect("/login");
	}

	const userIsAdmin = await isAdmin();
	const supabase = await getServerClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	return (
		<div className="min-h-screen bg-slate-50">
			<div className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
				<div className="container mx-auto px-4">
					<div className="flex items-center justify-between h-16">
						<div className="flex items-center space-x-8">
							<Link href="/admin" className="flex items-center space-x-2 cursor-pointer">
								<div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
									<span className="text-white font-bold text-sm">A</span>
								</div>
								<span className="text-xl font-semibold text-slate-900">Admin Panel</span>
							</Link>
							<nav className="flex space-x-1">
								<Link href="/admin" className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all duration-300 ease-out cursor-pointer hover:scale-105 hover:-translate-y-0.5 active:scale-95 active:translate-y-0">
									📊 Dashboard
								</Link>
								<Link href="/admin/products" className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all duration-300 ease-out cursor-pointer hover:scale-105 hover:-translate-y-0.5 active:scale-95 active:translate-y-0">
									📋 Products
								</Link>
								<Link href="/admin/products/new" className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all duration-300 ease-out cursor-pointer hover:scale-105 hover:-translate-y-0.5 active:scale-95 active:translate-y-0">
									➕ Add Product
								</Link>
								<Link href="/admin/categories" className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all duration-300 ease-out cursor-pointer hover:scale-105 hover:-translate-y-0.5 active:scale-95 active:translate-y-0">
									🏷️ Categories
								</Link>
								{userIsAdmin && (
									<>
										<Link href="/admin/users" className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all duration-300 ease-out cursor-pointer hover:scale-105 hover:-translate-y-0.5 active:scale-95 active:translate-y-0">
											👥 Users
										</Link>
										<Link href="/admin/settings" className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all duration-300 ease-out cursor-pointer hover:scale-105 hover:-translate-y-0.5 active:scale-95 active:translate-y-0">
											⚙️ Settings
										</Link>
									</>
								)}
							</nav>
						</div>
						<div className="flex items-center space-x-4">
							<div className="text-sm text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
								{user?.email || 'Unknown'}
							</div>
							<SignOutButton />
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
