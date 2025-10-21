"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getBrowserClient } from "@/lib/supabase/client";
import { useUserRole } from "@/lib/auth-client";

export default function EditProductPage() {
	const { id } = useParams<{ id: string }>();
	const router = useRouter();
	const supabase = getBrowserClient();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [name, setName] = useState("");
	const [price, setPrice] = useState<number>(0);
	const [description, setDescription] = useState("");
	const [status, setStatus] = useState("published");
	const [existingImages, setExistingImages] = useState<Array<{ id: string; url: string; alt?: string }>>([]);
	const [newImages, setNewImages] = useState<FileList | null>(null);
	const userRole = useUserRole();

	useEffect(() => {
		(async () => {
			const { data, error } = await supabase
				.from("products")
				.select("*, product_images(*)")
				.eq("id", id)
				.single();
			if (error || !data) {
				setError(error?.message || "Not found");
				setLoading(false);
				return;
			}
			setName(data.name);
			setPrice(data.price_rupees);
			setDescription(data.description || "");
			setStatus(data.status);
			setExistingImages(data.product_images || []);
			setLoading(false);
		})();
	}, [id, supabase]);

	async function onSave(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		setLoading(true);
		const { error: updateErr } = await supabase
			.from("products")
			.update({ name, price_rupees: price, description, status })
			.eq("id", id);
		if (updateErr) {
			setError(updateErr.message);
			setLoading(false);
			return;
		}
		if (newImages && newImages.length > 0) {
			try {
				await Promise.all(
					Array.from(newImages).map(async (file, idx) => {
						const path = `${id}/${Date.now()}-${idx}-${file.name}`;
						const { error: storageErr } = await supabase.storage.from("product-images").upload(path, file, { upsert: false });
						if (storageErr) throw storageErr;
						const { data: publicUrl } = supabase.storage.from("product-images").getPublicUrl(path);
						await supabase.from("product_images").insert({ product_id: id, url: publicUrl.publicUrl, position: existingImages.length + idx });
					})
				);
			} catch (err: unknown) {
				const errorMessage = err instanceof Error ? err.message : "Image upload failed";
				setError(errorMessage);
			}
		}
		setLoading(false);
		router.push("/admin/products");
	}

	async function onDeleteImage(imageId: string) {
		await supabase.from("product_images").delete().eq("id", imageId);
		setExistingImages((imgs) => imgs.filter((i) => i.id !== imageId));
	}

	async function onDeleteProduct() {
		if (confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
			await supabase.from("products").delete().eq("id", id);
			router.push("/admin/products");
		}
	}

	if (loading) return (
		<div className="flex items-center justify-center py-12">
			<div className="text-center">
				<div className="w-8 h-8 mx-auto mb-4 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
				<p className="text-slate-600">Loading product...</p>
			</div>
		</div>
	);
	
	if (error) return (
		<div className="text-center py-12">
			<div className="rounded-lg border border-red-200 bg-red-50 p-6 max-w-md mx-auto">
				<p className="text-red-800">Error: {error}</p>
				<button onClick={() => router.push("/admin/products")} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
					Back to Products
				</button>
			</div>
		</div>
	);

	return (
		<div className="max-w-2xl">
			<div className="mb-8">
				<h1 className="text-2xl font-bold text-slate-900 mb-2">Edit Product</h1>
				<p className="text-slate-600">Update product details and images</p>
			</div>

			<div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
				<form onSubmit={onSave} className="space-y-6">
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
						<label className="block text-sm font-medium text-slate-700 mb-2">Add More Images</label>
						<div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
							<input 
								type="file" 
								accept="image/*" 
								multiple 
								onChange={(e) => setNewImages(e.target.files)}
								className="hidden"
								id="new-image-upload"
							/>
							<label 
								htmlFor="new-image-upload" 
								className="cursor-pointer flex flex-col items-center space-y-2"
							>
								<svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
								</svg>
								<div>
									<span className="text-blue-600 font-medium">Add more images</span>
									<p className="text-sm text-slate-500">or drag and drop</p>
								</div>
								<p className="text-xs text-slate-400">PNG, JPG, GIF up to 10MB each</p>
							</label>
						</div>
						{newImages && newImages.length > 0 && (
							<div className="mt-3">
								<p className="text-sm text-slate-600 mb-2">New files to upload:</p>
								<div className="flex flex-wrap gap-2">
									{Array.from(newImages).map((file, idx) => (
										<span key={idx} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
											{file.name}
										</span>
									))}
								</div>
							</div>
						)}
					</div>

					{existingImages.length > 0 && (
						<div>
							<label className="block text-sm font-medium text-slate-700 mb-2">Current Images</label>
							<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
								{existingImages.map((img) => (
									<div key={img.id} className="relative group">
										{/* eslint-disable-next-line @next/next/no-img-element */}
										<img src={img.url} alt={img.alt || name} className="w-full h-24 object-cover rounded-lg border border-slate-200" />
										<button 
											type="button" 
											className="absolute top-2 right-2 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold" 
											onClick={() => onDeleteImage(img.id)}
										>
											×
										</button>
									</div>
								))}
							</div>
						</div>
					)}
					
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
							{loading ? "Saving..." : "Save Changes"}
						</button>
						<button 
							type="button" 
							onClick={() => router.push("/admin/products")}
							className="px-6 py-3 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
						>
							Cancel
						</button>
						{userRole === 'admin' && (
							<button 
								type="button" 
								onClick={onDeleteProduct}
								className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
							>
								Delete
							</button>
						)}
					</div>
				</form>
			</div>
		</div>
	);
}
