import { useReducedMotion } from "framer-motion";
import Lenis from "lenis";
import { useEffect } from "react";

let instance: Lenis | null = null;

/** Smooth-scroll to an element id, falling back to native behaviour. */
export function scrollToId(id: string, offset = -24) {
	const element = document.getElementById(id);
	if (!element) return;
	if (instance) {
		instance.scrollTo(element, { offset, duration: 1.1 });
		return;
	}
	const top = element.getBoundingClientRect().top + window.scrollY + offset;
	window.scrollTo({ top, behavior: "smooth" });
}

export function scrollToTop() {
	if (instance) {
		instance.scrollTo(0, { duration: 1 });
		return;
	}
	window.scrollTo({ top: 0, behavior: "smooth" });
}

/**
 * Lenis smooth scrolling. It drives the native scroll position, so
 * framer-motion's `useScroll` and TanStack Router's scroll restoration keep
 * working without any extra wiring.
 */
export default function SmoothScroll({ enabled = true }: { enabled?: boolean }) {
	const reduced = useReducedMotion();

	useEffect(() => {
		if (!enabled || reduced) return;

		const lenis = new Lenis({
			duration: 1.05,
			easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
			smoothWheel: true,
			touchMultiplier: 1.4,
			wheelMultiplier: 1,
		});
		instance = lenis;

		let frame = 0;
		const raf = (time: number) => {
			lenis.raf(time);
			frame = requestAnimationFrame(raf);
		};
		frame = requestAnimationFrame(raf);

		return () => {
			cancelAnimationFrame(frame);
			lenis.destroy();
			if (instance === lenis) instance = null;
		};
	}, [enabled, reduced]);

	return null;
}
