"use client";

import { useState, useRef, useEffect } from "react";

interface ProductImageProps {
	src: string;
	alt: string;
	className?: string;
	fallbackIcon?: React.ReactNode;
	lazy?: boolean;
}

export default function ProductImage({ src, alt, className = "", fallbackIcon, lazy = true }: ProductImageProps) {
	const [hasError, setHasError] = useState(false);
	const [isLoaded, setIsLoaded] = useState(false);
	const [isInView, setIsInView] = useState(!lazy);
	const imgRef = useRef<HTMLImageElement>(null);

	useEffect(() => {
		if (!lazy || isInView) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setIsInView(true);
					observer.disconnect();
				}
			},
			{ threshold: 0.1 }
		);

		if (imgRef.current) {
			observer.observe(imgRef.current);
		}

		return () => observer.disconnect();
	}, [lazy, isInView]);

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
		<div ref={imgRef} className={`relative ${className}`}>
			{!isInView && (
				<div className="absolute inset-0 bg-slate-100 animate-pulse flex items-center justify-center">
					<svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
					</svg>
				</div>
			)}
			{isInView && (
				<>
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img 
						src={src} 
						alt={alt} 
						className={`w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
						onError={() => setHasError(true)}
						onLoad={() => setIsLoaded(true)}
						loading={lazy ? "lazy" : "eager"}
					/>
				</>
			)}
		</div>
	);
}
