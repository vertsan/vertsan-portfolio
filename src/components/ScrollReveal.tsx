import { useEffect } from "react";

const ATTR = "data-reveal";
const OFF_CLASS = "reveal-off";
const EASING = "cubic-bezier(0.22, 1, 0.36, 1)";
const DEFAULT_DURATION = 700;
const DEFAULT_DISTANCE = "22px";

const revealed = new WeakSet<HTMLElement>();

function isInViewport(element: HTMLElement) {
	const rect = element.getBoundingClientRect();
	const viewportHeight =
		window.innerHeight || document.documentElement.clientHeight;
	return rect.top < viewportHeight * 0.92 && rect.bottom > 0;
}

function readNumber(value: string, fallback: number) {
	const parsed = Number.parseFloat(value);
	return Number.isFinite(parsed) ? parsed : fallback;
}

/**
 * Reveals an element with the Web Animations API.
 *
 * This deliberately avoids adding/removing classes or data attributes: React
 * hydrates streamed Suspense boundaries separately, so the effect can run
 * while part of the tree is still hydrating. Mutating a React-managed
 * attribute at that point triggers a hydration mismatch warning; an animation
 * does not touch the DOM attributes at all.
 */
function revealNow(element: HTMLElement) {
	if (revealed.has(element)) return;
	revealed.add(element);

	if (typeof element.animate !== "function") {
		document.documentElement.classList.add(OFF_CLASS);
		return;
	}

	const styles = window.getComputedStyle(element);
	const distance =
		styles.getPropertyValue("--reveal-y").trim() || DEFAULT_DISTANCE;
	const duration = readNumber(
		styles.getPropertyValue("--reveal-duration"),
		DEFAULT_DURATION,
	);
	const delay = readNumber(styles.getPropertyValue("--reveal-delay"), 0);

	element.animate(
		[
			{ opacity: 0, translate: `0 ${distance}` },
			{ opacity: 1, translate: "0 0" },
		],
		{ duration, delay, easing: EASING, fill: "both" },
	);
}

/**
 * Global scroll-reveal coordinator.
 *
 * Any element marked with `data-reveal` is hidden by CSS and revealed as it
 * enters the viewport. A single IntersectionObserver and a MutationObserver
 * handle both statically rendered and dynamically added content. When the user
 * prefers reduced motion, all elements are shown immediately.
 */
export default function ScrollReveal() {
	useEffect(() => {
		const root = document.documentElement;
		const media = window.matchMedia("(prefers-reduced-motion: reduce)");
		const supportsObserver = "IntersectionObserver" in window;

		if (media.matches || !supportsObserver) {
			root.classList.add(OFF_CLASS);
			return () => root.classList.remove(OFF_CLASS);
		}

		let observer: IntersectionObserver | null = null;
		let mutation: MutationObserver | null = null;

		const observe = (element: HTMLElement) => {
			if (revealed.has(element)) return;

			if (isInViewport(element)) {
				revealNow(element);
				return;
			}

			observer?.observe(element);
		};

		const collect = (rootNode: ParentNode) => {
			if (rootNode instanceof HTMLElement && rootNode.matches(`[${ATTR}]`)) {
				observe(rootNode);
			}
			rootNode.querySelectorAll<HTMLElement>(`[${ATTR}]`).forEach(observe);
		};

		observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (!entry.isIntersecting) continue;
					const element = entry.target as HTMLElement;
					revealNow(element);
					observer?.unobserve(element);
				}
			},
			{ rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
		);

		collect(document);

		mutation = new MutationObserver((records) => {
			for (const record of records) {
				record.addedNodes.forEach((node) => {
					if (node.nodeType !== Node.ELEMENT_NODE) return;
					collect(node as HTMLElement);
				});
			}
		});
		mutation.observe(document.body, { childList: true, subtree: true });

		const onPreferenceChange = () => {
			if (!media.matches) return;
			root.classList.add(OFF_CLASS);
			observer?.disconnect();
			mutation?.disconnect();
		};
		media.addEventListener("change", onPreferenceChange);

		return () => {
			observer?.disconnect();
			mutation?.disconnect();
			media.removeEventListener("change", onPreferenceChange);
			root.classList.remove(OFF_CLASS);
		};
	}, []);

	return null;
}
