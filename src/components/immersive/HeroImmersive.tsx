import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
	ArrowDown,
	ArrowUpRight,
	Check,
	Copy,
	Download,
	Github,
	Linkedin,
	Mail,
	MapPin,
	Sparkles,
	Terminal,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { profile } from "#/data/profile";
import GradientASCII, { type GradientShape } from "./GradientASCII";
import { scrollToId } from "./SmoothScroll";
import { useScene, useSceneSection } from "./scene/SceneContext";
import { Container, EASE, Magnetic } from "./ui";

const socials = [
	{ href: profile.socials.github, label: "GitHub", icon: Github },
	{ href: profile.socials.linkedin, label: "LinkedIn", icon: Linkedin },
	{ href: `mailto:${profile.email}`, label: "Email", icon: Mail },
];

/** Preset color themes matching the React Bits ASCII shader */
const THEMES = [
	{
		id: "cyber-indigo",
		name: "Cyber Indigo",
		colors: ["#1e3fd8", "#f6f8ff", "#a5d8ff", "#38bdf8"],
		accent: "#38bdf8",
	},
	{
		id: "aurora-teal",
		name: "Aurora Teal",
		colors: ["#0f766e", "#14b8a6", "#2dd4bf", "#ccfbf1"],
		accent: "#2dd4bf",
	},
	{
		id: "hyper-violet",
		name: "Hyper Violet",
		colors: ["#4c1d95", "#8b5cf6", "#c084fc", "#f5d0fe"],
		accent: "#c084fc",
	},
	{
		id: "solar-amber",
		name: "Solar Amber",
		colors: ["#7c2d12", "#ea580c", "#fb923c", "#fef08a"],
		accent: "#fb923c",
	},
	{
		id: "day-sky",
		name: "Day Sky",
		colors: ["#dbeafe", "#a5f3fc", "#38bdf8", "#0ea5e9"],
		accent: "#38bdf8",
	},
];

const SHAPES: Array<{ id: GradientShape; label: string; icon: string }> = [
	{ id: "horizon", label: "Horizon", icon: "🌅" },
	{ id: "eclipse", label: "Eclipse", icon: "🌑" },
	{ id: "pinch", label: "Pinch", icon: "⏳" },
	{ id: "rise", label: "Rise", icon: "🌋" },
];

