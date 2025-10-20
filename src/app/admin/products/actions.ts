"use server";

import { getServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function exportProductsAsJson() {
	const supabase = await getServerClient();
	const { data, error } = await supabase.from("products").select("*, product_images(*)");
	if (error) throw new Error(error.message);
	return JSON.stringify(data, null, 2);
}

export async function exportProductsAsCsv() {
	const supabase = await getServerClient();
	const { data, error } = await supabase.from("products").select("*");
	if (error) throw new Error(error.message);
	const headers = Object.keys(data?.[0] || { id: "", name: "", slug: "", price_rupees: 0, status: "" });
	const rows = [headers.join(","), ...data.map((row: Record<string, unknown>) => headers.map((h) => JSON.stringify(row[h] ?? "")).join(","))];
	return rows.join("\n");
}

export async function exportJsonAction() {
	// For now, just redirect back - in a real app you'd implement proper file download
	redirect("/admin/products?export=json");
}

export async function exportCsvAction() {
	// For now, just redirect back - in a real app you'd implement proper file download
	redirect("/admin/products?export=csv");
}
