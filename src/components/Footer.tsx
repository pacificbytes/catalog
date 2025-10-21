"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getBrowserClient } from "@/lib/supabase/client";

interface FooterConfig {
	company_name: string;
	company_address: string;
	company_phone: string;
	company_email: string;
	directions_url: string;
	copyright_text: string;
	facebook_url: string;
	instagram_url: string;
	linkedin_url: string;
}

export default function Footer() {
	const [config, setConfig] = useState<FooterConfig>({
		company_name: '',
		company_address: '',
		company_phone: '',
		company_email: '',
		directions_url: '',
		copyright_text: '',
		facebook_url: '',
		instagram_url: '',
		linkedin_url: ''
	});
	const [loading, setLoading] = useState(true);
	const supabase = getBrowserClient();

	useEffect(() => {
		const fetchConfig = async () => {
			try {
				const { data, error } = await supabase
					.from('site_config')
					.select('key, value')
					.in('key', [
						'company_name',
						'company_address', 
						'company_phone',
						'company_email',
						'directions_url',
						'copyright_text',
						'facebook_url',
						'instagram_url',
						'linkedin_url'
					]);
				
				if (error) {
					console.error('Error fetching footer config:', error);
				} else {
					const configData: Partial<FooterConfig> = {};
					data?.forEach((item: { key: string; value: string }) => {
						configData[item.key as keyof FooterConfig] = item.value;
					});
					setConfig(prev => ({ ...prev, ...configData }));
				}
			} catch (error) {
				console.error('Error fetching footer config:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchConfig();
	}, [supabase]);

	if (loading) {
		return (
			<footer className="bg-slate-900 text-white">
				<div className="container mx-auto px-4 py-8">
					<div className="animate-pulse">
						<div className="h-4 bg-slate-700 rounded w-1/4 mb-4"></div>
						<div className="h-3 bg-slate-700 rounded w-1/2 mb-2"></div>
						<div className="h-3 bg-slate-700 rounded w-1/3"></div>
					</div>
				</div>
			</footer>
		);
	}

	return (
		<footer className="bg-slate-900 text-white">
			<div className="container mx-auto px-4 py-12">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{/* Company Info */}
					<div>
						<h3 className="text-xl font-semibold mb-4">{config.company_name}</h3>
						<div className="space-y-2 text-slate-300">
							<p className="flex items-start">
								<svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
									<path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
								</svg>
								{config.company_address}
							</p>
							<p className="flex items-center">
								<svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
									<path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
								</svg>
								<a href={`tel:${config.company_phone}`} className="hover:text-white transition-colors">
									{config.company_phone}
								</a>
							</p>
							<p className="flex items-center">
								<svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
									<path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
									<path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
								</svg>
								<a href={`mailto:${config.company_email}`} className="hover:text-white transition-colors">
									{config.company_email}
								</a>
							</p>
							{config.directions_url && (
								<p className="flex items-center">
									<svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
										<path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
									</svg>
									<a href={config.directions_url} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
										Get Directions
									</a>
								</p>
							)}
						</div>
					</div>

					{/* Quick Links */}
					<div>
						<h3 className="text-xl font-semibold mb-4">Quick Links</h3>
						<ul className="space-y-2 text-slate-300">
							<li>
								<Link href="/" className="hover:text-white transition-colors">Home</Link>
							</li>
							<li>
								<Link href="/#products" className="hover:text-white transition-colors">Products</Link>
							</li>
							<li>
								<Link href="/categories" className="hover:text-white transition-colors">Categories & Tags</Link>
							</li>
							<li>
								<Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link>
							</li>
						</ul>
					</div>

					{/* Social Media */}
					<div>
						<h3 className="text-xl font-semibold mb-4">Follow Us</h3>
						<div className="flex space-x-4">
							{config.facebook_url && (
								<a 
									href={config.facebook_url} 
									target="_blank" 
									rel="noopener noreferrer"
									className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
								>
									<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
										<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
									</svg>
								</a>
							)}
							{config.instagram_url && (
								<a 
									href={config.instagram_url} 
									target="_blank" 
									rel="noopener noreferrer"
									className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center hover:from-purple-600 hover:to-pink-600 transition-colors"
								>
									<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
										<path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.647.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.418-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.244c-.875.807-2.026 1.297-3.323 1.297zm7.83-9.781H6.721c-.49 0-.928-.438-.928-.928s.438-.928.928-.928h9.558c.49 0 .928.438.928.928s-.438.928-.928.928z"/>
									</svg>
								</a>
							)}
							{config.linkedin_url && (
								<a 
									href={config.linkedin_url} 
									target="_blank" 
									rel="noopener noreferrer"
									className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center hover:bg-blue-800 transition-colors"
								>
									<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
										<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
									</svg>
								</a>
							)}
						</div>
					</div>
				</div>
				
				{/* Copyright */}
				<div className="border-t border-slate-700 mt-8 pt-8 text-center text-slate-400">
					<p>{config.copyright_text}</p>
				</div>
			</div>
		</footer>
	);
}
