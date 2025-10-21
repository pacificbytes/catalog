import { getServerClient } from "@/lib/supabase/server";
import ColorfulCard from "@/components/ColorfulCard";
import Link from "next/link";

export default async function ContactPage() {
	const supabase = await getServerClient();
	
	// Fetch site configuration for contact details
	const { data: configData } = await supabase
		.from('site_config')
		.select('key, value')
		.in('key', [
			'company_name',
			'company_address',
			'company_phone',
			'company_email',
			'whatsapp_number',
			'directions_url'
		]);

	const config: Record<string, string> = {};
	configData?.forEach(item => {
		config[item.key] = item.value;
	});

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
			{/* Header */}
			<div className="bg-white shadow-sm border-b">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-3">
							<div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
								<span className="text-white font-bold text-lg">C</span>
							</div>
							<div>
								<h1 className="text-2xl font-bold text-gray-900">{config.company_name || 'Chahar Printing Press'}</h1>
								<p className="text-sm text-gray-600">Contact Us</p>
							</div>
						</div>
						<Link 
							href="/" 
							className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
						>
							← Back to Catalog
						</Link>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="text-center mb-12">
					<h2 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h2>
					<p className="text-xl text-gray-600 max-w-2xl mx-auto">
						We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
					</p>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
					{/* Contact Information */}
					<div className="space-y-8">
						<ColorfulCard className="p-8">
							<h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
								<span className="mr-3">📞</span>
								Contact Information
							</h3>
							
							<div className="space-y-6">
								{/* Phone */}
								<div className="flex items-start space-x-4">
									<div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
										<svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
											<path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
										</svg>
									</div>
									<div>
										<h4 className="font-semibold text-gray-900">Phone</h4>
										<a href={`tel:${config.company_phone}`} className="text-blue-600 hover:text-blue-800 transition-colors">
											{config.company_phone || '+91 9876543210'}
										</a>
									</div>
								</div>

								{/* Email */}
								<div className="flex items-start space-x-4">
									<div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
										<svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
											<path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
											<path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
										</svg>
									</div>
									<div>
										<h4 className="font-semibold text-gray-900">Email</h4>
										<a href={`mailto:${config.company_email}`} className="text-blue-600 hover:text-blue-800 transition-colors">
											{config.company_email || 'info@chaharprinting.com'}
										</a>
									</div>
								</div>

								{/* WhatsApp */}
								{config.whatsapp_number && (
									<div className="flex items-start space-x-4">
										<div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
											<svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
												<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
											</svg>
										</div>
										<div>
											<h4 className="font-semibold text-gray-900">WhatsApp</h4>
											<a 
												href={`https://wa.me/${config.whatsapp_number.replace(/[^0-9]/g, '')}`}
												target="_blank"
												rel="noopener noreferrer"
												className="text-green-600 hover:text-green-800 transition-colors"
											>
												{config.whatsapp_number}
											</a>
										</div>
									</div>
								)}

								{/* Address */}
								<div className="flex items-start space-x-4">
									<div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
										<svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
											<path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
										</svg>
									</div>
									<div>
										<h4 className="font-semibold text-gray-900">Address</h4>
										<p className="text-gray-600">{config.company_address || '123 Business Street, City, State 12345'}</p>
										{config.directions_url && (
											<a 
												href={config.directions_url}
												target="_blank"
												rel="noopener noreferrer"
												className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
											>
												Get Directions →
											</a>
										)}
									</div>
								</div>
							</div>
						</ColorfulCard>

						{/* Business Hours */}
						<ColorfulCard className="p-8">
							<h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
								<span className="mr-3">🕒</span>
								Business Hours
							</h3>
							<div className="space-y-3">
								<div className="flex justify-between">
									<span className="text-gray-600">Monday - Friday</span>
									<span className="font-semibold">9:00 AM - 6:00 PM</span>
								</div>
								<div className="flex justify-between">
									<span className="text-gray-600">Saturday</span>
									<span className="font-semibold">10:00 AM - 4:00 PM</span>
								</div>
								<div className="flex justify-between">
									<span className="text-gray-600">Sunday</span>
									<span className="font-semibold">Closed</span>
								</div>
							</div>
						</ColorfulCard>
					</div>

					{/* Contact Form */}
					<div>
						<ColorfulCard className="p-8">
							<h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
								<span className="mr-3">✉️</span>
								Send us a Message
							</h3>
							<form className="space-y-6">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div>
										<label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
											Full Name
										</label>
										<input
											type="text"
											id="name"
											name="name"
											required
											className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
											placeholder="Your full name"
										/>
									</div>
									<div>
										<label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
											Email Address
										</label>
										<input
											type="email"
											id="email"
											name="email"
											required
											className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
											placeholder="your@email.com"
										/>
									</div>
								</div>
								<div>
									<label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
										Phone Number
									</label>
									<input
										type="tel"
										id="phone"
										name="phone"
										className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
										placeholder="+91 9876543210"
									/>
								</div>
								<div>
									<label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
										Subject
									</label>
									<input
										type="text"
										id="subject"
										name="subject"
										required
										className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
										placeholder="What's this about?"
									/>
								</div>
								<div>
									<label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
										Message
									</label>
									<textarea
										id="message"
										name="message"
										rows={6}
										required
										className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
										placeholder="Tell us how we can help you..."
									></textarea>
								</div>
								<button
									type="submit"
									className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
								>
									Send Message
								</button>
							</form>
						</ColorfulCard>
					</div>
				</div>
			</div>

		</div>
	);
}
