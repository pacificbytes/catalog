"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LoadingButton from "@/components/LoadingButton";
import AddUserModal from "@/components/AddUserModal";

export default function UserManagementClient() {
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);
	const router = useRouter();

	const handleUserAdded = () => {
		// Refresh the page to show the new user
		router.refresh();
	};

	return (
		<>
			<LoadingButton 
				variant="primary" 
				size="md"
				onClick={() => setIsAddModalOpen(true)}
			>
				➕ Add User
			</LoadingButton>

			<AddUserModal
				isOpen={isAddModalOpen}
				onClose={() => setIsAddModalOpen(false)}
				onUserAdded={handleUserAdded}
			/>
		</>
	);
}
