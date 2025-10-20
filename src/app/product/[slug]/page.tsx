import { getServerClient } from "@/lib/supabase/server";
import Link from "next/link";
import ImageCarousel from "@/components/ImageCarousel";

export default async function ProductDetail({ params }: { params: { slug: string } }) {
	const supabase = await getServerClient();
	const { data: product, error } = await supabase
		.from("products")
		.select("*, product_images(*)")
		.eq("slug", params.slug)
		.single();
	if (error || !product) {
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="text-center py-16">
					<div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
						<svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
						</svg>
					</div>
					<h3 className="text-lg font-semibold text-slate-900 mb-2">Product not found</h3>
					<p className="text-slate-600 mb-4">The product you&apos;re looking for doesn&apos;t exist or has been removed.</p>
					<Link href="/" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
						Back to Catalog
					</Link>
				</div>
			</div>
		);
	}
	return (
		<div className="container mx-auto px-4 py-8">
			<div className="grid md:grid-cols-2 gap-8">
				<div>
					<ImageCarousel 
						images={product.product_images || []} 
						productName={product.name}
					/>
				</div>
				<div className="space-y-6">
					<div>
						<h1 className="text-3xl font-bold text-slate-900 mb-2">{product.name}</h1>
						<div className="text-2xl font-bold text-blue-600">₹{product.price_rupees.toLocaleString()}</div>
					</div>
					{product.description && (
						<div>
							<h3 className="text-lg font-semibold text-slate-900 mb-2">Description</h3>
							<p className="text-slate-600 whitespace-pre-wrap">{product.description}</p>
						</div>
					)}
					<div className="grid grid-cols-2 gap-4 text-sm">
						<div>
							<span className="font-medium text-slate-700">SKU:</span>
							<span className="ml-2 text-slate-600">{product.sku || "N/A"}</span>
						</div>
						<div>
							<span className="font-medium text-slate-700">Stock:</span>
							<span className="ml-2 text-slate-600">{product.stock}</span>
						</div>
						<div>
							<span className="font-medium text-slate-700">Status:</span>
							<span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
								product.status === 'published' ? 'bg-green-100 text-green-800' :
								product.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
								'bg-gray-100 text-gray-800'
							}`}>
								{product.status}
							</span>
						</div>
					</div>
					<Link href="/" className="inline-flex items-center px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">
						<svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
						</svg>
						Back to Catalog
					</Link>
				</div>
			</div>
		</div>
	);
}
