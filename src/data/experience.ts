/**
 * Experience entries.
 *
 * These are typed placeholders used as the SSR fallback when the database has
 * no jobs yet. Live rows from `/api/public` take precedence — keep the shape in
 * sync with `jobs` in `src/db/schema.ts`.
 */
export interface ExperienceEntry {
	id: string;
	company: string;
	role: string;
	location: string;
	/** Human-readable period, e.g. "2024 — Present". */
	period: string;
	startDate: string;
	endDate: string | null;
	summary: string;
	/** Three metric-led impact lines. */
	highlights: string[];
	tech: string[];
	/** Accent used by the scene while this role is active. */
	accent: string;
}

export const experience: ExperienceEntry[] = [
	{
		id: "independent",
		company: "Independent",
		role: "Senior Full-Stack Engineer",
		location: "Phnom Penh, Cambodia",
		period: "2024 — Present",
		startDate: "2024-02",
		endDate: null,
		summary:
			"Designing and shipping product surfaces end to end for small teams that need senior ownership without the headcount.",
		highlights: [
			"Cut p95 API latency 42% by moving hot reads to indexed Postgres views",
			"Shipped a design system used across 6 products and 3 client teams",
			"Raised Lighthouse accessibility from 78 to 100 on every shipped surface",
		],
		tech: ["TypeScript", "React", "TanStack Start", "Postgres", "AWS"],
		accent: "#818cf8",
	},
	{
		id: "studio",
		company: "Northlight Studio",
		role: "Full-Stack Developer",
		location: "Remote",
		period: "2022 — 2024",
		startDate: "2022-04",
		endDate: "2024-01",
		summary:
			"Owned the web platform for a B2B analytics product, from schema design to the customer-facing dashboard.",
		highlights: [
			"Rebuilt onboarding and lifted activation 28% in one quarter",
			"Introduced typed API contracts that removed 90% of integration bugs",
			"Led a 3-person front-end guild and set the review bar",
		],
		tech: ["Next.js", "Node.js", "Drizzle ORM", "PostgreSQL", "Tailwind CSS"],
		accent: "#2dd4bf",
	},
	{
		id: "lab",
		company: "Product Lab",
		role: "Mobile Developer",
		location: "Phnom Penh, Cambodia",
		period: "2021 — 2022",
		startDate: "2021-03",
		endDate: "2022-03",
		summary:
			"Built and maintained a cross-platform mobile app for field teams working with intermittent connectivity.",
		highlights: [
			"Shipped offline-first sync to 100k+ users across 4 provinces",
			"Reduced cold start from 3.1s to 1.2s on low-end Android",
			"Added crash-free session tracking, taking stability to 99.7%",
		],
		tech: ["React Native", "Expo", "SQLite", "Kotlin", "Firebase"],
		accent: "#6ee7b7",
	},
	{
		id: "agency",
		company: "Studio Meridian",
		role: "Junior Developer",
		location: "Phnom Penh, Cambodia",
		period: "2020 — 2021",
		startDate: "2020-06",
		endDate: "2021-02",
		summary:
			"Started on marketing sites, ended up owning the component library the whole agency shipped with.",
		highlights: [
			"Delivered 12 client sites with a shared, accessible component kit",
			"Automated release checks and cut review cycles from days to hours",
			"Paired with designers to keep motion and contrast accessible",
		],
		tech: ["JavaScript", "SCSS", "Vue", "Figma", "GitHub Actions"],
		accent: "#a78bfa",
	},
];

/** Years of professional experience, derived from the earliest start date. */
export function yearsOfExperience(entries: ExperienceEntry[] = experience): number {
	if (entries.length === 0) return 0;
	const earliest = entries.reduce((min, entry) => {
		const time = new Date(entry.startDate).getTime();
		return Number.isNaN(time) ? min : Math.min(min, time);
	}, Number.POSITIVE_INFINITY);
	if (!Number.isFinite(earliest)) return 0;
	const years = (Date.now() - earliest) / (1000 * 60 * 60 * 24 * 365.25);
	return Math.max(1, Math.floor(years));
}
