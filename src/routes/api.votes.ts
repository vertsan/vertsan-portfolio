import { createFileRoute } from "@tanstack/react-router";
import { createProjectVoteService } from "#/services/project-vote.service";

const MAX_SESSION_LENGTH = 128;
const MAX_SLUG_LENGTH = 200;
const MAX_SLUGS = 50;
const NO_STORE = { "Cache-Control": "no-store" };

function validSlug(value: unknown): value is string {
	return (
		typeof value === "string" &&
		value.length > 0 &&
		value.length <= MAX_SLUG_LENGTH &&
		/^[\w.-]+$/.test(value)
	);
}

function cleanSlugs(value: unknown): string[] {
	if (!Array.isArray(value)) return [];
	return [...new Set(value.filter(validSlug))].slice(0, MAX_SLUGS);
}

export const Route = createFileRoute("/api/votes")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				try {
					const body = await request.json();
					const { sessionId, slug, value, slugs } = body as {
						sessionId?: unknown;
						slug?: unknown;
						value?: unknown;
						slugs?: unknown;
					};

					if (
						typeof sessionId !== "string" ||
						sessionId.length === 0 ||
						sessionId.length > MAX_SESSION_LENGTH
					) {
						return Response.json(
							{ error: "Invalid sessionId" },
							{ status: 400, headers: NO_STORE },
						);
					}

					const isWrite =
						validSlug(slug) && (value === -1 || value === 0 || value === 1);
					const requested = cleanSlugs(slugs);
					const targets = isWrite
						? [...new Set([slug, ...requested])].slice(0, MAX_SLUGS)
						: requested;

					if (targets.length === 0) {
						return Response.json({ votes: {} }, { headers: NO_STORE });
					}

					const service = createProjectVoteService();
					if (isWrite) await service.set(slug, sessionId, value);
					const votes = await service.list(targets, sessionId);

					return Response.json({ votes }, { headers: NO_STORE });
				} catch (err: unknown) {
					const message = err instanceof Error ? err.message : "Unknown error";
					console.error("Votes API error:", err);
					return Response.json(
						{ error: message },
						{ status: 500, headers: NO_STORE },
					);
				}
			},
		},
	},
});
