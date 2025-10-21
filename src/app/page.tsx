import Link from "next/link";
import { getServerClient } from "@/lib/supabase/server";
import { parsePagination } from "@/lib/pagination";
import CatalogImageCarousel from "@/components/CatalogImageCarousel";
import AdminActions from "@/components/AdminActions";
import ColorfulCard from "@/components/ColorfulCard";
import ColorfulBadge from "@/components/ColorfulBadge";
import SearchFilters from "@/components/SearchFilters";
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
		<div className="container mx-auto px-4 py-6">
			<div className="mb-6">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-slate-900 mb-1">Product Catalog</h1>
					<p className="text-sm text-slate-600">Discover our professional printing services</p>
				</div>
			</div>

			{/* Search and Filters Section */}
			<div id="products" className="mb-6">
				<SearchFilters 
					allCategories={allCategories}
					allTags={allTags}
					initialParams={{
						q: resolvedSearchParams.q as string,
						sort: resolvedSearchParams.sort as string,
						category: resolvedSearchParams.category as string,
						tag: resolvedSearchParams.tag as string,
					}}
				/>
			</div>


			{products && products.length > 0 ? (
				<>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
						{products.map((p, index) => {
							const colorSchemes = ["blue", "green", "purple", "pink", "orange"] as const;
							const colorScheme = colorSchemes[index % colorSchemes.length];
							
							return (
								<div key={p.id} className="group flex flex-col h-full">
									<Link href={`/product/${p.slug}`} className="block cursor-pointer flex-1">
										<ColorfulCard 
											colorScheme={colorScheme}
											className="overflow-hidden h-full flex flex-col"
										>
											<CatalogImageCarousel 
												images={p.product_images || []} 
												productName={p.name}
											/>
											<div className="p-4 flex-1 flex flex-col">
												<h3 className="font-semibold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
													{p.name}
												</h3>
												
												{/* Categories and Tags */}
												{(p.categories?.length > 0 || p.tags?.length > 0) && (
													<div className="mb-3 space-y-2 flex-1">
														{p.categories?.length > 0 && (
															<div className="flex flex-wrap gap-1">
																{p.categories.slice(0, 2).map((category: string) => (
																	<ColorfulBadge key={category} variant="blue" size="sm">
																		{category}
																	</ColorfulBadge>
																))}
																{p.categories.length > 2 && (
																	<ColorfulBadge variant="blue" size="sm" animated>
																		+{p.categories.length - 2}
																	</ColorfulBadge>
																)}
															</div>
														)}
														{p.tags?.length > 0 && (
															<div className="flex flex-wrap gap-1">
																{p.tags.slice(0, 3).map((tag: string) => (
																	<ColorfulBadge key={tag} variant="green" size="sm">
																		{tag}
																	</ColorfulBadge>
																))}
																{p.tags.length > 3 && (
																	<ColorfulBadge variant="green" size="sm" animated>
																		+{p.tags.length - 3}
																	</ColorfulBadge>
																)}
															</div>
														)}
													</div>
												)}
												
												<div className="text-lg font-bold text-blue-600 flex items-center mt-auto">
													<span className="text-2xl">₹</span>
													<span className="ml-1">{p.price_rupees.toLocaleString()}</span>
												</div>
											</div>
										</ColorfulCard>
									</Link>
									
									{/* Admin Actions */}
									{userIsAdmin && (
										<div className="mt-3 flex justify-end">
											<AdminActions 
												productId={p.id} 
												productName={p.name}
											/>
										</div>
									)}
								</div>
							);
						})}
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
										className={`px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
											idx === page 
												? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg" 
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
