import {
	type MotionValue,
	motion,
	useInView,
	useMotionValue,
	useReducedMotion,
	useSpring,
	useTransform,
} from "framer-motion";
import {
	type CSSProperties,
	type ReactNode,
	useEffect,
	useRef,
	useState,
} from "react";

import { cn } from "#/lib/utils";

/** The single easing curve used across the experience. */
export const EASE = [0.22, 1, 0.36, 1] as const;

export const fadeUp = {
	hidden: { opacity: 0, y: 24 },
	show: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.7, ease: EASE },
	},
};

export const staggerParent = {
	hidden: {},
	show: {
		transition: { staggerChildren: 0.06, delayChildren: 0.1 },
	},
};

/** A 1280px column with the shared vertical rhythm. */
export function Container({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<div className={cn("mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-12", className)}>
			{children}
		</div>
	);
}

/** Small uppercase label that opens a section. */
export function SectionLabel({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<span
			className={cn(
				"mono-label inline-flex items-center gap-3 text-[var(--i-subtle)]",
				className,
			)}
		>
			<span
				aria-hidden
				className="h-px w-7 bg-gradient-to-r from-[#2dd4bf] to-transparent"
			/>
			{children}
		</span>
	);
}

/** Fluid reveal: content smoothly emerges without hard overflow clipping or blocking spans. */
export function Reveal({
	children,
	delay = 0,
	className,
}: {
	children: ReactNode;
	delay?: number;
	className?: string;
}) {
	const reduced = useReducedMotion();
	return (
		<span className={cn("inline-block overflow-visible align-top", className)}>
			<motion.span
				className="inline-block will-change-[transform,opacity]"
				initial={reduced ? false : { opacity: 0, y: 16 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true, amount: 0.05, margin: "0px 0px 60px 0px" }}
				transition={{ duration: 0.65, ease: EASE, delay }}
			>
				{children}
			</motion.span>
		</span>
	);
}

