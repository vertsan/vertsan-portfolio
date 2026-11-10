/**
 * Skills grouped for the list fallback and flattened for the 3D tag sphere.
 * Live `technologies` rows from `/api/public` take precedence when present.
 */
export interface SkillGroup {
	label: string;
	items: string[];
}

export const skillGroups: SkillGroup[] = [
	{
		label: "Frontend",
		items: [
			"TypeScript",
			"React",
			"TanStack Start",
			"TanStack Router",
			"Tailwind CSS",
			"Motion",
		],
	},
	{
		label: "Backend",
		items: ["Node.js", "PostgreSQL", "Drizzle ORM", "REST", "Zod", "Neon"],
	},
	{
		label: "Mobile",
		items: ["React Native", "Expo", "SQLite", "Kotlin", "Offline sync"],
	},
	{
		label: "Security",
		items: ["OAuth 2.0", "OWASP Top 10", "CSP", "WebAuthn", "Threat modelling"],
	},
	{
		label: "Cloud & tooling",
		items: ["AWS", "Docker", "GitHub Actions", "Vite", "Playwright", "Figma"],
	},
];

export const allSkills: string[] = Array.from(
	new Set(skillGroups.flatMap((group) => group.items)),
);
