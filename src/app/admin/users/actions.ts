"use server";

import { createUser, updateUser } from "@/lib/user-management";
import { revalidatePath } from "next/cache";

export async function createUserAction(formData: FormData) {
	const email = formData.get("email") as string;
	const name = formData.get("name") as string;
	const role = formData.get("role") as "admin" | "manager";

	if (!email || !name || !role) {
		throw new Error("All fields are required");
	}

	try {
		const user = await createUser(email, name, role);
		if (!user) {
			throw new Error("Failed to create user");
		}

		revalidatePath("/admin/users");
		return { success: true, user };
	} catch (error) {
		console.error("Error creating user:", error);
		throw error;
	}
}

export async function updateUserAction(formData: FormData) {
	const id = formData.get("id") as string;
	const email = formData.get("email") as string;
	const name = formData.get("name") as string;
	const role = formData.get("role") as "admin" | "manager";
	const isActive = formData.get("is_active") === "true";
	const password = formData.get("password") as string;

	if (!id || !email || !name || !role) {
		throw new Error("All fields are required");
	}

	try {
		const updates: Partial<{ email: string; name: string; role: "admin" | "manager"; is_active: boolean }> = { 
			email, 
			name, 
			role: role as "admin" | "manager", 
			is_active: isActive 
		};
		
		// Only update password if provided
		if (password && password.trim() !== "") {
			const { updateUserPassword } = await import("@/lib/user-management");
			await updateUserPassword(id, password);
		}

		const user = await updateUser(id, updates);
		if (!user) {
			throw new Error("Failed to update user");
		}

		revalidatePath("/admin/users");
		return { success: true, user };
	} catch (error) {
		console.error("Error updating user:", error);
		throw error;
	}
}
