import { Clock, Eye, UserRound } from "lucide-react";
import { useState } from "react";

import { Button } from "#/components/ui/button";
import {
	type PresenceUser,
	type PresenceView,
	usePresence,
} from "../hooks/use-presence";

function formatCount(value: number | null): string {
	if (value === null) return "–";
	if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
	return value.toLocaleString("en-US");
}

function timeAgo(date: Date): string {
	const diff = Math.max(0, Date.now() - date.getTime());
	const s = Math.floor(diff / 1000);
	if (s < 60) return "just now";
	const m = Math.floor(s / 60);
	if (m < 60) return `${m}m ago`;
	const h = Math.floor(m / 60);
	if (h < 24) return `${h}h ago`;
	return `${Math.floor(h / 24)}d ago`;
}

function displayName(name: string | null): string {
	return name?.trim() ? name : "Guest";
}

export default function PresenceBadge() {
	const { online, totalViews, onlineUsers, recentViews } = usePresence();
	const [active, setActive] = useState<"online" | "views" | null>(null);

	const renderUser = (u: PresenceUser) => (
		<li
			key={u.lastSeenAt.getTime()}
			className="flex items-center justify-between gap-4 py-0.5 text-xs"
		>
			<span className="flex items-center gap-1.5 truncate text-foreground">
				<UserRound className="size-3 shrink-0 text-muted-foreground" />
				{displayName(u.name)}
			</span>
			<span className="shrink-0 text-muted-foreground">
				{timeAgo(u.lastSeenAt)}
			</span>
		</li>
	);

	const renderView = (v: PresenceView) => (
		<li
			key={v.firstSeenAt.getTime()}
			className="flex items-center justify-between gap-4 py-0.5 text-xs"
		>
			<span className="flex items-center gap-1.5 truncate text-foreground">
				<UserRound className="size-3 shrink-0 text-muted-foreground" />
				{displayName(v.name)}
			</span>
			<span className="flex items-center gap-1 shrink-0 text-muted-foreground">
				<Clock className="size-3" />
				{timeAgo(v.firstSeenAt)}
			</span>
		</li>
	);

	return (
		<div className="relative hidden items-center gap-1 rounded-full border border-border/60 bg-background/70 px-2.5 py-1.5 text-sm shadow-[0_8px_28px_-14px_rgb(0_0_0/0.32)] backdrop-blur-md lg:flex">
			{/* Online count */}
			<Button
				type="button"
				variant="ghost"
				onMouseEnter={() => setActive("online")}
				onMouseLeave={() => setActive(null)}
				onClick={() => setActive(active === "online" ? null : "online")}
				aria-label={`${formatCount(online)} visitors online`}
				className="header-chip h-auto gap-1.5 rounded-full px-1.5 py-0.5"
			>
				<span className="relative flex size-2 shrink-0">
					<span
						aria-hidden
						className="absolute inline-flex size-full animate-ping rounded-full bg-green-400 opacity-75"
					/>
					<span className="relative inline-flex size-2 rounded-full bg-green-500" />
				</span>
				<span className="font-medium tabular-nums text-foreground">
					{formatCount(online)}
				</span>
			</Button>

			<span aria-hidden className="h-3 w-px shrink-0 bg-border/60" />

			{/* Views count */}
			<Button
				type="button"
				variant="ghost"
				onMouseEnter={() => setActive("views")}
				onMouseLeave={() => setActive(null)}
				onClick={() => setActive(active === "views" ? null : "views")}
				aria-label={`${formatCount(totalViews)} total views`}
				className="header-chip h-auto gap-1.5 rounded-full px-1.5 py-0.5"
			>
				<Eye className="size-3.5" />
				<span className="font-medium tabular-nums text-foreground">
					{formatCount(totalViews)}
				</span>
			</Button>

			{active === "online" && (
				<div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-lg border border-border bg-card p-2 shadow-xl">
					<p className="px-1 pb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
						Online now
					</p>
					{onlineUsers.length === 0 ? (
						<p className="px-1 py-1 text-xs text-muted-foreground">No one</p>
					) : (
						<ul className="max-h-40 divide-y divide-border/50 overflow-y-auto">
							{onlineUsers.map(renderUser)}
						</ul>
					)}
				</div>
			)}

			{active === "views" && (
				<div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-lg border border-border bg-card p-2 shadow-xl">
					<p className="px-1 pb-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
						Recent views
					</p>
					{recentViews.length === 0 ? (
						<p className="px-1 py-1 text-xs text-muted-foreground">
							No views yet
						</p>
					) : (
						<ul className="max-h-40 divide-y divide-border/50 overflow-y-auto">
							{recentViews.map(renderView)}
						</ul>
					)}
				</div>
			)}
		</div>
	);
}
