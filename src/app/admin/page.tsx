import Link from "next/link";
import { getServerClient } from "@/lib/supabase/server";
import ColorfulCard from "@/components/ColorfulCard";
import ColorfulBadge from "@/components/ColorfulBadge";

async function getDashboardStats() {
	const supabase = await getServerClient();
	
	// Get total products
	const { count: totalProducts } = await supabase
		.from("products")
		.select("*", { count: "exact", head: true });
	
	// Get published products
	const { count: publishedProducts } = await supabase
		.from("products")
		.select("*", { count: "exact", head: true })
		.eq("status", "published");
	
	// Get draft products
	const { count: draftProducts } = await supabase
		.from("products")
		.select("*", { count: "exact", head: true })
		.eq("status", "draft");
	
	// Get archived products
	const { count: archivedProducts } = await supabase
		.from("products")
		.select("*", { count: "exact", head: true })
		.eq("status", "archived");
	
	// Get recent products
	const { data: recentProducts } = await supabase
		.from("products")
		.select("id, name, status, created_at")
		.order("created_at", { ascending: false })
		.limit(5);
	
	// Get all categories and tags
	const { data: allProducts } = await supabase
		.from("products")
		.select("categories, tags");
	
	const allCategories = Array.from(new Set(allProducts?.flatMap(p => p.categories || []) || [])).filter(Boolean);
	const allTags = Array.from(new Set(allProducts?.flatMap(p => p.tags || []) || [])).filter(Boolean);
	
	// Try to get user stats, but don't fail if users table doesn't exist
	let totalUsers = 0;
	try {
		const { count: userCount } = await supabase
			.from("users")
			.select("*", { count: "exact", head: true });
		totalUsers = userCount || 0;
	} catch {
		// Users table doesn't exist yet, that's okay
		totalUsers = 0;
	}
	
	return {
		totalProducts: totalProducts || 0,
		publishedProducts: publishedProducts || 0,
		draftProducts: draftProducts || 0,
		archivedProducts: archivedProducts || 0,
		recentProducts: recentProducts || [],
		totalCategories: allCategories.length,
		totalTags: allTags.length,
		totalUsers
	};
}

