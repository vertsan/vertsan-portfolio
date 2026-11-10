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
			className="relative min-h-[100svh] overflow-visible pt-28 pb-20 sm:pt-36 lg:pt-32"
		>
			{/* ==================================================================== */}
			{/* REACT BITS <GradientASCII /> HERO CANVAS                             */}
			{/* ==================================================================== */}
			<div
				className="pointer-events-auto absolute inset-x-0 top-0 h-[640px] sm:h-[740px] lg:h-[860px] w-full overflow-hidden select-none"
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
					scale={1.05}
					flow={0.52}
					speed={reduced ? 0 : 0.85}
					grain={0.07}
					mouseInteraction={!reduced}
					clickEffect="wave"
					scrambleRadius={0.11}
					className="size-full"
				/>

				{/* Smooth gradient fade to pitch black bottom (#05070d) */}
				<div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[var(--i-bg)] via-[var(--i-bg)]/80 to-transparent" />

				{/* Side vignettes to frame the viewport */}
				<div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[var(--i-bg)]/60 to-transparent" />
				<div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[var(--i-bg)]/60 to-transparent" />
			</div>

			{/* ==================================================================== */}
			{/* HERO FOREGROUND CONTENT                                             */}
			{/* ==================================================================== */}
			<Container className="relative z-10 pointer-events-none">
				<div className="max-w-4xl">
					{/* Top status badges */}
					<motion.div
						initial={reduced ? false : { opacity: 0, y: 14 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, ease: EASE }}
						className="flex flex-wrap items-center gap-2.5 sm:gap-3"
					>
						<span className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3.5 py-1.5 backdrop-blur-md shadow-sm">
							<span className="relative flex size-2">
								<span className="absolute inline-flex size-full animate-ping rounded-full bg-[#6ee7b7] opacity-60" />
								<span className="relative inline-flex size-2 rounded-full bg-[#6ee7b7]" />
							</span>
							<span className="font-mono text-xs text-white/90">
								{profile.availability}
							</span>
						</span>

						<span className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full border border-white/5 bg-black/30 px-3 py-1.5 font-mono text-xs text-white/60 backdrop-blur-md">
							<MapPin className="size-3 text-[#38bdf8]" aria-hidden />
							{profile.location}
						</span>

						{/* Scene ready badge */}
						<span
							className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full border border-white/5 bg-black/30 px-3 py-1.5 font-mono text-xs text-white/50 backdrop-blur-md"
							title={sceneReady ? "3D Scene loaded" : "Loading 3D assets"}
						>
							<span
								aria-hidden
								className={`size-1.5 rounded-full ${
									sceneReady ? "bg-[#6ee7b7]" : "animate-pulse bg-white/40"
								}`}
							/>
							<span>{sceneReady ? "3D Ready" : "Loading 3D"}</span>
						</span>

						{/* Interactive ASCII control trigger */}
						<button
							type="button"
							onClick={() => setShowControls((prev) => !prev)}
							className="pointer-events-auto group inline-flex items-center gap-1.5 rounded-full border border-[#38bdf8]/30 bg-[#38bdf8]/10 px-3 py-1.5 font-mono text-xs text-[#a5d8ff] backdrop-blur-md transition-all hover:border-[#38bdf8]/60 hover:bg-[#38bdf8]/20"
							aria-label="Toggle shader controls"
							title="Customize the ASCII gradient shader"
						>
							<Sparkles className="size-3 text-[#38bdf8] transition-transform duration-300 group-hover:rotate-45" />
							<span>ASCII Shader</span>
							<span className="rounded bg-[#38bdf8]/20 px-1.5 py-0.2 text-[10px] uppercase font-bold text-white">
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
								className="pointer-events-auto mt-4 overflow-hidden rounded-2xl border border-white/15 bg-black/70 p-4 backdrop-blur-xl shadow-2xl"
							>
								<div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
									<div className="flex items-center gap-2">
										<Terminal className="size-4 text-[#38bdf8]" />
										<span className="font-mono text-xs font-semibold text-white">
											React Bits {"//"} GradientASCII Controls
										</span>
									</div>
									<span className="font-mono text-[11px] text-white/50">
										Click background to pulse wave • Move mouse to scramble
									</span>
								</div>

								<div className="mt-3 flex flex-wrap items-center gap-6">
									{/* Shape Selector */}
									<div className="flex items-center gap-2">
										<span className="font-mono text-[11px] uppercase tracking-wider text-white/60">
											Shape:
										</span>
										<div className="flex rounded-lg bg-white/5 p-0.5 border border-white/10">
											{SHAPES.map((s) => (
												<button
													key={s.id}
													type="button"
													onClick={() => setCurrentShape(s.id)}
													className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 font-mono text-xs transition-colors ${
														currentShape === s.id
															? "bg-[#38bdf8] text-black font-semibold shadow-sm"
															: "text-white/70 hover:text-white"
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
										<span className="font-mono text-[11px] uppercase tracking-wider text-white/60">
											Palette:
										</span>
										<div className="flex rounded-lg bg-white/5 p-0.5 border border-white/10">
											{THEMES.map((theme, idx) => (
												<button
													key={theme.id}
													type="button"
													onClick={() => setThemeIndex(idx)}
													className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 font-mono text-xs transition-colors ${
														themeIndex === idx
															? "bg-white/20 text-white font-semibold shadow-sm"
															: "text-white/60 hover:text-white"
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

					{/* Giant confident headline (Matching React Bits layout in screenshot) */}
					<motion.h1
						initial={reduced ? false : { opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
						className="mt-8 font-display text-[clamp(2.75rem,8vw,6.5rem)] font-bold leading-[0.98] tracking-[-0.04em] text-white"
					>
						Building fast, immersive web &amp; mobile software.
					</motion.h1>

					{/* Author / Dynamic Role line */}
					<motion.div
						initial={reduced ? false : { opacity: 0, y: 16 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, ease: EASE, delay: 0.25 }}
						className="mt-5 flex flex-wrap items-center gap-3"
					>
						<span className="font-mono text-sm font-semibold uppercase tracking-wider text-[#38bdf8]">
							{profile.name}
						</span>
						<span className="size-1 rounded-full bg-white/30" />
						<div className="flex min-h-[1.5em] items-center">
							<AnimatePresence mode="wait" initial={false}>
								<motion.span
									key={role}
									initial={reduced ? false : { opacity: 0, y: 8 }}
									animate={{ opacity: 1, y: 0 }}
									exit={reduced ? undefined : { opacity: 0, y: -8 }}
									transition={{ duration: 0.35, ease: EASE }}
									className="font-mono text-sm text-white/80"
								>
									{role}
								</motion.span>
							</AnimatePresence>
						</div>
					</motion.div>

					{/* Subheading / Statement paragraph (Like the screenshot subtext) */}
					<motion.p
						initial={reduced ? false : { opacity: 0, y: 16 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, ease: EASE, delay: 0.35 }}
						className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-white/70 sm:text-lg lg:text-xl font-normal"
					>
						{profile.statement}
					</motion.p>

					{/* CTA Button row (Exact pill styling as the uploaded screenshot) */}
					<motion.div
						initial={reduced ? false : { opacity: 0, y: 18 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, ease: EASE, delay: 0.48 }}
						className="mt-10 flex flex-wrap items-center gap-3.5"
					>
						{/* Primary solid white pill (like 'Start building >' in screenshot) */}
						<Magnetic strength={8}>
							<button
								type="button"
								onClick={() => scrollToId("projects")}
								className="pointer-events-auto group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-7 text-sm font-semibold text-black shadow-lg shadow-white/10 transition-all duration-300 hover:bg-white/95 hover:scale-[1.02] active:scale-[0.98]"
							>
								View projects
								<ArrowUpRight
									aria-hidden
									className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
								/>
							</button>
						</Magnetic>

						{/* Secondary translucent pill (like 'Browse components' in screenshot) */}
						<Magnetic strength={8}>
							<a
								href={profile.resume}
								download
								className="pointer-events-auto inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 text-sm font-medium text-white backdrop-blur-md transition-all duration-300 hover:border-white/40 hover:bg-white/15 hover:scale-[1.02] active:scale-[0.98]"
							>
								<Download aria-hidden className="size-4" />
								Download CV
							</a>
						</Magnetic>

						{/* Copy email quick interaction */}
						<button
							type="button"
							onClick={handleCopyEmail}
							className="pointer-events-auto inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/10 bg-black/40 px-5 text-sm font-mono text-white/80 backdrop-blur-md transition-colors hover:border-white/25 hover:bg-black/60 hover:text-white"
							title="Click to copy email address"
						>
							{copied ? (
								<>
									<Check className="size-4 text-[#6ee7b7]" />
									<span className="text-[#6ee7b7]">Copied!</span>
								</>
							) : (
								<>
									<Copy className="size-3.5 text-white/50" />
									<span>{profile.email}</span>
								</>
							)}
						</button>
					</motion.div>

					{/* Social icons row for mobile & tablet */}
					<motion.div
						initial={reduced ? false : { opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.8, delay: 0.65 }}
						className="mt-8 flex items-center gap-2 2xl:hidden"
					>
						{socials.map(({ href, label, icon: Icon }) => (
							<a
								key={label}
								href={href}
								target={href.startsWith("mailto:") ? undefined : "_blank"}
								rel="noreferrer"
								aria-label={label}
								title={label}
								className="pointer-events-auto flex size-10 items-center justify-center rounded-full border border-white/10 bg-black/30 text-white/70 backdrop-blur-md transition-colors hover:border-white/30 hover:bg-white/10 hover:text-white"
							>
								<Icon aria-hidden className="size-4" />
							</a>
						))}
					</motion.div>
				</div>
			</Container>

			{/* ==================================================================== */}
			{/* FIXED DESKTOP SOCIAL RAIL                                            */}
			{/* ==================================================================== */}
			<div className="pointer-events-none fixed left-6 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-center gap-5 2xl:flex">
				{socials.map(({ href, label, icon: Icon }) => (
					<a
						key={label}
						href={href}
						target={href.startsWith("mailto:") ? undefined : "_blank"}
						rel="noreferrer"
						aria-label={label}
						title={label}
						className="pointer-events-auto flex size-10 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white/70 backdrop-blur-md transition-all hover:scale-110 hover:border-white/30 hover:bg-white/10 hover:text-white"
					>
						<Icon aria-hidden className="size-4" />
					</a>
				))}
				<span
					aria-hidden
					className="h-16 w-px bg-gradient-to-b from-white/20 to-transparent"
				/>
			</div>

			{/* ==================================================================== */}
			{/* BOTTOM SCROLL INDICATOR                                              */}
			{/* ==================================================================== */}
			<div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center z-10">
				<motion.button
					type="button"
					onClick={() => scrollToId("about")}
					initial={reduced ? false : { opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 1, duration: 0.6 }}
					className="pointer-events-auto flex flex-col items-center gap-2 text-white/50 transition-colors hover:text-white"
					aria-label="Scroll to about section"
				>
					<span className="font-mono text-xs uppercase tracking-widest">
						Explore
					</span>
					<motion.span
						aria-hidden
						animate={reduced ? undefined : { y: [0, 6, 0] }}
						transition={{
							duration: 2,
							repeat: Number.POSITIVE_INFINITY,
							ease: "easeInOut",
						}}
					>
						<ArrowDown className="size-4 text-[#38bdf8]" />
					</motion.span>
				</motion.button>
			</div>

			<Link to="/about" className="sr-only">
				More about Vert San
			</Link>
		</section>
	);
}
