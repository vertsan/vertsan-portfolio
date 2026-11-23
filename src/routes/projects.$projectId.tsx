import { createFileRoute, Link } from "@tanstack/react-router";
import {
	ArrowLeft,
	Github,
	Globe,
	Smartphone,
	Table2,
} from "lucide-react";
import { marked } from "marked";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "#/components/ui/badge";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "#/components/ui/breadcrumb";
import { Button } from "#/components/ui/button";
import { Skeleton } from "#/components/ui/skeleton";
import { VoteControl } from "#/components/ui/vote-control";
import { useProjectVotes } from "#/hooks/use-project-votes";
import { ASCII_FADE_MASK } from "#/lib/gradient-ascii";
import { useIsDark } from "#/lib/useIsDark";
import { getCache, setCache, useLiveContent } from "#/lib/useLiveContent";
import "#/lib/markdown";

interface Project {
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

export const Route = createFileRoute("/projects/$projectId")({
	component: ProjectDetail,
});

const TECH_KEYWORDS = [
	"react", "next", "vue", "angular", "svelte", "tanstack", "typescript",
	"javascript", "tailwind", "node", "express", "nest", "django", "flask",
	"python", "golang", "java", "spring", "php", "laravel", "ruby", "rails",
	"postgres", "mysql", "mongo", "sqlite", "firebase", "supabase", "graphql",
	"redis", "docker", "kubernetes", "aws", "azure", "gcp", "figma", "git",
];

const CHIP_COLORS = [
	"text-sky-600 dark:text-sky-400",
	"text-violet-600 dark:text-violet-400",
	"text-emerald-600 dark:text-emerald-400",
	"text-amber-600 dark:text-amber-400",
	"text-rose-600 dark:text-rose-400",
	"text-indigo-600 dark:text-indigo-400",
];

function chipColor(value: string) {
	let hash = 0;
	for (const char of value) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
	return CHIP_COLORS[hash % CHIP_COLORS.length];
}

function getDomain(url: string) {
	try {
		return new URL(url).hostname.replace("www.", "");
	} catch {
		return "";
	}
}

function extractUseCases(content: string) {
	const result: string[] = [];
	let inSection = false;
	for (const line of content.split("\n")) {
		const heading = /^#{2,4}\s+(.+)$/.exec(line);
		if (heading) {
			inSection = /use cases?|applications?|features/i.test(heading[1]);
			continue;
		}
		if (!inSection) continue;
		const item = /^\s*(?:[-*]|\d+\.)\s+(.+)$/.exec(line);
		if (item) {
			result.push(item[1].replace(/\*\*/g, "").trim());
		} else if (line.trim() && !/^\s/.test(line)) {
			inSection = false;
		}
	}
	return result;
}

function Chips({ items }: { items: string[] }) {
	if (items.length === 0) {
		return <p className="text-sm text-muted-foreground">—</p>;
	}
	return (
		<div className="flex flex-wrap gap-2">
			{items.map((item) => (
				<Badge
					key={item}
					variant="outline"
					className={`rounded-full border-border bg-muted/30 px-3 py-1 text-xs font-medium ${chipColor(item)}`}
				>
					{item}
				</Badge>
			))}
		</div>
	);
}

function MoreProjectCard({ project }: { project: Project }) {
	return (
		<Link
			to="/projects/$projectId"
			params={{ projectId: project.slug }}
			className="group flex h-full flex-col overflow-hidden rounded-lg border border-border/60 bg-card shadow-sm transition-all duration-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
		>
			<div className="relative aspect-video w-full shrink-0 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950">
				{project.image ? (
					<img
						src={project.image}
						alt=""
						loading="lazy"
						decoding="async"
						className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
					/>
				) : (
					<div
						aria-hidden
						className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.14),transparent_55%)]"
					/>
				)}
			</div>
			<div className="flex flex-1 flex-col gap-1 p-4">
				<h3 className="line-clamp-1 font-bold">{project.title}</h3>
				<p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
					{project.summary}
				</p>
			</div>
		</Link>
	);
}

