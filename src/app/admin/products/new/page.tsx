"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getBrowserClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/slug";

export default function NewProductPage() {
	const router = useRouter();
	const supabase = getBrowserClient();
	const [name, setName] = useState("");
	const [price, setPrice] = useState<number>(0);
	const [description, setDescription] = useState("");
	const [status, setStatus] = useState("published");
	const [images, setImages] = useState<FileList | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		setLoading(true);
		const slug = slugify(name);
		const { data: created, error: insertErr } = await supabase
			.from("products")
			.insert({ name, slug, description, price_rupees: price, status })
			.select("id")
			.single();
		if (insertErr || !created) {
			setLoading(false);
			setError(insertErr?.message || "Failed to create product");
			return;
		}

		const productId = created.id;
		if (images && images.length > 0) {
		const uploads = Array.from(images).map(async (file, idx) => {
			const path = `${productId}/${Date.now()}-${idx}-${file.name}`;
			const { error: storageErr } = await supabase.storage
				.from("product-images")
				.upload(path, file, { upsert: false });
			if (storageErr) throw storageErr;
			const { data: publicUrl } = supabase.storage.from("product-images").getPublicUrl(path);
			await supabase.from("product_images").insert({ product_id: productId, url: publicUrl.publicUrl, position: idx });
		});
		try {
			await Promise.all(uploads);
		} catch (err: unknown) {
			const errorMessage = err instanceof Error ? err.message : "Image upload failed";
			setError(errorMessage);
		}
		}
		setLoading(false);
		router.push("/admin/products");
	}

	return (
		<div className="max-w-2xl">
			<div className="mb-8">
				<h1 className="text-2xl font-bold text-slate-900 mb-2">Add New Product</h1>
				<p className="text-slate-600">Create a new product for your catalog</p>
			</div>

			<div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
				<form onSubmit={onSubmit} className="space-y-6">
					<div>
						<label className="block text-sm font-medium text-slate-700 mb-2">Product Name</label>
						<input 
							className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
							value={name} 
							onChange={(e) => setName(e.target.value)} 
							placeholder="Enter product name"
							required 
						/>
					</div>
					
					<div>
						<label className="block text-sm font-medium text-slate-700 mb-2">Price (₹)</label>
						<input 
							type="number" 
							min={0} 
							className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
							value={price} 
							onChange={(e) => setPrice(Number(e.target.value))} 
							placeholder="0"
							required 
						/>
					</div>
					
					<div>
						<label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
						<select 
							className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
							value={status} 
							onChange={(e) => setStatus(e.target.value)}
						>
							<option value="draft">Draft</option>
							<option value="published">Published</option>
							<option value="archived">Archived</option>
						</select>
					</div>
					
					<div>
						<label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
						<textarea 
							className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
							value={description} 
							onChange={(e) => setDescription(e.target.value)} 
							rows={4}
							placeholder="Enter product description"
						/>
					</div>
					
					<div>
						<label className="block text-sm font-medium text-slate-700 mb-2">Product Images</label>
						<div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
							<input 
								type="file" 
								accept="image/*" 
								multiple 
								onChange={(e) => setImages(e.target.files)}
								className="hidden"
								id="image-upload"
							/>
							<label 
								htmlFor="image-upload" 
								className="cursor-pointer flex flex-col items-center space-y-2"
							>
								<svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
								</svg>
								<div>
									<span className="text-blue-600 font-medium">Click to upload images</span>
									<p className="text-sm text-slate-500">or drag and drop</p>
								</div>
								<p className="text-xs text-slate-400">PNG, JPG, GIF up to 10MB each</p>
							</label>
						</div>
						{images && images.length > 0 && (
							<div className="mt-3">
								<p className="text-sm text-slate-600 mb-2">Selected files:</p>
								<div className="flex flex-wrap gap-2">
									{Array.from(images).map((file, idx) => (
										<span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
											{file.name}
										</span>
									))}
								</div>
							</div>
						)}
					</div>
					
					{error && (
						<div className="rounded-lg border border-red-200 bg-red-50 p-4">
							<p className="text-red-800 text-sm">{error}</p>
						</div>
					)}
					
					<div className="flex gap-4 pt-4">
						<button 
							type="submit" 
							disabled={loading} 
							className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
						>
							{loading ? "Creating Product..." : "Create Product"}
						</button>
						<button 
							type="button" 
							onClick={() => router.push("/admin/products")}
							className="px-6 py-3 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
						>
							Cancel
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