export default function HeroImmersive() {
	const sectionRef = useRef<HTMLElement>(null);
	const reduced = useReducedMotion();
	const [roleIndex, setRoleIndex] = useState(0);
	const [copied, setCopied] = useState(false);
	const { ready: sceneReady } = useScene();

	// Interactive GradientASCII states
	const [currentShape, setCurrentShape] = useState<GradientShape>("horizon");
	const [themeIndex, setThemeIndex] = useState(0);
	const [showControls, setShowControls] = useState(false);

	// Set theme based on OS preference
	useEffect(() => {
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		const handleChange = (e: MediaQueryListEvent) => {
			setThemeIndex(e.matches ? 0 : 4);
		};
		// Set initial theme
		setThemeIndex(mediaQuery.matches ? 0 : 4);
		// Listen for changes
		mediaQuery.addEventListener("change", handleChange);
		return () => mediaQuery.removeEventListener("change", handleChange);
	}, []);

	useSceneSection(sectionRef, "hero", THEMES[themeIndex].accent);

	useEffect(() => {
		if (reduced) return;
		const id = window.setInterval(() => {
			setRoleIndex((index) => (index + 1) % profile.roles.length);
		}, 3200);
		return () => window.clearInterval(id);
	}, [reduced]);

	const role = profile.roles[roleIndex] ?? profile.roles[0];
	const activeTheme = THEMES[themeIndex];

	const handleCopyEmail = () => {
		navigator.clipboard.writeText(profile.email);
		setCopied(true);
		window.setTimeout(() => setCopied(false), 2000);
	};

	return (
		<section
			ref={sectionRef}
			id="top"
			aria-label="Introduction"
			className="relative flex min-h-[100svh] flex-col justify-end overflow-visible pt-32 pb-12 sm:pb-16 lg:pb-20"
		>
			{/* ==================================================================== */}
			{/* REACT BITS <GradientASCII /> HERO CANVAS                             */}
			{/* Spans the full hero area so ASCII ripples & glows spread freely      */}
			{/* ==================================================================== */}
			<div
				className="pointer-events-auto absolute inset-0 size-full overflow-hidden select-none"
				aria-hidden="true"
			>
				<GradientASCII
					colors={activeTheme.colors}
					shape={currentShape}
					characters=" =+xX0S8#@"
					cellSize={18}
					density={0.82}
					glyphOpacity={0.88}
					gradientOpacity={0.92}
					glow={0.25}
					softness={0.48}
					scale={1.1}
					flow={0.52}
					speed={reduced ? 0 : 0.85}
					grain={0.07}
					mouseInteraction={!reduced}
					clickEffect="wave"
					scrambleRadius={0.11}
					className="size-full"
				/>

				{/* Smooth gradient fade towards the bottom so content has pristine contrast */}
				<div className="pointer-events-none absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-[var(--i-bg)] via-[var(--i-bg)]/85 to-transparent" />

				{/* Vignettes: stronger in light mode for better framing */}
				<div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[var(--i-bg)] to-transparent opacity-50 dark:opacity-100" />
				<div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[var(--i-bg)] to-transparent opacity-50 dark:opacity-100" />
			</div>

			{/* ==================================================================== */}
			{/* HERO CONTENT: ANCHORED AT BOTTOM-LEFT                                */}
			{/* Gives the top glowing ASCII field room to breathe cleanly           */}
			{/* ==================================================================== */}
			<Container className="relative z-10 pointer-events-none w-full">
				<div className="max-w-3xl text-left">
					{/* Status badges */}
					<motion.div
						initial={reduced ? false : { opacity: 0, y: 12 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, ease: EASE }}
						className="flex flex-wrap items-center gap-2 sm:gap-2.5"
					>
						<span className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-zinc-900/10 bg-zinc-900/[0.03] px-3 py-1 backdrop-blur-md shadow-sm dark:border-white/10 dark:bg-black/50">
							<span className="relative flex size-2">
								<span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
								<span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
							</span>
							<span className="font-mono text-xs text-zinc-800 dark:text-white/90">
								{profile.availability}
							</span>
						</span>

						<span className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full border border-zinc-900/10 bg-zinc-900/[0.03] px-3 py-1 font-mono text-xs text-zinc-600 backdrop-blur-md dark:border-white/5 dark:bg-black/40 dark:text-white/60">
							<MapPin className="size-3 text-sky-500" aria-hidden />
							{profile.location}
						</span>

						{/* 3D Scene status */}
						<span
							className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full border border-zinc-900/10 bg-zinc-900/[0.03] px-2.5 py-1 font-mono text-xs text-zinc-500 backdrop-blur-md dark:border-white/5 dark:bg-black/40 dark:text-white/50"
							title={sceneReady ? "3D Scene ready" : "Loading 3D assets"}
						>
							<span
								aria-hidden
								className={`size-1.5 rounded-full ${
									sceneReady
										? "bg-emerald-400"
										: "animate-pulse bg-zinc-400 dark:bg-white/40"
								}`}
							/>
							<span>{sceneReady ? "3D Ready" : "Loading 3D"}</span>
						</span>

						{/* Interactive ASCII control trigger */}
						<button
							type="button"
							onClick={() => setShowControls((prev) => !prev)}
							className="pointer-events-auto group inline-flex items-center gap-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 font-mono text-xs text-sky-700 backdrop-blur-md transition-all hover:border-sky-500/60 hover:bg-sky-500/20 dark:text-sky-300 dark:border-[#38bdf8]/30 dark:bg-[#38bdf8]/10 dark:hover:border-[#38bdf8]/60 dark:hover:bg-[#38bdf8]/20"
							aria-label="Toggle shader controls"
							title="Customize the ASCII gradient shader"
						>
							<Sparkles className="size-3 text-sky-500 transition-transform duration-300 group-hover:rotate-45 dark:text-[#38bdf8]" />
							<span>ASCII Shader</span>
							<span className="rounded bg-sky-500/20 px-1.5 py-0.2 text-[10px] uppercase font-bold text-sky-800 dark:bg-[#38bdf8]/20 dark:text-white">
								{currentShape}
							</span>
						</button>
					</motion.div>

					{/* Collapsible interactive controls for GradientASCII */}
					<AnimatePresence>
						{showControls && (
							<motion.div
								initial={{ opacity: 0, height: 0, y: -8 }}
								animate={{ opacity: 1, height: "auto", y: 0 }}
								exit={{ opacity: 0, height: 0, y: -8 }}
								transition={{ duration: 0.35, ease: EASE }}
								className="pointer-events-auto mt-3 overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100/80 p-4 backdrop-blur-xl shadow-2xl dark:border-white/15 dark:bg-black/80"
							>
								<div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 pb-3 dark:border-white/10">
									<div className="flex items-center gap-2">
										<Terminal className="size-4 text-sky-500 dark:text-[#38bdf8]" />
										<span className="font-mono text-xs font-semibold text-zinc-900 dark:text-white">
											React Bits {"//"} GradientASCII Controls
										</span>
									</div>
									<span className="font-mono text-[11px] text-zinc-500 dark:text-white/50">
										Click background to pulse wave • Move mouse to scramble
									</span>
								</div>

								<div className="mt-3 flex flex-wrap items-center gap-5">
									{/* Shape Selector */}
									<div className="flex items-center gap-2">
										<span className="font-mono text-[11px] uppercase tracking-wider text-zinc-600 dark:text-white/60">
											Shape:
										</span>
										<div className="flex rounded-lg bg-zinc-900/5 p-0.5 border border-zinc-900/10 dark:bg-white/5 dark:border-white/10">
											{SHAPES.map((s) => (
												<button
													key={s.id}
													type="button"
													onClick={() => setCurrentShape(s.id)}
													className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 font-mono text-xs transition-colors ${
														currentShape === s.id
															? "bg-sky-500 text-white font-semibold shadow-sm dark:bg-[#38bdf8] dark:text-black"
															: "text-zinc-700 hover:text-zinc-900 dark:text-white/70 dark:hover:text-white"
													}`}
												>
													<span>{s.icon}</span>
													<span>{s.label}</span>
												</button>
											))}
										</div>
									</div>

									{/* Theme Selector */}
									<div className="flex items-center gap-2">
										<span className="font-mono text-[11px] uppercase tracking-wider text-zinc-600 dark:text-white/60">
											Palette:
										</span>
										<div className="flex rounded-lg bg-zinc-900/5 p-0.5 border border-zinc-900/10 dark:bg-white/5 dark:border-white/10">
											{THEMES.map((theme, idx) => (
												<button
													key={theme.id}
													type="button"
													onClick={() => setThemeIndex(idx)}
													className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 font-mono text-xs transition-colors ${
														themeIndex === idx
															? "bg-zinc-200 text-zinc-900 font-semibold shadow-sm dark:bg-white/20 dark:text-white"
															: "text-zinc-600 hover:text-zinc-900 dark:text-white/60 dark:hover:text-white"
													}`}
												>
													<span
														className="size-2 rounded-full"
														style={{ backgroundColor: theme.accent }}
													/>
													<span>{theme.name}</span>
												</button>
											))}
										</div>
									</div>
								</div>
							</motion.div>
						)}
					</AnimatePresence>

					{/* Confident display headline (Anchored bottom-left, clean & punchy) */}
					<motion.h1
						initial={reduced ? false : { opacity: 0, y: 18 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.7, ease: EASE, delay: 0.08 }}
						className="mt-6 font-display text-[clamp(2.5rem,6.5vw,5.25rem)] font-bold leading-[0.98] tracking-[-0.04em] text-zinc-900 dark:text-white"
					>
						Building fast, immersive web &amp; mobile software.
					</motion.h1>

					{/* Author / Dynamic Role line */}
					<motion.div
						initial={reduced ? false : { opacity: 0, y: 14 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.7, ease: EASE, delay: 0.18 }}
						className="mt-4 flex flex-wrap items-center gap-2.5"
					>
						<span className="font-mono text-xs sm:text-sm font-semibold uppercase tracking-wider text-sky-600 dark:text-[#38bdf8]">
							{profile.name}
						</span>
						<span className="size-1 rounded-full bg-zinc-400 dark:bg-white/30" />
						<div className="flex min-h-[1.5em] items-center">
							<AnimatePresence mode="wait" initial={false}>
								<motion.span
									key={role}
									initial={reduced ? false : { opacity: 0, y: 6 }}
									animate={{ opacity: 1, y: 0 }}
									exit={reduced ? undefined : { opacity: 0, y: -6 }}
									transition={{ duration: 0.35, ease: EASE }}
									className="font-mono text-xs sm:text-sm text-zinc-700 dark:text-white/80"
								>
									{role}
								</motion.span>
							</AnimatePresence>
						</div>
					</motion.div>

					{/* Statement paragraph */}
					<motion.p
						initial={reduced ? false : { opacity: 0, y: 14 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.7, ease: EASE, delay: 0.28 }}
						className="mt-4 max-w-xl text-pretty text-sm leading-relaxed text-zinc-600 sm:text-base lg:text-lg font-normal dark:text-white/70"
					>
						{profile.statement}
					</motion.p>

					{/* Pill Action Button Row */}
					<motion.div
						initial={reduced ? false : { opacity: 0, y: 16 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.7, ease: EASE, delay: 0.38 }}
						className="mt-8 flex flex-wrap items-center gap-3"
					>
						{/* Primary solid white pill */}
						<Magnetic strength={8}>
							<button
								type="button"
								onClick={() => scrollToId("projects")}
								className="pointer-events-auto group inline-flex h-11 items-center justify-center gap-2 rounded-full bg-zinc-900 px-6 text-sm font-semibold text-white shadow-lg shadow-zinc-900/10 transition-all duration-300 hover:bg-zinc-800 hover:scale-[1.02] active:scale-[0.98] dark:bg-white dark:text-black dark:shadow-white/10 dark:hover:bg-white/95"
							>
								View projects
								<ArrowUpRight
									aria-hidden
									className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
								/>
							</button>
						</Magnetic>

						{/* Secondary translucent pill */}
						<Magnetic strength={8}>
							<a
								href={profile.resume}
								download
								className="pointer-events-auto inline-flex h-11 items-center justify-center gap-2 rounded-full border border-zinc-900/15 bg-zinc-900/[0.05] px-5 text-sm font-medium text-zinc-800 backdrop-blur-md transition-all duration-300 hover:border-zinc-900/30 hover:bg-zinc-900/10 hover:scale-[1.02] active:scale-[0.98] dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:border-white/40 dark:hover:bg-white/15"
							>
								<Download aria-hidden className="size-4" />
								Download CV
							</a>
						</Magnetic>

						{/* Copy email pill */}
						<button
							type="button"
							onClick={handleCopyEmail}
							className="pointer-events-auto inline-flex h-11 items-center justify-center gap-2 rounded-full border border-zinc-900/10 bg-zinc-900/[0.03] px-4 font-mono text-xs text-zinc-700 backdrop-blur-md transition-colors hover:border-zinc-900/25 hover:bg-zinc-900/5 hover:text-zinc-900 dark:border-white/10 dark:bg-black/40 dark:text-white/80 dark:hover:border-white/25 dark:hover:bg-black/60 dark:hover:text-white"
							title="Click to copy email address"
						>
							{copied ? (
								<>
									<Check className="size-3.5 text-emerald-500" />
									<span className="text-emerald-500">Copied!</span>
								</>
							) : (
								<>
									<Copy className="size-3.5 text-zinc-500 dark:text-white/50" />
									<span>{profile.email}</span>
								</>
							)}
						</button>
					</motion.div>

					{/* Mobile socials row */}
					<motion.div
						initial={reduced ? false : { opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.8, delay: 0.55 }}
						className="mt-6 flex items-center gap-2 2xl:hidden"
					>
						{socials.map(({ href, label, icon: Icon }) => (
							<a
								key={label}
								href={href}
								target={href.startsWith("mailto:") ? undefined : "_blank"}
								rel="noreferrer"
								aria-label={label}
								title={label}
								className="pointer-events-auto flex size-9 items-center justify-center rounded-full border border-zinc-900/10 bg-zinc-900/[0.03] text-zinc-600 backdrop-blur-md transition-colors hover:border-zinc-900/20 hover:bg-zinc-900/5 hover:text-zinc-900 dark:border-white/10 dark:bg-black/30 dark:text-white/70 dark:hover:border-white/30 dark:hover:bg-white/10 dark:hover:text-white"
							>
								<Icon className="size-4" />
							</a>
						))}
					</motion.div>
				</div>
			</Container>

			{/* ==================================================================== */}
			{/* FIXED DESKTOP SOCIAL RAIL                                            */}
			{/* ==================================================================== */}
			<motion.div
				initial={{ opacity: 0, x: -20 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ duration: 0.8, delay: 0.6 }}
				className="pointer-events-auto absolute top-1/2 left-6 z-20 hidden -translate-y-1/2 2xl:flex"
			>
				<div className="flex flex-col gap-2 rounded-full border border-zinc-900/10 bg-zinc-900/[0.03] p-1 backdrop-blur-md dark:border-white/10 dark:bg-black/50">
					{socials.map(({ href, label, icon: Icon }) => (
						<a
							key={label}
							href={href}
							target={href.startsWith("mailto:") ? undefined : "_blank"}
							rel="noreferrer"
							aria-label={label}
							title={label}
							className="flex size-9 items-center justify-center rounded-full text-zinc-600 transition-colors hover:bg-zinc-900/5 hover:text-zinc-900 dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
						>
							<Icon className="size-4" />
						</a>
					))}
				</div>
			</motion.div>

			{/* ==================================================================== */}
			{/* SCROLL DOWN INDICATOR                                                */}
			{/* ==================================================================== */}
			<div className="pointer-events-none absolute inset-x-0 bottom-12 z-20 flex justify-center">
				<motion.button
					type="button"
					onClick={() => scrollToId("about")}
					aria-label="Scroll down"
					className="pointer-events-auto flex flex-col items-center gap-1 text-zinc-600 transition-colors hover:text-zinc-900 dark:text-white/60 dark:hover:text-white"
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, ease: EASE, delay: 1.2 }}
				>
					<span className="font-mono text-[11px] tracking-widest uppercase [writing-mode:vertical-rl]">
						Scroll
					</span>
					<span className="mt-2 h-10 w-px bg-zinc-400/50" />
				</motion.button>
			</div>

			<Link to="/about" className="sr-only">
				More about Vert San
			</Link>
		</section>
	);
}