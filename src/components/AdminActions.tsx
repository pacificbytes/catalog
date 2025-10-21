"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getBrowserClient } from "@/lib/supabase/client";
import LoadingButton from "./LoadingButton";
import { useUserRole } from "@/lib/auth-client";

interface AdminActionsProps {
	productId: string;
	productName: string;
	className?: string;
}

export default function AdminActions({ productId, productName, className = "" }: AdminActionsProps) {
	const router = useRouter();
	const supabase = getBrowserClient();
	const [isDeleting, setIsDeleting] = useState(false);
	const userRole = useUserRole();

	const handleEdit = () => {
		router.push(`/admin/products/${productId}`);
	};

	const handleDelete = async () => {
		if (!confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
			return;
		}

		setIsDeleting(true);
		try {
			// Delete product images first
			await supabase.from("product_images").delete().eq("product_id", productId);
			
			// Delete the product
			const { error } = await supabase.from("products").delete().eq("id", productId);
			
			if (error) {
				alert(`Error deleting product: ${error.message}`);
				return;
			}

			// Refresh the page or redirect
			window.location.reload();
		} catch {
			alert("An error occurred while deleting the product");
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<div className={`flex gap-2 ${className}`}>
			<LoadingButton
				onClick={handleEdit}
				variant="primary"
				size="sm"
				className="shadow-md hover:shadow-lg"
			>
				✏️ Edit
			</LoadingButton>
			{userRole === 'admin' && (
				<LoadingButton
					onClick={handleDelete}
					loading={isDeleting}
					loadingText="Deleting..."
					variant="danger"
					size="sm"
					className="shadow-md hover:shadow-lg"
				>
					🗑️ Delete
				</LoadingButton>
			)}
		</div>
	);
}
