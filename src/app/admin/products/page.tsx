import Link from "next/link";
import { getServerClient } from "@/lib/supabase/server";
import { exportCsvAction, exportJsonAction } from "./actions";

export default async function AdminProductsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
	const resolvedSearchParams = await searchParams;
	const supabase = await getServerClient();
	const q = typeof resolvedSearchParams.q === "string" ? resolvedSearchParams.q : "";
	let query = supabase.from("products").select("id, name, slug, price_rupees, status, created_at").order("created_at", { ascending: false });
	if (q) query = query.ilike("name", `%${q}%`);
	const { data: products, error } = await query;
	if (error) return <div className="text-red-600">Error: {error.message}</div>;

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-semibold text-gray-900">Products</h1>
					<p className="text-gray-600">Manage your product catalog</p>
				</div>
				<Link href="/admin/products/new" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
					Add New Product
				</Link>
			</div>

			<div className="bg-white rounded-lg border p-6">
				<div className="flex items-center justify-between mb-6">
					<form className="flex gap-2">
						<input 
							name="q" 
							placeholder="Search products..." 
							defaultValue={q} 
							className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
						/>
						<button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
							Search
						</button>
					</form>
					<div className="flex gap-2">
						<form action={exportJsonAction}>
							<button className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
								Export JSON
							</button>
						</form>
						<form action={exportCsvAction}>
							<button className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
								Export CSV
							</button>
						</form>
					</div>
				</div>

				{products && products.length > 0 ? (
					<div className="overflow-x-auto">
						<table className="w-full text-sm">
							<thead>
								<tr className="text-left border-b border-gray-200">
									<th className="py-3 font-medium text-gray-900">Name</th>
									<th className="py-3 font-medium text-gray-900">Price</th>
									<th className="py-3 font-medium text-gray-900">Status</th>
									<th className="py-3 font-medium text-gray-900">Created</th>
									<th className="py-3 font-medium text-gray-900">Actions</th>
								</tr>
							</thead>
							<tbody>
								{products.map((p) => (
									<tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
										<td className="py-3 font-medium">{p.name}</td>
										<td className="py-3">₹{p.price_rupees}</td>
										<td className="py-3">
											<span className={`px-2 py-1 rounded-full text-xs font-medium ${
												p.status === 'published' ? 'bg-green-100 text-green-800' :
												p.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
												'bg-gray-100 text-gray-800'
											}`}>
												{p.status}
											</span>
										</td>
										<td className="py-3 text-gray-600">
											{new Date(p.created_at).toLocaleDateString()}
										</td>
										<td className="py-3">
											<div className="flex space-x-2">
												<Link href={`/product/${p.slug}`} className="text-blue-600 hover:text-blue-800 text-sm">
													View
												</Link>
												<Link href={`/admin/products/${p.id}`} className="text-blue-600 hover:text-blue-800 text-sm">
													Edit
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
						<p className="text-gray-500 mb-4">No products found</p>
						<Link href="/admin/products/new" className="text-blue-600 hover:text-blue-800">
							Add your first product
						</Link>
					</div>
				)}
			</div>
		</div>
	);
}
