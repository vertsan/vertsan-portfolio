import { Link, useLocation } from "@tanstack/react-router";
import { ArrowUpRight, ExternalLink, Github } from "lucide-react";
import { marked } from "marked";
import { type CSSProperties, memo, useMemo, useState } from "react";
import GradientASCII from "#/components/GradientASCII";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { VoteControl } from "#/components/ui/vote-control";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";
import { useProjectVotes } from "#/hooks/use-project-votes";
import Pagination from "#/components/ui/pagination";
import SectionHeading from "#/components/ui/section-heading";
import { Skeleton } from "#/components/ui/skeleton";
import { ASCII_FADE_MASK, GRADIENT_ASCII_COLORS } from "#/lib/gradient-ascii";
import type { VoteTally } from "#/services/project-vote.service";
import { useIsDark } from "#/lib/useIsDark";
import { setCache, useLiveContent } from "#/lib/useLiveContent";
import "#/lib/markdown";

export interface Project {
	id?: number;
	title: string;
	slug: string;
	summary: string;
	status: string;
	startDate: string;
	endDate: string;
	image?: string | null;
	link?: string | null;
	github?: string | null;
	downloadAndroid?: string | null;
	downloadIos?: string | null;
	tags: string[];
	content: string;
}

function prefetchProjects() {
	fetch("/api/public", {
		method: "POST",
		headers: { "Content-Type":"application/json" },
		body: JSON.stringify({ collection: "projects" }),
	})
		.then((r) => r.json())
		.then((data) => {
			if (data.items) setCache("projects", data.items);
		})
		.catch(() => {});
}

function getDomain(url: string) {
	try {
		return new URL(url).hostname.replace("www.", "");
	} catch {
		return "";
	}
}

/** Rounded-square logo on the preview, derived from the existing project link. */

function ProjectPreview({ project }: { project: Project }) {
	const [imageFailed, setImageFailed] = useState(false);
	const hasImage = Boolean(project.image?.trim()) && !imageFailed;

	return (
		<div className="relative aspect-video w-full shrink-0 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950">
			{hasImage ? (
				<img
					src={project.image as string}
					alt={`${project.title} preview`}
					loading="lazy"
					decoding="async"
					onError={() => setImageFailed(true)}
					className="absolute inset-0 size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
				/>
			) : (
				<div
					aria-hidden
					className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.14),transparent_55%)]"
				/>
			)}
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10"
			/>
			<div className="absolute right-3 top-3 flex items-center gap-2">
				{project.github && (
					<a
						href={project.github}
						target="_blank"
						rel="noreferrer"
						aria-label="View source on GitHub"
						className="inline-flex size-9 items-center justify-center rounded-full border border-white/25 bg-background/90 text-foreground shadow-sm backdrop-blur-sm transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
					>
						<Github className="size-4" />
					</a>
				)}
				{project.link && (
					<a
						href={project.link}
						target="_blank"
						rel="noreferrer"
						aria-label="View live project"
						className="inline-flex size-9 items-center justify-center rounded-full border border-white/25 bg-background/90 text-foreground shadow-sm backdrop-blur-sm transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
					>
						<ExternalLink className="size-4" />
					</a>
				)}
			</div>
			
		</div>
	);
}

function ProjectsShimmer() {
	return (
		<section className="min-h-screen flex flex-col justify-center py-16 md:py-24">
			<div className="max-w-6xl mx-auto w-full space-y-12 px-4 sm:px-6">
				<div className="text-center space-y-4">
					<Skeleton className="h-10 w-40 mx-auto" />
					<Skeleton className="h-5 w-64 mx-auto" />
				</div>
				<div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
					{[...Array(3)].map((_, i) => (
						<Card
							key={i}
							className="flex h-full flex-col gap-0 overflow-hidden rounded-lg border border-border/60 bg-card py-0 pt-0 shadow-sm ring-0 backdrop-blur-none"
						>
							<Skeleton className="aspect-video w-full shrink-0 rounded-none" />
							<CardHeader>
								<div className="flex items-start justify-between gap-2">
									<Skeleton className="h-6 w-36" />
									<Skeleton className="h-5 w-20 rounded-full shrink-0" />
								</div>
								<div className="pt-2">
									<Skeleton className="h-4 w-full" />
									<Skeleton className="h-4 w-3/4 mt-1" />
								</div>
							</CardHeader>
							<CardContent className="flex-1">
								<div className="flex flex-wrap gap-1.5">
									{[...Array(4)].map((_, j) => (
										<Skeleton key={j} className="h-5 w-14 rounded-full" />
									))}
								</div>
							</CardContent>
							<CardFooter className="pt-0">
								<Skeleton className="h-8 w-20" />
							</CardFooter>
						</Card>
					))}
				</div>
			</div>
		</section>
	);
}

