"use client";

import { useState } from "react";

interface ProductImageProps {
	src: string;
	alt: string;
	className?: string;
	fallbackIcon?: React.ReactNode;
}

export default function ProductImage({ src, alt, className = "", fallbackIcon }: ProductImageProps) {
	const [hasError, setHasError] = useState(false);

	if (hasError || !src) {
		return (
			<div className={`flex items-center justify-center text-slate-400 ${className}`}>
				{fallbackIcon || (
					<svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
					</svg>
				)}
			</div>
		);
	}

	return (
		<>
			{/* eslint-disable-next-line @next/next/no-img-element */}
			<img 
				src={src} 
				alt={alt} 
				className={className}
				onError={() => setHasError(true)}
			/>
		</>
	);
}
