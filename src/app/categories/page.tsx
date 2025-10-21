import { getServerClient } from "@/lib/supabase/server";
import ColorfulCard from "@/components/ColorfulCard";
import ColorfulBadge from "@/components/ColorfulBadge";
import Link from "next/link";

export default async function CategoriesPage() {
	const supabase = await getServerClient();
	
	// Fetch all products to extract categories and tags
	const { data: products } = await supabase
		.from('products')
		.select('categories, tags')
		.eq('status', 'published');

	// Extract unique categories
	const categories = Array.from(new Set(products?.flatMap(p => p.categories || []) || [])).filter(Boolean);
	
	// Extract all tags
	const allTags = products?.flatMap(p => p.tags || []).filter(Boolean) || [];
	const uniqueTags = Array.from(new Set(allTags));

	// Count products per category
	const categoryCounts: Record<string, number> = {};
	products?.forEach(product => {
		product.categories?.forEach((category: string) => {
			if (category) {
				categoryCounts[category] = (categoryCounts[category] || 0) + 1;
			}
		});
	});

	// Count products per tag
	const tagCounts: Record<string, number> = {};
	products?.forEach(product => {
		product.tags?.forEach((tag: string) => {
			if (tag) {
				tagCounts[tag] = (tagCounts[tag] || 0) + 1;
			}
		});
	});

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
			{/* Header */}
			<div className="bg-white shadow-sm border-b">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-3">
							<div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
								<span className="text-white font-bold text-lg">C</span>
							</div>
							<div>
								<h1 className="text-2xl font-bold text-gray-900">Categories & Tags</h1>
								<p className="text-sm text-gray-600">Browse our product categories and tags</p>
							</div>
						</div>
						<Link 
							href="/" 
							className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
						>
							← Back to Catalog
						</Link>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				{/* Categories Section */}
				<div className="mb-16">
					<div className="text-center mb-8">
						<h2 className="text-3xl font-bold text-gray-900 mb-4">Product Categories</h2>
						<p className="text-lg text-gray-600">
							Explore our products organized by category
						</p>
					</div>

					{categories.length > 0 ? (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{categories.map((category) => (
								<ColorfulCard key={category} className="p-6 hover:shadow-lg transition-all duration-200">
									<div className="text-center">
										<div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
											<span className="text-white text-2xl font-bold">
												{category.charAt(0).toUpperCase()}
											</span>
										</div>
										<h3 className="text-xl font-semibold text-gray-900 mb-2">
											{category}
										</h3>
										<p className="text-gray-600 mb-4">
											{categoryCounts[category]} product{categoryCounts[category] !== 1 ? 's' : ''}
										</p>
										<Link
											href={`/?category=${encodeURIComponent(category)}`}
											className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
										>
											View Products
										</Link>
									</div>
								</ColorfulCard>
							))}
						</div>
					) : (
						<ColorfulCard className="p-8 text-center">
							<div className="text-gray-500">
								<svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
									<path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
								</svg>
								<h3 className="text-lg font-semibold mb-2">No Categories Available</h3>
								<p>Categories will appear here once products are added to the catalog.</p>
							</div>
						</ColorfulCard>
					)}
				</div>

				{/* Tags Section */}
				<div>
					<div className="text-center mb-8">
						<h2 className="text-3xl font-bold text-gray-900 mb-4">Product Tags</h2>
						<p className="text-lg text-gray-600">
							Browse products by tags and keywords
						</p>
					</div>

					{uniqueTags.length > 0 ? (
						<ColorfulCard className="p-8">
							<div className="flex flex-wrap gap-3">
								{uniqueTags.map((tag) => (
									<Link
										key={tag}
										href={`/?tag=${encodeURIComponent(tag)}`}
										className="group"
									>
										<ColorfulBadge className="group-hover:shadow-lg transition-all duration-200">
											{tag} ({tagCounts[tag]})
										</ColorfulBadge>
									</Link>
								))}
							</div>
						</ColorfulCard>
					) : (
						<ColorfulCard className="p-8 text-center">
							<div className="text-gray-500">
								<svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
									<path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
								</svg>
								<h3 className="text-lg font-semibold mb-2">No Tags Available</h3>
								<p>Tags will appear here once products with tags are added to the catalog.</p>
							</div>
						</ColorfulCard>
					)}
				</div>

				{/* Quick Actions */}
				<div className="mt-16">
					<ColorfulCard className="p-8">
						<div className="text-center">
							<h3 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h3>
							<div className="flex flex-wrap justify-center gap-4">
								<Link
									href="/"
									className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
								>
									View All Products
								</Link>
								<Link
									href="/contact"
									className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
								>
									Contact Us
								</Link>
							</div>
						</div>
					</ColorfulCard>
				</div>
			</div>

		</div>
	);
}
