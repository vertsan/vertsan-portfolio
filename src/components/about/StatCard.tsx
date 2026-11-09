import type { LucideIcon } from "lucide-react";
import { type CSSProperties, useEffect, useRef, useState } from "react";

interface StatCardProps {
	icon: LucideIcon;
	value: number;
	suffix?: string;
	decimals?: number;
	label: string;
	/** Stagger in ms, applied to the shared scroll reveal. */
	delay?: number;
}

/**
 * Equal-height stat tile with an accent icon chip, a count-up number and a
 * small label. The count-up is skipped for users who prefer reduced motion.
 */
export default function StatCard({
	icon: Icon,
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
			className="ui-card ui-card-flat flex h-full flex-col justify-between gap-4 p-5 sm:p-6"
		>
			<span className="ui-icon-chip" aria-hidden>
				<Icon className="size-[18px]" />
			</span>

			<div>
				<p
					className="text-3xl font-semibold tracking-tight tabular-nums"
					style={{ color: "var(--ui-text)" }}
				>
					{count.toFixed(decimals)}
					{suffix}
				</p>
				<p
					className="mt-1 text-xs font-medium"
					style={{ color: "var(--ui-text-subtle)" }}
				>
					{label}
				</p>
			</div>
		</div>
	);
}
