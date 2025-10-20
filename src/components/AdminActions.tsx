"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getBrowserClient } from "@/lib/supabase/client";

interface AdminActionsProps {
	productId: string;
	productName: string;
	className?: string;
}

export default function AdminActions({ productId, productName, className = "" }: AdminActionsProps) {
	const router = useRouter();
	const supabase = getBrowserClient();
	const [isDeleting, setIsDeleting] = useState(false);

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
			<button
				onClick={handleEdit}
				className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
				title="Edit product"
			>
				Edit
			</button>
			<button
				onClick={handleDelete}
				disabled={isDeleting}
				className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-md hover:bg-red-200 disabled:opacity-50 transition-colors"
				title="Delete product"
			>
				{isDeleting ? "Deleting..." : "Delete"}
			</button>
		</div>
	);
}
