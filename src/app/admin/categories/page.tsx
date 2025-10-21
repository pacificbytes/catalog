import { getServerClient } from "@/lib/supabase/server";
import ColorfulCard from "@/components/ColorfulCard";
import ColorfulBadge from "@/components/ColorfulBadge";

async function getCategoriesAndTags() {
	const supabase = await getServerClient();
	
	// Get all products with categories and tags
	const { data: products } = await supabase
		.from("products")
		.select("id, name, categories, tags");
	
	// Extract unique categories and tags
	const allCategories = Array.from(new Set(products?.flatMap(p => p.categories || []) || [])).filter(Boolean);
	const allTags = Array.from(new Set(products?.flatMap(p => p.tags || []) || [])).filter(Boolean);
	
	// Count usage for each category and tag
	const categoryCounts = allCategories.map(category => ({
		name: category,
		count: products?.filter(p => p.categories?.includes(category)).length || 0
	}));
	
	const tagCounts = allTags.map(tag => ({
		name: tag,
		count: products?.filter(p => p.tags?.includes(tag)).length || 0
	}));
	
	return {
		categories: categoryCounts.sort((a, b) => b.count - a.count),
		tags: tagCounts.sort((a, b) => b.count - a.count),
		totalProducts: products?.length || 0
	};
}

export default async function CategoriesPage() {
	const { categories, tags, totalProducts } = await getCategoriesAndTags();
	
	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-2xl font-semibold">🏷️ Categories & Tags Management</h2>
				<p className="text-gray-600">Organize your product catalog with categories and tags</p>
			</div>

			{/* Stats */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<ColorfulCard colorScheme="blue" className="p-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-slate-600">Total Products</p>
							<p className="text-2xl font-bold text-slate-900">{totalProducts}</p>
						</div>
						<div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
							<span className="text-2xl">📦</span>
						</div>
					</div>
				</ColorfulCard>

				<ColorfulCard colorScheme="purple" className="p-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-slate-600">Categories</p>
							<p className="text-2xl font-bold text-slate-900">{categories.length}</p>
						</div>
						<div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
							<span className="text-2xl">🏷️</span>
						</div>
					</div>
				</ColorfulCard>

				<ColorfulCard colorScheme="green" className="p-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-slate-600">Tags</p>
							<p className="text-2xl font-bold text-slate-900">{tags.length}</p>
						</div>
						<div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
							<span className="text-2xl">🏷️</span>
						</div>
					</div>
				</ColorfulCard>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Categories */}
				<ColorfulCard colorScheme="purple" className="p-6">
					<h3 className="text-lg font-semibold mb-4 flex items-center">
						<span className="mr-2">📂</span>
						Categories ({categories.length})
					</h3>
					{categories.length > 0 ? (
						<div className="space-y-3">
							{categories.map((category) => (
								<div key={category.name} className="flex items-center justify-between p-3 bg-white rounded-lg border">
									<div className="flex items-center space-x-3">
										<ColorfulBadge variant="blue" size="md">
											{category.name}
										</ColorfulBadge>
										<span className="text-sm text-slate-600">
											{category.count} product{category.count !== 1 ? 's' : ''}
										</span>
									</div>
									<div className="flex items-center space-x-2">
										<span className="text-xs text-slate-500">
											{Math.round((category.count / totalProducts) * 100)}%
										</span>
										<div className="w-16 bg-gray-200 rounded-full h-2">
											<div 
												className="bg-blue-500 h-2 rounded-full" 
												style={{ width: `${(category.count / totalProducts) * 100}%` }}
											></div>
										</div>
									</div>
								</div>
							))}
						</div>
					) : (
						<div className="text-center py-8">
							<div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
								<span className="text-2xl">📂</span>
							</div>
							<p className="text-gray-500 mb-4">No categories yet</p>
							<p className="text-sm text-gray-400">Categories will appear here when you add them to products</p>
						</div>
					)}
				</ColorfulCard>

				{/* Tags */}
				<ColorfulCard colorScheme="green" className="p-6">
					<h3 className="text-lg font-semibold mb-4 flex items-center">
						<span className="mr-2">🏷️</span>
						Tags ({tags.length})
					</h3>
					{tags.length > 0 ? (
						<div className="space-y-3">
							{tags.map((tag) => (
								<div key={tag.name} className="flex items-center justify-between p-3 bg-white rounded-lg border">
									<div className="flex items-center space-x-3">
										<ColorfulBadge variant="green" size="md">
											{tag.name}
										</ColorfulBadge>
										<span className="text-sm text-slate-600">
											{tag.count} product{tag.count !== 1 ? 's' : ''}
										</span>
									</div>
									<div className="flex items-center space-x-2">
										<span className="text-xs text-slate-500">
											{Math.round((tag.count / totalProducts) * 100)}%
										</span>
										<div className="w-16 bg-gray-200 rounded-full h-2">
											<div 
												className="bg-green-500 h-2 rounded-full" 
												style={{ width: `${(tag.count / totalProducts) * 100}%` }}
											></div>
										</div>
									</div>
								</div>
							))}
						</div>
					) : (
						<div className="text-center py-8">
							<div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
								<span className="text-2xl">🏷️</span>
							</div>
							<p className="text-gray-500 mb-4">No tags yet</p>
							<p className="text-sm text-gray-400">Tags will appear here when you add them to products</p>
						</div>
					)}
				</ColorfulCard>
			</div>

			{/* Usage Tips */}
			<ColorfulCard colorScheme="gradient" className="p-6">
				<h3 className="text-lg font-semibold mb-4 flex items-center">
					<span className="mr-2">💡</span>
					Usage Tips
				</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<h4 className="font-medium text-slate-900 mb-2 flex items-center">
							<span className="mr-2">📂</span>
							Categories
						</h4>
						<ul className="text-sm text-slate-600 space-y-1">
							<li>• Use broad, hierarchical groupings</li>
							<li>• Examples: &quot;Printing Services&quot;, &quot;Paper Products&quot;</li>
							<li>• Keep categories limited (5-10 max)</li>
							<li>• Use for main product classification</li>
						</ul>
					</div>
					<div>
						<h4 className="font-medium text-slate-900 mb-2 flex items-center">
							<span className="mr-2">🏷️</span>
							Tags
						</h4>
						<ul className="text-sm text-slate-600 space-y-1">
							<li>• Use specific, descriptive keywords</li>
							<li>• Examples: &quot;eco-friendly&quot;, &quot;premium&quot;, &quot;bulk&quot;</li>
							<li>• Can have many tags per product</li>
							<li>• Use for detailed filtering</li>
						</ul>
					</div>
				</div>
			</ColorfulCard>
		</div>
	);
}
