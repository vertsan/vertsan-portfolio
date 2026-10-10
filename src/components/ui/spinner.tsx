import { cn } from "#/lib/utils";

export function Spinner({
	className,
	label = "Loading",
}: {
	className?: string;
	label?: string;
}) {
	return (
		<output aria-label={label} className="inline-flex">
			<span
				className={cn(
					"animate-spin rounded-full border-2 border-muted-foreground/25 border-t-primary",
					"motion-reduce:animate-[pulse_1.5s_ease-in-out_infinite]",
					className ?? "size-5",
				)}
			/>
			<span className="sr-only">{label}</span>
		</output>
	);
}
