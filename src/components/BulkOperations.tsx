"use client";

import { useState } from "react";
import ColorfulCard from "@/components/ColorfulCard";
import ColorfulBadge from "@/components/ColorfulBadge";
import LoadingButton from "@/components/LoadingButton";

interface BulkOperationsProps {
	selectedProducts: string[];
	onSelectionChange: (productIds: string[]) => void;
	onBulkAction: (action: string, productIds: string[]) => Promise<void>;
}

export default function BulkOperations({ selectedProducts, onSelectionChange, onBulkAction }: BulkOperationsProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [action, setAction] = useState("");

	const handleBulkAction = async () => {
		if (!action || selectedProducts.length === 0) return;
		
		setIsLoading(true);
		try {
			await onBulkAction(action, selectedProducts);
			onSelectionChange([]); // Clear selection after action
		} catch (error) {
			console.error("Bulk action failed:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const selectAll = () => {
		// This would need to be implemented with all product IDs
		// For now, we'll just show the interface
	};

	const clearSelection = () => {
		onSelectionChange([]);
	};

	if (selectedProducts.length === 0) {
		return (
			<ColorfulCard colorScheme="gradient" className="p-4">
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-4">
						<span className="text-sm text-slate-600">Select products to perform bulk actions</span>
					</div>
					<LoadingButton 
						variant="secondary" 
						size="sm" 
						onClick={selectAll}
					>
						📋 Select All
					</LoadingButton>
				</div>
			</ColorfulCard>
		);
	}

	return (
		<ColorfulCard colorScheme="blue" className="p-4">
			<div className="flex items-center justify-between">
				<div className="flex items-center space-x-4">
					<ColorfulBadge variant="blue" size="md" animated>
						{selectedProducts.length} selected
					</ColorfulBadge>
					<span className="text-sm text-slate-600">Bulk actions available</span>
				</div>
				
				<div className="flex items-center space-x-3">
					<select 
						value={action}
						onChange={(e) => setAction(e.target.value)}
						className="px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all duration-200 bg-white/80 backdrop-blur-sm"
					>
						<option value="">Choose action...</option>
						<option value="publish">✅ Publish</option>
						<option value="draft">📝 Move to Draft</option>
						<option value="archive">📦 Archive</option>
						<option value="delete">🗑️ Delete</option>
					</select>
					
					<LoadingButton 
						variant="primary" 
						size="sm" 
						onClick={handleBulkAction}
						disabled={!action || isLoading}
						loading={isLoading}
					>
						🚀 Apply
					</LoadingButton>
					
					<LoadingButton 
						variant="secondary" 
						size="sm" 
						onClick={clearSelection}
					>
						❌ Clear
					</LoadingButton>
				</div>
			</div>
		</ColorfulCard>
	);
}
