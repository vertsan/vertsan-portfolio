import {
	BadgeCheck,
	Clock,
	FolderOpen,
	Hourglass,
	type LucideIcon,
} from "lucide-react";
import { useMemo } from "react";
import MagicBento, { type MagicBentoItem } from "#/components/MagicBento";
import SectionHeading from "#/components/ui/section-heading";
import { Skeleton } from "#/components/ui/skeleton";
import { useIsDark } from "#/lib/useIsDark";
import { useLiveContent } from "#/lib/useLiveContent";

interface BentoProject {
	title: string;
	slug?: string;
	summary?: string;
	status?: string;
	startDate?: string;
	image?: string | null;
}

interface BentoCell {
	colSpan: number;
	rowSpan: number;
}

const MAX_ITEMS = 7;

/**
 * Bento composition: a 2x2 hero tile followed by wide/narrow pairs that fill a
 * 3-column, 4-row grid without leaving gaps.
 */
const GRID_SPANS: BentoCell[] = [
	{ colSpan: 2, rowSpan: 2 },
	{ colSpan: 1, rowSpan: 1 },
	{ colSpan: 1, rowSpan: 1 },
	{ colSpan: 2, rowSpan: 1 },
	{ colSpan: 1, rowSpan: 1 },
	{ colSpan: 2, rowSpan: 1 },
	{ colSpan: 1, rowSpan: 1 },
];

const SKELETON_TILES = [
	{
		id: "hero",
		className: "h-[220px] sm:col-span-2 lg:col-span-2 lg:row-span-2 lg:h-full",
	},
	{ id: "a", className: "h-[220px]" },
	{ id: "b", className: "h-[220px]" },
	{ id: "wide-a", className: "h-[220px] sm:col-span-2 lg:col-span-2" },
	{ id: "c", className: "h-[220px]" },
	{ id: "wide-b", className: "h-[220px] sm:col-span-2 lg:col-span-2" },
	{ id: "d", className: "h-[220px]" },
];

function statusIcon(status?: string): LucideIcon {
	const value = (status ?? "").toLowerCase();
	if (value.includes("coming")) return Hourglass;
	if (value.includes("progress") || value.includes("develop")) return Clock;
	if (value.includes("complete") || value.includes("ship")) return BadgeCheck;
	return FolderOpen;
}

function BentoShowcaseSkeleton() {
	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:auto-rows-[220px] lg:grid-cols-3">
			{SKELETON_TILES.map((tile) => (
				<Skeleton key={tile.id} className={tile.className} />
			))}
		</div>
	);
}

export default function BentoShowcaseSection() {
	const { items, loading } = useLiveContent<BentoProject>("projects");
	const isDark = useIsDark();

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

	const bentoItems = useMemo<MagicBentoItem[]>(
		() =>
			projects.map((project, index) => {
				const Icon = statusIcon(project.status);
				const cell = GRID_SPANS[index % GRID_SPANS.length];

				return {
					id: project.slug ?? project.title,
					label: project.status?.trim() || "Project",
					title: project.title,
					description:
						project.summary?.trim() ||
						"A project I designed and shipped end to end.",
					icon: <Icon size={14} strokeWidth={1.8} />,
					image: project.image ?? undefined,
					href: `/projects/${project.slug}`,
					colSpan: cell.colSpan,
					rowSpan: cell.rowSpan,
				};
			}),
		[projects],
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
					<MagicBento
						items={bentoItems}
						columns={3}
						rowHeight={220}
						gap={16}
						radius={20}
						theme={isDark ? "dark" : "light"}
						glowColor={isDark ? "#818cf8" : "#4f46e5"}
						enableBorderGlow
						enableSpotlight
						spotlightRadius={320}
						clickEffect
						intro
					/>
				)}
			</div>
		</section>
	);
}
