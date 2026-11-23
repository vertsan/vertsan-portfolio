"use client";

import { motion, useReducedMotion } from "motion/react";
import {
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { cn } from "#/lib/utils";

export interface ContainerTextFlipProps {
	/** Array of words to cycle through in the animation */
	words?: string[];
	/** Time in milliseconds between word transitions */
	interval?: number;
	/** Additional CSS classes to apply to the container */
	className?: string;
	/** Additional CSS classes to apply to the text */
	textClassName?: string;
	/** Duration of the transition animation in milliseconds */
	animationDuration?: number;
	/**
	 * Stable text exposed to assistive technology. The animated glyphs are
	 * hidden from screen readers, so this is what gets announced in their place.
	 */
	accessibleText?: string;
	/** Pause the cycle while the component is hovered. */
	pauseOnHover?: boolean;
}

const DEFAULT_WORDS = ["better", "modern", "beautiful", "awesome"];

/** Animate letters in at a readable pace even for very long strings. */
const MAX_ANIMATED_CHARACTERS = 48;
const MAX_LETTER_STAGGER_MS = 350;

const graphemeSegmenter =
	typeof Intl !== "undefined" && "Segmenter" in Intl
		? new Intl.Segmenter(undefined, { granularity: "grapheme" })
		: null;

/**
 * Split into user-perceived characters so emoji, flags and combining marks
 * never get torn apart by the flip animation.
 */
function splitGraphemes(value: string) {
	if (!graphemeSegmenter) return Array.from(value);

	return Array.from(
		graphemeSegmenter.segment(value),
		(segment) => segment.segment,
	);
}

/**
 * The widest space an inline-block can occupy inside its containing block.
 * Walk up past inline boxes because their clientWidth is not layout-backed.
 */
function getAvailableWidth(root: HTMLElement) {
	const viewportWidth = document.documentElement.clientWidth;
	let parent = root.parentElement;

	while (parent) {
		const style = getComputedStyle(parent);

		if (style.display !== "inline" && parent.clientWidth > 0) {
			const horizontalPadding =
				Number.parseFloat(style.paddingLeft) +
				Number.parseFloat(style.paddingRight);

			return Math.min(parent.clientWidth - horizontalPadding, viewportWidth);
		}

		parent = parent.parentElement;
	}

	return viewportWidth;
}

export function ContainerTextFlip({
	words = DEFAULT_WORDS,
	interval = 3000,
	className,
	textClassName,
	animationDuration = 700,
	accessibleText,
	pauseOnHover = true,
}: ContainerTextFlipProps) {
	const [currentWordIndex, setCurrentWordIndex] = useState(0);
	const [size, setSize] = useState<{ width: number; height: number }>();
	const [isHovered, setIsHovered] = useState(false);
	const [isDocumentVisible, setIsDocumentVisible] = useState(true);

	const rootRef = useRef<HTMLSpanElement>(null);
	const probeRef = useRef<HTMLSpanElement>(null);
	const prefersReducedMotion = useReducedMotion() ?? false;

	const wordIndex = words.length > 0 ? currentWordIndex % words.length : 0;
	const word = words[wordIndex] ?? "";
	const letters = useMemo(() => splitGraphemes(word), [word]);
	const canAnimateLetters = letters.length <= MAX_ANIMATED_CHARACTERS;
	const letterStagger = Math.min(
		0.02,
		MAX_LETTER_STAGGER_MS / 1000 / Math.max(letters.length, 1),
	);

	// Pick a type scale from the longest entry so every word in the cycle keeps
	// the same visual weight, and long copy has room to wrap instead of spilling.
	const longestWordLength = useMemo(
		() =>
			words.reduce(
				(longest, current) => Math.max(longest, splitGraphemes(current).length),
				0,
			),
		[words],
	);

	const sizeClass =
		longestWordLength > 40
			? "text-2xl md:text-3xl"
			: longestWordLength > 20
				? "text-3xl md:text-5xl"
				: "text-4xl md:text-7xl";

	/**
	 * Measure the natural width first (unwrapped), clamp it to the space the
	 * containing block actually has, then measure the height of the wrapped
	 * result. The probe mirrors the real text styles, so responsive type and
	 * font loading are accounted for.
	 */
	const measure = useCallback(() => {
		const root = rootRef.current;
		const probe = probeRef.current;
		if (!root || !probe) return;

		const rootStyle = getComputedStyle(root);
		const horizontalInsets =
			Number.parseFloat(rootStyle.paddingLeft) +
			Number.parseFloat(rootStyle.paddingRight) +
			Number.parseFloat(rootStyle.borderLeftWidth) +
			Number.parseFloat(rootStyle.borderRightWidth);
		const verticalInsets =
			Number.parseFloat(rootStyle.paddingTop) +
			Number.parseFloat(rootStyle.paddingBottom) +
			Number.parseFloat(rootStyle.borderTopWidth) +
			Number.parseFloat(rootStyle.borderBottomWidth);

		probe.style.width = "max-content";
		probe.style.whiteSpace = "nowrap";
		const naturalWidth = probe.getBoundingClientRect().width;

		const availableWidth = Math.max(
			getAvailableWidth(root) - horizontalInsets,
			0,
		);
		const contentWidth = Math.min(naturalWidth, availableWidth);

		probe.style.whiteSpace = "normal";
		probe.style.width = `${contentWidth}px`;
		const contentHeight = probe.getBoundingClientRect().height;

		setSize({
			// A spare pixel avoids sub-pixel rounding clipping the final glyph.
			width: Math.ceil(contentWidth + horizontalInsets) + 1,
			height: Math.ceil(contentHeight + verticalInsets) + 1,
		});
	}, []);

	// Measure before paint so the chip never starts at the wrong size and the
	// glyphs never spill past its edge.
	// biome-ignore lint/correctness/useExhaustiveDependencies: re-measure whenever the rendered word or typography changes
	useLayoutEffect(measure, [measure, word, className, textClassName]);

	// Fonts can load after the first measurement, and a viewport change can
	// change the rendered text size or available width.
	useEffect(() => {
		let cancelled = false;
		const remeasure = () => {
			if (!cancelled) measure();
		};

		document.fonts?.ready.then(remeasure);
		window.addEventListener("resize", remeasure, { passive: true });

		return () => {
			cancelled = true;
			window.removeEventListener("resize", remeasure);
		};
	}, [measure]);

	useEffect(() => {
		const handleVisibilityChange = () => {
			setIsDocumentVisible(!document.hidden);
		};

		document.addEventListener("visibilitychange", handleVisibilityChange);
		return () =>
			document.removeEventListener("visibilitychange", handleVisibilityChange);
	}, []);

	// Keep the index valid if the word list shrinks.
	useEffect(() => {
		setCurrentWordIndex((index) =>
			words.length > 0 && index >= words.length ? 0 : index,
		);
	}, [words.length]);

	// Reduce motion and hidden tabs stop the cycle entirely. Hovering pauses it
	// so people can finish reading a longer phrase.
	const shouldPause =
		words.length <= 1 ||
		interval <= 0 ||
		prefersReducedMotion ||
		!isDocumentVisible ||
		(pauseOnHover && isHovered);

	useEffect(() => {
		if (shouldPause) return;

		const intervalId = window.setInterval(() => {
			setCurrentWordIndex((index) => (index + 1) % words.length);
		}, interval);

		return () => window.clearInterval(intervalId);
	}, [shouldPause, interval, words.length]);

	const transition = prefersReducedMotion
		? { duration: 0 }
		: { duration: animationDuration / 2000, ease: "easeInOut" as const };
	const wordTransition = prefersReducedMotion
		? { duration: 0 }
		: { duration: animationDuration / 1000, ease: "easeInOut" as const };

	return (
		<motion.span
			ref={rootRef}
			animate={size ? { width: size.width, height: size.height } : undefined}
			initial={false}
			transition={transition}
			onMouseEnter={pauseOnHover ? () => setIsHovered(true) : undefined}
			onMouseLeave={pauseOnHover ? () => setIsHovered(false) : undefined}
			className={cn(
				"relative inline-block max-w-full min-w-0 overflow-hidden rounded-lg px-4 pt-2 pb-3 text-center align-bottom font-bold break-words text-black [overflow-wrap:anywhere] dark:text-white",
				sizeClass,
				"[background:linear-gradient(to_bottom,#f3f4f6,#e5e7eb)]",
				"shadow-[inset_0_-1px_#d1d5db,inset_0_0_0_1px_#d1d5db,_0_4px_8px_#d1d5db]",
				"dark:[background:linear-gradient(to_bottom,#374151,#1f2937)]",
				"dark:shadow-[inset_0_-1px_#10171e,inset_0_0_0_1px_hsla(205,89%,46%,.24),_0_4px_8px_#00000052]",
				className,
			)}
		>
			{/* Announced instead of the constantly changing visual text. */}
			<span className="sr-only">{accessibleText ?? words.join(", ")}</span>

			{/* Hidden probe used only for measurement. */}
			<span
				ref={probeRef}
				aria-hidden="true"
				className={cn(
					"pointer-events-none invisible absolute top-0 left-0 block whitespace-pre-wrap",
					textClassName,
				)}
				style={{ maxWidth: "none", overflowWrap: "anywhere" }}
			>
				{word}
			</span>

			<motion.span
				key={word}
				aria-hidden="true"
				initial={
					prefersReducedMotion ? false : { opacity: 0, filter: "blur(10px)" }
				}
				animate={{ opacity: 1, filter: "blur(0px)" }}
				transition={wordTransition}
				className={cn(
					"block max-w-full whitespace-pre-wrap break-words [overflow-wrap:anywhere]",
					textClassName,
				)}
			>
				{canAnimateLetters
					? letters.map((letter, index) => (
							<motion.span
								// Letters repeat, so position is the stable identity.
								// biome-ignore lint/suspicious/noArrayIndexKey: ordered glyphs
								key={index}
								initial={
									prefersReducedMotion
										? false
										: { opacity: 0, filter: "blur(10px)" }
								}
								animate={{ opacity: 1, filter: "blur(0px)" }}
								transition={
									prefersReducedMotion
										? { duration: 0 }
										: { delay: index * letterStagger }
								}
							>
								{letter}
							</motion.span>
						))
					: // Very long copy animates as one block instead of hundreds of
						// individual glyphs.
						word}
			</motion.span>
		</motion.span>
	);
}
