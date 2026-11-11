import { Link } from "@tanstack/react-router";
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
} from "lucide-react";
import { useReducedMotion } from "motion/react";
import { type CSSProperties, useEffect, useState } from "react";
import GradientASCII from "#/components/GradientASCII";
import { GRADIENT_ASCII_COLORS } from "#/lib/gradient-ascii";
import { useIsDark } from "#/lib/useIsDark";
import { useLiveContent } from "#/lib/useLiveContent";

interface HeroProject {
	title: string;
	startDate: string;
	image?: string | null;
}

const EMAIL = "itsanvert@gmail.com";

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
	const [copied, setCopied] = useState(false);

	const {
		items: projects,
		loading: projectsLoading,
		error: projectsError,
	} = useLiveContent<HeroProject>("projects");
	const {
		items: certificates,
		loading: certificatesLoading,
		error: certificatesError,
	} = useLiveContent<Record<string, unknown>>("certificates");

	const handleCopyEmail = async () => {
		try {
			await navigator.clipboard.writeText(EMAIL);
			setCopied(true);
			window.setTimeout(() => setCopied(false), 2000);
		} catch {
			// Clipboard access can be blocked; the mailto link still works.
		}
	};

	const count = (
		length: number,
		loading: boolean,
		error: string | null,
	): string | null => {
		if (length > 0) return `${length}+`;
		if (error) return "–";
		if (loading) return null;
		return "0";
	};

	const stats = [
		{ label: "Years", value: "2.5+" },
		{
			label: "Projects",
			value: count(projects.length, projectsLoading, projectsError),
		},
		{
			label: "Certificates",
			value: count(certificates.length, certificatesLoading, certificatesError),
		},
	];

	return (
		<section
			id="top"
			aria-label="Introduction"
			className="hero-shell relative -mt-[52px] flex min-h-[100svh] flex-col justify-end overflow-hidden lg:-mt-[62px]"
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
				<div className="mx-auto w-full max-w-[84rem] px-5 pb-6 sm:px-8 sm:pb-8 lg:px-10 lg:pb-10">
					<div className="max-w-[66rem]">
						{/* Availability + location */}
						

						{/* Statement headline */}
						<h1
							data-reveal
							style={reveal(120)}
							className="mt-4 max-w-[64rem] text-balance text-[clamp(2.5rem,6vw,5rem)] font-semibold leading-[0.95] tracking-[-0.045em] text-[var(--ui-text)]"
						>
							Building fast, immersive
							<br className="hidden sm:block" /> web &amp; mobile software.
						</h1>

						{/* Supporting statement */}
						<p
							data-reveal
							style={reveal(180)}
							className="mt-5 max-w-[46rem] text-pretty text-sm leading-relaxed text-[var(--ui-text-muted)] sm:text-base"
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
								className="ui-button ui-button-primary ui-focusable group"
							>
								Explore projects
								<ArrowUpRight
									aria-hidden="true"
									className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
								/>
							</Link>

							<a
								href="/resume.pdf"
								download
								className="ui-button ui-button-ghost ui-focusable"
							>
								<Download aria-hidden="true" className="size-4" />
								Download resume
							</a>

							<button
								type="button"
								onClick={handleCopyEmail}
								title="Copy email address"
								className="ui-button ui-button-ghost ui-focusable gap-2 px-3.5 text-xs"
							>
								{copied ? (
									<>
										<Check
											aria-hidden="true"
											className="size-3.5 text-[var(--ui-accent)]"
										/>
										<span className="text-[var(--ui-accent)]">Copied</span>
									</>
								) : (
									<>
										<Copy aria-hidden="true" className="size-3.5" />
										<span className="hidden sm:inline">Copy email</span>
										<span className="sm:hidden">Copy</span>
									</>
								)}
							</button>
						</div>
					</div>

					{/* Baseline rail: socials, live counts, scroll cue. */}
					<div
						data-reveal
						style={reveal(320)}
						className="mt-9 flex flex-col gap-4 border-t border-[var(--ui-border)] pt-5 sm:flex-row sm:items-center sm:justify-between"
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
									className="ui-focusable flex size-9 items-center justify-center rounded-full text-[var(--ui-text-muted)] transition-colors hover:bg-[var(--ui-surface-soft)] hover:text-[var(--ui-text)]"
								>
									<Icon className="size-4" />
								</a>
							))}
						</div>

						<ul className="hidden items-center gap-6 sm:flex">
							{stats.map(({ label, value }) => (
								<li key={label} className="flex items-baseline gap-2">
									{value === null ? (
										<span
											aria-hidden="true"
											className="inline-block h-3 w-6 animate-pulse rounded-sm bg-[var(--ui-border)]"
										/>
									) : (
										<span className="font-mono text-sm font-semibold tabular-nums text-[var(--ui-text)]">
											{value}
										</span>
									)}
									<span className="text-[10px] uppercase tracking-[0.16em] text-[var(--ui-text-subtle)]">
										{label}
									</span>
								</li>
							))}
						</ul>

						<a
							href="#about"
							className="ui-focusable group inline-flex items-center gap-2.5 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ui-text-muted)] transition-colors hover:text-[var(--ui-text)]"
						>
							Scroll to explore
							<span className="grid size-8 place-items-center rounded-full border border-[var(--ui-border-strong)] transition-transform duration-300 group-hover:translate-y-0.5">
								<ArrowDown aria-hidden="true" className="size-3.5" />
							</span>
						</a>
					</div>
				</div>
			</div>
		</section>
	);
}
