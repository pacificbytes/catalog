"use client";

import { useState, useEffect } from "react";
import { updateUserAction } from "@/app/admin/users/actions";
import LoadingButton from "@/components/LoadingButton";
import ColorfulCard from "@/components/ColorfulCard";
import ColorfulBadge from "@/components/ColorfulBadge";

interface User {
	id: string;
	email: string;
	name: string;
	role: "admin" | "manager";
	is_active: boolean;
}

interface EditUserModalProps {
	isOpen: boolean;
	onClose: () => void;
	onUserUpdated: () => void;
	user: User | null;
}

export default function EditUserModal({ isOpen, onClose, onUserUpdated, user }: EditUserModalProps) {
	const [email, setEmail] = useState("");
	const [name, setName] = useState("");
	const [role, setRole] = useState<"admin" | "manager">("manager");
	const [isActive, setIsActive] = useState(true);
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Update form when user changes
	useEffect(() => {
		if (user) {
			setEmail(user.email);
			setName(user.name);
			setRole(user.role);
			setIsActive(user.is_active);
		}
	}, [user]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!user) return;

		setError(null);
		setLoading(true);

		try {
			const formData = new FormData();
			formData.append("id", user.id);
			formData.append("email", email);
			formData.append("name", name);
			formData.append("role", role);
			formData.append("is_active", isActive.toString());
			if (password) {
				formData.append("password", password);
			}

			const result = await updateUserAction(formData);
			if (result.success) {
				onUserUpdated();
				onClose();
			} else {
				setError("Failed to update user. Please try again.");
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to update user");
		} finally {
			setLoading(false);
		}
	};

	if (!isOpen || !user) return null;

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
						<h3 className="text-xl font-semibold">✏️ Edit User</h3>
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
								🔒 Account Status
							</label>
							<div className="flex items-center space-x-4">
								<label className="flex items-center space-x-2 cursor-pointer">
									<input
										type="radio"
										name="status"
										checked={isActive}
										onChange={() => setIsActive(true)}
										className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
									/>
									<span className="text-sm text-green-700">✅ Active</span>
								</label>
								<label className="flex items-center space-x-2 cursor-pointer">
									<input
										type="radio"
										name="status"
										checked={!isActive}
										onChange={() => setIsActive(false)}
										className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
									/>
									<span className="text-sm text-red-700">❌ Disabled</span>
								</label>
							</div>
						</div>

						<div>
							<label className="block text-sm font-medium text-slate-700 mb-2">
								🔑 New Password (Optional)
							</label>
							<input
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-400 transition-all duration-200 bg-white/80 backdrop-blur-sm"
								placeholder="Leave blank to keep current password"
								minLength={6}
							/>
							<p className="text-xs text-slate-500 mt-1">Leave blank to keep current password. Minimum 6 characters if changing.</p>
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
								{loading ? "Updating..." : "Update User"}
							</LoadingButton>
						</div>
					</form>

					<div className="mt-6 p-4 bg-slate-100 rounded-lg">
						<h4 className="font-medium text-slate-900 mb-2">Status Information:</h4>
						<div className="space-y-2">
							<div className="flex items-center space-x-2">
								<ColorfulBadge variant="green" size="sm">✅ Active</ColorfulBadge>
								<span className="text-sm text-slate-600">User can login and perform actions</span>
							</div>
							<div className="flex items-center space-x-2">
								<ColorfulBadge variant="red" size="sm">❌ Disabled</ColorfulBadge>
								<span className="text-sm text-slate-600">User cannot login or perform actions</span>
							</div>
						</div>
					</div>
				</div>
				</ColorfulCard>
			</div>
		</div>
	);
}
