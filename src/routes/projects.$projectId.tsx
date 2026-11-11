import { createFileRoute, Link } from "@tanstack/react-router";
import {
	ArrowLeft,
	Calendar,
	Github,
	Globe,
	Smartphone,
	Table2,
} from "lucide-react";
import { marked } from "marked";
import { useEffect, useMemo, useState } from "react";
import GradientASCII from "#/components/GradientASCII";
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
import { ASCII_FADE_MASK, GRADIENT_ASCII_COLORS } from "#/lib/gradient-ascii";
import { useIsDark } from "#/lib/useIsDark";
import { getCache, setCache } from "#/lib/useLiveContent";
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

function ProjectDetail() {
	const { projectId } = Route.useParams();
	const isDark = useIsDark();

	const [project, setProject] = useState<Project | undefined>(() => {
		const cached = getCache<Project>("projects");
		return cached ? cached.find((p) => p.slug === projectId) : undefined;
	});
	const [loading, setLoading] = useState(!project);

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

	const backdrop = (
		<>
			<div
				aria-hidden
				className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[100svh] overflow-hidden opacity-30 dark:opacity-45"
				style={ASCII_FADE_MASK}
			>
				<GradientASCII
					colors={GRADIENT_ASCII_COLORS}
					shape="horizon"
					cellSize={18}
					density={0.8}
					glyphOpacity={0.85}
					gradientOpacity={0.9}
					glow={0.2}
					softness={0.5}
					scale={1}
					flow={0.5}
					speed={0.4}
					flicker={0.2}
					depthOfField={0}
					grain={0.08}
					variation={0}
					mouseInteraction
					clickEffect="wave"
					intro={false}
					lightMode={!isDark}
					className="size-full"
				/>
			</div>
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
				<div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16 lg:py-24">
					<div className="mb-10 sm:mb-12">
						<Skeleton className="h-4 w-48" />
					</div>
					<div className="lg:grid lg:grid-cols-3 lg:gap-14">
						<div className="lg:col-span-2 space-y-8 sm:space-y-10">
							<div className="space-y-4">
								<div className="flex flex-wrap items-start justify-between gap-3">
									<Skeleton className="h-9 w-2/3 max-w-md sm:h-11" />
									<Skeleton className="h-6 w-20 rounded-full" />
								</div>
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-4/5" />
							</div>
							<Skeleton className="aspect-video w-full rounded-xl" />
							<div className="space-y-3">
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-full" />
								<Skeleton className="h-4 w-3/4" />
							</div>
						</div>
						<aside className="mt-10 lg:mt-0 lg:col-span-1">
							<div className="space-y-5 rounded-xl border border-border bg-muted/20 p-4 sm:p-5">
								<Skeleton className="h-4 w-40" />
								<div className="flex flex-wrap gap-1.5">
									<Skeleton className="h-5 w-14 rounded-full" />
									<Skeleton className="h-5 w-20 rounded-full" />
									<Skeleton className="h-5 w-16 rounded-full" />
								</div>
								<Skeleton className="h-8 w-full" />
								<Skeleton className="h-8 w-full" />
							</div>
						</aside>
					</div>
				</div>
			</main>
		);
	}

	if (!project) {
		return (
			<main className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-6 text-center">
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
			<div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16 lg:py-24">
				<nav className="flex items-center justify-between mb-10 sm:mb-12">
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
								<BreadcrumbPage className="truncate max-w-[120px] sm:max-w-[180px]">
									{project.title}
								</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
					<Button
						variant="ghost"
						size="sm"
						asChild
						className="-ml-2 w-full sm:ml-0 sm:w-auto justify-center"
					>
						<Link to="/projects" className="gap-2">
							<ArrowLeft className="size-4" />
							Back
						</Link>
					</Button>
				</nav>

				<div className="lg:grid lg:grid-cols-3 lg:gap-14">
					<div className="lg:col-span-2 space-y-8 sm:space-y-10">
						<header className="space-y-4 sm:space-y-3">
							<div className="flex flex-wrap items-start justify-between gap-3">
								<h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
									{project.title}
								</h1>
								<Badge
									variant={
										project.status === "Completed" ? "default" : "secondary"
									}
									className="shrink-0"
								>
									{project.status}
								</Badge>
							</div>
							<p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
								{project.summary}
							</p>
						</header>

						{project.image && (
							<div className="rounded-xl overflow-hidden border border-border shadow-sm bg-card">
								<div className="flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 bg-muted/30 border-b border-border">
									<span className="size-2.5 sm:size-3 rounded-full bg-[#ff605c]" />
									<span className="size-2.5 sm:size-3 rounded-full bg-[#ffbd44]" />
									<span className="size-2.5 sm:size-3 rounded-full bg-[#00ca4e]" />
								</div>
								<img
									src={project.image}
									alt={project.title}
									className="w-full"
									loading="lazy"
									decoding="async"
								/>
							</div>
						)}

						{renderedContent && (
							<div
								className="max-w-none"
								dangerouslySetInnerHTML={{ __html: renderedContent }}
							/>
						)}
					</div>

					<aside className="mt-10 lg:mt-0 lg:col-span-1">
						<div className="sticky top-24 space-y-5 rounded-xl border border-border bg-muted/20 p-4 sm:p-5">
							<div className="flex items-center gap-2 text-sm text-muted-foreground">
								<Calendar className="size-4 shrink-0" />
								<time dateTime={project.startDate}>{project.startDate}</time>
								<span>—</span>
								<time dateTime={project.endDate || undefined}>
									{project.endDate || "Present"}
								</time>
							</div>

							{project.tags.length > 0 && (
								<div className="flex flex-wrap gap-1.5">
									{project.tags.map((tag) => (
										<Badge key={tag} variant="outline" className="text-xs">
											{tag}
										</Badge>
									))}
								</div>
							)}

							{(project.downloadAndroid ||
								project.downloadIos ||
								project.github ||
								project.link) && (
								<div className="space-y-1.5">
									{project.downloadAndroid && (
										<Button
											variant="default"
											size="sm"
											className="gap-2 w-full justify-start"
											asChild
										>
											<a
												href={`/api/download?url=${encodeURIComponent(project.downloadAndroid)}`}
											>
												<Smartphone className="size-4" />
												Download APK
											</a>
										</Button>
									)}
									{project.downloadIos && (
										<Button
											variant="default"
											size="sm"
											className="gap-2 w-full justify-start"
											asChild
										>
											<a
												href={`/api/download?url=${encodeURIComponent(project.downloadIos)}`}
											>
												<Table2 className="size-4" />
												Download iOS
											</a>
										</Button>
									)}
									{project.github && (
										<Button
											variant="secondary"
											size="sm"
											className="gap-2 w-full justify-start"
											asChild
										>
											<a href={project.github} target="_blank" rel="noreferrer">
												<Github className="size-4" />
												Source Code
											</a>
										</Button>
									)}
									{project.link && (
										<Button
											variant="secondary"
											size="sm"
											className="gap-2 w-full justify-start"
											asChild
										>
											<a href={project.link} target="_blank" rel="noreferrer">
												<Globe className="size-4" />
												Live Site
											</a>
										</Button>
									)}
								</div>
							)}
						</div>
					</aside>
				</div>

				<div className="mt-12 sm:mt-16 text-center">
					<Button variant="ghost" asChild>
						<Link to="/projects" className="gap-2">
							<ArrowLeft className="size-4" />
							Back to all projects
						</Link>
					</Button>
				</div>
			</div>
		</main>
	);
}
