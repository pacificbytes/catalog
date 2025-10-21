import Link from "next/link";
import { getServerClient } from "@/lib/supabase/server";
import { exportCsvAction, exportJsonAction } from "./actions";
import ColorfulCard from "@/components/ColorfulCard";
import ColorfulBadge from "@/components/ColorfulBadge";
import LoadingButton from "@/components/LoadingButton";

export default async function AdminProductsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
	const resolvedSearchParams = await searchParams;
	const supabase = await getServerClient();
	const q = typeof resolvedSearchParams.q === "string" ? resolvedSearchParams.q : "";
	const status = typeof resolvedSearchParams.status === "string" ? resolvedSearchParams.status : "";
	const category = typeof resolvedSearchParams.category === "string" ? resolvedSearchParams.category : "";
	const tag = typeof resolvedSearchParams.tag === "string" ? resolvedSearchParams.tag : "";
	const sort = typeof resolvedSearchParams.sort === "string" ? resolvedSearchParams.sort : "created_at";
	const order = typeof resolvedSearchParams.order === "string" ? resolvedSearchParams.order : "desc";
	
	// Try to include user data, but fallback to basic query if users table doesn't exist
	let query;
	try {
		query = supabase.from("products").select("id, name, slug, price_rupees, status, categories, tags, created_at, updated_at, created_by, updated_by, created_by_user:created_by(name), updated_by_user:updated_by(name)").order(sort, { ascending: order === "asc" });
	} catch {
		// Users table doesn't exist yet, use basic query
		query = supabase.from("products").select("id, name, slug, price_rupees, status, categories, tags, created_at, updated_at, created_by, updated_by").order(sort, { ascending: order === "asc" });
	}
	
	if (q) query = query.ilike("name", `%${q}%`);
	if (status) query = query.eq("status", status);
	if (category) query = query.contains("categories", [category]);
	if (tag) query = query.contains("tags", [tag]);
	
	const { data: products, error } = await query;
	if (error) return <div className="text-red-600">Error: {error.message}</div>;

	// Get all categories and tags for filters
	const { data: allProducts } = await supabase.from("products").select("categories, tags");
	const allCategories = Array.from(new Set(allProducts?.flatMap(p => p.categories || []) || [])).filter(Boolean);
	const allTags = Array.from(new Set(allProducts?.flatMap(p => p.tags || []) || [])).filter(Boolean);

	// Get stats
	const { count: totalCount } = await supabase.from("products").select("*", { count: "exact", head: true });
	const { count: publishedCount } = await supabase.from("products").select("*", { count: "exact", head: true }).eq("status", "published");
	const { count: draftCount } = await supabase.from("products").select("*", { count: "exact", head: true }).eq("status", "draft");
	const { count: archivedCount } = await supabase.from("products").select("*", { count: "exact", head: true }).eq("status", "archived");

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-semibold text-gray-900">📋 Product Management</h1>
					<p className="text-gray-600">Manage your product catalog with advanced tools</p>
				</div>
				<Link href="/admin/products/new" className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl cursor-pointer">
					➕ Add New Product
				</Link>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<ColorfulCard colorScheme="blue" className="p-4">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-slate-600">Total</p>
							<p className="text-xl font-bold text-slate-900">{totalCount || 0}</p>
						</div>
						<span className="text-2xl">📦</span>
					</div>
				</ColorfulCard>
				<ColorfulCard colorScheme="green" className="p-4">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-slate-600">Published</p>
							<p className="text-xl font-bold text-slate-900">{publishedCount || 0}</p>
						</div>
						<span className="text-2xl">✅</span>
					</div>
				</ColorfulCard>
				<ColorfulCard colorScheme="orange" className="p-4">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-slate-600">Drafts</p>
							<p className="text-xl font-bold text-slate-900">{draftCount || 0}</p>
						</div>
						<span className="text-2xl">📝</span>
					</div>
				</ColorfulCard>
				<ColorfulCard colorScheme="purple" className="p-4">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-slate-600">Archived</p>
							<p className="text-xl font-bold text-slate-900">{archivedCount || 0}</p>
						</div>
						<span className="text-2xl">📦</span>
					</div>
				</ColorfulCard>
			</div>

			<ColorfulCard colorScheme="gradient" className="p-6">
				<div className="flex items-center justify-between mb-6">
					<form className="flex gap-2 flex-wrap">
						<input 
							name="q" 
							placeholder="🔍 Search products..." 
							defaultValue={q} 
							className="px-3 py-2 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all duration-200 bg-white/80 backdrop-blur-sm" 
						/>
						<select 
							name="status" 
							defaultValue={status} 
							className="px-3 py-2 border-2 border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-400 transition-all duration-200 bg-white/80 backdrop-blur-sm"
						>
							<option value="">📊 All Status</option>
							<option value="published">✅ Published</option>
							<option value="draft">📝 Draft</option>
							<option value="archived">📦 Archived</option>
						</select>
						{allCategories.length > 0 && (
							<select 
								name="category" 
								defaultValue={category} 
								className="px-3 py-2 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-200 bg-white/80 backdrop-blur-sm"
							>
								<option value="">🏷️ All Categories</option>
								{allCategories.map(cat => (
									<option key={cat} value={cat}>{cat}</option>
								))}
							</select>
						)}
						{allTags.length > 0 && (
							<select 
								name="tag" 
								defaultValue={tag} 
								className="px-3 py-2 border-2 border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-400 transition-all duration-200 bg-white/80 backdrop-blur-sm"
							>
								<option value="">🏷️ All Tags</option>
								{allTags.map(tag => (
									<option key={tag} value={tag}>{tag}</option>
								))}
							</select>
						)}
						<select 
							name="sort" 
							defaultValue={sort} 
							className="px-3 py-2 border-2 border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-400 transition-all duration-200 bg-white/80 backdrop-blur-sm"
						>
							<option value="created_at">🕒 Created Date</option>
							<option value="updated_at">📅 Updated Date</option>
							<option value="name">📝 Name</option>
							<option value="price_rupees">💰 Price</option>
						</select>
						<select 
							name="order" 
							defaultValue={order} 
							className="px-3 py-2 border-2 border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition-all duration-200 bg-white/80 backdrop-blur-sm"
						>
							<option value="desc">⬇️ Descending</option>
							<option value="asc">⬆️ Ascending</option>
						</select>
						<LoadingButton type="submit" variant="primary" size="md">
							🚀 Search
						</LoadingButton>
					</form>
					<div className="flex gap-2">
						<form action={exportJsonAction}>
							<LoadingButton variant="secondary" size="md">
								📄 Export JSON
							</LoadingButton>
						</form>
						<form action={exportCsvAction}>
							<LoadingButton variant="secondary" size="md">
								📊 Export CSV
							</LoadingButton>
						</form>
					</div>
				</div>

				{products && products.length > 0 ? (
					<div className="overflow-x-auto">
						<table className="w-full text-sm">
							<thead>
								<tr className="text-left border-b border-gray-200">
									<th className="py-3 font-medium text-gray-900">Product</th>
									<th className="py-3 font-medium text-gray-900">Price</th>
									<th className="py-3 font-medium text-gray-900">Status</th>
									<th className="py-3 font-medium text-gray-900">Categories</th>
									<th className="py-3 font-medium text-gray-900">Tags</th>
									<th className="py-3 font-medium text-gray-900">Created</th>
									<th className="py-3 font-medium text-gray-900">Created By</th>
									<th className="py-3 font-medium text-gray-900">Actions</th>
								</tr>
							</thead>
							<tbody>
								{products.map((p) => (
									<tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
										<td className="py-3">
											<div>
												<div className="font-medium text-slate-900">{p.name}</div>
												<div className="text-xs text-slate-500">{p.slug}</div>
											</div>
										</td>
										<td className="py-3 font-medium">₹{p.price_rupees.toLocaleString()}</td>
										<td className="py-3">
											<ColorfulBadge 
												variant={
													p.status === 'published' ? 'green' :
													p.status === 'draft' ? 'yellow' : 'red'
												}
												size="sm"
											>
												{p.status}
											</ColorfulBadge>
										</td>
										<td className="py-3">
											<div className="flex flex-wrap gap-1">
												{p.categories?.slice(0, 2).map((cat: string) => (
													<ColorfulBadge key={cat} variant="blue" size="sm">
														{cat}
													</ColorfulBadge>
												))}
												{p.categories && p.categories.length > 2 && (
													<ColorfulBadge variant="blue" size="sm" animated>
														+{p.categories.length - 2}
													</ColorfulBadge>
												)}
											</div>
										</td>
										<td className="py-3">
											<div className="flex flex-wrap gap-1">
												{p.tags?.slice(0, 2).map((tag: string) => (
													<ColorfulBadge key={tag} variant="green" size="sm">
														{tag}
													</ColorfulBadge>
												))}
												{p.tags && p.tags.length > 2 && (
													<ColorfulBadge variant="green" size="sm" animated>
														+{p.tags.length - 2}
													</ColorfulBadge>
												)}
											</div>
										</td>
										<td className="py-3 text-gray-600">
											{new Date(p.created_at).toLocaleDateString()}
										</td>
										<td className="py-3">
											<div className="flex items-center space-x-2">
												<div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
													<span className="text-xs font-semibold text-blue-600">
														{/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
														{(p as any).created_by_user?.name?.charAt(0).toUpperCase() || '?'}
													</span>
												</div>
												<span className="text-sm text-slate-600">
													{/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
													{(p as any).created_by_user?.name || 'Unknown'}
												</span>
											</div>
										</td>
										<td className="py-3">
											<div className="flex space-x-2">
												<Link href={`/product/${p.slug}`} className="text-blue-600 hover:text-blue-800 text-sm cursor-pointer">
													👁️ View
												</Link>
												<Link href={`/admin/products/${p.id}`} className="text-green-600 hover:text-green-800 text-sm cursor-pointer">
													✏️ Edit
												</Link>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				) : (
					<div className="text-center py-12">
						<div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
							<span className="text-2xl">📦</span>
						</div>
						<p className="text-gray-500 mb-4">No products found</p>
						<Link href="/admin/products/new" className="text-blue-600 hover:text-blue-800 cursor-pointer">
							➕ Add your first product
						</Link>
					</div>
				)}
			</ColorfulCard>
		</div>
	);
}
