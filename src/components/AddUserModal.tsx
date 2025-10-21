"use client";

import { useState } from "react";
import { createUserAction } from "@/app/admin/users/actions";
import LoadingButton from "@/components/LoadingButton";
import ColorfulCard from "@/components/ColorfulCard";
import ColorfulBadge from "@/components/ColorfulBadge";

interface AddUserModalProps {
	isOpen: boolean;
	onClose: () => void;
	onUserAdded: () => void;
}

export default function AddUserModal({ isOpen, onClose, onUserAdded }: AddUserModalProps) {
	const [email, setEmail] = useState("");
	const [name, setName] = useState("");
	const [role, setRole] = useState<"admin" | "manager">("manager");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setLoading(true);

		try {
			const formData = new FormData();
			formData.append("email", email);
			formData.append("name", name);
			formData.append("role", role);

			const result = await createUserAction(formData);
			if (result.success) {
				// Reset form
				setEmail("");
				setName("");
				setRole("manager");
				onUserAdded();
				onClose();
			} else {
				setError("Failed to create user. Please try again.");
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to create user");
		} finally {
			setLoading(false);
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			{/* Backdrop */}
			<div 
				className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-200" 
				onClick={onClose}
			></div>
			
			{/* Modal */}
			<div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-2xl">
				<ColorfulCard colorScheme="gradient" className="shadow-none border-0">
				<div className="p-6">
					<div className="flex items-center justify-between mb-6">
						<h3 className="text-xl font-semibold">➕ Add New User</h3>
						<button
							onClick={onClose}
							className="text-slate-500 hover:text-slate-700 text-2xl cursor-pointer"
						>
							×
						</button>
					</div>

					<form onSubmit={handleSubmit} className="space-y-4">
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
								placeholder="user@example.com"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-slate-700 mb-2">
								👤 Full Name
							</label>
							<input
								type="text"
								required
								value={name}
								onChange={(e) => setName(e.target.value)}
								className="w-full px-4 py-3 border-2 border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-400 transition-all duration-200 bg-white/80 backdrop-blur-sm"
								placeholder="John Doe"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-slate-700 mb-2">
								🎭 Role
							</label>
							<select
								value={role}
								onChange={(e) => setRole(e.target.value as "admin" | "manager")}
								className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-200 bg-white/80 backdrop-blur-sm"
							>
								<option value="manager">👨‍💼 Manager</option>
								<option value="admin">👑 Admin</option>
							</select>
						</div>

						<div>
							<label className="block text-sm font-medium text-slate-700 mb-2">
								📋 Instructions
							</label>
							<div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
								<p className="text-sm text-blue-800 mb-2">
									<strong>After creating this user:</strong>
								</p>
								<ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
									<li>Go to your Supabase Dashboard</li>
									<li>Navigate to Authentication → Users</li>
									<li>Click &quot;Add User&quot;</li>
									<li>Use the same email: <strong>{email || 'user@example.com'}</strong></li>
									<li>Set a password and confirm email</li>
								</ol>
								<p className="text-xs text-blue-600 mt-2">
									The user will be able to log in immediately after this step.
								</p>
							</div>
						</div>

						{error && (
							<div className="p-3 bg-red-100 border border-red-300 rounded-lg">
								<p className="text-red-700 text-sm">{error}</p>
							</div>
						)}

						<div className="flex space-x-3 pt-4">
							<LoadingButton
								type="button"
								variant="secondary"
								size="md"
								onClick={onClose}
								disabled={loading}
								className="flex-1"
							>
								Cancel
							</LoadingButton>
							<LoadingButton
								type="submit"
								variant="primary"
								size="md"
								loading={loading}
								disabled={loading}
								className="flex-1"
							>
								{loading ? "Creating..." : "Create User"}
							</LoadingButton>
						</div>
					</form>

					<div className="mt-6 p-4 bg-slate-100 rounded-lg">
						<h4 className="font-medium text-slate-900 mb-2">Role Permissions:</h4>
						<div className="space-y-2">
							<div className="flex items-center space-x-2">
								<ColorfulBadge variant="purple" size="sm">👑 Admin</ColorfulBadge>
								<span className="text-sm text-slate-600">Full access to everything</span>
							</div>
							<div className="flex items-center space-x-2">
								<ColorfulBadge variant="green" size="sm">👨‍💼 Manager</ColorfulBadge>
								<span className="text-sm text-slate-600">Product management only</span>
							</div>
						</div>
					</div>
				</div>
				</ColorfulCard>
			</div>
		</div>
	);
}
