import Link from "next/link";
import { getServerClient } from "@/lib/supabase/server";
import { parsePagination } from "@/lib/pagination";
import CatalogImageCarousel from "@/components/CatalogImageCarousel";

function buildQuery(
	searchParams: Record<string, string | string[] | undefined>,
	supabase: Awaited<ReturnType<typeof getServerClient>>
) {
	let query = supabase.from("products").select("*, product_images(*)", { count: "exact" });
	const q = typeof searchParams.q === "string" ? searchParams.q : undefined;
	const status = typeof searchParams.status === "string" ? searchParams.status : "published";
	const sort = typeof searchParams.sort === "string" ? searchParams.sort : "new";
	if (q) {
		query = query.ilike("name", `%${q}%`);
	}
	if (status) {
		query = query.eq("status", status);
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
					<form className="flex flex-col sm:flex-row gap-4">
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
					</form>
				</div>
			</div>

			{products && products.length > 0 ? (
				<>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
						{products.map((p) => (
							<Link key={p.id} href={`/product/${p.slug}`} className="group">
								<div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 group-hover:border-blue-200">
									<CatalogImageCarousel 
										images={p.product_images || []} 
										productName={p.name}
									/>
									<div className="p-4">
										<h3 className="font-semibold text-slate-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
											{p.name}
										</h3>
										<div className="text-lg font-bold text-blue-600">
											₹{p.price_rupees.toLocaleString()}
										</div>
									</div>
								</div>
							</Link>
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
