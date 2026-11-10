/**
 * Featured projects.
 *
 * Typed placeholders for the horizontal gallery. Live rows from `/api/public`
 * take precedence; the extra `problem` / `solution` / `result` fields only
 * exist here, so live projects fall back to their summary for the same line.
 */
export interface ProjectEntry {
	slug: string;
	title: string;
	status: string;
	year: string;
	summary: string;
	problem: string;
	solution: string;
	result: string;
	image: string;
	tags: string[];
	link?: string;
	github?: string;
}

export const projects: ProjectEntry[] = [
	{
		slug: "pulse-analytics",
		title: "Pulse Analytics",
		status: "Live",
		year: "2025",
		summary:
			"An event analytics workspace that makes product funnels legible to non-analysts.",
		problem: "Teams waited days for a data request to answer one funnel question.",
		solution: "Self-serve funnel builder with typed event schemas and saved views.",
		result: "Time-to-answer dropped from 3 days to under 10 minutes.",
		image: "/dashboard.webp",
		tags: ["TanStack Start", "Postgres", "Recharts", "TypeScript"],
		link: "https://example.com",
	},
	{
		slug: "atlas-cloud",
		title: "Atlas Cloud",
		status: "Live",
		year: "2024",
		summary:
			"A deployment console for small teams that want AWS without the console.",
		problem: "Every release needed a senior engineer to hand-edit infrastructure.",
		solution: "Guided environment builder with previews, rollbacks and audit trails.",
		result: "Cut release setup from a day to 12 minutes for 40+ services.",
		image: "/aws.webp",
		tags: ["AWS", "Node.js", "Drizzle ORM", "Zod"],
		link: "https://example.com",
	},
	{
		slug: "job-tracker",
		title: "Job Tracker",
		status: "In progress",
		year: "2025",
		summary:
			"A calm job-search board that turns a messy spreadsheet into a pipeline.",
		problem: "Applications, follow-ups and interviews lived in five places at once.",
		solution: "One board with reminders, stage automation and a weekly digest.",
		result: "Beta users report 3× fewer missed follow-ups.",
		image: "/jtr.webp",
		tags: ["React", "TanStack Router", "Neon", "Tailwind CSS"],
		github: "https://github.com/vertsan",
	},
	{
		slug: "signal",
		title: "Signal",
		status: "Prototype",
		year: "2024",
		summary:
			"An offline-first field app for teams working where the network is not.",
		problem: "Field data was captured on paper and re-typed days later.",
		solution: "Local-first sync with conflict resolution and a low-bandwidth queue.",
		result: "Zero data loss across a 6-week pilot in 4 provinces.",
		image: "/placeholder-project.svg",
		tags: ["React Native", "SQLite", "Expo", "Security"],
		github: "https://github.com/vertsan",
	},
];
