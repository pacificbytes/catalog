"use client";

import { useState, useEffect } from "react";
import { getBrowserClient } from "@/lib/supabase/client";

export function useUserRole(): 'admin' | 'manager' | null {
	const [role, setRole] = useState<'admin' | 'manager' | null>(null);
	const supabase = getBrowserClient();

	useEffect(() => {
		const getUserRole = async () => {
			try {
				const { data: { user } } = await supabase.auth.getUser();
				if (!user?.email) {
					setRole(null);
					return;
				}

				const { data: userData } = await supabase
					.from('users')
					.select('role')
					.eq('email', user.email)
					.single();

				setRole(userData?.role || null);
			} catch (error) {
				console.error('Error getting user role:', error);
				setRole(null);
			}
		};

		getUserRole();

		// Listen for auth changes
		const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
			getUserRole();
		});

		return () => subscription.unsubscribe();
	}, [supabase]);

	return role;
}
