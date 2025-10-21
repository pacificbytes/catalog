"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import ColorfulCard from "@/components/ColorfulCard";

interface SearchFiltersProps {
	allCategories: string[];
	allTags: string[];
	initialParams: {
		q?: string;
		sort?: string;
		category?: string;
		tag?: string;
	};
}

export default function SearchFilters({ allCategories, allTags, initialParams }: SearchFiltersProps) {
	const router = useRouter();
	const [searchTerm, setSearchTerm] = useState(initialParams.q || "");
	const [sortBy, setSortBy] = useState(initialParams.sort || "new");
	const [selectedCategory, setSelectedCategory] = useState(initialParams.category || "");
	const [selectedTag, setSelectedTag] = useState(initialParams.tag || "");
	const isInitialMount = useRef(true);

	// Auto-submit when filters change (except search term)
	useEffect(() => {
		// Skip the initial mount to prevent auto-submission on component load
		if (isInitialMount.current) {
			isInitialMount.current = false;
			return;
		}

		const params = new URLSearchParams();
		
		// Include current search term in URL but don't trigger on search term changes
		if (searchTerm.trim()) params.set("q", searchTerm.trim());
		if (sortBy !== "new") params.set("sort", sortBy);
		if (selectedCategory) params.set("category", selectedCategory);
		if (selectedTag) params.set("tag", selectedTag);
		
		const queryString = params.toString();
		const newUrl = queryString ? `/?${queryString}` : "/";
		
		router.push(newUrl);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [sortBy, selectedCategory, selectedTag, router]); // Intentionally excluding searchTerm

	const handleSearch = () => {
		const params = new URLSearchParams();
		
		if (searchTerm.trim()) params.set("q", searchTerm.trim());
		if (sortBy !== "new") params.set("sort", sortBy);
		if (selectedCategory) params.set("category", selectedCategory);
		if (selectedTag) params.set("tag", selectedTag);
		
		const queryString = params.toString();
		const newUrl = queryString ? `/?${queryString}` : "/";
		
		router.push(newUrl);
	};

	const clearFilters = () => {
		setSearchTerm("");
		setSortBy("new");
		setSelectedCategory("");
		setSelectedTag("");
		router.push("/");
	};

	const hasActiveFilters = searchTerm || sortBy !== "new" || selectedCategory || selectedTag;

	return (
		<ColorfulCard colorScheme="gradient" className="p-4">
			<div className="space-y-3">
				{/* Search Input */}
				<div className="flex flex-col sm:flex-row gap-3">
					<div className="flex-1">
						<input 
							type="text"
							placeholder="🔍 Search products..." 
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
							className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-400 transition-colors bg-white hover:border-blue-300" 
						/>
					</div>
					<div className="sm:w-40">
						<select 
							value={sortBy}
							onChange={(e) => setSortBy(e.target.value)}
							className="w-full px-3 py-2 border border-purple-200 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-400 transition-colors bg-white hover:border-purple-300"
						>
							<option value="new">🆕 Newest</option>
							<option value="price_asc">💰 Low-High</option>
							<option value="price_desc">💎 High-Low</option>
						</select>
					</div>
					<button 
						type="button"
						onClick={handleSearch}
						className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:from-blue-700 hover:to-purple-700 transition-colors font-medium text-sm"
					>
						🚀 Search
					</button>
				</div>
				
				{/* Category and Tag Filters */}
				{(allCategories.length > 0 || allTags.length > 0) && (
					<div className="flex flex-col sm:flex-row gap-3">
						{allCategories.length > 0 && (
							<div className="sm:w-40">
								<select 
									value={selectedCategory}
									onChange={(e) => setSelectedCategory(e.target.value)}
									className="w-full px-3 py-2 border border-green-200 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-400 transition-colors bg-white hover:border-green-300"
								>
									<option value="">🏷️ All Categories</option>
									{allCategories.map(category => (
										<option key={category} value={category}>{category}</option>
									))}
								</select>
							</div>
						)}
						{allTags.length > 0 && (
							<div className="sm:w-40">
								<select 
									value={selectedTag}
									onChange={(e) => setSelectedTag(e.target.value)}
									className="w-full px-3 py-2 border border-orange-200 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-400 transition-colors bg-white hover:border-orange-300"
								>
									<option value="">🏷️ All Tags</option>
									{allTags.map(tag => (
										<option key={tag} value={tag}>{tag}</option>
									))}
								</select>
							</div>
						)}
						{hasActiveFilters && (
							<button 
								type="button"
								onClick={clearFilters}
								className="px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-md hover:from-blue-600 hover:to-blue-700 transition-colors font-medium text-sm"
							>
								🗑️ Clear Filters
							</button>
						)}
					</div>
				)}
			</div>
		</ColorfulCard>
	);
}
