import { Link } from "@tanstack/react-router";
import {
	motion,
	useReducedMotion,
	useScroll,
	useSpring,
	useTransform,
} from "framer-motion";
import { ArrowRight, ArrowUpRight, Github } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { projects, type ProjectEntry } from "#/data/projects";
import { useLiveContent } from "#/lib/useLiveContent";
import { cn } from "#/lib/utils";
import { useSceneSection } from "./scene/SceneContext";
import { Container, Glow, Reveal, SectionLabel } from "./ui";

interface LiveProject {
	title: string;
	slug: string;
	summary: string;
	status: string;
	startDate: string;
	endDate?: string | null;
	image?: string | null;
	link?: string | null;
	github?: string | null;
	tags: string[];
}

interface GalleryItem extends ProjectEntry {
	live: boolean;
}

function useMediaQuery(query: string) {
	const [matches, setMatches] = useState(false);
	useEffect(() => {
		const media = window.matchMedia(query);
		const sync = () => setMatches(media.matches);
		sync();
		media.addEventListener("change", sync);
		return () => media.removeEventListener("change", sync);
	}, [query]);
	return matches;
}

function fromLive(project: LiveProject): GalleryItem {
	return {
		slug: project.slug,
		title: project.title,
		status: project.status,
		year: project.startDate?.slice(0, 4) ?? "",
		summary: project.summary,
		problem: project.summary,
		solution: "",
		result: "",
		image: project.image || "/placeholder-project.svg",
		tags: project.tags ?? [],
		link: project.link ?? undefined,
		github: project.github ?? undefined,
		live: true,
	};
}

function SpotlightCard({ item, index }: { item: GalleryItem; index: number }) {
	const cardRef = useRef<HTMLElement>(null);

	return (
		<article
			ref={cardRef}
			onPointerMove={(event) => {
				const rect = cardRef.current?.getBoundingClientRect();
				if (!rect) return;
				cardRef.current?.style.setProperty(
					"--mx",
					`${event.clientX - rect.left}px`,
				);
				cardRef.current?.style.setProperty(
					"--my",
					`${event.clientY - rect.top}px`,
				);
			}}
			className="group relative flex w-[min(84vw,520px)] shrink-0 snap-center flex-col overflow-hidden rounded-3xl border border-[var(--i-line)] bg-[var(--i-card)] backdrop-blur-xl lg:w-[clamp(360px,40vw,540px)]"
		>
			{/* Spotlight follows the cursor inside the card. */}
			<span
				aria-hidden
				className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
				style={{
					background:
						"radial-gradient(320px circle at var(--mx, 50%) var(--my, 50%), rgba(99,102,241,0.16), transparent 70%)",
				}}
			/>

			<div className="relative h-[clamp(180px,30svh,300px)] overflow-hidden border-b border-[var(--i-line)]">
				<img
					src={item.image}
					alt={`${item.title} preview`}
					loading="lazy"
					decoding="async"
					className="size-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.045]"
				/>
				<span
					aria-hidden
					className="absolute inset-0 bg-gradient-to-t from-[#05070d]/70 via-transparent to-transparent"
				/>
				<div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
					<span className="rounded-full border border-white/15 bg-black/35 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white/85 backdrop-blur-md">
						{item.status}
					</span>
					<span className="font-mono text-[10px] tracking-[0.18em] text-white/60">
						{String(index + 1).padStart(2, "0")} / {item.year}
					</span>
				</div>
			</div>

			<div className="flex flex-1 flex-col p-6 sm:p-7">
				<h3 className="font-display text-2xl font-semibold tracking-[-0.02em]">
					{item.title}
				</h3>

				{item.problem ? (
					<dl className="mt-5 space-y-3 text-sm leading-relaxed">
						<div className="grid grid-cols-[4.5rem_1fr] gap-2">
							<dt className="mono-label pt-0.5 text-[var(--i-subtle)]">Problem</dt>
							<dd className="text-[var(--i-muted)]">{item.problem}</dd>
						</div>
						{item.solution && (
							<div className="grid grid-cols-[4.5rem_1fr] gap-2">
								<dt className="mono-label pt-0.5 text-[var(--i-subtle)]">Fix</dt>
								<dd className="text-[var(--i-muted)]">{item.solution}</dd>
							</div>
						)}
						{item.result && (
							<div className="grid grid-cols-[4.5rem_1fr] gap-2">
								<dt className="mono-label pt-0.5 text-[#6ee7b7]">Result</dt>
								<dd className="text-[var(--i-fg)]">{item.result}</dd>
							</div>
						)}
					</dl>
				) : (
					<p className="mt-4 text-sm leading-relaxed text-[var(--i-muted)]">
						{item.summary}
					</p>
				)}

				<ul className="mt-5 flex flex-wrap gap-1.5">
					{item.tags.slice(0, 5).map((tag) => (
						<li
							key={tag}
							className="rounded-full border border-[var(--i-line)] px-2.5 py-1 font-mono text-[11px] text-[var(--i-subtle)]"
						>
							{tag}
						</li>
					))}
				</ul>

				<div className="mt-auto flex items-center justify-between gap-4 pt-6">
					{item.live ? (
						<Link
							to="/projects/$projectId"
							params={{ projectId: item.slug }}
							className="group/link inline-flex items-center gap-2 text-sm font-medium text-[var(--i-fg)]"
						>
							View case study
							<ArrowRight
								aria-hidden
								className="size-4 transition-transform duration-300 group-hover/link:translate-x-1"
							/>
						</Link>
					) : (
						<Link
							to="/projects"
							className="group/link inline-flex items-center gap-2 text-sm font-medium text-[var(--i-fg)]"
						>
							Browse projects
							<ArrowRight
								aria-hidden
								className="size-4 transition-transform duration-300 group-hover/link:translate-x-1"
							/>
						</Link>
					)}

					<div className="flex items-center gap-1">
						{item.github && (
							<a
								href={item.github}
								target="_blank"
								rel="noreferrer"
								aria-label={`${item.title} on GitHub`}
								className="flex size-8 items-center justify-center rounded-full text-[var(--i-subtle)] transition-colors hover:bg-[var(--i-card-strong)] hover:text-[var(--i-fg)]"
							>
								<Github aria-hidden className="size-4" />
							</a>
						)}
						{item.link && (
							<a
								href={item.link}
								target="_blank"
								rel="noreferrer"
								aria-label={`Open ${item.title}`}
								className="flex size-8 items-center justify-center rounded-full text-[var(--i-subtle)] transition-colors hover:bg-[var(--i-card-strong)] hover:text-[var(--i-fg)]"
							>
								<ArrowUpRight aria-hidden className="size-4" />
							</a>
						)}
					</div>
				</div>
			</div>
		</article>
	);
}

