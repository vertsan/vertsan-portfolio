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
import { useEffect, useState } from "react";
import DitherVeil from "#/components/DitherVeil";
import { useIsDark } from "#/lib/useIsDark";
import { useLiveContent } from "#/lib/useLiveContent";
import { cn } from "#/lib/utils";
import { AnimatedGradientText } from "#/registry/magicui/animated-gradient-text";
import { RainbowButton } from "#/registry/magicui/rainbow-button";

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

function StatTile({
	icon: Icon,
	label,
	value,
}: {
	icon: React.ComponentType<{ className?: string }>;
	label: string;
	value: string | null;
}) {
	return (
		<div className="group flex min-w-0 items-center gap-3 rounded-2xl border border-black/8 bg-white/60 px-3.5 py-3 shadow-sm backdrop-blur-md transition-colors duration-200 hover:border-black/15 hover:bg-white/80 dark:border-white/10 dark:bg-white/6 dark:shadow-none dark:hover:border-white/20 dark:hover:bg-white/10">
			<div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-black/5 text-black/70 dark:bg-white/8 dark:text-white/80">
				<Icon className="size-4" />
			</div>
			<div className="min-w-0 leading-tight">
				{value === null ? (
					<span className="inline-block h-4 w-10 animate-pulse rounded-sm bg-black/15 align-middle dark:bg-white/20" />
				) : (
					<p className="flex items-center gap-1 text-base font-semibold tabular-nums text-[#0b0e17] dark:text-white">
						{value}
						<ArrowUpRight className="size-3 text-black/35 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-black/70 dark:text-white/40 dark:group-hover:text-white/80" />
					</p>
				)}
				<p className="truncate text-xs text-black/55 dark:text-white/55">
					{label}
				</p>
			</div>
		</div>
	);
}

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
	const [reducedMotion, setReducedMotion] = useState(false);
	const [copied, setCopied] = useState(false);
	const isDark = useIsDark();

	useEffect(() => {
		const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
		const update = () => setReducedMotion(mq.matches);
		update();
		mq.addEventListener("change", update);
		return () => mq.removeEventListener("change", update);
	}, []);

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
		<section className="relative w-full px-3 pt-3 sm:px-4 sm:pt-4">
			<div className="relative flex min-h-[calc(100svh-5.25rem)] w-full flex-col overflow-hidden rounded-[1.75rem] bg-[#eef0f4] shadow-2xl shadow-black/10 ring-1 ring-black/5 dark:bg-[#05070f] dark:shadow-black/40 dark:ring-white/10">
				<div aria-hidden className="absolute inset-0 z-0 overflow-hidden">
					{reducedMotion ? (
						<img
							src="/hero-portrait-cutout.png"
							alt=""
							className="size-full object-contain object-right mix-blend-multiply dark:mix-blend-normal"
							decoding="async"
						/>
					) : (
						<DitherVeil
							src="/hero-portrait-cutout.png"
							fit="contain"
							pattern="floyd"
							pixelSize={2}
							levels={3}
							palette="duotone"
							inkColor={isDark ? "#05070f" : "#eef0f4"}
							paperColor={isDark ? "#f8fafc" : "#0b0e17"}
							contrast={1.35}
							brightness={0.08}
							revealRadius={380}
							softness={0.7}
							linger={1.5}
							rimColor="#ff3366"
							rim={0.12}
							wander={true}
							clickBurst={true}
							className="size-full"
						/>
					)}
				</div>

				<div
					aria-hidden
					className="pointer-events-none absolute inset-0 z-1 bg-gradient-to-t from-[#eef0f4] via-[#eef0f4]/45 to-transparent dark:from-[#05070f] dark:via-[#05070f]/55"
				/>
				<div
					aria-hidden
					className="pointer-events-none absolute inset-0 z-1 bg-gradient-to-r from-[#eef0f4] via-[#eef0f4]/72 to-transparent lg:via-[#eef0f4]/35 dark:from-[#05070f] dark:via-[#05070f]/78 dark:lg:via-[#05070f]/40"
				/>
				<div
					aria-hidden
					className="pointer-events-none absolute inset-0 z-1 bg-[radial-gradient(ellipse_at_top_right,rgba(168,85,247,0.14),transparent_58%)]"
				/>
				<div
					aria-hidden
					className="pointer-events-none absolute inset-0 z-1 bg-[radial-gradient(ellipse_at_bottom_left,rgba(56,189,248,0.16),transparent_52%)] dark:bg-[radial-gradient(ellipse_at_bottom_left,rgba(56,189,248,0.07),transparent_52%)]"
				/>

				<div className="pointer-events-none relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-between gap-10 px-5 py-6 sm:px-8 sm:py-8 lg:px-10">
					<div className="flex w-full items-center justify-between gap-3">
						<div className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs text-black/70 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-black/30 dark:text-white/70 dark:shadow-none">
							<MapPin className="size-3 text-black/50 dark:text-white/50" />
							<span>Phnom Penh, Cambodia</span>
						</div>

						<div className="pointer-events-auto group relative flex w-fit items-center justify-center gap-2 rounded-full border border-black/10 bg-white/70 px-3.5 py-1.5 shadow-[inset_0_-8px_10px_#8fdfff1f] backdrop-blur-md transition-all duration-300 hover:shadow-[inset_0_-5px_10px_#8fdfff3f] dark:border-white/10 dark:bg-black/30">
							<span
								className={cn(
									"animate-gradient absolute inset-0 block h-full w-full rounded-[inherit] bg-linear-to-r from-[#ffaa40]/40 via-[#9c40ff]/40 to-[#ffaa40]/40 bg-size-[300%_100%] p-px",
								)}
								style={{
									WebkitMask:
										"linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
									WebkitMaskComposite: "destination-out",
									mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
									maskComposite: "subtract",
									WebkitClipPath: "padding-box",
								}}
							/>
							<span className="relative flex size-2">
								<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
								<span
									className="relative inline-flex size-2 rounded-full bg-emerald-400"
									style={{ boxShadow: "0 0 10px 2px rgba(52,211,153,0.7)" }}
								/>
							</span>
							<AnimatedGradientText className="text-[0.68rem] font-medium uppercase tracking-widest sm:text-xs">
								Open to opportunities
							</AnimatedGradientText>
						</div>
					</div>

					<div className="grid items-end gap-8 lg:grid-cols-[minmax(0,34rem)_minmax(16rem,22rem)] lg:justify-between lg:gap-12">
						<div className="pointer-events-auto flex max-w-xl flex-col items-start gap-6">
							<div className="space-y-4">
								<p className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-black/45 dark:text-white/45">
									Software engineer
								</p>
								<h1 className="text-balance text-[2.65rem] font-light leading-[0.98] tracking-tight text-[#0b0e17] sm:text-6xl md:text-7xl dark:text-white">
									Vert{" "}
									<span className="font-semibold">San</span>
								</h1>
								<p className="max-w-md text-base leading-relaxed text-[#0b0e17]/75 sm:text-lg dark:text-white/75">
									I build accessible, scalable, and secure web and mobile
									applications — with modern architecture and thoughtful UX.
								</p>
							</div>

							<div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
								<RainbowButton
									size="lg"
									className="w-full justify-center gap-2 font-medium shadow-lg shadow-black/15 sm:w-auto dark:shadow-black/40"
									asChild
								>
									<Link to="/projects">
										Explore projects
										<ArrowUpRight className="size-4" />
									</Link>
								</RainbowButton>

								<a
									href="/resume.pdf"
									download
									className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-black/10 bg-white/75 px-5 text-sm font-medium text-[#0b0e17] shadow-sm backdrop-blur-md transition-colors hover:border-black/20 hover:bg-white sm:w-auto dark:border-white/15 dark:bg-white/8 dark:text-white dark:shadow-none dark:hover:border-white/30 dark:hover:bg-white/12"
								>
									<Download className="size-4" />
									Download resume
								</a>

								<button
									type="button"
									onClick={handleCopyEmail}
									title="Copy email address"
									className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-black/10 bg-white/75 px-3.5 text-xs font-medium text-black/75 shadow-sm backdrop-blur-md transition-colors hover:border-black/20 hover:bg-white hover:text-black dark:border-white/15 dark:bg-white/8 dark:text-white/80 dark:shadow-none dark:hover:border-white/30 dark:hover:bg-white/12 dark:hover:text-white"
								>
									{copied ? (
										<>
											<Check className="size-3.5 text-emerald-500" />
											<span className="text-emerald-600 dark:text-emerald-400">
												Copied
											</span>
										</>
									) : (
										<>
											<Copy className="size-3.5" />
											<span className="hidden sm:inline">Copy email</span>
										</>
									)}
								</button>
							</div>

							<div className="flex items-center gap-2">
								{socials.map(({ href, label, icon: Icon }) => (
									<a
										key={label}
										href={href}
										target="_blank"
										rel="noreferrer"
										aria-label={label}
										title={label}
										className="flex size-10 items-center justify-center rounded-full border border-black/10 bg-white/70 text-black/75 shadow-sm backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-black/25 hover:bg-white hover:text-black dark:border-white/15 dark:bg-white/8 dark:text-white/80 dark:shadow-none dark:hover:border-white/40 dark:hover:bg-white/15 dark:hover:text-white"
									>
										<Icon className="size-4" />
									</a>
								))}
							</div>
						</div>

						<aside className="pointer-events-auto w-full max-w-md rounded-3xl border border-black/8 bg-white/62 p-5 shadow-xl shadow-black/5 backdrop-blur-xl sm:p-6 dark:border-white/10 dark:bg-[#0b0e17]/55 dark:shadow-black/30">
							<div className="flex items-center justify-between gap-3">
								<p className="text-[0.68rem] font-medium uppercase tracking-[0.2em] text-black/45 dark:text-white/45">
									About
								</p>
								<Link
									to="/about"
									className="inline-flex items-center gap-1 text-xs font-medium text-black/55 transition-colors hover:text-black dark:text-white/55 dark:hover:text-white"
								>
									Full story
									<ArrowUpRight className="size-3" />
								</Link>
							</div>

							<p className="mt-4 text-sm leading-relaxed text-[#0b0e17]/80 sm:text-[0.95rem] dark:text-white/80">
								I focus on interfaces that are fast, accessible, and visually
								clean. I work across the full stack — from pixel-perfect
								frontends to robust backends.
							</p>

							<ul className="mt-4 flex flex-wrap gap-2">
								{focus.map((item) => (
									<li
										key={item}
										className="rounded-full border border-black/8 bg-black/4 px-2.5 py-1 text-[0.7rem] font-medium text-black/65 dark:border-white/10 dark:bg-white/6 dark:text-white/70"
									>
										{item}
									</li>
								))}
							</ul>

							<div className="mt-5 flex items-center gap-3">
								<div className="flex -space-x-2">
									{portraits.map((portrait) => (
										<img
											key={portrait.src}
											src={portrait.src}
											alt={portrait.alt}
											className="size-10 rounded-full border-2 border-white object-cover dark:border-[#0b0e17]"
											decoding="async"
										/>
									))}
								</div>
								<p className="text-xs leading-snug text-black/55 dark:text-white/55">
									Always learning, always building.
								</p>
							</div>
						</aside>
					</div>

					<div className="pointer-events-auto grid grid-cols-1 gap-2.5 sm:grid-cols-3">
						{stats.map(({ icon, label, value, href }) => (
							<Link
								key={label}
								to={href}
								className="rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-black/20 dark:focus-visible:ring-white/30"
							>
								<StatTile icon={icon} label={label} value={value} />
							</Link>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
