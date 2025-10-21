import { getServerClient } from "@/lib/supabase/server";

export interface SiteConfig {
	id: string;
	key: string;
	value: string;
	description?: string;
	created_at: string;
	updated_at: string;
}

export async function getSiteConfig(key: string): Promise<string | null> {
	try {
		const supabase = await getServerClient();
		
		const { data, error } = await supabase
			.from('site_config')
			.select('value')
			.eq('key', key)
			.single();
		
		if (error) {
			console.error(`Error getting config for key ${key}:`, error);
			return null;
		}
		
		return data?.value || null;
	} catch (error) {
		console.error(`Error getting config for key ${key}:`, error);
		return null;
	}
}

export async function getAllSiteConfig(): Promise<SiteConfig[]> {
	try {
		const supabase = await getServerClient();
		
		const { data, error } = await supabase
			.from('site_config')
			.select('*')
			.order('key');
		
		if (error) {
			console.error('Error getting all site config:', error);
			return [];
		}
		
		return data || [];
	} catch (error) {
		console.error('Error getting all site config:', error);
		return [];
	}
}

export async function updateSiteConfig(key: string, value: string): Promise<boolean> {
	try {
		const supabase = await getServerClient();
		
		const { error } = await supabase
			.from('site_config')
			.update({ 
				value,
				updated_at: new Date().toISOString()
			})
			.eq('key', key);
		
		if (error) {
			console.error(`Error updating config for key ${key}:`, error);
			return false;
		}
		
		return true;
	} catch (error) {
		console.error(`Error updating config for key ${key}:`, error);
		return false;
	}
}

export async function updateMultipleConfigs(configs: Record<string, string>): Promise<boolean> {
	try {
		const supabase = await getServerClient();
		
		const updates = Object.entries(configs).map(([key, value]) => 
			supabase
				.from('site_config')
				.update({ 
					value,
					updated_at: new Date().toISOString()
				})
				.eq('key', key)
		);
		
		const results = await Promise.all(updates);
		
		// Check if any update failed
		const hasError = results.some(result => result.error);
		if (hasError) {
			console.error('Error updating multiple configs:', results);
			return false;
		}
		
		return true;
	} catch (error) {
		console.error('Error updating multiple configs:', error);
		return false;
	}
}
