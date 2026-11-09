import { Link } from "@tanstack/react-router";
import {
	ArrowUpRight,
	Award,
	Check,
	Copy,
	Download,
	FolderKanban,
	Github,
	Linkedin,
	Mail,
	MapPin,
	Sparkles,
} from "lucide-react";
import { type CSSProperties, useState } from "react";
import AsciiBackdrop from "#/components/ui/ascii-backdrop";
import { useLiveContent } from "#/lib/useLiveContent";

interface HeroProject {
	title: string;
	startDate: string;
	image?: string | null;
}

const socials = [
	{ href: "https://github.com/vertsan", label: "GitHub", icon: Github },
	{
		href: "https://linkedin.com/in/vertsan",
		label: "LinkedIn",
		icon: Linkedin,
	},
	{ href: "mailto:itsanvert@gmail.com", label: "Email", icon: Mail },
];

const focus = ["Full stack", "Accessible UI", "Clean architecture"];

const portraits = [
	{ src: "/profile.webp", alt: "Portrait of Vert San" },
	{ src: "/profile1.webp", alt: "Vert San" },
	{ src: "/profile2.webp", alt: "Vert San" },
];

const reveal = (delay: number) =>
	({ "--reveal-delay": `${delay}ms` }) as CSSProperties;

/**
 * Home hero — same premium, minimal language as the About page.
 *
 * What changed and why:
 * - Removed the framed card, ring and heavy shadow around the hero so the
 *   GradientASCII backdrop can breathe edge-to-edge.
 * - Replaced the rainbow CTA and multi-colour accents with one restrained
 *   indigo accent, quieter surfaces and a single clear type hierarchy.
 * - Kept every piece of content (location, availability, bio, focus chips,
 *   portraits, tagline and live stats) and reflowed it into a calmer grid.
 */
