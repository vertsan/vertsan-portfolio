import { cn } from "#/lib/utils";

export function Skeleton({ className }: { className?: string }) {
	return (
		<div
			className={cn(
				"relative overflow-hidden rounded-md bg-muted/60",
				"before:absolute before:inset-0 before:content-['']",
				"before:bg-gradient-to-r before:from-transparent before:via-foreground/10 before:to-transparent",
				"before:animate-[skeleton-sweep_1.6s_ease-in-out_infinite]",
				"motion-reduce:before:hidden",
				className,
			)}
		/>
	);
}
