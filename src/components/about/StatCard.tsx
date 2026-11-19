import { type CSSProperties, useEffect, useRef, useState } from "react";

interface StatCardProps {
	value: number;
	suffix?: string;
	decimals?: number;
	label: string;
	/** Stagger in ms, applied to the shared scroll reveal. */
	delay?: number;
}

/**
 * Unboxed metric for the About hairline strip: a large count-up number and a
 * muted label, with no card chrome of its own.
 */
export default function StatCard({
	value,
	suffix = "",
	decimals = 0,
	label,
	delay = 0,
}: StatCardProps) {
	const ref = useRef<HTMLDivElement>(null);
	const [count, setCount] = useState(0);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;

		const media = window.matchMedia("(prefers-reduced-motion: reduce)");
		if (media.matches) {
			setCount(value);
			return;
		}

		let frame = 0;
		let started = false;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (!entry.isIntersecting || started) return;
				started = true;
				observer.disconnect();

				const start = performance.now();
				const duration = 1400;

				const tick = (now: number) => {
					const progress = Math.min((now - start) / duration, 1);
					const eased = 1 - (1 - progress) ** 3;
					setCount(eased * value);
					if (progress < 1) frame = requestAnimationFrame(tick);
				};

				frame = requestAnimationFrame(tick);
			},
			{ threshold: 0.4 },
		);

		observer.observe(el);

		return () => {
			observer.disconnect();
			cancelAnimationFrame(frame);
		};
	}, [value]);

	return (
		<div
			ref={ref}
			data-reveal
			style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
			className="px-4 first:pl-0 last:pr-0 sm:px-6"
		>
			<p className="text-2xl font-semibold tracking-tight tabular-nums text-neutral-900 dark:text-white sm:text-3xl">
				{count.toFixed(decimals)}
				{suffix}
			</p>
			<p className="mt-1.5 text-xs font-medium text-neutral-500 dark:text-neutral-400">
				{label}
			</p>
		</div>
	);
}