/**
 * Profile constants shared by the immersive home page.
 * Edit the copy here; the hero, about and contact sections read from this file.
 */
export const profile = {
	name: "Vert San",
	shortName: "Vert",
	role: "Software Engineer",
	location: "Phnom Penh, Cambodia",
	email: "itsanvert@gmail.com",
	availability: "Open to opportunities",
	statement:
		"I build accessible, scalable, and secure web and mobile applications — from pixel-perfect interfaces to the systems behind them.",
	/** Rotating line under the hero name. */
	roles: [
		"Software Engineer",
		"Full-Stack Developer",
		"Mobile Developer",
		"Security-minded Builder",
	],
	socials: {
		github: "https://github.com/vertsan",
		linkedin: "https://linkedin.com/in/vertsan",
	},
	resume: "/resume.pdf",
	/** Placeholder — replace with your own numbers. */
	usersReached: 100_000,
	education: {
		school: "Royal University of Phnom Penh",
		program: "BSc, Computer Science",
		period: "2018 — 2022",
	},
} as const;
