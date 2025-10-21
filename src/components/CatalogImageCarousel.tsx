"use client";

import { useState, useRef, useCallback } from "react";
import ProductImage from "@/components/ProductImage";

interface CatalogImageCarouselProps {
	images: Array<{ id: string; url: string; alt?: string }>;
	productName: string;
}

export default function CatalogImageCarousel({ images, productName }: CatalogImageCarouselProps) {
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [touchStart, setTouchStart] = useState<number | null>(null);
	const [touchEnd, setTouchEnd] = useState<number | null>(null);
	const [isDragging, setIsDragging] = useState(false);
	const [dragOffset, setDragOffset] = useState(0);
	const carouselRef = useRef<HTMLDivElement>(null);

	// Minimum distance for swipe detection
	const minSwipeDistance = 50;

	const handleTouchStart = (e: React.TouchEvent) => {
		setTouchEnd(null);
		setTouchStart(e.targetTouches[0].clientX);
		setIsDragging(true);
		setDragOffset(0);
	};

	const handleTouchMove = (e: React.TouchEvent) => {
		if (!isDragging || !touchStart) return;
		
		const currentX = e.targetTouches[0].clientX;
		const deltaX = currentX - touchStart;
		setDragOffset(deltaX);
		setTouchEnd(currentX);
	};

	const handleTouchEnd = () => {
		if (!isDragging || !touchStart || !touchEnd) {
			setIsDragging(false);
			setDragOffset(0);
			return;
		}
		
		const distance = touchStart - touchEnd;
		const isLeftSwipe = distance > minSwipeDistance;
		const isRightSwipe = distance < -minSwipeDistance;

		if (isLeftSwipe && images.length > 1) {
			changeImage(selectedIndex === images.length - 1 ? 0 : selectedIndex + 1);
		} else if (isRightSwipe && images.length > 1) {
			changeImage(selectedIndex === 0 ? images.length - 1 : selectedIndex - 1);
		}
		
		setIsDragging(false);
		setDragOffset(0);
	};

	const changeImage = useCallback((newIndex: number) => {
		if (newIndex === selectedIndex) return;
		setSelectedIndex(newIndex);
	}, [selectedIndex]);

	if (!images || images.length === 0) {
		return (
			<div className="aspect-square bg-slate-100 rounded-xl border border-slate-200 overflow-hidden">
				<div className="w-full h-full flex items-center justify-center text-slate-400">
					<svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
					</svg>
				</div>
			</div>
		);
	}

	return (
		<div className="relative group">
			{/* Main Image */}
			<div 
				ref={carouselRef}
				className="aspect-square bg-slate-100 rounded-xl border border-slate-200 overflow-hidden relative cursor-grab active:cursor-grabbing"
				onTouchStart={handleTouchStart}
				onTouchMove={handleTouchMove}
				onTouchEnd={handleTouchEnd}
			>
				<div 
					className="flex h-full transition-transform duration-300 ease-out"
					style={{
						transform: `translateX(${-selectedIndex * 100 + (isDragging ? (dragOffset / (carouselRef.current?.offsetWidth || 1)) * 100 : 0)}%)`,
					}}
				>
					{images.map((img, index) => (
						<div key={img.id} className="w-full h-full flex-shrink-0">
							<ProductImage 
								src={img.url} 
								alt={img.alt || productName} 
								className="w-full h-full object-cover"
								lazy={index === selectedIndex ? false : true} // Current image loads immediately, others lazy load
								fallbackIcon={
									<svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
									</svg>
								}
							/>
						</div>
					))}
				</div>
				
				{/* Image Counter Badge */}
				{images.length > 1 && (
					<div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
						{images.length} photos
					</div>
				)}
				
				{/* Navigation Arrows */}
				{images.length > 1 && (
					<>
						<button
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								changeImage(selectedIndex === 0 ? images.length - 1 : selectedIndex - 1);
							}}
							className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
							aria-label="Previous image"
						>
							<svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
							</svg>
						</button>
						<button
							onClick={(e) => {
								e.preventDefault();
								e.stopPropagation();
								changeImage(selectedIndex === images.length - 1 ? 0 : selectedIndex + 1);
							}}
							className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
							aria-label="Next image"
						>
							<svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
							</svg>
						</button>
					</>
				)}
				
				{/* Thumbnail Strip */}
				{images.length > 1 && (
					<div className="absolute bottom-2 left-2 right-2 flex gap-1 overflow-x-auto">
						{images.slice(0, 4).map((img, idx) => (
							<button
								key={img.id}
								onClick={(e) => {
									e.preventDefault();
									e.stopPropagation();
									changeImage(idx);
								}}
								className={`flex-shrink-0 w-8 h-8 rounded border overflow-hidden transition-all ${
									idx === selectedIndex 
										? 'border-white ring-2 ring-white/50' 
										: 'border-white/50 hover:border-white/80'
								}`}
								aria-label={`View image ${idx + 1}`}
							>
								<ProductImage 
									src={img.url} 
									alt={img.alt || productName} 
									className="w-full h-full object-cover"
									lazy={true} // Thumbnails can lazy load
									fallbackIcon={
										<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
										</svg>
									}
								/>
							</button>
						))}
						{images.length > 4 && (
							<div className="flex-shrink-0 w-8 h-8 rounded border border-white/50 bg-black/50 flex items-center justify-center">
								<span className="text-white text-xs font-bold">+{images.length - 4}</span>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
