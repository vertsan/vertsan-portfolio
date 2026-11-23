import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import {
	type CSSProperties,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";
import {
	ProjectCard,
	type Project,
} from "#/components/sections/ProjectsSection";
import { Button } from "#/components/ui/button";
import SectionHeading from "#/components/ui/section-heading";
import { Skeleton } from "#/components/ui/skeleton";
import { useProjectVotes } from "#/hooks/use-project-votes";
import { useLiveContent } from "#/lib/useLiveContent";
import "./ShowcaseSection.css";

const MAX_ITEMS = 6;
const AUTOPLAY_MS = 5200;

function usePerView() {
	const [perView, setPerView] = useState(1);

	useEffect(() => {
		const compute = () =>
			setPerView(
				window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1,
			);
		compute();
		window.addEventListener("resize", compute, { passive: true });
		return () => window.removeEventListener("resize", compute);
	}, []);

	return perView;
}

function ShowcaseSkeleton({ perView }: { perView: number }) {
	return (
		<div className="showcase-viewport" aria-hidden="true">
			<div className="showcase-track">
				{["a", "b", "c"].slice(0, perView).map((key) => (
					<div className="showcase-slide" key={key}>
						<div className="showcase-card-skeleton">
							<Skeleton className="aspect-video w-full rounded-none" />
							<div className="space-y-2 p-4">
								<Skeleton className="h-5 w-2/3" />
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-4/5" />
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export default function ShowcaseSection() {
	const { items: projects, loading } = useLiveContent<Project>("projects");
	const perView = usePerView();
	const [index, setIndex] = useState(0);
	const [paused, setPaused] = useState(false);

	const showcase = useMemo(
		() =>
			[...projects]
				.sort(
					(a, b) =>
						new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
				)
				.slice(0, MAX_ITEMS),
		[projects],
	);

	const slugs = useMemo(
		() => showcase.map((project) => project.slug).filter(Boolean),
		[showcase],
	);
	const { votes, pending, vote } = useProjectVotes(slugs);

	const maxIndex = Math.max(0, showcase.length - perView);
	const safeIndex = Math.min(index, maxIndex);
	const isLoading = loading && showcase.length === 0;

	const goTo = useCallback(
		(next: number) => setIndex(Math.max(0, Math.min(next, maxIndex))),
		[maxIndex],
	);

	useEffect(() => {
		if (paused || maxIndex === 0) return;
		const timer = window.setInterval(
			() => setIndex((current) => (current + 1) % (maxIndex + 1)),
			AUTOPLAY_MS,
		);
		return () => window.clearInterval(timer);
	}, [paused, maxIndex]);

	if (!isLoading && showcase.length === 0) return null;

	return (
		<section
			id="showcase"
			className="relative flex min-h-screen scroll-mt-20 flex-col justify-center overflow-hidden px-4 py-16 sm:px-6 md:py-24"
		>
			<div className="mx-auto w-full max-w-6xl space-y-10 md:space-y-14">
				<SectionHeading
					eyebrow="Showcase"
					title="Featured Projects"
					description="A closer look at the projects I've designed and shipped."
				/>

				{isLoading ? (
					<ShowcaseSkeleton perView={perView} />
				) : (
					<section
						className="showcase-viewport"
						aria-label="Featured projects carousel"
						onMouseEnter={() => setPaused(true)}
						onMouseLeave={() => setPaused(false)}
						onFocusCapture={() => setPaused(true)}
						onBlurCapture={() => setPaused(false)}
					>
						<div
							className="showcase-track"
							style={{ "--showcase-index": safeIndex } as CSSProperties}
						>
							{showcase.map((project, i) => (
								<div
									className="showcase-slide"
									key={project.slug ?? project.title}
								>
									<ProjectCard
										project={project}
										index={i}
										vote={votes[project.slug]}
										pending={pending[project.slug]}
										onVote={vote}
									/>
								</div>
							))}
						</div>
					</section>
				)}

				{!isLoading && maxIndex > 0 && (
					<div className="showcase-controls">
						<div className="flex items-center gap-2">
							<Button
								type="button"
								variant="outline"
								size="icon"
								onClick={() => goTo(safeIndex - 1)}
								disabled={safeIndex === 0}
								aria-label="Previous project"
								className="showcase-nav"
							>
								<ArrowLeft className="size-4" />
							</Button>
							<Button
								type="button"
								variant="outline"
								size="icon"
								onClick={() => goTo(safeIndex + 1)}
								disabled={safeIndex === maxIndex}
								aria-label="Next project"
								className="showcase-nav"
							>
								<ArrowRight className="size-4" />
							</Button>
						</div>

						<div
							className="showcase-dots"
							role="tablist"
							aria-label="Project slides"
						>
							{showcase.slice(0, maxIndex + 1).map((project, i) => (
								<button
									key={project.slug ?? project.title}
									type="button"
									role="tab"
									aria-label={`Go to slide ${i + 1}`}
									aria-selected={i === safeIndex}
									onClick={() => goTo(i)}
									className={`showcase-dot ${i === safeIndex ? "is-active" : ""}`}
								/>
							))}
						</div>

						<Button variant="ghost" asChild>
							<Link to="/projects" className="gap-2">
								See all projects
								<ArrowUpRight className="size-4" />
							</Link>
						</Button>
					</div>
				)}

				{isLoading && (
					<div className="flex justify-center">
						<Skeleton className="h-9 w-36 rounded-full" />
					</div>
				)}
			</div>
		</section>
	);
}
