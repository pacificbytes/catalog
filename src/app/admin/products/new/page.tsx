"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProductAction } from "./actions";
import LoadingButton from "@/components/LoadingButton";
import ColorfulCard from "@/components/ColorfulCard";
import ColorfulBadge from "@/components/ColorfulBadge";

export default function NewProductPage() {
	const router = useRouter();
	const [name, setName] = useState("");
	const [price, setPrice] = useState<number>(0);
	const [description, setDescription] = useState("");
	const [status, setStatus] = useState("published");
	const [sku, setSku] = useState("");
	const [stock, setStock] = useState<number>(0);
	const [categories, setCategories] = useState<string[]>([]);
	const [tags, setTags] = useState<string[]>([]);
	const [newCategory, setNewCategory] = useState("");
	const [newTag, setNewTag] = useState("");
	const [images, setImages] = useState<FileList | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		setLoading(true);

		try {
			const formData = new FormData();
			formData.append("name", name);
			formData.append("price", price.toString());
			formData.append("description", description);
			formData.append("status", status);
			formData.append("sku", sku);
			formData.append("stock", stock.toString());
			formData.append("categories", JSON.stringify(categories));
			formData.append("tags", JSON.stringify(tags));
			
			if (images) {
				for (let i = 0; i < images.length; i++) {
					formData.append("images", images[i]);
				}
			}

			await createProductAction(formData);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to create product");
		} finally {
			setLoading(false);
		}
	}

	const addCategory = () => {
		if (newCategory.trim() && !categories.includes(newCategory.trim())) {
			setCategories([...categories, newCategory.trim()]);
			setNewCategory("");
		}
	};

	const removeCategory = (category: string) => {
		setCategories(categories.filter(c => c !== category));
	};

	const addTag = () => {
		if (newTag.trim() && !tags.includes(newTag.trim())) {
			setTags([...tags, newTag.trim()]);
			setNewTag("");
		}
	};

	const removeTag = (tag: string) => {
		setTags(tags.filter(t => t !== tag));
	};

	return (
		<div className="max-w-2xl">
			<div className="mb-8">
				<h1 className="text-2xl font-bold text-slate-900 mb-2">✨ Add New Product</h1>
				<p className="text-slate-600">Create a new product for your catalog</p>
			</div>

			<ColorfulCard colorScheme="gradient" className="p-8">
				<form onSubmit={onSubmit} className="space-y-6">
					<div>
						<label className="block text-sm font-medium text-slate-700 mb-2">🏷️ Product Name</label>
						<input 
							className="w-full px-4 py-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all duration-200 bg-white/80 backdrop-blur-sm" 
							value={name} 
							onChange={(e) => setName(e.target.value)} 
							placeholder="Enter product name"
							required 
						/>
					</div>
					
					<div>
						<label className="block text-sm font-medium text-slate-700 mb-2">💰 Price (₹)</label>
						<input 
							type="number" 
							min={0} 
							className="w-full px-4 py-3 border-2 border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-400 transition-all duration-200 bg-white/80 backdrop-blur-sm" 
							value={price} 
							onChange={(e) => setPrice(Number(e.target.value))} 
							placeholder="0"
							required 
						/>
					</div>
					
					<div>
						<label className="block text-sm font-medium text-slate-700 mb-2">🏷️ SKU</label>
						<input 
							type="text" 
							className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-400 transition-all duration-200 bg-white/80 backdrop-blur-sm" 
							value={sku} 
							onChange={(e) => setSku(e.target.value)} 
							placeholder="Product SKU"
						/>
					</div>
					
					<div>
						<label className="block text-sm font-medium text-slate-700 mb-2">📦 Stock Quantity</label>
						<input 
							type="number" 
							min={0} 
							className="w-full px-4 py-3 border-2 border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-400 transition-all duration-200 bg-white/80 backdrop-blur-sm" 
							value={stock} 
							onChange={(e) => setStock(Number(e.target.value))} 
							placeholder="0"
						/>
					</div>
					
					<div>
						<label className="block text-sm font-medium text-slate-700 mb-2">📊 Status</label>
						<select 
							className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-200 bg-white/80 backdrop-blur-sm" 
							value={status} 
							onChange={(e) => setStatus(e.target.value)}
						>
							<option value="draft">📝 Draft</option>
							<option value="published">✅ Published</option>
							<option value="archived">📦 Archived</option>
						</select>
					</div>

					{/* Categories */}
					<div>
						<label className="block text-sm font-medium text-slate-700 mb-2">🏷️ Categories</label>
						<div className="space-y-3">
							<div className="flex gap-2">
								<input 
									className="flex-1 px-4 py-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all duration-200 bg-white/80 backdrop-blur-sm" 
									value={newCategory} 
									onChange={(e) => setNewCategory(e.target.value)} 
									placeholder="Add category"
									onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCategory())}
								/>
								<LoadingButton type="button" onClick={addCategory} variant="primary" size="md">
									➕ Add
								</LoadingButton>
							</div>
							{categories.length > 0 && (
								<div className="flex flex-wrap gap-2">
									{categories.map(category => (
										<ColorfulBadge key={category} variant="blue" size="md" className="flex items-center gap-2">
											{category}
											<button type="button" onClick={() => removeCategory(category)} className="text-white hover:text-blue-200 cursor-pointer">
												×
											</button>
										</ColorfulBadge>
									))}
								</div>
							)}
						</div>
					</div>

					{/* Tags */}
					<div>
						<label className="block text-sm font-medium text-slate-700 mb-2">🏷️ Tags</label>
						<div className="space-y-3">
							<div className="flex gap-2">
								<input 
									className="flex-1 px-4 py-3 border-2 border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-400 transition-all duration-200 bg-white/80 backdrop-blur-sm" 
									value={newTag} 
									onChange={(e) => setNewTag(e.target.value)} 
									placeholder="Add tag"
									onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
								/>
								<LoadingButton type="button" onClick={addTag} variant="success" size="md">
									➕ Add
								</LoadingButton>
							</div>
							{tags.length > 0 && (
								<div className="flex flex-wrap gap-2">
									{tags.map(tag => (
										<ColorfulBadge key={tag} variant="green" size="md" className="flex items-center gap-2">
											{tag}
											<button type="button" onClick={() => removeTag(tag)} className="text-white hover:text-green-200 cursor-pointer">
												×
											</button>
										</ColorfulBadge>
									))}
								</div>
							)}
						</div>
					</div>
					
					<div>
						<label className="block text-sm font-medium text-slate-700 mb-2">📝 Description</label>
						<textarea 
							className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-400 transition-all duration-200 bg-white/80 backdrop-blur-sm" 
							value={description} 
							onChange={(e) => setDescription(e.target.value)} 
							rows={4}
							placeholder="Enter product description"
						/>
					</div>
					
					<div>
						<label className="block text-sm font-medium text-slate-700 mb-2">🖼️ Product Images</label>
						<div className="border-2 border-dashed border-orange-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors bg-orange-50/50">
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
								<svg className="w-12 h-12 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
								</svg>
								<div>
									<span className="text-orange-600 font-medium">📸 Click to upload images</span>
									<p className="text-sm text-orange-500">or drag and drop</p>
								</div>
								<p className="text-xs text-orange-400">PNG, JPG, GIF up to 10MB each</p>
							</label>
						</div>
						{images && images.length > 0 && (
							<div className="mt-3">
								<p className="text-sm text-slate-600 mb-2">Selected files:</p>
								<div className="flex flex-wrap gap-2">
									{Array.from(images).map((file, idx) => (
										<ColorfulBadge key={idx} variant="orange" size="sm">
											📁 {file.name}
										</ColorfulBadge>
									))}
								</div>
							</div>
						)}
					</div>
					
					{error && (
						<div className="rounded-lg border-2 border-red-200 bg-red-50 p-4">
							<p className="text-red-800 text-sm flex items-center">
								<span className="mr-2">⚠️</span>
								{error}
							</p>
						</div>
					)}
					
					<div className="flex gap-4 pt-4">
						<LoadingButton
							type="submit"
							loading={loading}
							loadingText="Creating..."
							variant="primary"
							size="lg"
							className="flex-1"
						>
							✨ Create Product
						</LoadingButton>
						<LoadingButton
							type="button"
							onClick={() => router.push("/admin/products")}
							variant="secondary"
							size="lg"
						>
							🚫 Cancel
						</LoadingButton>
					</div>
				</form>
			</ColorfulCard>
		</div>
	);
}
