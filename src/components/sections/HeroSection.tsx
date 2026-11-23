import { Link } from "@tanstack/react-router";
import {
	ArrowUpRight,
	Code2,
	Download,
	Github,
	Layers3,
	Linkedin,
	Mail,
	Palette,
	Zap,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { type CSSProperties, useEffect, useState } from "react";
import ElapsedYearsCounter from "#/components/ElapsedYearsCounter";
import GradientASCII from "#/components/GradientASCII";
import { buttonVariants } from "#/components/ui/button";
import { ContainerTextFlip } from "#/components/ui/container-text-flip";
import { GRADIENT_ASCII_COLORS } from "#/lib/gradient-ascii";
import { useIsDark } from "#/lib/useIsDark";

const EMAIL = "itsanvert@gmail.com";
const BIRTH_DATE = new Date("2004-09-25T00:00:00Z");

/** The hero statement cycles its second adjective — see the supporting copy. */
const HERO_ADJECTIVES = ["immersive", "accessible", "scalable", "secure"];

const socials = [
	{ href: "https://github.com/vertsan", label: "GitHub", icon: Github },
	{
		href: "https://linkedin.com/in/vertsan",
		label: "LinkedIn",
		icon: Linkedin,
	},
	{ href: `mailto:${EMAIL}`, label: "Email", icon: Mail },
];

const reveal = (delay: number) =>
	({ "--reveal-delay": `${delay}ms` }) as CSSProperties;



/** Phones need chunkier cells, or the character grid turns into noise. */
function useGlyphCellSize() {
	const [size, setSize] = useState(18);

	useEffect(() => {
		const compute = () => {
			const width = window.innerWidth;
			setSize(width < 480 ? 13 : width < 1024 ? 16 : 18);
		};
		compute();
		window.addEventListener("resize", compute, { passive: true });
		return () => window.removeEventListener("resize", compute);
	}, []);

	return size;
}

/**
 * Home hero — one full-bleed GradientASCII field with the copy anchored to the
 * bottom-left. The field carries the whole composition; the supporting UI is
 * deliberately quiet so the light and the type do the work.
 */
export default function HeroSection() {
	const isDark = useIsDark();
	const reduced = useReducedMotion() ?? false;
	const cellSize = useGlyphCellSize();

	return (
		<section
			id="top"
			aria-label="Introduction"
			className="hero-shell relative -mt-13 flex min-h-svh flex-col justify-end overflow-hidden lg:-mt-15.5"
		>
			{/* ============================================================== */}
			{/* FULL-BLEED FIELD                                                */}
			{/* ============================================================== */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 select-none"
			>
				<GradientASCII
					colors={GRADIENT_ASCII_COLORS}
					shape="horizon"
					characters=" =+xX0S8#@"
					cellSize={cellSize}
					density={0.8}
					glyphOpacity={0.85}
					gradientOpacity={0.9}
					glow={0.2}
					softness={0.5}
					scale={1}
					flow={0.5}
					speed={reduced ? 0 : 1}
					flicker={reduced ? 0 : 0.2}
					depthOfField={0}
					grain={0.08}
					variation={0}
					mouseInteraction={!reduced}
					clickEffect="wave"
					scrambleRadius={0.1}
					intro={!reduced}
					lightMode={!isDark}
					className="size-full"
				/>
			</div>

			{/* Top wash keeps the floating navigation legible over the glow. */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-x-0 top-0 h-40"
				style={{
					background:
						"linear-gradient(to bottom, var(--ui-bg) 0%, color-mix(in srgb, var(--ui-bg) 45%, transparent) 45%, transparent 100%)",
				}}
			/>

			{/* Bottom-left scrim anchors the copy without flattening the field. */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0"
				style={{
					background:
						"radial-gradient(100% 82% at 0% 100%, var(--ui-bg) 0%, color-mix(in srgb, var(--ui-bg) 76%, transparent) 42%, transparent 78%), linear-gradient(to top, var(--ui-bg) 0%, color-mix(in srgb, var(--ui-bg) 80%, transparent) 24%, transparent 62%)",
				}}
			/>

			{/* ============================================================== */}
			{/* COPY — ANCHORED BOTTOM-LEFT                                     */}
			{/* ============================================================== */}
			<div className="relative z-10 w-full pt-32">
				<div className="mx-auto w-full max-w-336 px-5 pb-6 sm:px-8 sm:pb-8 lg:px-10 lg:pb-10">
					<div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end lg:gap-12">
						<div className="max-w-264">
						{/* Live age counter */}
						<ElapsedYearsCounter birthDate={BIRTH_DATE} />

						{/* Statement headline — same wrapper shape as the registry demo. */}
						<motion.h1
							layout
							initial={{ opacity: 0 }}
							whileInView={{ opacity: 1 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: 0.12, ease: "easeOut" }}
							className="mt-4 max-w-5xl text-balance text-[clamp(2.5rem,6vw,5rem)] font-semibold leading-[0.95] tracking-[-0.045em] text-(--ui-text)"
						>
							<span className="inline-block">
								Building fast,{" "}
								<ContainerTextFlip words={HERO_ADJECTIVES} interval={2600} />
								<br className="hidden sm:block" /> web &amp; mobile software.
							</span>
						</motion.h1>

						{/* Supporting statement */}
						<p
							data-reveal
							style={reveal(180)}
							className="mt-5 max-w-184 text-pretty text-sm leading-relaxed text-(--ui-text-muted) sm:text-base"
						>
							I build accessible, scalable, and secure web and mobile
							applications — with modern architecture and thoughtful UX.
						</p>

						{/* Actions */}
						<div
							data-reveal
							style={reveal(240)}
							className="mt-7 flex flex-wrap items-center gap-3"
						>
							<Link
								to="/projects"
								className={buttonVariants({ variant: "ghost" })}
							>
								Explore Project
								<ArrowUpRight
									aria-hidden="true"
									className="size-4 transition-transform duration-200"
								/>
							</Link>

							<a
								href="/resume.pdf"
								download
								className={buttonVariants({ variant: "ghost" })}
							>
								<Download aria-hidden="true" className="size-4" />
								Download resume
							</a>
						</div>
					</div>

						
					</div>

					{/* Baseline rail: socials, live counts, scroll cue. */}
					<div
						data-reveal
						style={reveal(320)}
						className="mt-9 flex flex-col gap-4  pt-5 sm:flex-row sm:items-center sm:justify-between"
					>
						<div className="flex items-center gap-1">
							{socials.map(({ href, label, icon: Icon }) => (
								<a
									key={label}
									href={href}
									target={href.startsWith("mailto:") ? undefined : "_blank"}
									rel="noreferrer"
									aria-label={label}
									title={label}
									className="ui-focusable flex size-9 items-center justify-center rounded-full text-(--ui-text-muted) transition-colors"
								>
									<Icon className="size-4" />
								</a>
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
