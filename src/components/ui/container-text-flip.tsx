"use client";

import { motion } from "motion/react";
import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";
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
}

export function ContainerTextFlip({
	words = ["better", "modern", "beautiful", "awesome"],
	interval = 3000,
	className,
	textClassName,
	animationDuration = 700,
}: ContainerTextFlipProps) {
	const [currentWordIndex, setCurrentWordIndex] = useState(0);
	const [width, setWidth] = useState<number>();
	const textRef = React.useRef<HTMLDivElement>(null);
	const word = words[currentWordIndex] ?? "";

	// biome-ignore lint/correctness/useExhaustiveDependencies: re-measure whenever the rendered word changes
	const measure = useCallback(() => {
		if (textRef.current) {
			// 15px of breathing room on each side of the text.
			setWidth(textRef.current.scrollWidth + 30);
		}
	}, [word]);

	// Measure before paint so the chip never starts at the wrong width and the
	// glyphs never spill past its edge.
	useLayoutEffect(measure, [measure]);

	// Fonts can load after the first measurement, and a viewport change can
	// change the rendered text size.
	useEffect(() => {
		document.fonts?.ready.then(measure);
		window.addEventListener("resize", measure, { passive: true });
		return () => window.removeEventListener("resize", measure);
	}, [measure]);

	useEffect(() => {
		if (words.length <= 1) return;

		const intervalId = setInterval(() => {
			setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
		}, interval);

		return () => clearInterval(intervalId);
	}, [words, interval]);

	return (
		<motion.p
			animate={{ width }}
			initial={false}
			transition={{ duration: animationDuration / 2000 }}
			className={cn(
				"relative inline-block overflow-hidden rounded-lg pt-2 pb-3 text-center text-4xl font-bold text-black md:text-7xl dark:text-white",
				"[background:linear-gradient(to_bottom,#f3f4f6,#e5e7eb)]",
				"shadow-[inset_0_-1px_#d1d5db,inset_0_0_0_1px_#d1d5db,_0_4px_8px_#d1d5db]",
				"dark:[background:linear-gradient(to_bottom,#374151,#1f2937)]",
				"dark:shadow-[inset_0_-1px_#10171e,inset_0_0_0_1px_hsla(205,89%,46%,.24),_0_4px_8px_#00000052]",
				className,
			)}
		>
			<motion.div
				key={word}
				transition={{
					duration: animationDuration / 1000,
					ease: "easeInOut",
				}}
				className={cn("inline-block", textClassName)}
				ref={textRef}
			>
				<motion.div className="inline-block">
					{word.split("").map((letter, index) => (
						<motion.span
							// Letters repeat, so position is the stable identity.
							// biome-ignore lint/suspicious/noArrayIndexKey: ordered glyphs
							key={index}
							initial={{
								opacity: 0,
								filter: "blur(10px)",
							}}
							animate={{
								opacity: 1,
								filter: "blur(0px)",
							}}
							transition={{
								delay: index * 0.02,
							}}
						>
							{letter}
						</motion.span>
					))}
				</motion.div>
			</motion.div>
		</motion.p>
	);
}
