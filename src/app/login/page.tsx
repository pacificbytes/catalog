"use client";

import { useState, useEffect } from "react";
import { getBrowserClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
	const router = useRouter();
	const supabase = getBrowserClient();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	// Check if user is already logged in
	useEffect(() => {
		const checkUser = async () => {
			const { data: { user } } = await supabase.auth.getUser();
			if (user) {
				router.push("/admin");
			}
		};
		checkUser();
	}, [router, supabase.auth]);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		setLoading(true);
		
		try {
			const { data, error } = await supabase.auth.signInWithPassword({ email, password });
			
			if (error) {
				setError(error.message);
				setLoading(false);
				return;
			}

			if (data.user) {
				// Wait a moment for auth state to propagate
				setTimeout(() => {
					router.push("/admin");
				}, 100);
			}
		} catch {
			setError("An unexpected error occurred");
			setLoading(false);
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center px-4 py-12">
			<div className="w-full max-w-md">
				<div className="text-center mb-8">
					<Link href="/" className="inline-flex items-center space-x-2 mb-6">
						<div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
							<span className="text-white font-bold">CP</span>
						</div>
						<span className="font-semibold text-xl">Chahar Printing Press</span>
					</Link>
					<h1 className="text-2xl font-bold text-slate-900">Admin Login</h1>
					<p className="text-slate-600 mt-2">Sign in to manage your products</p>
				</div>

				<div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
					<form onSubmit={onSubmit} className="space-y-6">
						<div>
							<label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
							<input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								placeholder="admin@example.com"
								required
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
							<input
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								placeholder="Enter your password"
								required
							/>
						</div>
						{error && (
							<div className="rounded-lg border border-red-200 bg-red-50 p-3">
								<p className="text-red-800 text-sm">{error}</p>
							</div>
						)}
						<button
							type="submit"
							disabled={loading}
							className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
						>
							{loading ? "Signing in..." : "Sign In"}
						</button>
					</form>
				</div>

				<div className="text-center mt-6">
					<Link href="/" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
						← Back to catalog
					</Link>
				</div>
			</div>
		</div>
	);
}
