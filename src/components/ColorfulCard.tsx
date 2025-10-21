"use client";

interface ColorfulCardProps {
	children: React.ReactNode;
	className?: string;
	hoverEffect?: boolean;
	colorScheme?: "blue" | "green" | "purple" | "pink" | "orange" | "gradient";
	elevation?: "low" | "medium" | "high";
}

export default function ColorfulCard({ 
	children, 
	className = "", 
	hoverEffect = true,
	colorScheme = "gradient",
	elevation = "medium"
}: ColorfulCardProps) {
	const colorSchemes = {
		blue: "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200",
		green: "bg-gradient-to-br from-green-50 to-green-100 border-green-200", 
		purple: "bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200",
		pink: "bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200",
		orange: "bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200",
		gradient: "bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 border-slate-200"
	};

	const elevationClasses = {
		low: "shadow-sm",
		medium: "shadow-lg",
		high: "shadow-2xl"
	};

	const hoverClasses = hoverEffect 
		? "hover:shadow-lg hover:border-blue-300 cursor-pointer transition-all duration-200" 
		: "transition-all duration-200";

	return (
		<div
			className={`rounded-xl border ${colorSchemes[colorScheme]} ${elevationClasses[elevation]} ${hoverClasses} ${className}`}
		>
			{children}
		</div>
	);
}
