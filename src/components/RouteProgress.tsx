import { useRouter } from "@tanstack/react-router";
import { type RefObject, useEffect, useRef, useState } from "react";
import { cn } from "#/lib/utils";

const SHOW_DELAY = 120;
const MIN_VISIBLE = 420;
const SAFETY_TIMEOUT = 8000;
const TRICKLE_INTERVAL = 200;

/**
 * Slim top-of-viewport navigation progress bar.
 *
 * Visibility is driven by the router's lifecycle events rather than route
 * loaders, so it also gives feedback for instant client navigations. The bar
 * is only shown after a short delay to avoid a distracting flash on quick
 * transitions.
 */
export default function RouteProgress() {
	const router = useRouter();
	const [visible, setVisible] = useState(false);
	const [progress, setProgress] = useState(0);

	const visibleRef = useRef(false);
	const activeRef = useRef(false);
	const startedAt = useRef(0);
	const showTimer = useRef<number | null>(null);
	const hideTimer = useRef<number | null>(null);
	const safetyTimer = useRef<number | null>(null);
	const trickleTimer = useRef<number | null>(null);

	useEffect(() => {
		const setBarVisible = (next: boolean) => {
			visibleRef.current = next;
			setVisible(next);
		};

		const clearTimeoutRef = (ref: RefObject<number | null>) => {
			if (ref.current !== null) {
				window.clearTimeout(ref.current);
				ref.current = null;
			}
		};

		const clearTrickle = () => {
			if (trickleTimer.current !== null) {
				window.clearInterval(trickleTimer.current);
				trickleTimer.current = null;
			}
		};

		const reset = () => {
			clearTimeoutRef(showTimer);
			clearTimeoutRef(hideTimer);
			clearTimeoutRef(safetyTimer);
			clearTrickle();
		};

		const finish = () => {
			if (!activeRef.current) return;
			activeRef.current = false;

			clearTimeoutRef(showTimer);
			clearTimeoutRef(safetyTimer);
			clearTrickle();

			if (!visibleRef.current) return;

			const elapsed = performance.now() - startedAt.current;
			const delay = Math.max(0, MIN_VISIBLE - elapsed);

			hideTimer.current = window.setTimeout(() => {
				setProgress(100);
				hideTimer.current = window.setTimeout(() => {
					setBarVisible(false);
					hideTimer.current = window.setTimeout(() => setProgress(0), 320);
				}, 260);
			}, delay);
		};

		const begin = () => {
			reset();
			activeRef.current = true;
			startedAt.current = performance.now();
			setProgress(0);

			showTimer.current = window.setTimeout(() => {
				setBarVisible(true);
				setProgress(10);
				trickleTimer.current = window.setInterval(() => {
					setProgress((current) => {
						if (current >= 92) return current;
						const remaining = 92 - current;
						return current + Math.max(0.6, remaining * 0.09);
					});
				}, TRICKLE_INTERVAL);
			}, SHOW_DELAY);

			safetyTimer.current = window.setTimeout(finish, SAFETY_TIMEOUT);
		};

		const unsubscribeBeforeNavigate = router.subscribe(
			"onBeforeNavigate",
			(event) => {
				if (!event.pathChanged && !event.hrefChanged) return;
				begin();
			},
		);
		const unsubscribeResolved = router.subscribe("onResolved", finish);

		return () => {
			unsubscribeBeforeNavigate();
			unsubscribeResolved();
			reset();
		};
	}, [router]);

	return (
		<div
			aria-hidden="true"
			className={cn(
				"pointer-events-none fixed inset-x-0 top-0 z-[110] h-0.5",
				"transition-opacity duration-300 ease-out",
				visible ? "opacity-100" : "opacity-0",
			)}
		>
			<div
				className="h-full rounded-r-full bg-gradient-to-r from-[var(--accent-1)] via-[var(--accent-2)] to-[var(--accent-3)] shadow-[0_0_12px_-1px_var(--accent-2)] transition-[width] duration-200 ease-out"
				style={{ width: `${progress}%` }}
			/>
		</div>
	);
}