export default async function AdminHome() {
	const stats = await getDashboardStats();
	
	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-2xl font-semibold">📊 Admin Dashboard</h2>
				<p className="text-gray-600">Welcome to Chahar Printing Press admin panel</p>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<ColorfulCard colorScheme="blue" className="p-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-slate-600">Total Products</p>
							<p className="text-2xl font-bold text-slate-900">{stats.totalProducts}</p>
						</div>
						<div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
							<span className="text-2xl">📦</span>
						</div>
					</div>
				</ColorfulCard>

				<ColorfulCard colorScheme="green" className="p-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-slate-600">Published</p>
							<p className="text-2xl font-bold text-slate-900">{stats.publishedProducts}</p>
						</div>
						<div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
							<span className="text-2xl">✅</span>
						</div>
					</div>
				</ColorfulCard>

				<ColorfulCard colorScheme="orange" className="p-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-slate-600">Drafts</p>
							<p className="text-2xl font-bold text-slate-900">{stats.draftProducts}</p>
						</div>
						<div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
							<span className="text-2xl">📝</span>
						</div>
					</div>
				</ColorfulCard>

				<ColorfulCard colorScheme="purple" className="p-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-slate-600">Archived</p>
							<p className="text-2xl font-bold text-slate-900">{stats.archivedProducts}</p>
						</div>
						<div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
							<span className="text-2xl">📦</span>
						</div>
					</div>
				</ColorfulCard>
			</div>

			{/* Quick Actions */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				<Link href="/admin/products/new" className="group">
					<ColorfulCard colorScheme="gradient" className="p-6 transition-colors">
						<div className="flex items-center space-x-4">
							<div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
								<span className="text-2xl">➕</span>
							</div>
							<div>
								<h3 className="text-lg font-semibold group-hover:text-blue-600 transition-colors">Add Product</h3>
								<p className="text-sm text-gray-600">Create a new product with images and details</p>
							</div>
						</div>
					</ColorfulCard>
				</Link>

				<Link href="/admin/products" className="group">
					<ColorfulCard colorScheme="gradient" className="p-6 transition-colors">
						<div className="flex items-center space-x-4">
							<div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
								<span className="text-2xl">📋</span>
							</div>
							<div>
								<h3 className="text-lg font-semibold group-hover:text-green-600 transition-colors">Manage Products</h3>
								<p className="text-sm text-gray-600">View, edit, and organize your products</p>
							</div>
						</div>
					</ColorfulCard>
				</Link>

				<Link href="/admin/categories" className="group">
					<ColorfulCard colorScheme="gradient" className="p-6 transition-colors">
						<div className="flex items-center space-x-4">
							<div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
								<span className="text-2xl">🏷️</span>
							</div>
							<div>
								<h3 className="text-lg font-semibold group-hover:text-purple-600 transition-colors">Categories & Tags</h3>
								<p className="text-sm text-gray-600">Manage product categories and tags</p>
							</div>
						</div>
					</ColorfulCard>
				</Link>
			</div>

			{/* Recent Products */}
			<ColorfulCard colorScheme="blue" className="p-6">
				<h3 className="text-lg font-semibold mb-4 flex items-center">
					<span className="mr-2">🕒</span>
					Recent Products
				</h3>
				{stats.recentProducts.length > 0 ? (
					<div className="space-y-3">
						{stats.recentProducts.map((product) => (
							<div key={product.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
								<div>
									<h4 className="font-medium text-slate-900">{product.name}</h4>
									<p className="text-sm text-slate-600">
										{new Date(product.created_at).toLocaleDateString()}
									</p>
								</div>
								<div className="flex items-center space-x-2">
									<ColorfulBadge 
										variant={
											product.status === 'published' ? 'green' :
											product.status === 'draft' ? 'yellow' : 'red'
										}
										size="sm"
									>
										{product.status}
									</ColorfulBadge>
									<Link 
										href={`/admin/products/${product.id}`}
										className="text-blue-600 hover:text-blue-800 text-sm cursor-pointer"
									>
										Edit
									</Link>
								</div>
							</div>
						))}
					</div>
				) : (
					<p className="text-slate-600">No products yet. <Link href="/admin/products/new" className="text-blue-600 hover:text-blue-800 cursor-pointer">Create your first product</Link></p>
				)}
			</ColorfulCard>

			{/* Quick Stats */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<ColorfulCard colorScheme="green" className="p-6">
					<h3 className="text-lg font-semibold mb-3 flex items-center">
						<span className="mr-2">📊</span>
						Content Stats
					</h3>
					<div className="space-y-2">
						<div className="flex justify-between">
							<span className="text-slate-600">Categories:</span>
							<span className="font-medium">{stats.totalCategories}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-slate-600">Tags:</span>
							<span className="font-medium">{stats.totalTags}</span>
						</div>
					</div>
				</ColorfulCard>

				<ColorfulCard colorScheme="purple" className="p-6">
					<h3 className="text-lg font-semibold mb-3 flex items-center">
						<span className="mr-2">⚡</span>
						Quick Actions
					</h3>
					<div className="space-y-2">
						<Link href="/admin/products?status=draft" className="block text-blue-600 hover:text-blue-800 cursor-pointer">
							📝 View Drafts
						</Link>
						<Link href="/admin/products?status=published" className="block text-green-600 hover:text-green-800 cursor-pointer">
							✅ View Published
						</Link>
						<Link href="/admin/products?status=archived" className="block text-red-600 hover:text-red-800 cursor-pointer">
							📦 View Archived
						</Link>
					</div>
				</ColorfulCard>
			</div>
		</div>
	);
}