export default function HeroSection() {
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
	const [copied, setCopied] = useState(false);

	const handleCopyEmail = (e: React.MouseEvent) => {
		e.preventDefault();
		navigator.clipboard.writeText("itsanvert@gmail.com");
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const resolveCount = (
		count: number,
		loading: boolean,
		error: string | null,
	): string | null => {
		if (count > 0) return `${count}+`;
		if (error) return "–";
		if (loading) return null;
		return `${count}+`;
	};

	const stats = [
		{
			icon: Sparkles,
			label: "Years of experience",
			value: "2.5+",
			href: "/about",
		},
		{
			icon: FolderKanban,
			label: "Projects delivered",
			value: resolveCount(projects.length, projectsLoading, projectsError),
			href: "/projects",
		},
		{
			icon: Award,
			label: "Certifications",
			value: resolveCount(
				certificates.length,
				certificatesLoading,
				certificatesError,
			),
			href: "/certificates",
		},
	];

	return (
		<section className="hero-shell relative w-full overflow-hidden">
			<div
				aria-hidden
				className="ui-hero-glow pointer-events-none absolute inset-x-0 top-0 z-0 h-[42rem]"
			/>
			<AsciiBackdrop
				className="inset-0 opacity-40 dark:opacity-50"
				shape="horizon"
				cellSize={20}
				density={0.45}
				glow={0.22}
				gradientOpacity={0.4}
				glyphOpacity={0.5}
				speed={0.35}
				intro
			/>

			<div className="relative z-10 mx-auto flex min-h-[calc(100svh-5.25rem)] w-full max-w-7xl flex-col justify-center gap-12 px-5 py-12 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
				<div className="flex flex-wrap items-center justify-between gap-3">
					<span
						className="ui-chip px-3 py-1.5 text-xs"
						style={{ color: "var(--ui-text-muted)" }}
					>
						<MapPin className="size-3.5" aria-hidden />
						Phnom Penh, Cambodia
					</span>

					<span className="ui-chip px-3 py-1.5 text-xs">
						<span className="relative flex size-2" aria-hidden>
							<span
								className="absolute inline-flex size-full rounded-full opacity-60 motion-safe:animate-ping"
								style={{ backgroundColor: "var(--ui-accent)" }}
							/>
							<span
								className="relative inline-flex size-2 rounded-full"
								style={{ backgroundColor: "var(--ui-accent)" }}
							/>
						</span>
						Open to opportunities
					</span>
				</div>

				<div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)] lg:gap-16">
					<div className="flex flex-col items-start gap-8">
						<div className="space-y-5">
							<p
								data-reveal
								style={reveal(0)}
								className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-[var(--ui-text-subtle)]"
							>
								Software engineer
							</p>

							<h1
								data-reveal
								style={reveal(60)}
								className="text-balance text-[2.75rem] font-semibold leading-[0.98] tracking-[-0.04em] text-[var(--ui-text)] sm:text-6xl lg:text-7xl"
							>
								Vert <span style={{ color: "var(--ui-accent)" }}>San</span>
							</h1>

							<p
								data-reveal
								style={{ ...reveal(120), color: "var(--ui-text-muted)" }}
								className="max-w-md text-base leading-relaxed sm:text-lg"
							>
								I build accessible, scalable, and secure web and mobile
								applications — with modern architecture and thoughtful UX.
							</p>
						</div>

						<div
							data-reveal
							style={reveal(180)}
							className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center"
						>
							<Link
								to="/projects"
								className="ui-button ui-button-primary ui-focusable group w-full sm:w-auto"
							>
								Explore projects
								<ArrowUpRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
							</Link>

							<a
								href="/resume.pdf"
								download
								className="ui-button ui-button-ghost ui-focusable w-full sm:w-auto"
							>
								<Download className="size-4" />
								Download resume
							</a>

							<button
								type="button"
								onClick={handleCopyEmail}
								title="Copy email address"
								className="ui-button ui-button-ghost ui-focusable w-full px-3.5 text-xs sm:w-auto"
							>
								{copied ? (
									<>
										<Check
											className="size-3.5"
											style={{ color: "var(--ui-accent)" }}
										/>
										<span style={{ color: "var(--ui-accent)" }}>Copied</span>
									</>
								) : (
									<>
										<Copy className="size-3.5" />
										<span className="hidden sm:inline">Copy email</span>
									</>
								)}
							</button>
						</div>

						<div
							data-reveal
							style={reveal(240)}
							className="flex items-center gap-2"
						>
							{socials.map(({ href, label, icon: Icon }) => (
								<a
									key={label}
									href={href}
									target="_blank"
									rel="noreferrer"
									aria-label={label}
									title={label}
									className="ui-focusable flex size-10 items-center justify-center rounded-full border transition-transform duration-200 hover:-translate-y-0.5"
									style={{
										borderColor: "var(--ui-border)",
										backgroundColor: "var(--ui-surface)",
										color: "var(--ui-text-muted)",
									}}
								>
									<Icon className="size-4" />
								</a>
							))}
						</div>
					</div>

					<aside
						data-reveal
						style={reveal(180)}
						className="ui-card relative w-full overflow-hidden p-6 sm:p-7"
					>
						<div
							aria-hidden
							className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full"
							style={{
								background:
									"radial-gradient(circle, var(--ui-glow) 0%, transparent 70%)",
							}}
						/>

						<div className="relative flex items-center justify-between gap-3">
							<p
								className="text-[0.68rem] font-medium uppercase tracking-[0.2em]"
								style={{ color: "var(--ui-text-subtle)" }}
							>
								About
							</p>
							<Link
								to="/about"
								className="ui-focusable inline-flex items-center gap-1 rounded-sm text-xs font-medium transition-colors hover:text-[var(--ui-text)]"
								style={{ color: "var(--ui-text-muted)" }}
							>
								Full story
								<ArrowUpRight className="size-3" />
							</Link>
						</div>

						<p
							className="relative mt-4 text-sm leading-relaxed sm:text-[0.95rem]"
							style={{ color: "var(--ui-text-muted)" }}
						>
							I focus on interfaces that are fast, accessible, and visually
							clean. I work across the full stack — from pixel-perfect frontends
							to robust backends.
						</p>

						<ul className="relative mt-4 flex flex-wrap gap-2">
							{focus.map((item) => (
								<li key={item} className="ui-chip">
									{item}
								</li>
							))}
						</ul>

						<div className="relative mt-5 flex items-center gap-3">
							<div className="flex -space-x-2">
								{portraits.map((portrait) => (
									<img
										key={portrait.src}
										src={portrait.src}
										alt={portrait.alt}
										width={40}
										height={40}
										loading="lazy"
										decoding="async"
										className="size-10 rounded-full border-2 object-cover"
										style={{ borderColor: "var(--ui-bg)" }}
									/>
								))}
							</div>
							<p
								className="text-xs leading-snug"
								style={{ color: "var(--ui-text-subtle)" }}
							>
								Always learning, always building.
							</p>
						</div>
					</aside>
				</div>

				<div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
					{stats.map(({ icon: Icon, label, value, href }, index) => (
						<Link
							key={label}
							to={href}
							data-reveal
							style={reveal(300 + index * 60)}
							className="ui-card ui-focusable group flex items-center gap-3 p-4 sm:p-5"
						>
							<span className="ui-icon-chip size-10" aria-hidden>
								<Icon className="size-4" />
							</span>
							<div className="min-w-0 leading-tight">
								{value === null ? (
									<span
										className="inline-block h-4 w-10 animate-pulse rounded-sm align-middle"
										style={{ backgroundColor: "var(--ui-border)" }}
									/>
								) : (
									<p
										className="text-base font-semibold tabular-nums"
										style={{ color: "var(--ui-text)" }}
									>
										{value}
									</p>
								)}
								<p
									className="truncate text-xs"
									style={{ color: "var(--ui-text-muted)" }}
								>
									{label}
								</p>
							</div>
							<ArrowUpRight
								className="ml-auto size-3.5 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
								style={{ color: "var(--ui-text-subtle)" }}
							/>
						</Link>
					))}
				</div>
			</div>
		</section>
	);
}
