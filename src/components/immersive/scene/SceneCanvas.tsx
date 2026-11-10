import { useReducedMotion } from "framer-motion";
import { lazy, Suspense, useEffect, useState } from "react";
import { useIsDark } from "#/lib/useIsDark";
import { useScene } from "./SceneContext";

const Scene = lazy(() => import("./Scene"));

type IdleWindow = Window & {
	requestIdleCallback?: (
		callback: () => void,
		options?: { timeout: number },
	) => number;
	cancelIdleCallback?: (handle: number) => void;
};

/**
 * Hosts the lazy WebGL scene as a fixed, non-interactive layer behind the page.
 * Nothing is requested until the main thread is idle, so the hero copy paints
 * first and the canvas arrives afterwards.
 */
export default function SceneCanvas() {
	const { quality, setQuality, setReady, isMobile } = useScene();
	const reduced = useReducedMotion() ?? false;
	const dark = useIsDark();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		if (reduced) return;
		const idleWindow = window as IdleWindow;		let handle: number;

		if (typeof idleWindow.requestIdleCallback === "function") {
			handle = idleWindow.requestIdleCallback(() => setMounted(true), {
				timeout: 1400,
			});
		} else {
			handle = window.setTimeout(() => setMounted(true), 700);
		}

		return () => {
			if (typeof idleWindow.cancelIdleCallback === "function") {
				idleWindow.cancelIdleCallback(handle);
			}
			window.clearTimeout(handle);
		};
	}, [reduced]);

	if (reduced) return null;

	if (reduced) return null;

	const particleCount = isMobile
		? quality === "high"
			? 15_000
			: 8_000
		: quality === "high"
			? 60_000
			: 20_000;

	// Bloom is the most expensive pass; desktop + dark + full quality only.
	const bloom = dark && quality === "high" && !isMobile;

	return (
		<div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
			<Suspense fallback={null}>
				{mounted ? (
					<Scene
						key={`${quality}-${isMobile ? "mobile" : "desktop"}`}
						particleCount={particleCount}
						dark={dark}
						reduced={reduced}
						bloom={bloom}
						onReady={() => setReady(true)}
						onDecline={() => setQuality("low")}
					/>
				) : null}
			</Suspense>
		</div>
	);
}
