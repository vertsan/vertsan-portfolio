/**
 * Certificates used by the masonry grid.
 * Typed placeholders — live rows from `/api/public` take precedence.
 */
export interface CertificateEntry {
	id: string;
	title: string;
	issuer: string;
	date: string;
	summary: string;
	credentialUrl?: string;
	tags: string[];
	/** Accent for the monogram plate. */
	accent: string;
}

export const certificates: CertificateEntry[] = [
	{
		id: "aws-sa",
		title: "AWS Certified Solutions Architect",
		issuer: "Amazon Web Services",
		date: "2025",
		summary:
			"Designing resilient, cost-aware architectures across compute, storage and networking.",
		credentialUrl: "https://aws.amazon.com/certification/",
		tags: ["Cloud", "Architecture"],
		accent: "#f59e0b",
	},
	{
		id: "gcp-security",
		title: "Google Cybersecurity Professional",
		issuer: "Google",
		date: "2024",
		summary:
			"Threat modelling, incident response and defensive controls for production systems.",
		credentialUrl: "https://www.coursera.org/professional-certificates/google-cybersecurity",
		tags: ["Security", "Operations"],
		accent: "#2dd4bf",
	},
	{
		id: "meta-frontend",
		title: "Meta Front-End Developer",
		issuer: "Meta",
		date: "2024",
		summary:
			"Accessible interface engineering, state management and performance fundamentals.",
		credentialUrl: "https://www.coursera.org/professional-certificates/meta-front-end-developer",
		tags: ["Frontend", "Accessibility"],
		accent: "#818cf8",
	},
	{
		id: "postgres",
		title: "PostgreSQL for Developers",
		issuer: "Neon",
		date: "2024",
		summary:
			"Query planning, indexing strategy and safe schema evolution for Postgres at scale.",
		credentialUrl: "https://neon.tech/",
		tags: ["Database", "Performance"],
		accent: "#6ee7b7",
	},
	{
		id: "react-native",
		title: "React Native Specialist",
		issuer: "Callstack",
		date: "2023",
		summary:
			"Native module integration, offline data flows and release automation for mobile.",
		credentialUrl: "https://www.callstack.com/",
		tags: ["Mobile", "React Native"],
		accent: "#38bdf8",
	},
	{
		id: "a11y",
		title: "Web Accessibility Specialist",
		issuer: "IAAP",
		date: "2023",
		summary:
			"WCAG 2.2 conformance, assistive technology testing and inclusive interaction design.",
		credentialUrl: "https://www.accessibilityassociation.org/",
		tags: ["Accessibility", "Design"],
		accent: "#f472b6",
	},
];