function ProjectDetail() {
	const { projectId } = Route.useParams();
	const isDark = useIsDark();
	const { items: allProjects } = useLiveContent<Project>("projects");

	const [project, setProject] = useState<Project | undefined>(() => {
		const cached = getCache<Project>("projects");
		return cached ? cached.find((p) => p.slug === projectId) : undefined;
	});
	const [loading, setLoading] = useState(!project);
	const [heroFailed, setHeroFailed] = useState(false);
	const [logoFailed, setLogoFailed] = useState(false);
	const voteSlugs = useMemo(
		() => (project?.slug ? [project.slug] : []),
		[project?.slug],
	);
	const { votes, pending, vote } = useProjectVotes(voteSlugs);

	useEffect(() => {
		const cached = getCache<Project>("projects");
		const foundInCache = cached
			? cached.find((p) => p.slug === projectId)
			: undefined;

		if (foundInCache) {
			setProject(foundInCache);
			setLoading(false);
			return;
		}

		setLoading(true);
		fetch("/api/public", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ collection: "projects" }),
		})
			.then((r) => r.json())
			.then((data) => {
				const items = (data.items ?? []) as Project[];
				setCache("projects", items);
				const found = items.find((p) => p.slug === projectId);
				setProject(found);
			})
			.catch(() => setProject(undefined))
			.finally(() => setLoading(false));
	}, [projectId]);

	const renderedContent = useMemo(
		() => (project?.content?.trim() ? marked(project.content) : ""),
		[project?.content],
	);

	const moreProjects = useMemo(
		() => allProjects.filter((item) => item.slug !== project?.slug).slice(0, 4),
		[allProjects, project?.slug],
	);

	const tags = project?.tags ?? [];
	const builtWith = tags.filter((tag) =>
		TECH_KEYWORDS.some((keyword) => tag.toLowerCase().includes(keyword)),
	);
	const useCases = tags.filter(
		(tag) => !TECH_KEYWORDS.some((keyword) => tag.toLowerCase().includes(keyword)),
	);
	const builtWithChips = builtWith.length ? builtWith : tags;
	const useCaseChips = useCases.length
		? useCases
		: extractUseCases(project?.content ?? "");

	const backdrop = (
		<>
			<div
				aria-hidden
				className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[100svh] overflow-hidden opacity-30 dark:opacity-45"
				style={ASCII_FADE_MASK}
			/>
			<div
				aria-hidden
				className="pointer-events-none absolute inset-x-0 top-0 z-0 h-72 bg-gradient-to-b from-background/70 via-background/20 to-transparent"
			/>
		</>
	);

	if (loading) {
		return (
			<main className="relative min-h-screen overflow-hidden">
				{backdrop}
				<div className="relative z-10 mx-auto max-w-4xl space-y-8 px-4 py-10 sm:px-6 sm:py-16">
					<Skeleton className="h-4 w-48" />
					<Skeleton className="aspect-video w-full rounded-xl" />
					<div className="flex items-center gap-3">
						<Skeleton className="size-12 rounded-lg" />
						<Skeleton className="h-10 w-2/3 max-w-sm" />
					</div>
					<div className="space-y-2">
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-4/5" />
					</div>
					<Skeleton className="h-5 w-24" />
					<div className="flex flex-wrap gap-2">
						<Skeleton className="h-7 w-24 rounded-full" />
						<Skeleton className="h-7 w-32 rounded-full" />
					</div>
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<Skeleton className="aspect-[2/1] w-full rounded-lg" />
						<Skeleton className="aspect-[2/1] w-full rounded-lg" />
					</div>
				</div>
			</main>
		);
	}

	if (!project) {
		return (
			<main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
				<h1 className="text-4xl font-bold">Project Not Found</h1>
				<p className="text-muted-foreground">
					The project you're looking for doesn't exist.
				</p>
				<Button asChild>
					<Link to="/">Back to Home</Link>
				</Button>
			</main>
		);
	}

	return (
		<main className="relative min-h-screen overflow-hidden">
			{backdrop}
			<div className="relative z-10 mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-16">
				<nav className="mb-8 flex items-center justify-between gap-3 sm:mb-10">
					<Breadcrumb className="hidden sm:flex">
						<BreadcrumbList className="flex-nowrap">
							<BreadcrumbItem>
								<BreadcrumbLink asChild>
									<Link to="/">Home</Link>
								</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbLink asChild>
									<Link to="/projects">Projects</Link>
								</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbPage className="max-w-[180px] truncate">
									{project.title}
								</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
					<Button
						variant="ghost"
						size="sm"
						asChild
						className="-ml-2 w-full justify-center sm:ml-0 sm:w-auto"
					>
						<Link to="/projects" className="gap-2">
							<ArrowLeft className="size-4" />
							Back
						</Link>
					</Button>
				</nav>

				<div className="space-y-8">
					<section className="relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 shadow-sm">
						{project.image && !heroFailed ? (
							<img
								src={project.image}
								alt={project.title}
								onError={() => setHeroFailed(true)}
								className="absolute inset-0 size-full object-cover"
							/>
						) : (
							<div
								aria-hidden
								className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.14),transparent_55%)]"
							/>
						)}
						<div
							aria-hidden
							className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent"
						/>
					</section>

					<header className="flex flex-wrap items-start justify-between gap-4">
						<div className="flex min-w-0 items-start gap-3">
							<div className="size-12 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
								{project.link && !logoFailed ? (
									<img
										src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(getDomain(project.link))}&sz=128`}
										alt=""
										onError={() => setLogoFailed(true)}
										className="size-full object-cover p-1.5"
									/>
								) : (
									<div
										className={`flex size-full items-center justify-center text-lg font-bold text-primary ${isDark ? "bg-slate-800" : "bg-background"}`}
									>
										{project.title.charAt(0).toUpperCase()}
									</div>
								)}
							</div>
							<div className="min-w-0">
								<h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
									{project.title}
								</h1>
								<p className="mt-1 text-sm font-medium text-primary">
									{project.status}
									{project.startDate ? ` · ${project.startDate}` : ""}
								</p>
							</div>
						</div>
						<div className="flex flex-wrap items-center gap-2">
							{project.github && (
								<Button
									asChild
									className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
								>
									<a href={project.github} target="_blank" rel="noreferrer">
										<Github className="size-4" />
										View Source
									</a>
								</Button>
							)}
							{project.link && (
								<Button
									asChild
									className="gap-2 bg-foreground text-background hover:bg-foreground/90"
								>
									<a href={project.link} target="_blank" rel="noreferrer">
										<Globe className="size-4" />
										Visit Site
									</a>
								</Button>
							)}
						</div>
					</header>

					{(project.downloadAndroid || project.downloadIos) && (
						<div className="flex flex-wrap gap-2">
							{project.downloadAndroid && (
								<Button variant="outline" size="sm" className="gap-2" asChild>
									<a
										href={`/api/download?url=${encodeURIComponent(project.downloadAndroid)}`}
									>
										<Smartphone className="size-4" />
										Download APK
									</a>
								</Button>
							)}
							{project.downloadIos && (
								<Button variant="outline" size="sm" className="gap-2" asChild>
									<a
										href={`/api/download?url=${encodeURIComponent(project.downloadIos)}`}
									>
										<Table2 className="size-4" />
										Download iOS
									</a>
								</Button>
							)}
						</div>
					)}

					<p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
						{project.summary}
					</p>

					{renderedContent && (
						<div
							className="max-w-none text-sm text-muted-foreground [&_a]:text-primary"
							dangerouslySetInnerHTML={{ __html: renderedContent }}
						/>
					)}

					<div className="space-y-4">
						<div>
							<h2 className="mb-2 text-sm font-semibold">Built with</h2>
							<Chips items={builtWithChips} />
						</div>
						<div>
							<h2 className="mb-2 text-sm font-semibold">Use cases</h2>
							<Chips items={useCaseChips} />
						</div>
					</div>

					<hr className="border-border" />

					<div className="flex flex-wrap items-center justify-between gap-3">
						<span className="text-sm font-semibold">Rate this project</span>
						<div className="[&_span]:font-semibold [&_span]:text-emerald-600 dark:[&_span]:text-emerald-400">
							<VoteControl
								vote={votes[project.slug]}
								pending={pending[project.slug]}
								onVote={(value) => void vote(project.slug, value)}
							/>
						</div>
					</div>

					<hr className="border-border" />

					<section className="space-y-5">
						<h2 className="text-2xl font-bold">More Projects</h2>
						{moreProjects.length > 0 ? (
							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
								{moreProjects.map((item) => (
									<MoreProjectCard key={item.slug} project={item} />
								))}
							</div>
						) : (
							<p className="text-sm text-muted-foreground">
								No other projects yet.
							</p>
						)}
					</section>
				</div>
			</div>
		</main>
	);
}
