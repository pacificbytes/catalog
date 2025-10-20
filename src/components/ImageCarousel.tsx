"use client";

import { useState } from "react";
import ProductImage from "@/components/ProductImage";

interface ImageCarouselProps {
	images: Array<{ id: string; url: string; alt?: string }>;
	productName: string;
}

export default function ImageCarousel({ images, productName }: ImageCarouselProps) {
	const [selectedIndex, setSelectedIndex] = useState(0);

	if (!images || images.length === 0) {
		return (
			<div className="aspect-square bg-slate-100 rounded-xl border border-slate-200 overflow-hidden">
				<div className="w-full h-full flex items-center justify-center text-slate-400">
					<svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
					</svg>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{/* Main Image */}
			<div className="aspect-square bg-slate-100 rounded-xl border border-slate-200 overflow-hidden relative group">
				<ProductImage 
					src={images[selectedIndex].url} 
					alt={images[selectedIndex].alt || productName} 
					className="w-full h-full object-cover"
					fallbackIcon={
						<svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
						</svg>
					}
				/>
				
				{/* Navigation Arrows */}
				{images.length > 1 && (
					<>
						<button
							onClick={() => setSelectedIndex(selectedIndex === 0 ? images.length - 1 : selectedIndex - 1)}
							className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
						>
							<svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
							</svg>
						</button>
						<button
							onClick={() => setSelectedIndex(selectedIndex === images.length - 1 ? 0 : selectedIndex + 1)}
							className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
						>
							<svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
							</svg>
						</button>
					</>
				)}
				
				{/* Image Counter */}
				{images.length > 1 && (
					<div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
						{selectedIndex + 1} / {images.length}
					</div>
				)}
			</div>

			{/* Thumbnail Strip */}
			{images.length > 1 && (
				<div className="flex gap-2 overflow-x-auto pb-2">
					{images.map((img, index) => (
						<button
							key={img.id}
							onClick={() => setSelectedIndex(index)}
							className={`flex-shrink-0 w-16 h-16 rounded-lg border-2 overflow-hidden transition-all ${
								index === selectedIndex 
									? 'border-blue-500 ring-2 ring-blue-200' 
									: 'border-slate-200 hover:border-slate-300'
							}`}
						>
							<ProductImage 
								src={img.url} 
								alt={img.alt || productName} 
								className="w-full h-full object-cover"
								fallbackIcon={
									<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
									</svg>
								}
							/>
						</button>
					))}
				</div>
			)}
		</div>
	);
}
