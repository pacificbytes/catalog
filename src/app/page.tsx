import Link from "next/link";
import { getServerClient } from "@/lib/supabase/server";
import { parsePagination } from "@/lib/pagination";
import CatalogImageCarousel from "@/components/CatalogImageCarousel";
import AdminActions from "@/components/AdminActions";
import { isAdmin } from "@/lib/auth";

function buildQuery(
	searchParams: Record<string, string | string[] | undefined>,
	supabase: Awaited<ReturnType<typeof getServerClient>>
) {
	let query = supabase.from("products").select("*, product_images(*)", { count: "exact" });
	const q = typeof searchParams.q === "string" ? searchParams.q : undefined;
	const status = typeof searchParams.status === "string" ? searchParams.status : "published";
	const sort = typeof searchParams.sort === "string" ? searchParams.sort : "new";
	const category = typeof searchParams.category === "string" ? searchParams.category : undefined;
	const tag = typeof searchParams.tag === "string" ? searchParams.tag : undefined;
	
	if (q) {
		query = query.ilike("name", `%${q}%`);
	}
	if (status) {
		query = query.eq("status", status);
	}
	if (category) {
		query = query.contains("categories", [category]);
	}
	if (tag) {
		query = query.contains("tags", [tag]);
	}
	if (sort === "price_asc") query = query.order("price_rupees", { ascending: true });
	else if (sort === "price_desc") query = query.order("price_rupees", { ascending: false });
	else query = query.order("created_at", { ascending: false });
	return query;
}

export default async function CatalogPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
	const resolvedSearchParams = await searchParams;
	const supabase = await getServerClient();
	const { from, to, page, pageSize } = parsePagination(new URLSearchParams(resolvedSearchParams as Record<string, string>));
	const query = buildQuery(resolvedSearchParams, supabase).range(from, to);
	const { data: products, count, error } = await query;
	
	// Check if user is admin
	const userIsAdmin = await isAdmin();
	
	// Get all categories and tags for filters
	const { data: allProducts } = await supabase.from("products").select("categories, tags").eq("status", "published");
	const allCategories = Array.from(new Set(allProducts?.flatMap(p => p.categories || []) || [])).filter(Boolean);
	const allTags = Array.from(new Set(allProducts?.flatMap(p => p.tags || []) || [])).filter(Boolean);
	
	if (error) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="rounded-lg border border-red-200 bg-red-50 p-4">
					<p className="text-red-800">Error loading products: {error.message}</p>
				</div>
			</div>
		);
	}
	const total = count ?? 0;
	const totalPages = Math.max(1, Math.ceil(total / pageSize));
	return (
		<div className="container mx-auto px-4 py-8">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-slate-900 mb-2">Product Catalog</h1>
				<p className="text-slate-600">Discover our professional printing services</p>
			</div>

			<div className="mb-8">
				<div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
					<form className="space-y-4">
						<div className="flex flex-col sm:flex-row gap-4">
							<div className="flex-1">
								<input 
									name="q" 
									placeholder="Search products..." 
									defaultValue={(resolvedSearchParams.q as string) ?? ""} 
									className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
								/>
							</div>
							<div className="sm:w-48">
								<select 
									name="sort" 
									defaultValue={(resolvedSearchParams.sort as string) ?? "new"} 
									className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								>
									<option value="new">Newest First</option>
									<option value="price_asc">Price: Low to High</option>
									<option value="price_desc">Price: High to Low</option>
								</select>
							</div>
							<button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
								Search
							</button>
						</div>
						
						{/* Category and Tag Filters */}
						{(allCategories.length > 0 || allTags.length > 0) && (
							<div className="flex flex-col sm:flex-row gap-4">
								{allCategories.length > 0 && (
									<div className="sm:w-48">
										<select 
											name="category" 
											defaultValue={(resolvedSearchParams.category as string) ?? ""} 
											className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										>
											<option value="">All Categories</option>
											{allCategories.map(category => (
												<option key={category} value={category}>{category}</option>
											))}
										</select>
									</div>
								)}
								{allTags.length > 0 && (
									<div className="sm:w-48">
										<select 
											name="tag" 
											defaultValue={(resolvedSearchParams.tag as string) ?? ""} 
											className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										>
											<option value="">All Tags</option>
											{allTags.map(tag => (
												<option key={tag} value={tag}>{tag}</option>
											))}
										</select>
									</div>
								)}
							</div>
						)}
					</form>
				</div>
			</div>

			{products && products.length > 0 ? (
				<>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
						{products.map((p) => (
							<div key={p.id} className="group">
								<Link href={`/product/${p.slug}`} className="block">
									<div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 group-hover:border-blue-200">
										<CatalogImageCarousel 
											images={p.product_images || []} 
											productName={p.name}
										/>
										<div className="p-4">
											<h3 className="font-semibold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
												{p.name}
											</h3>
											
											{/* Categories and Tags */}
											{(p.categories?.length > 0 || p.tags?.length > 0) && (
												<div className="mb-2 space-y-1">
													{p.categories?.length > 0 && (
														<div className="flex flex-wrap gap-1">
															{p.categories.slice(0, 2).map((category: string) => (
																<span key={category} className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
																	{category}
																</span>
															))}
															{p.categories.length > 2 && (
																<span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
																	+{p.categories.length - 2}
																</span>
															)}
														</div>
													)}
													{p.tags?.length > 0 && (
														<div className="flex flex-wrap gap-1">
															{p.tags.slice(0, 3).map((tag: string) => (
																<span key={tag} className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
																	{tag}
																</span>
															))}
															{p.tags.length > 3 && (
																<span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
																	+{p.tags.length - 3}
																</span>
															)}
														</div>
													)}
												</div>
											)}
											
											<div className="text-lg font-bold text-blue-600">
												₹{p.price_rupees.toLocaleString()}
											</div>
										</div>
									</div>
								</Link>
								
								{/* Admin Actions */}
								{userIsAdmin && (
									<div className="mt-2 flex justify-end">
										<AdminActions 
											productId={p.id} 
											productName={p.name}
										/>
									</div>
								)}
							</div>
						))}
					</div>

					{totalPages > 1 && (
						<div className="flex items-center justify-center gap-2">
							{Array.from({ length: totalPages }).map((_, i) => {
								const idx = i + 1;
								const params = new URLSearchParams(resolvedSearchParams as Record<string, string>);
								params.set("page", String(idx));
								return (
									<Link 
										key={idx} 
										href={`/?${params.toString()}`} 
										className={`px-4 py-2 rounded-lg font-medium transition-colors ${
											idx === page 
												? "bg-blue-600 text-white" 
												: "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
										}`}
									>
										{idx}
									</Link>
								);
							})}
						</div>
					)}
				</>
			) : (
				<div className="text-center py-16">
					<div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
						<svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
						</svg>
					</div>
					<h3 className="text-lg font-semibold text-slate-900 mb-2">No products found</h3>
					<p className="text-slate-600">Try adjusting your search criteria</p>
				</div>
			)}
		</div>
	);
}
