import { useCallback, useEffect, useRef, useState } from "react";
import { getSessionId } from "#/lib/session-id";
import type { VoteTally, VoteValue } from "#/services/project-vote.service";

const REFRESH_MS = 15_000;

async function request(body: Record<string, unknown>) {
	const res = await fetch("/api/votes", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body),
	});
	if (!res.ok) throw new Error("Vote request failed");
	const data = (await res.json()) as {
		votes?: Record<string, VoteTally>;
		error?: string;
	};
	if (data.error) throw new Error(data.error);
	return data.votes ?? {};
}

/** Live vote tallies for the displayed projects, keyed by slug. */
export function useProjectVotes(slugs: string[]) {
	const [votes, setVotes] = useState<Record<string, VoteTally>>({});
	const [pending, setPending] = useState<Record<string, boolean>>({});
	const sessionRef = useRef("");
	const slugsRef = useRef(slugs);
	const slugKey = slugs.join("|");

	slugsRef.current = slugs;

	const refresh = useCallback(async (list = slugsRef.current) => {
		const sessionId = sessionRef.current;
		if (!sessionId || list.length === 0) return;
		try {
			const next = await request({ sessionId, slugs: list });
			setVotes((prev) => ({ ...prev, ...next }));
		} catch {
			// Keep the last known tallies if a refresh fails.
		}
	}, []);

	useEffect(() => {
		sessionRef.current = getSessionId();
		const list = slugKey ? slugKey.split("|") : [];
		slugsRef.current = list;
		void refresh(list);
		const timer = window.setInterval(() => void refresh(list), REFRESH_MS);
		const onVisible = () => {
			if (document.visibilityState === "visible") void refresh(list);
		};
		document.addEventListener("visibilitychange", onVisible);
		return () => {
			window.clearInterval(timer);
			document.removeEventListener("visibilitychange", onVisible);
		};
	}, [slugKey, refresh]);

	const vote = useCallback(
		async (slug: string, value: Exclude<VoteValue, 0>) => {
			const sessionId = sessionRef.current;
			if (!sessionId || pending[slug]) return;

			const current = votes[slug] ?? { likes: 0, dislikes: 0, mine: 0 };
			const mine: VoteValue = current.mine === value ? 0 : value;

			setVotes((prev) => {
				const tally = prev[slug] ?? { likes: 0, dislikes: 0, mine: 0 };
				const next = { ...tally };
				if (tally.mine === 1) next.likes -= 1;
				if (tally.mine === -1) next.dislikes -= 1;
				if (mine === 1) next.likes += 1;
				if (mine === -1) next.dislikes += 1;
				next.mine = mine;
				return { ...prev, [slug]: next };
			});
			setPending((prev) => ({ ...prev, [slug]: true }));

			try {
				const next = await request({ sessionId, slug, value: mine });
				setVotes((prev) => ({ ...prev, ...next }));
			} catch {
				await refresh();
			} finally {
				setPending((prev) => ({ ...prev, [slug]: false }));
			}
		},
		[pending, votes, refresh],
	);

	return { votes, pending, vote };
}
