import { useReducedMotion } from "framer-motion";
import Lenis from "lenis";
import { useEffect } from "react";

let instance: Lenis | null = null;

/** Crisp ease-out for programmatic jumps (nav links, back-to-top). */
const EASE_OUT = (t: number) => 1 - (1 - t) ** 4;

/** Clearance kept between the fixed header and a section target, matching `scroll-mt-20`. */
const HEADER_CLEARANCE = 80;

/** Smooth-scroll to an element id, falling back to native behaviour. */
export function scrollToId(id: string, clearance = HEADER_CLEARANCE) {
	const element = document.getElementById(id);
	if (!element) return;
	// Resolve the target position ourselves (rect + live scroll) so the Lenis
	// path and the native fallback land at exactly the same spot, regardless
	// of the target's `scroll-margin` or the root's `scroll-padding`.
	const top = element.getBoundingClientRect().top + window.scrollY - clearance;
	if (instance) {
		// `force` keeps jumps working while the mobile menu holds the scroll lock.
		instance.scrollTo(top, { duration: 0.9, easing: EASE_OUT, force: true });
		return;
	}
	window.scrollTo({ top, behavior: "smooth" });
}

export function scrollToTop() {
	if (instance) {
		instance.scrollTo(0, { duration: 0.9, easing: EASE_OUT, force: true });
		return;
	}
	window.scrollTo({ top: 0, behavior: "smooth" });
}

/**
 * Pause/resume Lenis alongside CSS scroll locks (e.g. the mobile menu).
 * Stopping prevents wheel input from desyncing Lenis while the page is locked.
 */
export function setSmoothScrollLocked(locked: boolean) {
	if (!instance) return;
	if (locked) instance.stop();
	else instance.start();
}

/**
 * Lenis smooth scrolling. It drives the native scroll position, so
 * framer-motion's `useScroll` and TanStack Router's scroll restoration keep
 * working without any extra wiring.
 *
 * Tuning notes:
 * - `lerp` damping (instead of a fixed duration) makes the page respond to the
 *   wheel immediately and settle quickly, with no long floaty tail dragging
 *   behind the input. 0.14 is snappy yet still buttery.
 * - `wheelMultiplier` slightly above 1 covers more distance per tick, so long
 *   pages feel faster.
 */
export default function SmoothScroll({ enabled = true }: { enabled?: boolean }) {
	const reduced = useReducedMotion();

	useEffect(() => {
		if (!enabled || reduced) return;

		const lenis = new Lenis({
			smoothWheel: true,
			lerp: 0.14,
			wheelMultiplier: 1.15,
			touchMultiplier: 1.4,
			// Lenis runs its own requestAnimationFrame loop.
			autoRaf: true,
		});
		instance = lenis;

		return () => {
			lenis.destroy();
			if (instance === lenis) instance = null;
		};
	}, [enabled, reduced]);

	return null;
}
