import { ThumbsDown, ThumbsUp } from "lucide-react";
import { cn } from "#/lib/utils";
import type { VoteTally } from "#/services/project-vote.service";

export function VoteControl({
	vote,
	pending = false,
	onVote,
}: {
	vote?: VoteTally;
	pending?: boolean;
	onVote: (value: 1 | -1) => void;
}) {
	const mine = vote?.mine ?? 0;
	const count = (vote?.likes ?? 0) - (vote?.dislikes ?? 0);

	const buttonClass =
		"inline-flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50";

	return (
		<div className="flex shrink-0 items-center gap-1" aria-busy={pending}>
			<button
				type="button"
				aria-label="Like project"
				aria-pressed={mine === 1}
				disabled={pending}
				onClick={() => onVote(1)}
				className={cn(buttonClass, mine === 1 && "text-primary")}
			>
				<ThumbsUp className="size-3.5" />
			</button>
			<span className="min-w-5 text-center text-xs font-medium tabular-nums text-muted-foreground">
				{count}
			</span>
			<button
				type="button"
				aria-label="Dislike project"
				aria-pressed={mine === -1}
				disabled={pending}
				onClick={() => onVote(-1)}
				className={cn(buttonClass, mine === -1 && "text-primary")}
			>
				<ThumbsDown className="size-3.5" />
			</button>
		</div>
	);
}
