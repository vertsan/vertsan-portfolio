import { Link } from "@tanstack/react-router";
import { Eye, Github, Linkedin, Mail, Users } from "lucide-react";

import { usePresence } from "../hooks/use-presence";

const year = new Date().getFullYear();

const footerLinks = [
	{ to: "/" as const, label: "Home" },
	{ to: "/projects" as const, label: "Projects" },
	{ to: "/certificates" as const, label: "Certificates" },
	{ to: "/visitors" as const, label: "Visitors" },
];

const socialLinks = [
	{ href: "https://github.com/vertsan", label: "GitHub", icon: Github },
	{
		href: "https://linkedin.com/in/vertsan",
		label: "LinkedIn",
		icon: Linkedin,
	},
	{ href: "mailto:itsanvert@gmail.com", label: "Email", icon: Mail },
];

function formatCount(value: number | null): string {
	if (value === null) return "—";
	return value.toLocaleString("en-US");
}

export default function Footer() {
	const { online, totalViews } = usePresence();

	return (
		<footer className="relative z-10 border-t border-[var(--i-line)] bg-[var(--i-bg)]/80 backdrop-blur-xl">
			<div className="mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-12">
				{/* Main footer content */}
				<div className="flex flex-col gap-6 py-8 sm:py-10 md:flex-row md:items-center md:justify-between">
					{/* Left: Brand + nav */}
					<div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6 md:items-center">
						<Link
							to="/"
							className="font-display text-base font-semibold tracking-tight text-[var(--i-fg)]"
						>
							Vert<span className="text-[#2dd4bf]">.</span>
						</Link>

						<nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
							{footerLinks.map((link) => (
								<Link
									key={link.label}
									to={link.to}
									className="text-xs text-[var(--i-subtle)] transition-colors hover:text-[var(--i-fg)]"
								>
									{link.label}
								</Link>
							))}
						</nav>
					</div>

					{/* Right: Socials */}
					<div className="flex items-center justify-center gap-1.5 md:justify-end">
						{socialLinks.map(({ href, label, icon: Icon }) => (
							<a
								key={label}
								href={href}
								target={href.startsWith("mailto:") ? undefined : "_blank"}
								rel="noreferrer"
								className="flex size-9 sm:size-8 items-center justify-center rounded-full text-[var(--i-subtle)] transition-colors hover:bg-[var(--i-card-strong)] hover:text-[var(--i-fg)]"
								aria-label={label}
							>
								<Icon className="size-3.5" />
							</a>
						))}
					</div>
				</div>

				{/* Bottom bar: live presence on the left, copyright on the right. */}
				<div className="flex flex-col items-center justify-between gap-3 border-t border-[var(--i-line)] py-4 sm:flex-row">
					<div className="flex items-center gap-4 font-mono text-[11px] text-[var(--i-subtle)]">
						<span className="inline-flex items-center gap-1.5" title="Online now">
							<span className="relative flex size-1.5" aria-hidden>
								<span className="absolute inline-flex size-full animate-ping rounded-full bg-[#6ee7b7] opacity-60" />
								<span className="relative inline-flex size-1.5 rounded-full bg-[#6ee7b7]" />
							</span>
							<Users aria-hidden className="size-3" />
							<span className="tabular-nums">{formatCount(online)}</span>
							<span className="sr-only">visitors online</span>
						</span>

						<span className="inline-flex items-center gap-1.5" title="Total views">
							<Eye aria-hidden className="size-3" />
							<span className="tabular-nums">{formatCount(totalViews)}</span>
							<span className="sr-only">total page views</span>
						</span>
					</div>

					<span className="font-mono text-[11px] text-[var(--i-subtle)]">
						&copy; {year} Vert San. Crafted with Next.js, Three.js & Framer Motion.
					</span>
				</div>
			</div>
		</footer>
	);
}
