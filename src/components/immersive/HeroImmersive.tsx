import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
	ArrowDown,
	ArrowUpRight,
	Download,
	Github,
	Linkedin,
	Mail,
	MapPin,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { profile } from "#/data/profile";
import { useSceneSection } from "./scene/SceneContext";
import { scrollToId } from "./SmoothScroll";
import { Container, EASE, Magnetic, SplitText } from "./ui";

const socials = [
	{ href: profile.socials.github, label: "GitHub", icon: Github },
	{ href: profile.socials.linkedin, label: "LinkedIn", icon: Linkedin },
	{ href: `mailto:${profile.email}`, label: "Email", icon: Mail },
];

export default function HeroImmersive() {
	const sectionRef = useRef<HTMLElement>(null);
	const reduced = useReducedMotion();
	const [roleIndex, setRoleIndex] = useState(0);

	useSceneSection(sectionRef, "hero", "#818cf8");

	useEffect(() => {
		if (reduced) return;
		const id = window.setInterval(() => {
			setRoleIndex((index) => (index + 1) % profile.roles.length);
		}, 2800);
		return () => window.clearInterval(id);
	}, [reduced]);

	const role = profile.roles[roleIndex] ?? profile.roles[0];

	return (
		<section
			ref={sectionRef}
			id="top"
			aria-label="Introduction"
			className="relative flex min-h-[100svh] items-center overflow-hidden pt-28 pb-16 sm:pt-32 lg:pt-24"
		>
			{/* One soft glow anchored behind the copy. The portrait is the only
			    other light source, so the hero stays quiet. */}
			<div
				aria-hidden
				className="pointer-events-none absolute -left-32 top-1/3 size-[36rem] rounded-full bg-[radial-gradient(circle_at_center,var(--i-glow),transparent_66%)] blur-3xl"
			/>

			<Container className="relative">
				<div className="grid grid-cols-12 items-center gap-y-10">
					<div className="col-span-12 lg:col-span-8 xl:col-span-7">
						<motion.div
							initial={reduced ? false : { opacity: 0, y: 14 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.7, ease: EASE }}
							className="flex flex-wrap items-center gap-x-4 gap-y-2"
						>
							<span className="inline-flex items-center gap-2 rounded-full border border-[var(--i-line)] bg-[var(--i-card)] px-3 py-1.5">
								<span className="relative flex size-2">
									<span className="absolute inline-flex size-full animate-ping rounded-full bg-[#6ee7b7] opacity-60" />
									<span className="relative inline-flex size-2 rounded-full bg-[#6ee7b7]" />
								</span>
								<span className="mono-label text-[var(--i-muted)]">
									{profile.availability}
								</span>
							</span>

							<span className="mono-label inline-flex items-center gap-1.5 text-[var(--i-subtle)]">
								<MapPin className="size-3" aria-hidden />
								{profile.location}
							</span>
						</motion.div>

						<h1 className="mt-7 font-display text-[clamp(3.5rem,10vw,9rem)] font-semibold leading-[0.92] tracking-[-0.045em] text-[var(--i-fg)]">
							<SplitText text={profile.name} delay={0.15} />
						</h1>

						<div className="mt-5 flex min-h-[1.9em] items-center gap-3">
							<span
								aria-hidden
								className="h-px w-8 bg-gradient-to-r from-[#2dd4bf] to-transparent"
							/>
							<span className="sr-only">Roles: {profile.roles.join(", ")}</span>
							<AnimatePresence mode="wait" initial={false}>
								<motion.span
									key={role}
									aria-hidden
									initial={reduced ? false : { opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={reduced ? undefined : { opacity: 0, y: -10 }}
									transition={{ duration: 0.45, ease: EASE }}
									className="mono-label text-[var(--i-muted)]"
								>
									{role}
								</motion.span>
							</AnimatePresence>
						</div>

						<motion.p
							initial={reduced ? false : { opacity: 0, y: 16 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, ease: EASE, delay: 0.5 }}
							className="mt-6 max-w-[46ch] text-pretty text-base leading-relaxed text-[var(--i-muted)] sm:text-lg"
						>
							{profile.statement}
						</motion.p>

						<motion.div
							initial={reduced ? false : { opacity: 0, y: 16 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, ease: EASE, delay: 0.62 }}
							className="mt-9 flex flex-wrap items-center gap-3"
						>
							<Magnetic strength={10}>
								<button
									type="button"
									onClick={() => scrollToId("projects")}
									className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[var(--i-fg)] px-6 text-sm font-medium text-[var(--i-bg)] transition-colors hover:bg-[var(--i-fg)]/90"
								>
									View projects
									<ArrowUpRight
										aria-hidden
										className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
									/>
								</button>
							</Magnetic>

							<Magnetic strength={10}>
								<a
									href={profile.resume}
									download
									className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[var(--i-line-strong)] bg-[var(--i-card)] px-6 text-sm font-medium text-[var(--i-fg)] backdrop-blur-md transition-colors hover:border-[var(--i-fg)]/40 hover:bg-[var(--i-card-strong)]"
								>
									<Download aria-hidden className="size-4" />
									Download resume
								</a>
							</Magnetic>
						</motion.div>

						{/* Inline socials for screens without the fixed rail. */}
						<motion.div
							initial={reduced ? false : { opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.8, delay: 0.8 }}
							className="mt-10 flex items-center gap-1 2xl:hidden"
						>
							{socials.map(({ href, label, icon: Icon }) => (
								<a
									key={label}
									href={href}
									target={href.startsWith("mailto:") ? undefined : "_blank"}
									rel="noreferrer"
									aria-label={label}
									title={label}
									className="flex size-10 items-center justify-center rounded-full text-[var(--i-muted)] transition-colors hover:bg-[var(--i-card)] hover:text-[var(--i-fg)]"
								>
									<Icon aria-hidden className="size-4" />
								</a>
							))}
						</motion.div>
					</div>
				</div>
			</Container>

			{/* Fixed vertical rail, only where there is room outside the grid. */}
			<div className="pointer-events-none fixed left-6 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-center gap-5 2xl:flex">
				{socials.map(({ href, label, icon: Icon }) => (
					<a
						key={label}
						href={href}
						target={href.startsWith("mailto:") ? undefined : "_blank"}
						rel="noreferrer"
						aria-label={label}
						title={label}
						className="pointer-events-auto flex size-9 items-center justify-center rounded-full text-[var(--i-subtle)] transition-colors hover:bg-[var(--i-card)] hover:text-[var(--i-fg)]"
					>
						<Icon aria-hidden className="size-4" />
					</a>
				))}
				<span aria-hidden className="h-16 w-px bg-gradient-to-b from-[var(--i-line-strong)] to-transparent" />
			</div>

			<div className="pointer-events-none absolute inset-x-0 bottom-7 flex justify-center">
				<motion.button
					type="button"
					onClick={() => scrollToId("about")}
					initial={reduced ? false : { opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 1, duration: 0.6 }}
					className="pointer-events-auto flex flex-col items-center gap-2 text-[var(--i-subtle)] transition-colors hover:text-[var(--i-fg)]"
					aria-label="Scroll to about section"
				>
					<span className="mono-label">Scroll</span>
					<motion.span
						aria-hidden
						animate={reduced ? undefined : { y: [0, 6, 0] }}
						transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
					>
						<ArrowDown className="size-4" />
					</motion.span>
				</motion.button>
			</div>

			{/* The resume CTA is the only place the route nav is needed from here. */}
			<Link to="/about" className="sr-only">
				More about Vert San
			</Link>
		</section>
	);
}
