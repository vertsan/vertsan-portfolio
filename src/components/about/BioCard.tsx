import { Sparkles } from "lucide-react";
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
 * Open-canvas right column: the bio, metrics and tagline sit directly on the
 * page background. Only hairlines and type define the hierarchy.
 */
export default function BioCard() {
	return (
		<section
			aria-labelledby="about-bio-heading"
			data-reveal
			style={{ "--reveal-delay": "120ms" } as CSSProperties}
			className="flex h-full flex-col bg-transparent"
		>
			<div className="max-w-xl">
				<h2
					id="about-bio-heading"
					className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white sm:text-3xl"
				>
					A bit about me
				</h2>

				<p className="mt-4 text-base leading-relaxed text-neutral-600 dark:text-neutral-300 sm:text-[17px]">
					I focus on building interfaces that are fast, accessible, and visually
					clean. I enjoy working across the full stack - from pixel-perfect
					frontends to robust backends.
				</p>

				<ul aria-label="Tech stack" className="mt-6 flex flex-wrap gap-2.5">
					{techStack.map((tech) => (
						<li key={tech} className="ui-chip">
							{tech}
						</li>
					))}
				</ul>
			</div>

			<div className="mt-10 grid grid-cols-2 divide-x divide-black/10 border-y border-black/10 py-6 dark:divide-white/10 dark:border-white/10 sm:mt-12">
				<StatCard
					value={2.5}
					decimals={1}
					suffix="+"
					label="Years Experience"
					delay={180}
				/>
				<StatCard value={10} suffix="+" label="Projects Delivered" delay={240} />
			</div>

			<p className="mt-auto flex items-center gap-2 pt-8 text-xs text-neutral-500 dark:text-neutral-400">
				<Sparkles className="size-3.5 shrink-0 text-(--accent-1)" aria-hidden="true" />
				Always learning, always building
			</p>
		</section>
	);
}