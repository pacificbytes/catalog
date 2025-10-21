"use client";

interface ColorfulBadgeProps {
	children: React.ReactNode;
	variant?: "blue" | "green" | "purple" | "pink" | "orange" | "red" | "yellow" | "indigo";
	size?: "sm" | "md" | "lg";
	className?: string;
	animated?: boolean;
}

export default function ColorfulBadge({ 
	children, 
	variant = "blue", 
	size = "md",
	className = "",
	animated = false
}: ColorfulBadgeProps) {
	const variants = {
		blue: "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg",
		green: "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg",
		purple: "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg",
		pink: "bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg",
		orange: "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg",
		red: "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg",
		yellow: "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg",
		indigo: "bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg"
	};

	const sizes = {
		sm: "px-2 py-1 text-xs",
		md: "px-3 py-1 text-sm",
		lg: "px-4 py-2 text-base"
	};

	const animationClass = animated 
		? "animate-pulse hover:animate-none hover:scale-110 hover:shadow-xl" 
		: "hover:scale-110 hover:shadow-xl hover:-translate-y-0.5";

	return (
		<span className={`inline-flex items-center rounded-full font-medium transition-all duration-300 ease-out cursor-pointer ${variants[variant]} ${sizes[size]} ${animationClass} ${className}`}>
			{children}
		</span>
	);
}