/** Per-letter reveal used once, on the hero name. */
export function SplitText({
	text,
	className,
	stagger = 0.045,
	delay = 0.1,
}: {
	text: string;
	className?: string;
	stagger?: number;
	delay?: number;
}) {
	const reduced = useReducedMotion();
	const chars = Array.from(text);

	return (
		<span className={cn("inline-block", className)} aria-label={text}>
			{chars.map((char, index) => (
				<span
					// biome-ignore lint/suspicious/noArrayIndexKey: characters are positional
					key={`${char}-${index}`}
					aria-hidden
					className="inline-block align-bottom"
				>
					<motion.span
						className="inline-block will-change-[transform,opacity]"
						initial={reduced ? false : { y: 14, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{
							duration: 0.7,
							ease: EASE,
							delay: delay + index * stagger,
						}}
					>
						{char === " " ? "\u00A0" : char}
					</motion.span>
				</span>
			))}
		</span>
	);
}

/** Word-by-word opacity reveal tied to scroll progress. Words stay legible at 0.45 min opacity. */
export function ScrollWords({
	text,
	progress,
	className,
}: {
	text: string;
	progress: MotionValue<number>;
	className?: string;
}) {
	const words = text.split(" ");
	return (
		<p className={cn("flex flex-wrap", className)}>
			{words.map((word, index) => {
				const start = index / words.length;
				const end = Math.min(1, start + 1.4 / words.length);
				return (
					<Word key={`${word}-${index}`} progress={progress} start={start} end={end}>
						{word}
					</Word>
				);
			})}
		</p>
	);
}

function Word({
	children,
	progress,
	start,
	end,
}: {
	children: ReactNode;
	progress: MotionValue<number>;
	start: number;
	end: number;
}) {
	const reduced = useReducedMotion();
	// Base opacity is 0.45 so text is never washed out or invisible before scroll
	const opacity = useTransform(progress, [start, end], [0.45, 1]);

	return (
		<span className="mr-[0.28em] inline-block">
			<motion.span
				style={reduced ? undefined : { opacity }}
				className="inline-block"
			>
				{children}
			</motion.span>
		</span>
	);
}

/** Count-up number that starts when scrolled into view. */
export function CountUp({
	value,
	suffix = "",
	duration = 1.6,
	className,
}: {
	value: number;
	suffix?: string;
	duration?: number;
	className?: string;
}) {
	const ref = useRef<HTMLSpanElement>(null);
	const inView = useInView(ref, { once: true, margin: "-12% 0px" });
	const reduced = useReducedMotion();
	const [display, setDisplay] = useState(reduced ? value : 0);

	useEffect(() => {
		if (!inView || reduced) {
			if (reduced) setDisplay(value);
			return;
		}
		let frame = 0;
		const start = performance.now();
		const tick = (now: number) => {
			const t = Math.min(1, (now - start) / (duration * 1000));
			const eased = 1 - (1 - t) ** 3;
			setDisplay(Math.round(value * eased));
			if (t < 1) frame = requestAnimationFrame(tick);
		};
		frame = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(frame);
	}, [inView, value, duration, reduced]);

	return (
		<span ref={ref} className={cn("tabular-nums", className)}>
			{display >= 1000 ? `${(display / 1000).toFixed(display % 1000 === 0 ? 0 : 1)}k` : display}
			{suffix}
		</span>
	);
}

/** Pointer-following magnetic wrapper. Children keep their own semantics. */
export function Magnetic({
	children,
	strength = 16,
	className,
}: {
	children: ReactNode;
	strength?: number;
	className?: string;
}) {
	const ref = useRef<HTMLDivElement>(null);
	const reduced = useReducedMotion();
	const x = useMotionValue(0);
	const y = useMotionValue(0);
	const springX = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
	const springY = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

	return (
		<motion.div
			ref={ref}
			className={cn("inline-flex", className)}
			style={reduced ? undefined : { x: springX, y: springY }}
			onPointerMove={(event) => {
				if (reduced) return;
				const rect = ref.current?.getBoundingClientRect();
				if (!rect) return;
				const dx = (event.clientX - (rect.left + rect.width / 2)) / rect.width;
				const dy = (event.clientY - (rect.top + rect.height / 2)) / rect.height;
				x.set(dx * strength);
				y.set(dy * strength);
			}}
			onPointerLeave={() => {
				x.set(0);
				y.set(0);
			}}
		>
			{children}
		</motion.div>
	);
}

/** 3D tilt on hover, with a reset for reduced motion. */
export function TiltCard({
	children,
	className,
	max = 7,
	style,
}: {
	children: ReactNode;
	className?: string;
	max?: number;
	style?: CSSProperties;
}) {
	const ref = useRef<HTMLDivElement>(null);
	const reduced = useReducedMotion();
	const rotateX = useMotionValue(0);
	const rotateY = useMotionValue(0);
	const springX = useSpring(rotateX, { stiffness: 180, damping: 20 });
	const springY = useSpring(rotateY, { stiffness: 180, damping: 20 });

	return (
		<motion.div
			ref={ref}
			className={cn("[transform-style:preserve-3d]", className)}
			style={reduced ? style : { ...style, rotateX: springX, rotateY: springY }}
			onPointerMove={(event) => {
				if (reduced) return;
				const rect = ref.current?.getBoundingClientRect();
				if (!rect) return;
				const px = (event.clientX - rect.left) / rect.width - 0.5;
				const py = (event.clientY - rect.top) / rect.height - 0.5;
				rotateY.set(px * max * 2);
				rotateX.set(-py * max * 2);
			}}
			onPointerLeave={() => {
				rotateX.set(0);
				rotateY.set(0);
			}}
		>
			{children}
		</motion.div>
	);
}

/** Faint radial glow used behind section anchors. */
export function Glow({
	className,
	color = "rgba(99,102,241,0.22)",
}: {
	className?: string;
	color?: string;
}) {
	return (
		<div
			aria-hidden
			className={cn("pointer-events-none absolute rounded-full blur-3xl", className)}
			style={{ background: `radial-gradient(circle at center, ${color}, transparent 68%)` }}
		/>
	);
}
