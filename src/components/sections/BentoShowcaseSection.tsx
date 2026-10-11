import {
	BadgeCheck,
	Clock,
	FolderOpen,
	Hourglass,
	type LucideIcon,
} from "lucide-react";
import { type CSSProperties, useMemo } from "react";
import SectionHeading from "#/components/ui/section-heading";
import { Skeleton } from "#/components/ui/skeleton";
import { useLiveContent } from "#/lib/useLiveContent";
import { BentoCard, BentoGrid } from "#/registry/magicui/bento-grid";
import "./BentoShowcaseSection.css";

interface BentoProject {
	title: string;
	slug?: string;
	summary?: string;
	status?: string;
	startDate?: string;
	image?: string | null;
}

const MAX_ITEMS = 7;

/**
 * Bento composition: a 2x2 hero tile followed by wide/narrow pairs that fill a
 * 3-column, 4-row grid without leaving gaps.
 */
const GRID_SPANS = [
	"lg:col-span-2 lg:row-span-2",
	"lg:col-span-1",
	"lg:col-span-1",
	"lg:col-span-2",
	"lg:col-span-1",
	"lg:col-span-2",
	"lg:col-span-1",
];

const GRID_ROWS = "auto-rows-[15rem] sm:auto-rows-[18rem] lg:auto-rows-[20rem]";

function statusIcon(status?: string): LucideIcon {
	const value = (status ?? "").toLowerCase();
	if (value.includes("coming")) return Hourglass;
	if (value.includes("progress") || value.includes("develop")) return Clock;
	if (value.includes("complete") || value.includes("ship")) return BadgeCheck;
	return FolderOpen;
}

function projectBackground(project: BentoProject) {
	return (
		<div>
			{project.image ? (
				<img
					src={project.image}
					alt=""
					loading="lazy"
					decoding="async"
					draggable={false}
					className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
				/>
			) : (
				<span className="bento-card-fallback absolute inset-0" />
			)}
			<span className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
		</div>
	);
}

function BentoShowcaseSkeleton() {
	return (
		<BentoGrid className={GRID_ROWS}>
			{GRID_SPANS.map((span) => (
				<Skeleton
					key={span}
					className={`col-span-3 h-full w-full rounded-xl ${span}`}
				/>
			))}
		</BentoGrid>
	);
}

export default function BentoShowcaseSection() {
	const { items, loading } = useLiveContent<BentoProject>("projects");

	const projects = useMemo(
		() =>
			[...items]
				.filter((project) => project.slug)
				.sort(
					(a, b) =>
						new Date(b.startDate ?? 0).getTime() -
						new Date(a.startDate ?? 0).getTime(),
				)
				.slice(0, MAX_ITEMS),
		[items],
	);

	const isLoading = loading && items.length === 0;

	if (!isLoading && projects.length === 0) return null;

	return (
		<section
			id="project-grid"
			className="relative flex min-h-screen scroll-mt-20 flex-col justify-center overflow-hidden px-4 py-16 sm:px-6 md:py-24"
		>
			<div className="mx-auto w-full max-w-6xl space-y-10 md:space-y-14">
				<SectionHeading
					eyebrow="Bento"
					title={
						<>
							Project <span className="accent-gradient-text">Grid</span>
						</>
					}
					description="A bento-style gallery of work I've shipped — hover a tile to preview it, then open the full case study."
				/>

				{isLoading ? (
					<BentoShowcaseSkeleton />
				) : (
					<BentoGrid className={GRID_ROWS}>
						{projects.map((project, index) => (
							<BentoCard
								key={project.slug ?? project.title}
								data-reveal
								style={
									{
										"--reveal-delay": `${index * 60}ms`,
									} as CSSProperties
								}
								className={GRID_SPANS[index % GRID_SPANS.length]}
								name={project.title}
								description={
									project.summary?.trim() ||
									"A project I designed and shipped end to end."
								}
								Icon={statusIcon(project.status)}
								href={`/projects/${project.slug}`}
								cta="View project"
								background={projectBackground(project)}
							/>
						))}
					</BentoGrid>
				)}
			</div>
		</section>
	);
}
