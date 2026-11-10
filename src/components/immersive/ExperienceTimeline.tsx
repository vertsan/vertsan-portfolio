import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { ArrowUpRight, MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { experience, type ExperienceEntry } from "#/data/experience";
import { useLiveContent } from "#/lib/useLiveContent";
import { cn } from "#/lib/utils";
import { useScene, useSceneSection } from "./scene/SceneContext";
import {
	Container,
	Glow,
	Reveal,
	SectionLabel,
	TiltCard,
} from "./ui";

interface LiveJob {
	id?: number;
	jobTitle: string;
	company: string;
	location: string;
	summary: string;
	startDate: string;
	endDate: string | null;
	tags: string[];
	content: string;
}

const ACCENTS = ["#818cf8", "#2dd4bf", "#6ee7b7", "#a78bfa"];

function formatPeriod(startDate: string, endDate: string | null): string {
	const start = startDate?.slice(0, 4) || "—";
	const end = endDate ? endDate.slice(0, 4) : "Present";
	return `${start} — ${end}`;
}

/** Pulls the first three bullets out of markdown, falling back to sentences. */
function toHighlights(content: string, summary: string): string[] {
	const bullets = content
		.split("\n")
		.map((line) => line.replace(/^\s*[-*+]\s*/, "").trim())
		.filter((line) => line.length > 12 && !line.startsWith("#"))
		.slice(0, 3);
	if (bullets.length > 0) return bullets;
	return summary
		.split(/(?<=\.)\s+/)
		.filter(Boolean)
		.slice(0, 3);
}

function fromLive(job: LiveJob, index: number): ExperienceEntry {
	return {
		id: String(job.id ?? `live-${index}`),
		company: job.company,
		role: job.jobTitle,
		location: job.location,
		period: formatPeriod(job.startDate, job.endDate),
		startDate: job.startDate,
		endDate: job.endDate,
		summary: job.summary,
		highlights: toHighlights(job.content ?? "", job.summary),
		tech: job.tags ?? [],
		accent: ACCENTS[index % ACCENTS.length] ?? "#818cf8",
	};
}

function TimelineCard({
	entry,
	index,
	active,
	onActive,
}: {
	entry: ExperienceEntry;
	index: number;
	active: boolean;
	onActive: (index: number) => void;
}) {
	const cardRef = useRef<HTMLDivElement>(null);
	const { setTarget } = useScene();
	const reduced = useReducedMotion();

	// The role closest to the middle of the viewport owns the scene accent.
	useEffect(() => {
		const node = cardRef.current;
		if (!node) return;
		const observer = new IntersectionObserver(
			(entries) => {
				for (const observed of entries) {
					if (observed.isIntersecting) onActive(index);
				}
			},
			{ rootMargin: "-42% 0px -42% 0px" },
		);
		observer.observe(node);
		return () => observer.disconnect();
	}, [index, onActive]);

	useEffect(() => {
		if (active) setTarget({ mode: "experience", accent: entry.accent });
	}, [active, entry.accent, setTarget]);

	return (
		<motion.div
			ref={cardRef}
			initial={reduced ? false : { opacity: 0, y: 28 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-12% 0px" }}
			transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
			className="relative pl-9 sm:pl-12"
		>
			{/* Node on the timeline. */}
			<span
				aria-hidden
				className={cn(
					"absolute left-0 top-8 z-10 size-3 -translate-x-[5px] rounded-full border-2 transition-colors duration-500",
					active
						? "border-[var(--i-bg)] bg-[#6ee7b7] shadow-[0_0_20px_rgba(110,231,183,0.7)]"
						: "border-[var(--i-line-strong)] bg-[var(--i-bg)]",
				)}
			/>

			<TiltCard max={4} className="rounded-3xl">
				<article
					className={cn(
						"glass relative overflow-hidden p-6 transition-colors duration-500 sm:p-8",
						active && "border-[var(--i-line-strong)]",
					)}
				>
					<span
						aria-hidden
						className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-70"
						style={{
							background: `linear-gradient(90deg, transparent, ${entry.accent}, transparent)`,
						}}
					/>
					<span
						aria-hidden
						className="pointer-events-none absolute -right-24 -top-24 size-56 rounded-full blur-3xl transition-opacity duration-500"
						style={{
							background: `radial-gradient(circle, ${entry.accent}33, transparent 68%)`,
							opacity: active ? 1 : 0.35,
						}}
					/>

					<div className="flex flex-wrap items-start justify-between gap-4">
						<div>
							<p className="mono-label text-[var(--i-subtle)]">
								{String(index + 1).padStart(2, "0")} / {entry.period}
							</p>
							<h3 className="mt-3 font-display text-xl font-semibold tracking-[-0.02em] sm:text-2xl">
								{entry.role}
							</h3>
							<p className="mt-1 text-sm text-[var(--i-muted)]">
								{entry.company}
								<span aria-hidden className="mx-2 text-[var(--i-subtle)]">
									·
								</span>
								<span className="inline-flex items-center gap-1 text-[var(--i-subtle)]">
									<MapPin aria-hidden className="size-3" />
									{entry.location}
								</span>
							</p>
						</div>
					</div>

					<p className="mt-5 max-w-2xl text-sm leading-relaxed text-[var(--i-muted)]">
						{entry.summary}
					</p>

					{entry.highlights.length > 0 && (
						<ul className="mt-5 space-y-2.5">
							{entry.highlights.map((highlight) => (
								<li
									key={highlight}
									className="flex gap-3 text-sm leading-relaxed text-[var(--i-muted)]"
								>
									<span
										aria-hidden
										className="mt-[0.55em] size-1.5 shrink-0 rounded-sm"
										style={{ background: entry.accent }}
									/>
									{highlight}
								</li>
							))}
						</ul>
					)}

					{entry.tech.length > 0 && (
						<ul className="mt-6 flex flex-wrap gap-1.5">
							{entry.tech.map((tag) => (
								<li
									key={tag}
									className="rounded-full border border-[var(--i-line)] bg-[var(--i-card)] px-2.5 py-1 font-mono text-[11px] text-[var(--i-subtle)]"
								>
									{tag}
								</li>
							))}
						</ul>
					)}
				</article>
			</TiltCard>
		</motion.div>
	);
}

export default function ExperienceTimeline() {
	const sectionRef = useRef<HTMLElement>(null);
	const trackRef = useRef<HTMLDivElement>(null);
	const reduced = useReducedMotion();
	const [active, setActive] = useState(0);
	const { items } = useLiveContent<LiveJob>("jobs");
	const entries = items.length > 0 ? items.map(fromLive) : experience;

	useSceneSection(sectionRef, "experience", entries[0]?.accent ?? "#818cf8");

	const { scrollYProgress } = useScroll({
		target: trackRef,
		offset: ["start 0.7", "end 0.75"],
	});
	const lineScale = useSpring(scrollYProgress, {
		stiffness: 90,
		damping: 26,
		restDelta: 0.001,
	});

	return (
		<section
			ref={sectionRef}
			id="experience"
			aria-labelledby="experience-heading"
			className="relative overflow-hidden py-24 sm:py-32"
		>
			<Glow className="-left-52 top-1/4 size-[36rem] opacity-60" />

			<Container>
				<div className="grid grid-cols-12 gap-y-12 lg:gap-x-12">
					<div className="col-span-12 lg:col-span-4">
						<div className="lg:sticky lg:top-32">
							<SectionLabel>Experience</SectionLabel>
							<h2
								id="experience-heading"
								className="mt-6 font-display text-4xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-5xl"
							>
								<Reveal>Where I have</Reveal>
								<Reveal delay={0.08}>
									<span className="immersive-gradient-text">done the work.</span>
								</Reveal>
							</h2>

							<ol className="mt-8 hidden space-y-1 border-l border-[var(--i-line)] pl-4 lg:block">
								{entries.map((entry, index) => (
									<li key={entry.id}>
										<span
											className={cn(
												"block border-l py-1.5 pl-3 text-sm transition-colors duration-300",
												index === active
													? "border-[#6ee7b7] text-[var(--i-fg)]"
													: "-ml-px border-transparent text-[var(--i-subtle)]",
											)}
										>
											{entry.company}
										</span>
									</li>
								))}
							</ol>

							<a
								href="/resume.pdf"
								download
								className="mt-8 inline-flex items-center gap-1.5 text-sm text-[var(--i-muted)] transition-colors hover:text-[var(--i-fg)]"
							>
								Full resume
								<ArrowUpRight aria-hidden className="size-3.5" />
							</a>
						</div>
					</div>

					<div className="col-span-12 lg:col-span-8">
						<div ref={trackRef} className="relative">
							{/* Track + glowing fill. */}
							<span
								aria-hidden
								className="absolute inset-y-0 left-0 w-px bg-[var(--i-line)]"
							/>
							<motion.span
								aria-hidden
								className="absolute inset-y-0 left-0 w-px origin-top bg-gradient-to-b from-[#818cf8] via-[#2dd4bf] to-[#6ee7b7]"
								style={{ scaleY: reduced ? 1 : lineScale }}
							/>

							<div className="space-y-6">
								{entries.map((entry, index) => (
									<TimelineCard
										key={entry.id}
										entry={entry}
										index={index}
										active={index === active}
										onActive={setActive}
									/>
								))}
							</div>
						</div>
					</div>
				</div>
			</Container>
		</section>
	);
}
