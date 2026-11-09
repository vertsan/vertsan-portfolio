import { Code2, Globe, Sparkles } from "lucide-react";
import type { CSSProperties } from "react";
import StatCard from "./StatCard";

const techStack = [
	"React",
	"TypeScript",
	"Tailwind CSS",
	"Node.js",
	"PostgreSQL",
];

/**
 * Right-hand content card: heading, readable bio, outlined tech chips, stats
 * and the closing tagline pill. `mt-auto` keeps the quote anchored to the
 * bottom when the card stretches to match the portrait column.
 */
export default function BioCard() {
	return (
		<section
			aria-labelledby="about-bio-heading"
			data-reveal
			style={{ "--reveal-delay": "120ms" } as CSSProperties}
			className="ui-card flex h-full flex-col gap-6 p-6 sm:p-8"
		>
			<div>
				<h2
					id="about-bio-heading"
					className="text-2xl font-semibold tracking-tight"
					style={{ color: "var(--ui-text)" }}
				>
					A bit about me
				</h2>

				<p
					className="mt-3 max-w-[60ch] text-base leading-[1.7] sm:text-[17px]"
					style={{ color: "var(--ui-text-muted)" }}
				>
					I focus on building interfaces that are fast, accessible, and visually
					clean. I enjoy working across the full stack — from pixel-perfect
					frontends to robust backends.
				</p>

				<ul aria-label="Tech stack" className="mt-5 flex flex-wrap gap-2">
					{techStack.map((tech) => (
						<li key={tech} className="ui-chip">
							{tech}
						</li>
					))}
				</ul>
			</div>

			<div aria-hidden className="ui-divider" />

			<div className="grid grid-cols-2 gap-3 sm:gap-4">
				<StatCard
					icon={Code2}
					value={2.5}
					decimals={1}
					suffix="+"
					label="Years Experience"
					delay={180}
				/>
				<StatCard
					icon={Globe}
					value={10}
					suffix="+"
					label="Projects Delivered"
					delay={240}
				/>
			</div>

			<div
				className="mt-auto flex items-center gap-3 rounded-2xl border px-4 py-3.5"
				style={{
					borderColor: "var(--ui-border)",
					backgroundColor: "var(--ui-accent-soft)",
				}}
			>
				<span className="ui-icon-chip size-9" aria-hidden>
					<Sparkles className="size-4" />
				</span>
				<p className="text-sm" style={{ color: "var(--ui-text-muted)" }}>
					Always learning, always building.
				</p>
			</div>
		</section>
	);
}
