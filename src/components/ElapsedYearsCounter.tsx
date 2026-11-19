import { useId } from "react";

import { useElapsedYears } from "#/lib/useElapsedYears";
import { cn } from "#/lib/utils";

const PLACEHOLDER = "0.000000000";
const LABEL = "Been here for";
const TOOLTIP = "Live Earth uptime since 2004";

type ElapsedYearsCounterProps = {
	birthDate: Date;
	label?: string;
	/** Opt-in color transition on hover; the tooltip is always available. */
	interactive?: boolean;
	className?: string;
};

/** Small, legible eyebrow: label + live year count above the hero headline. */
export default function ElapsedYearsCounter({
	birthDate,
	label = LABEL,
	interactive = false,
	className,
}: ElapsedYearsCounterProps) {
	const years = useElapsedYears(birthDate);
	const value = years ?? PLACEHOLDER;
	const tooltipId = useId();

	return (
		<p className={cn("inline-flex text-[10px] leading-none sm:text-[11px]", className)}>
			<span
				className={cn(
					"inline-flex items-center gap-2.5 whitespace-nowrap rounded-full border px-2.5 py-1.5 shadow-[0_10px_30px_-18px_rgba(9,9,11,0.35)] backdrop-blur-md",
					"border-black/[0.07] bg-white/75 dark:border-white/10 dark:bg-neutral-950/75 dark:shadow-[0_12px_34px_-18px_rgba(0,0,0,0.85)]",
				)}
			>
				<span className="inline-flex items-center gap-1.5 font-medium uppercase tracking-[0.2em] text-(--ui-text-muted)">
					<span
						aria-hidden="true"
						className="size-1 rounded-full bg-(--accent-1) opacity-80"
					/>
					{label}
				</span>

				<span aria-hidden="true" className="h-3 w-px bg-(--ui-border)" />

				<span
					aria-describedby={tooltipId}
					className={cn(
						"group relative inline-flex items-baseline gap-1 font-mono text-[11px] tabular-nums sm:text-xs",
						interactive &&
							"transition-colors duration-200 hover:text-(--ui-accent)",
					)}
				>
					<span className="tabular-nums text-(--ui-text)">{value}</span>
					<span className="font-sans text-(--ui-text-subtle)">years</span>
					<span
						id={tooltipId}
						role="tooltip"
						className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 -translate-x-1/2 whitespace-nowrap rounded-md border border-border/60 bg-background/95 px-2 py-1 font-sans text-[10px] font-medium normal-nums text-(--ui-text-muted) opacity-0 shadow-[0_12px_32px_-16px_rgb(0_0_0/0.55)] backdrop-blur-lg transition-opacity duration-150 group-hover:opacity-100"
					>
						{TOOLTIP}
					</span>
				</span>
			</span>
		</p>
	);
}
