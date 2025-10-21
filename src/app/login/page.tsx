"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "./actions";
import LoadingButton from "@/components/LoadingButton";
import ColorfulCard from "@/components/ColorfulCard";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	useEffect(() => {
		// Check if user is already logged in
		const checkAuth = async () => {
			try {
				const response = await fetch("/api/auth/check");
				if (response.ok) {
					router.push("/admin");
				}
			} catch {
				// User not logged in, continue with login form
			}
		};
		checkAuth();
	}, [router]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setLoading(true);

		try {
			const formData = new FormData();
			formData.append("email", email);
			formData.append("password", password);

			await loginAction(formData);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Login failed. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
			<ColorfulCard colorScheme="gradient" className="w-full max-w-md">
				<div className="p-8">
					<div className="text-center mb-8">
						<div className="h-16 w-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
							<span className="text-white font-bold text-2xl">🔐</span>
						</div>
						<h1 className="text-3xl font-bold text-slate-900 mb-2">Admin Login</h1>
						<p className="text-slate-600">Sign in to access the admin panel</p>
					</div>

					<form onSubmit={handleSubmit} className="space-y-6">
						<div>
							<label className="block text-sm font-medium text-slate-700 mb-2">
								📧 Email Address
							</label>
							<input
								type="email"
								required
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all duration-200 bg-white/80 backdrop-blur-sm"
								placeholder="admin@example.com"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-slate-700 mb-2">
								🔒 Password
							</label>
							<input
								type="password"
								required
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-200 bg-white/80 backdrop-blur-sm"
								placeholder="Enter your password"
							/>
						</div>

						{error && (
							<div className="p-3 bg-red-100 border border-red-300 rounded-lg">
								<p className="text-red-700 text-sm">{error}</p>
							</div>
						)}

						<LoadingButton
							type="submit"
							variant="primary"
							size="lg"
							loading={loading}
							disabled={loading}
							className="w-full"
						>
							{loading ? "Signing in..." : "Sign In"}
						</LoadingButton>
					</form>

					<div className="mt-6 text-center">
						<button
							onClick={() => router.push("/")}
							className="text-sm text-slate-600 hover:text-slate-900 cursor-pointer"
						>
							← Back to Catalog
						</button>
					</div>

					<div className="mt-6 p-4 bg-slate-100 rounded-lg">
						<h4 className="font-medium text-slate-900 mb-2">Admin Access:</h4>
						<ul className="text-sm text-slate-600 space-y-1">
							<li>✅ Create, edit, and delete products</li>
							<li>✅ Manage categories and tags</li>
							<li>✅ Export data</li>
							<li>✅ View audit logs</li>
							<li>✅ Manage users (Admin only)</li>
						</ul>
					</div>
				</div>
			</ColorfulCard>
		</div>
	);
}
