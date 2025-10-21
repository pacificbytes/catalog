"use server";

import { getAuthServerClient } from "@/lib/supabase/auth-server";
import { getServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
	const email = formData.get("email") as string;
	const password = formData.get("password") as string;

	if (!email || !password) {
		throw new Error("Email and password are required");
	}

	try {
		// First try Supabase Auth authentication
		const supabase = await getAuthServerClient();
		
		const { data, error } = await supabase.auth.signInWithPassword({
			email: email,
			password: password,
		});

		if (error) {
			console.error("Supabase auth error:", error);
			throw new Error("Invalid email or password. Please check your credentials.");
		}

		if (data.user) {
			// Check if user exists in custom users table
			const serverSupabase = await getServerClient();
			const { data: existingUser } = await serverSupabase
				.from('users')
				.select('*')
				.eq('email', email)
				.single();

			// If user doesn't exist in custom table, create them with manager role
			if (!existingUser) {
				console.log(`Creating user ${email} in custom users table...`);
				await serverSupabase
					.from('users')
					.insert({
						id: data.user.id, // Use the same ID from Supabase Auth
						email: email,
						name: email.split('@')[0], // Use email prefix as name
						role: 'manager', // Default to manager role
						is_active: true,
						created_at: new Date().toISOString(),
						updated_at: new Date().toISOString()
					});
			}

			redirect("/admin");
		} else {
			throw new Error("Login failed. Please try again.");
		}
	} catch (error) {
		console.error("Login error:", error);
		throw error;
	}
}
