import { getServerClient } from "@/lib/supabase/server";
import Link from "next/link";
import ImageCarousel from "@/components/ImageCarousel";
import AdminActions from "@/components/AdminActions";
import ColorfulCard from "@/components/ColorfulCard";
import ColorfulBadge from "@/components/ColorfulBadge";
import { isAdmin } from "@/lib/auth";
import { notFound } from "next/navigation";

export default async function ProductDetail({ params }: { params: { slug: string } }) {
	try {
		console.log("Loading product with slug:", params.slug);
		const supabase = await getServerClient();
		const { data: product, error } = await supabase
			.from("products")
			.select("*, product_images(*)")
			.eq("slug", params.slug)
			.single();
		
		console.log("Product query result:", { product, error });
		
		// Check if user is admin
		const userIsAdmin = await isAdmin();
		
		if (error) {
			console.error("Database error:", error);
			return (
				<div className="container mx-auto px-4 py-8">
					<div className="text-center py-16">
						<div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
							<svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
							</svg>
						</div>
						<h3 className="text-lg font-semibold text-slate-900 mb-2">Database Error</h3>
						<p className="text-slate-600 mb-4">There was an error loading the product.</p>
						<Link href="/" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
							Back to Catalog
						</Link>
					</div>
				</div>
			);
		}

		if (!product) {
			notFound();
		}
	return (
		<div className="container mx-auto px-4 py-8">
			<div className="grid md:grid-cols-2 gap-8">
				<div>
					<ColorfulCard colorScheme="gradient" className="overflow-hidden">
						<ImageCarousel 
							images={product.product_images || []} 
							productName={product.name}
						/>
					</ColorfulCard>
				</div>
				<div className="space-y-6">
					<ColorfulCard colorScheme="blue" className="p-6">
						<div className="flex items-start justify-between">
							<div>
								<h1 className="text-3xl font-bold text-slate-900 mb-2">{product.name}</h1>
								<div className="text-2xl font-bold text-blue-600 flex items-center">
									<span className="text-3xl">₹</span>
									<span className="ml-1">{product.price_rupees.toLocaleString()}</span>
								</div>
							</div>
							{userIsAdmin && (
								<AdminActions 
									productId={product.id} 
									productName={product.name}
									className="ml-4"
								/>
							)}
						</div>
					</ColorfulCard>
					
					{/* Categories and Tags */}
					{(product.categories?.length > 0 || product.tags?.length > 0) && (
						<ColorfulCard colorScheme="green" className="p-6">
							<div className="space-y-4">
								{product.categories?.length > 0 && (
									<div>
										<h3 className="text-sm font-medium text-slate-700 mb-3 flex items-center">
											🏷️ Categories
										</h3>
										<div className="flex flex-wrap gap-2">
											{product.categories.map((category: string) => (
												<ColorfulBadge key={category} variant="blue" size="md">
													{category}
												</ColorfulBadge>
											))}
										</div>
									</div>
								)}
								{product.tags?.length > 0 && (
									<div>
										<h3 className="text-sm font-medium text-slate-700 mb-3 flex items-center">
											🏷️ Tags
										</h3>
										<div className="flex flex-wrap gap-2">
											{product.tags.map((tag: string) => (
												<ColorfulBadge key={tag} variant="green" size="md">
													{tag}
												</ColorfulBadge>
											))}
										</div>
									</div>
								)}
							</div>
						</ColorfulCard>
					)}
					
					{product.description && (
						<ColorfulCard colorScheme="purple" className="p-6">
							<h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center">
								📝 Description
							</h3>
							<p className="text-slate-600 whitespace-pre-wrap">{product.description}</p>
						</ColorfulCard>
					)}
					
					<ColorfulCard colorScheme="orange" className="p-6">
						<div className="grid grid-cols-2 gap-4 text-sm">
							<div className="flex items-center">
								<span className="font-medium text-slate-700 mr-2">🏷️ SKU:</span>
								<span className="text-slate-600">{product.sku || "N/A"}</span>
							</div>
							<div className="flex items-center">
								<span className="font-medium text-slate-700 mr-2">📦 Stock:</span>
								<span className="text-slate-600">{product.stock}</span>
							</div>
							<div className="flex items-center">
								<span className="font-medium text-slate-700 mr-2">📊 Status:</span>
								<ColorfulBadge 
									variant={
										product.status === 'published' ? 'green' :
										product.status === 'draft' ? 'yellow' : 'red'
									}
									size="sm"
								>
									{product.status}
								</ColorfulBadge>
							</div>
						</div>
					</ColorfulCard>
					
					<Link href="/" className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-lg hover:from-slate-700 hover:to-slate-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer">
						<svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
						</svg>
						🏠 Back to Catalog
					</Link>
				</div>
			</div>
		</div>
	);
	} catch (err) {
		console.error("Unexpected error:", err);
		return (
			<div className="container mx-auto px-4 py-8">
				<div className="text-center py-16">
					<div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
						<svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
						</svg>
					</div>
					<h3 className="text-lg font-semibold text-slate-900 mb-2">Something went wrong</h3>
					<p className="text-slate-600 mb-4">An unexpected error occurred while loading the product.</p>
					<Link href="/" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
						Back to Catalog
					</Link>
				</div>
			</div>
		);
	}
}
