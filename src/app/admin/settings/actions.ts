"use server";

import { updateMultipleConfigs } from "@/lib/site-config";
import { revalidatePath } from "next/cache";

export async function updateSiteConfigAction(configs: Record<string, string>) {
	try {
		const success = await updateMultipleConfigs(configs);
		if (success) {
			revalidatePath("/admin/settings");
			revalidatePath("/");
			return { success: true };
		} else {
			return { success: false, error: "Failed to update configuration" };
		}
	} catch (error) {
		console.error("Error updating site config:", error);
		return { success: false, error: "An error occurred while updating configuration" };
	}
}
