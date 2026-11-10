import { useEffect, useSyncExternalStore } from "react";

const SESSION_KEY = "vrt_session";
const NAME_KEY = "vrt_name";
const HEARTBEAT_MS = 30_000;

export type PresenceUser = {
	name: string | null;
	lastSeenAt: Date;
};

export type PresenceView = {
	name: string | null;
	firstSeenAt: Date;
};

type PresenceResponse = {
	online: number;
	totalViews: number;
	onlineUsers: { name: string | null; lastSeenAt: string | Date }[];
	recentViews: { name: string | null; firstSeenAt: string | Date }[];
};

type PresenceState = {
	online: number | null;
	totalViews: number | null;
	onlineUsers: PresenceUser[];
	recentViews: PresenceView[];
};

const INITIAL: PresenceState = {
	online: null,
	totalViews: null,
	onlineUsers: [],
	recentViews: [],
};

/*
 * One shared presence store for the whole page.
 *
 * The header badge and the footer counter both read this hook. Keeping the
 * poller at module scope means one heartbeat and — more importantly — one
 * "view" event per page load, instead of one per mounted component.
 */
let state: PresenceState = INITIAL;
let sessionId = "";
let viewSent = false;
let activeConsumers = 0;
let intervalId: ReturnType<typeof setInterval> | null = null;

const listeners = new Set<() => void>();

function emit() {
	for (const listener of listeners) listener();
}

function apply(data: PresenceResponse | null) {
	if (!data) return;
	state = {
		online: data.online,
		totalViews: data.totalViews,
		onlineUsers: (data.onlineUsers ?? []).map((user) => ({
			name: user.name,
			lastSeenAt: new Date(user.lastSeenAt),
		})),
		recentViews: (data.recentViews ?? []).map((view) => ({
			name: view.name,
			firstSeenAt: new Date(view.firstSeenAt),
		})),
	};
	emit();
}

function getSessionId(): string {
	if (typeof window === "undefined") return "";
	try {
		let id = window.localStorage.getItem(SESSION_KEY);
		if (!id) {
			id =
				typeof crypto.randomUUID === "function"
					? crypto.randomUUID()
					: `s-${Date.now()}-${Math.random().toString(36).slice(2)}`;
			window.localStorage.setItem(SESSION_KEY, id);
		}
		return id;
	} catch {
		return "";
	}
}

async function ping(
	id: string,
	event: "view" | "heartbeat",
	name: string | null,
) {
	if (!id) return null;
	try {
		const res = await fetch("/api/presence", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ sessionId: id, event, name }),
		});
		if (!res.ok) return null;
		return (await res.json()) as PresenceResponse;
	} catch {
		return null;
	}
}

function readName(): string | null {
	try {
		return window.localStorage.getItem(NAME_KEY);
	} catch {
		return null;
	}
}

function heartbeat() {
	void ping(sessionId, "heartbeat", readName()).then(apply);
}

function onVisibility() {
	if (document.visibilityState === "visible") heartbeat();
}

function start() {
	activeConsumers += 1;
	if (activeConsumers > 1) return;

	sessionId = getSessionId();
	const name = readName();

	// Count a view once per page load, no matter how many components subscribe.
	if (!viewSent) {
		viewSent = true;
		void ping(sessionId, "view", name).then(apply);
	} else {
		heartbeat();
	}

	intervalId = setInterval(heartbeat, HEARTBEAT_MS);
	document.addEventListener("visibilitychange", onVisibility);
}

function stop() {
	activeConsumers = Math.max(0, activeConsumers - 1);
	if (activeConsumers > 0) return;
	if (intervalId) clearInterval(intervalId);
	intervalId = null;
	document.removeEventListener("visibilitychange", onVisibility);
}

function subscribe(listener: () => void) {
	listeners.add(listener);
	return () => {
		listeners.delete(listener);
	};
}

export function usePresence() {
	const snapshot = useSyncExternalStore(
		subscribe,
		() => state,
		() => INITIAL,
	);

	useEffect(() => {
		start();
		return stop;
	}, []);

	return snapshot;
}
