import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getAllSiteConfig } from "@/lib/site-config";
import ColorfulCard from "@/components/ColorfulCard";
import ColorfulBadge from "@/components/ColorfulBadge";
import LoadingButton from "@/components/LoadingButton";
import SiteConfigForm from "@/components/SiteConfigForm";

export default async function AdminSettings() {
	// Check if user is admin - redirect if not
	const userIsAdmin = await isAdmin();
	if (!userIsAdmin) {
		redirect("/admin");
	}

	const configs = await getAllSiteConfig();

	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-2xl font-semibold">⚙️ Admin Settings</h2>
				<p className="text-gray-600">Configure your admin panel and application settings</p>
			</div>

			{/* Site Configuration */}
			<ColorfulCard colorScheme="blue" className="p-6">
				<h3 className="text-lg font-semibold mb-4 flex items-center">
					<span className="mr-2">🔧</span>
					Site Configuration
				</h3>
				<p className="text-slate-600 mb-4">
					Manage your website settings, contact information, and social media links.
				</p>
				<SiteConfigForm initialConfigs={configs} />
			</ColorfulCard>

			{/* Image Settings */}
			<ColorfulCard colorScheme="green" className="p-6">
				<h3 className="text-lg font-semibold mb-4 flex items-center">
					<span className="mr-2">🖼️</span>
					Image Settings
				</h3>
				<div className="space-y-4">
					<div className="flex items-center justify-between p-4 bg-white rounded-lg border">
						<div>
							<h4 className="font-medium text-slate-900">Max Image Size</h4>
							<p className="text-sm text-slate-600">5MB per image</p>
						</div>
						<LoadingButton variant="secondary" size="sm">
							⚙️ Change
						</LoadingButton>
					</div>
					
					<div className="flex items-center justify-between p-4 bg-white rounded-lg border">
						<div>
							<h4 className="font-medium text-slate-900">Allowed Formats</h4>
							<p className="text-sm text-slate-600">JPG, PNG, WebP</p>
						</div>
						<ColorfulBadge variant="blue" size="sm">
							Optimized
						</ColorfulBadge>
					</div>
					
					<div className="flex items-center justify-between p-4 bg-white rounded-lg border">
						<div>
							<h4 className="font-medium text-slate-900">Auto Resize</h4>
							<p className="text-sm text-slate-600">Images automatically resized for web</p>
						</div>
						<ColorfulBadge variant="green" size="sm">
							Enabled
						</ColorfulBadge>
					</div>
				</div>
			</ColorfulCard>

			{/* Security Settings */}
			<ColorfulCard colorScheme="purple" className="p-6">
				<h3 className="text-lg font-semibold mb-4 flex items-center">
					<span className="mr-2">🔒</span>
					Security Settings
				</h3>
				<div className="space-y-4">
					<div className="flex items-center justify-between p-4 bg-white rounded-lg border">
						<div>
							<h4 className="font-medium text-slate-900">Admin Email</h4>
							<p className="text-sm text-slate-600">Configured via environment variables</p>
						</div>
						<ColorfulBadge variant="green" size="sm">
							Secure
						</ColorfulBadge>
					</div>
					
					<div className="flex items-center justify-between p-4 bg-white rounded-lg border">
						<div>
							<h4 className="font-medium text-slate-900">Session Timeout</h4>
							<p className="text-sm text-slate-600">24 hours (automatic logout)</p>
						</div>
						<LoadingButton variant="secondary" size="sm">
							⚙️ Adjust
						</LoadingButton>
					</div>
					
					<div className="flex items-center justify-between p-4 bg-white rounded-lg border">
						<div>
							<h4 className="font-medium text-slate-900">Database Access</h4>
							<p className="text-sm text-slate-600">Supabase with Row Level Security</p>
						</div>
						<ColorfulBadge variant="green" size="sm">
							Protected
						</ColorfulBadge>
					</div>
				</div>
			</ColorfulCard>

			{/* Export & Backup */}
			<ColorfulCard colorScheme="orange" className="p-6">
				<h3 className="text-lg font-semibold mb-4 flex items-center">
					<span className="mr-2">💾</span>
					Export & Backup
				</h3>
				<div className="space-y-4">
					<div className="flex items-center justify-between p-4 bg-white rounded-lg border">
						<div>
							<h4 className="font-medium text-slate-900">Product Data Export</h4>
							<p className="text-sm text-slate-600">Export all products to JSON or CSV</p>
						</div>
						<div className="flex space-x-2">
							<LoadingButton variant="primary" size="sm">
								📄 JSON
							</LoadingButton>
							<LoadingButton variant="secondary" size="sm">
								📊 CSV
							</LoadingButton>
						</div>
					</div>
					
					<div className="flex items-center justify-between p-4 bg-white rounded-lg border">
						<div>
							<h4 className="font-medium text-slate-900">Database Backup</h4>
							<p className="text-sm text-slate-600">Full database backup (Supabase handles this)</p>
						</div>
						<ColorfulBadge variant="blue" size="sm">
							Automatic
						</ColorfulBadge>
					</div>
					
					<div className="flex items-center justify-between p-4 bg-white rounded-lg border">
						<div>
							<h4 className="font-medium text-slate-900">Image Backup</h4>
							<p className="text-sm text-slate-600">All images stored in Supabase Storage</p>
						</div>
						<ColorfulBadge variant="green" size="sm">
							Secure
						</ColorfulBadge>
					</div>
				</div>
			</ColorfulCard>

			{/* System Info */}
			<ColorfulCard colorScheme="gradient" className="p-6">
				<h3 className="text-lg font-semibold mb-4 flex items-center">
					<span className="mr-2">ℹ️</span>
					System Information
				</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="space-y-3">
						<div className="flex justify-between">
							<span className="text-slate-600">Framework:</span>
							<span className="font-medium">Next.js 15</span>
						</div>
						<div className="flex justify-between">
							<span className="text-slate-600">Database:</span>
							<span className="font-medium">Supabase (PostgreSQL)</span>
						</div>
						<div className="flex justify-between">
							<span className="text-slate-600">Storage:</span>
							<span className="font-medium">Supabase Storage</span>
						</div>
					</div>
					<div className="space-y-3">
						<div className="flex justify-between">
							<span className="text-slate-600">Styling:</span>
							<span className="font-medium">Tailwind CSS</span>
						</div>
						<div className="flex justify-between">
							<span className="text-slate-600">Deployment:</span>
							<span className="font-medium">Vercel</span>
						</div>
						<div className="flex justify-between">
							<span className="text-slate-600">Version:</span>
							<span className="font-medium">1.0.0</span>
						</div>
					</div>
				</div>
			</ColorfulCard>
		</div>
	);
}