export default function ProjectsGallery() {
	const sectionRef = useRef<HTMLElement>(null);
	const pinRef = useRef<HTMLDivElement>(null);
	const trackRef = useRef<HTMLDivElement>(null);
	const reduced = useReducedMotion();
	const desktop = useMediaQuery("(min-width: 1024px)");
	const pinned = desktop && !reduced;
	const [shift, setShift] = useState(0);

	const { items } = useLiveContent<LiveProject>("projects");
	const gallery: GalleryItem[] =
		items.length > 0
			? items.map(fromLive)
			: projects.map((project) => ({ ...project, live: false }));

	useSceneSection(sectionRef, "projects", "#2dd4bf");

	// Measure how far the track must travel so the last card lands in view.
	useEffect(() => {
		if (!pinned) {
			setShift(0);
			return;
		}
		const measure = () => {
			const track = trackRef.current;
			if (!track) return;
			const overflow = track.scrollWidth - window.innerWidth;
			setShift(Math.max(0, overflow + 48));
		};
		measure();
		const observer = new ResizeObserver(measure);
		if (trackRef.current) observer.observe(trackRef.current);
		window.addEventListener("resize", measure);
		return () => {
			observer.disconnect();
			window.removeEventListener("resize", measure);
		};
	}, [pinned, gallery.length]);

	const { scrollYProgress } = useScroll({
		target: pinRef,
		offset: ["start start", "end end"],
	});
	const x = useSpring(useTransform(scrollYProgress, [0, 1], [0, -shift]), {
		stiffness: 110,
		damping: 28,
		restDelta: 0.4,
	});

	return (
		<section
			ref={sectionRef}
			id="projects"
			aria-labelledby="projects-heading"
			className="relative overflow-hidden pt-24 sm:pt-32"
		>
			<Glow className="right-0 top-0 size-[34rem] opacity-60" color="rgba(45,212,191,0.16)" />

			<Container>
				<div className="flex flex-wrap items-end justify-between gap-6">
					<div>
						<SectionLabel>Featured projects</SectionLabel>
						<h2
							id="projects-heading"
							className="mt-6 font-display text-4xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-5xl"
						>
							<Reveal>Selected work,</Reveal>
							<Reveal delay={0.08}>
								<span className="immersive-gradient-text">start to ship.</span>
							</Reveal>
						</h2>
					</div>
					<p className="mono-label hidden text-[var(--i-subtle)] sm:block">
						{pinned ? "Scroll to explore" : "Swipe to explore"}
					</p>
				</div>
			</Container>

			<div
				ref={pinRef}
				className="relative mt-12"
				style={{ height: pinned ? `calc(100svh + ${shift}px)` : undefined }}
			>
				<div
					className={cn(
						"relative overflow-hidden",
						pinned && "sticky top-0 flex h-[100svh] items-center",
					)}
				>
					<motion.div
						ref={trackRef}
						style={pinned ? { x } : undefined}
						className={cn(
							"flex gap-5 py-4",
							pinned
								? "px-[max(1.5rem,calc((100vw-1280px)/2+3rem))]"
								: "snap-x snap-mandatory overflow-x-auto px-5 pb-6 no-scrollbar sm:px-8 lg:px-12",
						)}
					>
						{gallery.map((item, index) => (
							<SpotlightCard key={item.slug} item={item} index={index} />
						))}

						{/* End card keeps the horizontal travel from feeling abrupt. */}
						<Link
							to="/projects"
							className="flex w-[min(60vw,300px)] shrink-0 snap-center flex-col justify-between rounded-3xl border border-dashed border-[var(--i-line-strong)] bg-[var(--i-card)] p-6 transition-colors hover:border-[var(--i-fg)]/40 hover:bg-[var(--i-card-strong)]"
						>
							<span className="mono-label text-[var(--i-subtle)]">All work</span>
							<span className="mt-8 font-display text-2xl font-medium leading-tight tracking-[-0.02em]">
								See every project
								<ArrowUpRight aria-hidden className="mt-3 size-6 text-[#6ee7b7]" />
							</span>
						</Link>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
