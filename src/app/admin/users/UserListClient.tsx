"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LoadingButton from "@/components/LoadingButton";
import ColorfulBadge from "@/components/ColorfulBadge";
import EditUserModal from "@/components/EditUserModal";

interface User {
	id: string;
	email: string;
	name: string;
	role: "admin" | "manager";
	is_active: boolean;
}

interface UserListClientProps {
	users: User[];
}

export default function UserListClient({ users }: UserListClientProps) {
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [selectedUser, setSelectedUser] = useState<User | null>(null);
	const router = useRouter();

	const handleUserUpdated = () => {
		// Refresh the page to show the updated user
		router.refresh();
	};

	const handleEditUser = (user: User) => {
		setSelectedUser(user);
		setIsEditModalOpen(true);
	};

	return (
		<>
			<div className="space-y-3">
				{users.map((user) => (
					<div key={user.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
						<div className="flex items-center space-x-3">
							<div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
								<span className="text-sm font-semibold text-purple-600">
									{user.name.charAt(0).toUpperCase()}
								</span>
							</div>
							<div>
								<h4 className="font-medium text-slate-900">{user.name}</h4>
								<p className="text-sm text-slate-600">{user.email}</p>
							</div>
						</div>
						<div className="flex items-center space-x-2">
							<ColorfulBadge 
								variant={user.role === 'admin' ? 'purple' : 'green'} 
								size="sm"
							>
								{user.role === 'admin' ? '👑 Admin' : '👨‍💼 Manager'}
							</ColorfulBadge>
							<ColorfulBadge 
								variant={user.is_active ? 'green' : 'red'} 
								size="sm"
							>
								{user.is_active ? '✅ Active' : '❌ Disabled'}
							</ColorfulBadge>
							<LoadingButton 
								variant="secondary" 
								size="sm"
								onClick={() => handleEditUser(user)}
							>
								✏️ Edit
							</LoadingButton>
						</div>
					</div>
				))}
			</div>

			<EditUserModal
				isOpen={isEditModalOpen}
				onClose={() => {
					setIsEditModalOpen(false);
					setSelectedUser(null);
				}}
				onUserUpdated={handleUserUpdated}
				user={selectedUser}
			/>
		</>
	);
}
