"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function LoadingIndicator() {
	const [isLoading, setIsLoading] = useState(false);
	const pathname = usePathname();

	useEffect(() => {
		const handleStart = () => setIsLoading(true);
		const handleComplete = () => setIsLoading(false);

		// Listen for route changes
		const originalPushState = history.pushState;
		const originalReplaceState = history.replaceState;

		history.pushState = function(...args) {
			handleStart();
			originalPushState.apply(history, args);
			setTimeout(handleComplete, 100); // Small delay to show loading
		};

		history.replaceState = function(...args) {
			handleStart();
			originalReplaceState.apply(history, args);
			setTimeout(handleComplete, 100);
		};

		// Listen for popstate events (back/forward navigation)
		window.addEventListener('popstate', handleStart);
		
		// Complete loading when pathname changes
		const timer = setTimeout(handleComplete, 100);

		return () => {
			history.pushState = originalPushState;
			history.replaceState = originalReplaceState;
			window.removeEventListener('popstate', handleStart);
			clearTimeout(timer);
		};
	}, [pathname]);

	if (!isLoading) return null;

	return (
		<div className="fixed top-0 left-0 right-0 z-50">
			<div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse">
				<div className="h-full bg-gradient-to-r from-blue-600 to-purple-600 animate-loading-bar"></div>
			</div>
		</div>
	);
}
