import Link from "next/link";

export default function AdminHome() {
	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-2xl font-semibold">Admin Dashboard</h2>
				<p className="text-gray-600">Welcome to Chahar Printing Press admin panel.</p>
			</div>
			
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				<Link href="/admin/products" className="p-6 border rounded-lg hover:bg-gray-50 transition-colors">
					<h3 className="text-lg font-semibold mb-2">Products</h3>
					<p className="text-sm text-gray-600">Manage your product catalog - add, edit, and delete products with images.</p>
				</Link>
				
				<Link href="/admin/products/new" className="p-6 border rounded-lg hover:bg-gray-50 transition-colors">
					<h3 className="text-lg font-semibold mb-2">Add Product</h3>
					<p className="text-sm text-gray-600">Create a new product with multiple images and details.</p>
				</Link>
				
				<div className="p-6 border rounded-lg bg-gray-50">
					<h3 className="text-lg font-semibold mb-2">Quick Stats</h3>
					<p className="text-sm text-gray-600">Product analytics and insights coming soon.</p>
				</div>
			</div>
		</div>
	);
}
