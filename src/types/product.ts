import { z } from "zod";

export const productStatusEnum = z.enum(["draft", "published", "archived"]);

export const productImageSchema = z.object({
	id: z.string().uuid().optional(),
	product_id: z.string().uuid().optional(),
	url: z.string().url(),
	alt: z.string().default(""),
	position: z.number().int().nonnegative().default(0),
	created_at: z.string().optional(),
});

export const productSchema = z.object({
	id: z.string().uuid().optional(),
	slug: z.string().min(1),
	name: z.string().min(1),
	description: z.string().default(""),
	price_rupees: z.number().int().nonnegative(),
	sku: z.string().default(""),
	stock: z.number().int().nonnegative().default(0),
	categories: z.array(z.string()).default([]),
	tags: z.array(z.string()).default([]),
	status: productStatusEnum.default("published"),
	created_at: z.string().optional(),
	updated_at: z.string().optional(),
	images: z.array(productImageSchema).default([]),
});

export type Product = z.infer<typeof productSchema>;
export type ProductImage = z.infer<typeof productImageSchema>;