const ProjectCard = memo(function ProjectCard({
	project,
	index = 0,
	vote,
	pending = false,
	onVote,
}: {
	project: Project;
	index?: number;
	vote?: VoteTally;
	pending?: boolean;
	onVote: (slug: string, value: 1 | -1) => void;
}) {
	const renderedSummary = useMemo(
		() => (project.summary?.trim() ? marked(project.summary) : ""),
		[project.summary],
	);

	return (
		<Card
			data-reveal
			style={{ "--reveal-delay": `${index * 60}ms` } as CSSProperties}
			onMouseEnter={prefetchProjects}
			className="group flex h-full flex-col gap-0 overflow-hidden rounded-lg border border-border/60 bg-card py-0 pt-0 shadow-sm ring-0 backdrop-blur-none transition-all duration-300 hover:shadow-md"
		>
			<ProjectPreview project={project} />
			<CardHeader className="flex flex-1 flex-col gap-1 px-4 pb-3 pt-3">
				<CardTitle className="text-base font-bold leading-snug md:text-lg">
					{project.slug ? (
						<Link
							to="/projects/$projectId"
							params={{ projectId: project.slug }}
							className="line-clamp-1 transition-colors hover:text-primary"
						>
							{project.title}
						</Link>
					) : (
						<span className="line-clamp-1">{project.title}</span>
					)}
				</CardTitle>
				{renderedSummary ? (
					<div
						className="line-clamp-2 text-sm leading-relaxed text-muted-foreground [&_a]:text-primary [&_p]:m-0"
						dangerouslySetInnerHTML={{ __html: renderedSummary }}
					/>
				) : (
					<p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
						{project.summary}
					</p>
				)}
				{project.slug && (
					<Link
						to="/projects/$projectId"
						params={{ projectId: project.slug }}
						className="mt-1 inline-flex w-fit items-center gap-1 text-xs font-medium text-primary transition-opacity hover:opacity-80"
					>
						View details
						<ArrowUpRight className="size-3" />
					</Link>
				)}
			</CardHeader>
			<CardFooter className="mt-auto flex items-center justify-between gap-2 border-t border-border/60 px-4 py-3">
				<div className="flex min-w-0 flex-wrap items-center gap-1.5">
					{project.tags?.slice(0, 3).map((tag) => (
						<Badge
							key={tag}
							variant="outline"
							className="text-[11px] font-normal"
						>
							{tag}
						</Badge>
					))}
					{project.tags && project.tags.length > 3 && (
						<Badge variant="outline" className="text-[11px] font-normal">
							+{project.tags.length - 3}
						</Badge>
					)}
				</div>
				<VoteControl
					vote={vote}
					pending={pending}
					onVote={(value) => onVote(project.slug, value)}
				/>
			</CardFooter>
		</Card>
	);
});

export default function ProjectsSection() {
	const { items: projects, loading } = useLiveContent<Project>("projects");
	const location = useLocation();
	const isHome = location.pathname === "/";
	const isDark = useIsDark();
	const MAX_HOME = 6;
	const PAGE_SIZE = 6;
	const [page, setPage] = useState(1);

	const sortedProjects = useMemo(
		() =>
			[...projects].sort(
				(a, b) =>
					new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
			),
		[projects],
	);

	const pageCount = Math.max(1, Math.ceil(sortedProjects.length / PAGE_SIZE));
	const safePage = Math.min(page, pageCount);
	const pageItems = sortedProjects.slice(
		(safePage - 1) * PAGE_SIZE,
		safePage * PAGE_SIZE,
	);
	const displayed = isHome ? sortedProjects.slice(0, MAX_HOME) : pageItems;
	const displayedSlugs = useMemo(
		() => displayed.map((project) => project.slug).filter(Boolean),
		[displayed],
	);
	const { votes, pending, vote } = useProjectVotes(displayedSlugs);

	const handlePageChange = (nextPage: number) => {
		setPage(nextPage);
		document
			.getElementById("projects")
			?.scrollIntoView({ behavior: "smooth", block:"start" });
	};

	if (loading && projects.length === 0) return <ProjectsShimmer />;

	return (
		<section
			id="projects"
			className="relative min-h-screen flex flex-col justify-center py-16 md:py-24 scroll-mt-20 overflow-hidden"
		>
			<div
				aria-hidden
				className="pointer-events-none absolute inset-x-0 top-0 z-0 h-72 bg-gradient-to-b from-background/70 via-background/20 to-transparent"
			/>
			<div className="max-w-6xl mx-auto w-full space-y-12 px-4 sm:px-6 relative z-10">
				<SectionHeading
					eyebrow="Portfolio"
					title="Projects"
					description="A selection of projects I've built and contributed to"
				/>

				<div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
					{displayed.map((project, index) => (
						<ProjectCard
							key={project.slug ?? project.title}
							project={project}
							index={index}
							vote={votes[project.slug]}
							pending={pending[project.slug]}
							onVote={vote}
						/>
					))}
				</div>

				{!isHome && pageCount > 1 && (
					<Pagination
						page={safePage}
						pageCount={pageCount}
						onPageChange={handlePageChange}
					/>
				)}

				{isHome && (
					<div className="text-center">
						<Button variant="outline" asChild>
							<Link to="/projects" className="gap-2">
								See all projects
								<ArrowUpRight className="size-3.5" />
							</Link>
						</Button>
					</div>
				)}
			</div>
		</section>
	);
}
