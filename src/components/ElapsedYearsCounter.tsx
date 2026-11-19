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
		<p
			className={cn(
				"inline-flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] leading-none sm:text-[11px]",
				className,
			)}
		>
			<span
				aria-hidden="true"
				className="size-1.5 shrink-0 rounded-full bg-(--ui-accent) opacity-70"
			/>
			<span className="uppercase tracking-[0.18em] text-(--ui-text-subtle)">
				{label}
			</span>
			<span
				aria-describedby={tooltipId}
				className={cn(
					"group relative inline-flex items-baseline gap-1 rounded-full border border-border/60 bg-background/70 px-2 py-1 font-mono text-[11px] tabular-nums text-(--ui-text-muted) shadow-[0_8px_28px_-14px_rgb(0_0_0/0.32)] backdrop-blur-md sm:text-xs",
					interactive &&
						"transition-colors duration-200 hover:border-border hover:bg-background/80 hover:text-(--ui-text)",
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
		</p>
	);
}
