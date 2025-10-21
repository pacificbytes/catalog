import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Chahar Printing Press - Product Catalog",
	description: "Professional printing services catalog and admin panel",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
					<div className="container flex h-16 items-center justify-between px-4">
						<Link href="/" className="flex items-center space-x-2 cursor-pointer">
							<div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
								<span className="text-white font-bold text-sm">CP</span>
							</div>
							<span className="font-semibold text-lg">Chahar Printing Press</span>
						</Link>
						<nav className="flex items-center space-x-6">
							<Link href="/" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer">
								Catalog
							</Link>
							<Link href="/admin" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer">
								Admin
							</Link>
						</nav>
					</div>
				</header>
				<main className="min-h-screen bg-slate-50/50">
					{children}
				</main>
			</body>
		</html>
	);
}
