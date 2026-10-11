import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";
import CardSwap, { Card, type CardSwapHandle } from "#/components/ui/CardSwap";
import SectionHeading from "#/components/ui/section-heading";
import { Skeleton } from "#/components/ui/skeleton";
import { useLiveContent } from "#/lib/useLiveContent";
import "./ShowcaseSection.css";

interface Project {
	title: string;
	slug: string;
	summary: string;
	status: string;
	startDate: string;
	endDate?: string | null;
	image?: string | null;
	tags: string[];
}

const MAX_ITEMS = 6;

function ShowcaseSkeleton() {
	return (
		<div className="showcase-stage" aria-hidden="true">
			<div className="relative mx-auto h-full w-full">
				{[3, 2, 1, 0].map((offset) => (
					<div
						key={offset}
						className="absolute left-1/2 top-1/2 h-[70%] w-[78%]"
						style={{
							transform: `translate(calc(-50% + ${offset * 22}px), calc(-50% - ${offset * 24}px)) scale(${1 - offset * 0.06})`,
							zIndex: 10 - offset,
						}}
					>
						<Skeleton className="h-full w-full rounded-2xl" />
					</div>
				))}
			</div>
		</div>
	);
}

export default function ShowcaseSection() {
	const { items: projects, loading } = useLiveContent<Project>("projects");
	const navigate = useNavigate();
	const swapRef = useRef<CardSwapHandle>(null);
	const [activeIndex, setActiveIndex] = useState(0);

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

	const activeProject = showcase[activeIndex];
	const isLoading = loading && showcase.length === 0;

	const handleCardClick = useCallback(
		(index: number) => {
			const project = showcase[index];
			if (!project) return;
			// Only the front card opens the detail page. Clicking a card behind
			// lets CardSwap bring it forward first (onChange updates activeIndex).
			if (index === activeIndex && project.slug) {
				navigate({
					to: "/projects/$projectId",
					params: { projectId: project.slug },
				});
			}
		},
		[activeIndex, navigate, showcase],
	);

	if (!isLoading && showcase.length === 0) return null;

	return (
		<section
			id="showcase"
			className="relative flex min-h-screen scroll-mt-20 flex-col justify-center overflow-hidden px-4 py-16 sm:px-6 md:py-24"
		>
			<div className="mx-auto w-full max-w-6xl space-y-10 md:space-y-14">
				<SectionHeading
					eyebrow="Showcase"
					title={
						<>
							Featured <span className="accent-gradient-text">Projects</span>
						</>
					}
					description="A rotating look at projects I've designed and shipped. Tap a card to jump straight into the case study."
				/>

				<div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14">
					{isLoading ? (
						<ShowcaseSkeleton />
					) : (
						<div className="showcase-stage">
							<CardSwap
								ref={swapRef}
								width={400}
								height={300}
								cardDistance={55}
								verticalDistance={60}
								depth={90}
								skewAmount={6}
								visibleCards={4}
								delay={4000}
								pauseOnHover={true}
								onCardClick={handleCardClick}
								onChange={setActiveIndex}
								theme="dark"
							>
								{showcase.map((project) => (
									<Card
										key={project.slug ?? project.title}
										className="showcase-card"
									>
										<div className="showcase-card-media">
											{project.image ? (
												<img
													src={project.image}
													alt={project.title}
													loading="lazy"
													decoding="async"
													draggable={false}
												/>
											) : (
												<span className="showcase-card-fallback" />
											)}
											<span className="showcase-card-scrim" />
										</div>
										<div className="showcase-card-body">
											<span className="showcase-card-status">
												{project.status}
											</span>
											<h3 className="showcase-card-title">{project.title}</h3>
											<p className="showcase-card-summary">{project.summary}</p>
										</div>
									</Card>
								))}
							</CardSwap>
						</div>
					)}

					{/* Active project details */}
					{activeProject && (
						<div className="flex flex-col gap-6">
							<div className="flex flex-wrap items-center gap-3">
								<span className="inline-flex items-center rounded-full border border-black/10 bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground dark:border-white/10">
									{activeProject.status}
								</span>
								{activeProject.startDate && (
									<span className="text-xs text-muted-foreground">
										{activeProject.startDate}
										{activeProject.endDate ? ` – ${activeProject.endDate}` : ""}
									</span>
								)}
							</div>

							<div className="space-y-3">
								<h3 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
									{activeProject.title}
								</h3>
								<p className="max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
									{activeProject.summary}
								</p>
							</div>

							{activeProject.tags?.length > 0 && (
								<div className="flex flex-wrap gap-1.5">
									{activeProject.tags.slice(0, 6).map((tag) => (
										<span
											key={tag}
											className="rounded-full border border-border bg-background/60 px-2.5 py-0.5 text-xs text-muted-foreground"
										>
											{tag}
										</span>
									))}
								</div>
							)}

							<div className="flex flex-wrap items-center gap-3">
								{activeProject.slug && (
									<Link
										to="/projects/$projectId"
										params={{ projectId: activeProject.slug }}
										className="inline-flex items-center gap-2 rounded-xl bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-transform duration-200 hover:-translate-y-0.5"
									>
										View project
										<ArrowUpRight className="size-4" />
									</Link>
								)}

								<div className="flex items-center gap-2">
									<button
										type="button"
										onClick={() => swapRef.current?.prev()}
										aria-label="Previous project"
										className="flex size-10 items-center justify-center rounded-full border border-border bg-background/60 text-foreground transition-colors duration-200 hover:bg-muted"
									>
										<ArrowLeft className="size-4" />
									</button>
									<button
										type="button"
										onClick={() => swapRef.current?.next()}
										aria-label="Next project"
										className="flex size-10 items-center justify-center rounded-full border border-border bg-background/60 text-foreground transition-colors duration-200 hover:bg-muted"
									>
										<ArrowRight className="size-4" />
									</button>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</section>
	);
}
