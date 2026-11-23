export const SESSION_KEY = "vrt_session";

/** Stable anonymous visitor id shared by presence and project votes. */
export function getSessionId(): string {
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
