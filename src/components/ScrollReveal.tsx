import { useEffect, useLayoutEffect } from "react";

const ATTR = "data-reveal";
const INIT_CLASS = "reveal-init";
const IN_CLASS = "reveal-in";

const useIsomorphicLayoutEffect =
	typeof window !== "undefined" ? useLayoutEffect : useEffect;

function revealNow(element: HTMLElement) {
	element.classList.remove(INIT_CLASS);
	element.classList.add(IN_CLASS);
	element.dataset.revealState = "done";
}

function isInViewport(element: HTMLElement) {
	const rect = element.getBoundingClientRect();
	const viewportHeight =
		window.innerHeight || document.documentElement.clientHeight;
	return rect.top < viewportHeight * 0.92 && rect.bottom > 0;
}

/**
 * Global scroll-reveal coordinator.
 *
 * Any element marked with `data-reveal` is hidden before paint and revealed
 * as it enters the viewport. A single IntersectionObserver and a MutationObserver
 * handle both statically rendered and dynamically added content. When the user
 * prefers reduced motion, all elements are shown immediately.
 */
export default function ScrollReveal() {
	useIsomorphicLayoutEffect(() => {
		const media = window.matchMedia("(prefers-reduced-motion: reduce)");
		const supportsObserver = "IntersectionObserver" in window;

		let observer: IntersectionObserver | null = null;

		const observe = (element: HTMLElement) => {
			if (element.dataset.revealState) return;

			if (media.matches || !supportsObserver) {
				revealNow(element);
				return;
			}

			element.classList.add(INIT_CLASS);

			if (isInViewport(element)) {
				requestAnimationFrame(() => revealNow(element));
				return;
			}

			observer?.observe(element);
		};

		const collect = (root: ParentNode) => {
			if (root instanceof HTMLElement && root.matches(`[${ATTR}]`)) {
				observe(root);
			}
			root.querySelectorAll<HTMLElement>(`[${ATTR}]`).forEach(observe);
		};

		if (supportsObserver) {
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
		}

		collect(document);

		const mutation = new MutationObserver((records) => {
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
			document.querySelectorAll<HTMLElement>(`[${ATTR}]`).forEach(revealNow);
			observer?.disconnect();
		};
		media.addEventListener("change", onPreferenceChange);

		return () => {
			observer?.disconnect();
			mutation.disconnect();
			media.removeEventListener("change", onPreferenceChange);
		};
	}, []);

	return null;
}
