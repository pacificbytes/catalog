"use server";

import { getServerClient } from "@/lib/supabase/server";
import { getCurrentUser, logAuditAction } from "@/lib/user-management";
import { slugify } from "@/lib/slug";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProductAction(formData: FormData) {
	const supabase = await getServerClient();
	const currentUser = await getCurrentUser();
	
	if (!currentUser) {
		throw new Error("User not authenticated");
	}

	const name = formData.get("name") as string;
	const price = parseInt(formData.get("price") as string);
	const description = formData.get("description") as string;
	const status = formData.get("status") as string;
	const sku = formData.get("sku") as string;
	const stock = parseInt(formData.get("stock") as string);
	const categories = JSON.parse(formData.get("categories") as string || "[]");
	const tags = JSON.parse(formData.get("tags") as string || "[]");
	const images = formData.getAll("images") as File[];

	if (!name || !price) {
		throw new Error("Name and price are required");
	}

	const slug = slugify(name);

	try {
		// Create the product
		const { data: product, error: productError } = await supabase
			.from("products")
			.insert({
				name,
				slug,
				description,
				price_rupees: price,
				sku,
				stock,
				status,
				categories,
				tags,
				created_by: currentUser.id,
				updated_by: currentUser.id
			})
			.select()
			.single();

		if (productError) {
			throw new Error(`Failed to create product: ${productError.message}`);
		}

		// Upload images if any
		if (images && images.length > 0) {
			for (let i = 0; i < images.length; i++) {
				const image = images[i];
				if (image.size > 0) {
					const fileExt = image.name.split('.').pop();
					const fileName = `${product.id}-${i}.${fileExt}`;
					
					const { error: uploadError } = await supabase.storage
						.from('product-images')
						.upload(fileName, image);

					if (uploadError) {
						console.error('Image upload error:', uploadError);
						continue;
					}

					// Get public URL
					const { data: { publicUrl } } = supabase.storage
						.from('product-images')
						.getPublicUrl(fileName);

					// Insert image record
					await supabase
						.from("product_images")
						.insert({
							product_id: product.id,
							url: publicUrl,
							alt: `${name} image ${i + 1}`,
							position: i
						});
				}
			}
		}

		// Log the action
		await logAuditAction(
			'create',
			'product',
			product.id,
			name,
			undefined,
			{ name, price, status, categories, tags }
		);

		revalidatePath("/admin/products");
		revalidatePath("/");
		redirect("/admin/products");
	} catch (error) {
		console.error("Error creating product:", error);
		throw error;
	}
}
