import { Link } from "@tanstack/react-router";
import { Download, Github, Linkedin, Mail, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import DitherVeil from "#/components/DitherVeil";
import { useIsDark } from "#/lib/useIsDark";

const socials = [
	{ href: "https://github.com/vertsan", label: "GitHub", icon: Github },
	{
		href: "https://linkedin.com/in/vertsan",
		label: "LinkedIn",
		icon: Linkedin,
	},
	{ href: "mailto:itsanvert@gmail.com", label: "Email", icon: Mail },
];

export default function HeroSection() {
	const [reducedMotion, setReducedMotion] = useState(false);
	const isDark = useIsDark();

	useEffect(() => {
		const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
		const update = () => setReducedMotion(mq.matches);
		update();
		mq.addEventListener("change", update);
		return () => mq.removeEventListener("change", update);
	}, []);

	return (
		<section className="relative w-full px-3 py-3 sm:px-4 sm:py-4">
			<div className="relative overflow-hidden rounded-2xl bg-[#eef0f4] ring-1 ring-black/5 sm:rounded-3xl dark:bg-[#05070f] dark:ring-white/10">
				{/* One soft glow behind the portrait — the only atmospheric effect. */}
				<div
					aria-hidden
					className="pointer-events-none absolute -right-40 top-1/2 h-[34rem] w-[34rem] -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.18),transparent_68%)] blur-2xl dark:bg-[radial-gradient(circle_at_center,rgba(129,140,248,0.22),transparent_68%)]"
				/>

				<div className="relative mx-auto grid w-full max-w-7xl items-center gap-10 px-5 py-10 sm:px-8 sm:py-14 lg:grid-cols-12 lg:gap-14 lg:px-12 lg:py-16">
					{/* Left: statement, actions, socials */}
					<div className="lg:col-span-7">
						<div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-black/55 dark:text-white/55">
							<span className="inline-flex items-center gap-2">
								<span className="size-2 rounded-full bg-emerald-500" />
								Open to opportunities
							</span>
							<span
								aria-hidden
								className="hidden h-3.5 w-px bg-black/15 sm:block dark:bg-white/15"
							/>
							<span className="inline-flex items-center gap-1.5">
								<MapPin className="size-3.5" />
								Phnom Penh, Cambodia
							</span>
						</div>

						<h1 className="mt-6 font-heading text-5xl font-semibold leading-[1.02] tracking-[-0.04em] text-[#0b0e17] sm:text-6xl lg:text-7xl dark:text-white">
							Vert San
						</h1>

						<p className="mt-3 text-lg font-medium text-black/60 sm:text-xl dark:text-white/60">
							Software engineer
						</p>

						<p className="mt-5 max-w-xl text-pretty text-sm leading-relaxed text-black/65 sm:text-base dark:text-white/65">
							I build accessible, scalable, and secure web and mobile
							applications, from pixel-perfect interfaces to the systems behind
							them.
						</p>

						<div className="mt-8 flex flex-wrap items-center gap-3">
							<Link
								to="/projects"
								className="inline-flex h-11 items-center justify-center rounded-xl bg-[#0b0e17] px-5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#0b0e17]/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4f46e5] dark:bg-white dark:text-[#0b0e17] dark:hover:bg-white/85"
							>
								View projects
							</Link>

							<a
								href="/resume.pdf"
								download
								className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-black/10 bg-white/60 px-5 text-sm font-medium text-[#0b0e17] transition-colors hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4f46e5] dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
							>
								<Download className="size-4" />
								Download resume
							</a>
						</div>

						<div className="mt-10 flex items-center gap-1">
							{socials.map(({ href, label, icon: Icon }) => (
								<a
									key={label}
									href={href}
									target={href.startsWith("mailto:") ? undefined : "_blank"}
									rel="noreferrer"
									aria-label={label}
									title={label}
									className="flex size-9 items-center justify-center rounded-lg text-black/55 transition-colors hover:bg-black/5 hover:text-[#0b0e17] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4f46e5] dark:text-white/55 dark:hover:bg-white/10 dark:hover:text-white"
								>
									<Icon className="size-4" />
								</a>
							))}
						</div>
					</div>

					{/* Right: contained dithered portrait */}
					<div className="lg:col-span-5">
						<figure className="mx-auto w-full max-w-[400px]">
							<div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-white ring-1 ring-black/5 sm:rounded-3xl dark:bg-[#0b0e17] dark:ring-white/10">
								{reducedMotion ? (
									<img
										src="/hero-portrait-cutout.png"
										alt="Portrait of Vert San"
										width={700}
										height={969}
										loading="eager"
										decoding="async"
										className="size-full object-contain p-5 sm:p-6"
									/>
								) : (
									<div
										role="img"
										aria-label="Portrait of Vert San"
										className="size-full"
									>
										<DitherVeil
											src="/hero-portrait-cutout.png"
											fit="contain"
											pattern="floyd"
											pixelSize={3}
											levels={3}
											palette="duotone"
											inkColor={isDark ? "#0b0e17" : "#ffffff"}
											paperColor={isDark ? "#f8fafc" : "#0b0e17"}
											contrast={1.35}
											brightness={isDark ? 0.12 : 0.02}
											revealRadius={340}
											softness={0.9}
											linger={1.6}
											rimColor={isDark ? "#818cf8" : "#4f46e5"}
											rim={0.12}
											wander={true}
											clickBurst={true}
											className="size-full"
										/>
									</div>
								)}

								<div
									aria-hidden
									className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_80%_at_50%_40%,transparent_58%,rgba(11,14,23,0.08))] dark:bg-[radial-gradient(90%_80%_at_50%_40%,transparent_52%,rgba(0,0,0,0.35))]"
								/>
							</div>
						</figure>
					</div>
				</div>
			</div>
		</section>
	);
}
