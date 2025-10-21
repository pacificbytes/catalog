import Link from "next/link";

export default function NotFound() {
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
				<Link href="/" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
					🏠 Back to Catalog
				</Link>
			</div>
		</div>
	);
}
