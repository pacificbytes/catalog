"use client";

import { useState } from "react";
import { updateSiteConfigAction } from "@/app/admin/settings/actions";
import ColorfulCard from "@/components/ColorfulCard";
import LoadingButton from "@/components/LoadingButton";

interface SiteConfig {
	id: string;
	key: string;
	value: string;
	description?: string;
	created_at: string;
	updated_at: string;
}

interface SiteConfigFormProps {
	initialConfigs: SiteConfig[];
}

export default function SiteConfigForm({ initialConfigs }: SiteConfigFormProps) {
	const [configs, setConfigs] = useState<Record<string, string>>(() => {
		const configMap: Record<string, string> = {};
		initialConfigs.forEach(config => {
			configMap[config.key] = config.value;
		});
		return configMap;
	});
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleInputChange = (key: string, value: string) => {
		setConfigs(prev => ({
			...prev,
			[key]: value
		}));
		setSuccess(false);
		setError(null);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			const result = await updateSiteConfigAction(configs);
			if (result.success) {
				setSuccess(true);
				setTimeout(() => setSuccess(false), 3000);
			} else {
				setError(result.error || "Failed to update configuration. Please try again.");
			}
		} catch (err) {
			console.error("Error updating configuration:", err);
			setError("An error occurred while updating configuration.");
		} finally {
			setLoading(false);
		}
	};

	const configGroups = [
		{
			title: "Company Information",
			icon: "🏢",
			colorScheme: "blue" as const,
			configs: [
				{ key: "company_name", label: "Company Name", type: "text" },
				{ key: "company_address", label: "Company Address", type: "textarea" },
				{ key: "company_phone", label: "Phone Number", type: "tel" },
				{ key: "company_email", label: "Email Address", type: "email" }
			]
		},
		{
			title: "Contact & Communication",
			icon: "📞",
			colorScheme: "green" as const,
			configs: [
				{ key: "whatsapp_number", label: "WhatsApp Number", type: "tel" },
				{ key: "whatsapp_message_template", label: "WhatsApp Message Template", type: "textarea" },
				{ key: "directions_url", label: "Directions Link", type: "url" },
				{ key: "copyright_text", label: "Copyright Text", type: "text" }
			]
		},
		{
			title: "Social Media Links",
			icon: "🌐",
			colorScheme: "purple" as const,
			configs: [
				{ key: "facebook_url", label: "Facebook URL", type: "url" },
				{ key: "instagram_url", label: "Instagram URL", type: "url" },
				{ key: "linkedin_url", label: "LinkedIn URL", type: "url" }
			]
		},
		{
			title: "Business Hours",
			icon: "🕒",
			colorScheme: "orange" as const,
			configs: [
				{ key: "business_hours_monday", label: "Monday Hours", type: "text" },
				{ key: "business_hours_tuesday", label: "Tuesday Hours", type: "text" },
				{ key: "business_hours_wednesday", label: "Wednesday Hours", type: "text" },
				{ key: "business_hours_thursday", label: "Thursday Hours", type: "text" },
				{ key: "business_hours_friday", label: "Friday Hours", type: "text" },
				{ key: "business_hours_saturday", label: "Saturday Hours", type: "text" },
				{ key: "business_hours_sunday", label: "Sunday Hours", type: "text" }
			]
		}
	];

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			{success && (
				<div className="p-4 bg-green-100 border border-green-300 rounded-lg">
					<div className="flex items-center">
						<svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
							<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
						</svg>
						<p className="text-green-800 font-medium">Configuration updated successfully!</p>
					</div>
				</div>
			)}

			{error && (
				<div className="p-4 bg-red-100 border border-red-300 rounded-lg">
					<div className="flex items-center">
						<svg className="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
							<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
						</svg>
						<p className="text-red-800 font-medium">{error}</p>
					</div>
				</div>
			)}

			{configGroups.map((group) => (
				<ColorfulCard key={group.title} colorScheme={group.colorScheme} className="p-6">
					<h3 className="text-lg font-semibold mb-4 flex items-center">
						<span className="mr-2">{group.icon}</span>
						{group.title}
					</h3>
					<div className="space-y-4">
						{group.configs.map((config) => (
							<div key={config.key}>
								<label className="block text-sm font-medium text-slate-700 mb-2">
									{config.label}
								</label>
								{config.type === "textarea" ? (
									<textarea
										value={configs[config.key] || ""}
										onChange={(e) => handleInputChange(config.key, e.target.value)}
										className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all duration-200 bg-white/80 backdrop-blur-sm"
										rows={3}
										placeholder={`Enter ${config.label.toLowerCase()}`}
									/>
								) : (
									<input
										type={config.type}
										value={configs[config.key] || ""}
										onChange={(e) => handleInputChange(config.key, e.target.value)}
										className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-all duration-200 bg-white/80 backdrop-blur-sm"
										placeholder={`Enter ${config.label.toLowerCase()}`}
									/>
								)}
								{config.key === "whatsapp_number" && (
									<p className="text-xs text-slate-500 mt-1">
										This number will be used for WhatsApp contact buttons on product pages
									</p>
								)}
								{config.key === "whatsapp_message_template" && (
									<p className="text-xs text-slate-500 mt-1">
										Use {"{product_name}"} and {"{product_link}"} as placeholders. This message will be sent when customers click the WhatsApp button.
									</p>
								)}
							</div>
						))}
					</div>
				</ColorfulCard>
			))}

			<div className="flex justify-end">
				<LoadingButton
					type="submit"
					loading={loading}
					loadingText="Saving..."
					variant="primary"
					size="lg"
					className="px-8 py-3"
				>
					💾 Save Configuration
				</LoadingButton>
			</div>
		</form>
	);
}
