import { getServerClient } from "@/lib/supabase/server";
import bcrypt from 'bcryptjs';

export interface User {
	id: string;
	email: string;
	name: string;
	role: 'admin' | 'manager';
	is_active: boolean;
	password_hash?: string;
	password_reset_token?: string;
	password_reset_expires?: string;
	last_login?: string;
	created_at: string;
	updated_at: string;
}

export interface AuditLog {
	id: string;
	user_id: string;
	user_email: string;
	action: string;
	resource_type: string;
	resource_id: string;
	resource_name: string;
	old_values?: Record<string, unknown>;
	new_values?: Record<string, unknown>;
	ip_address?: string;
	user_agent?: string;
	created_at: string;
}

export async function getCurrentUser(): Promise<User | null> {
	const supabase = await getServerClient();
	const { data: { user } } = await supabase.auth.getUser();
	
	if (!user?.email) return null;
	
	const { data: userData } = await supabase
		.from('users')
		.select('*')
		.eq('email', user.email)
		.single();
	
	return userData;
}

export async function getUserRole(): Promise<'admin' | 'manager' | null> {
	const user = await getCurrentUser();
	return user?.role || null;
}

export async function isAdmin(): Promise<boolean> {
	const role = await getUserRole();
	return role === 'admin';
}

export async function isManager(): Promise<boolean> {
	const role = await getUserRole();
	return role === 'manager' || role === 'admin';
}

export async function canManageUsers(): Promise<boolean> {
	return await isAdmin();
}

export async function canDeleteProducts(): Promise<boolean> {
	const role = await getUserRole();
	return role === 'admin' || role === 'manager';
}

export async function logAuditAction(
	action: string,
	resourceType: string,
	resourceId: string,
	resourceName: string,
	oldValues?: Record<string, unknown>,
	newValues?: Record<string, unknown>,
	ipAddress?: string,
	userAgent?: string
): Promise<void> {
	const supabase = await getServerClient();
	const currentUser = await getCurrentUser();
	
	if (!currentUser) return;
	
	await supabase.from('audit_logs').insert({
		user_id: currentUser.id,
		user_email: currentUser.email,
		action,
		resource_type: resourceType,
		resource_id: resourceId,
		resource_name: resourceName,
		old_values: oldValues,
		new_values: newValues,
		ip_address: ipAddress,
		user_agent: userAgent
	});
}

export async function getAuditLogs(
	limit: number = 50,
	offset: number = 0,
	resourceType?: string,
	userId?: string
): Promise<AuditLog[]> {
	const supabase = await getServerClient();
	let query = supabase
		.from('audit_logs')
		.select('*')
		.order('created_at', { ascending: false })
		.limit(limit)
		.range(offset, offset + limit - 1);
	
	if (resourceType) {
		query = query.eq('resource_type', resourceType);
	}
	
	if (userId) {
		query = query.eq('user_id', userId);
	}
	
	const { data } = await query;
	return data || [];
}

export async function getAllUsers(): Promise<User[]> {
	const supabase = await getServerClient();
	const { data } = await supabase
		.from('users')
		.select('*')
		.order('created_at', { ascending: false });
	
	return data || [];
}

export async function createUser(email: string, name: string, role: 'admin' | 'manager'): Promise<User | null> {
	const supabase = await getServerClient();
	
	// For security, we only create users in the custom table
	// Supabase Auth users must be created manually in the dashboard
	const { data, error } = await supabase
		.from('users')
		.insert({
			email,
			name,
			role,
			is_active: true,
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString()
		})
		.select()
		.single();
	
	if (error) {
		console.error('Error creating user:', error);
		return null;
	}
	
	// Log the action
	await logAuditAction('create', 'user', data.id, `${name} (${email})`, undefined, { email, name, role });
	
	return data;
}

export async function updateUser(id: string, updates: Partial<User>): Promise<User | null> {
	const supabase = await getServerClient();
	
	// Get old values for audit log
	const { data: oldUser } = await supabase
		.from('users')
		.select('*')
		.eq('id', id)
		.single();
	
	const { data, error } = await supabase
		.from('users')
		.update(updates)
		.eq('id', id)
		.select()
		.single();
	
	if (error) {
		console.error('Error updating user:', error);
		return null;
	}
	
	// Log the action
	await logAuditAction('update', 'user', id, `${data.name} (${data.email})`, oldUser, updates);
	
	return data;
}

export async function deleteUser(id: string): Promise<boolean> {
	const supabase = await getServerClient();
	
	// Get user info for audit log
	const { data: user } = await supabase
		.from('users')
		.select('*')
		.eq('id', id)
		.single();
	
	const { error } = await supabase
		.from('users')
		.delete()
		.eq('id', id);
	
	if (error) {
		console.error('Error deleting user:', error);
		return false;
	}
	
	// Log the action
	if (user) {
		await logAuditAction('delete', 'user', id, `${user.name} (${user.email})`, user, undefined);
	}
	
	return true;
}

// Password management functions
export async function authenticateUser(email: string, _password: string): Promise<User | null> {
	const supabase = await getServerClient();
	
	// Get user from custom users table
	const { data: user, error } = await supabase
		.from('users')
		.select('*')
		.eq('email', email)
		.eq('is_active', true)
		.single();
	
	if (error || !user) {
		return null;
	}
	
	// For now, we'll skip password verification since we're using Supabase auth
	// The password verification happens in Supabase auth, not here
	// This function just checks if the user exists and is active
	
	// Update last login
	await supabase
		.from('users')
		.update({ last_login: new Date().toISOString() })
		.eq('id', user.id);
	
	return user;
}

export async function updateUserPassword(userId: string, newPassword: string): Promise<boolean> {
	const supabase = await getServerClient();
	
	const passwordHash = await bcrypt.hash(newPassword, 10);
	
	const { error } = await supabase
		.from('users')
		.update({ 
			password_hash: passwordHash,
			password_reset_token: null,
			password_reset_expires: null
		})
		.eq('id', userId);
	
	return !error;
}

export async function setUserPassword(userId: string, password: string): Promise<boolean> {
	return updateUserPassword(userId, password);
}
