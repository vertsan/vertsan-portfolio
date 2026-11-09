import { Link } from "@tanstack/react-router";
import type { CSSProperties } from "react";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "#/components/ui/breadcrumb";

const reveal = (delay: number) =>
	({ "--reveal-delay": `${delay}ms` }) as CSSProperties;

/**
 * Centered About hero: low-key breadcrumb, pill label, headline and a
 * comfortably narrow subtitle. Every element fades up on a 60ms stagger.
 */
export default function AboutHero() {
	return (
		<header className="relative flex flex-col items-center text-center">
			<Breadcrumb className="mb-10">
				<BreadcrumbList
					className="text-xs sm:text-sm"
					style={{ color: "var(--ui-text-subtle)" }}
				>
					<BreadcrumbItem>
						<BreadcrumbLink asChild>
							<Link
								to="/"
								className="ui-focusable rounded-sm transition-colors hover:text-[var(--ui-text)]"
							>
								Home
							</Link>
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage style={{ color: "var(--ui-text-muted)" }}>
							About
						</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>

			<span
				data-reveal
				style={{
					...reveal(0),
					borderColor: "var(--ui-border)",
					backgroundColor: "var(--ui-surface-soft)",
					color: "var(--ui-text-muted)",
				}}
				className="inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.12em]"
			>
				<span
					aria-hidden
					className="size-1.5 rounded-full"
					style={{ backgroundColor: "var(--ui-accent)" }}
				/>
				About me
			</span>

			<h1
				data-reveal
				style={reveal(60)}
				className="mt-6 text-[2.5rem] font-bold leading-[1.05] tracking-[-0.035em] text-[var(--ui-text)] sm:text-5xl md:text-6xl lg:text-[3.75rem]"
			>
				Who <span style={{ color: "var(--ui-accent)" }}>I Am</span>
			</h1>

			<p
				data-reveal
				style={{ ...reveal(120), color: "var(--ui-text-muted)" }}
				className="mt-5 max-w-[35rem] text-base leading-[1.65] sm:text-[17px]"
			>
				Software engineer crafting accessible, performant web applications with
				modern technologies and clean architecture.
			</p>
		</header>
	);
}
