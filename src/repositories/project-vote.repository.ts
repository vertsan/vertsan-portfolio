import { and, eq, inArray } from "drizzle-orm";
import { type DbInstance, getDb } from "#/db/index";
import { projectVotes } from "#/db/schema";

export type VoteValue = -1 | 0 | 1;

export interface VoteTally {
	likes: number;
	dislikes: number;
	mine: VoteValue;
}

const emptyTally = (): VoteTally => ({ likes: 0, dislikes: 0, mine: 0 });

export function createProjectVoteRepository(dbInstance: DbInstance = getDb()) {
	async function list(slugs: string[], sessionId: string) {
		const result: Record<string, VoteTally> = {};
		if (slugs.length === 0) return result;

		for (const slug of slugs) result[slug] = emptyTally();

		const rows = await dbInstance
			.select({
				projectSlug: projectVotes.projectSlug,
				sessionId: projectVotes.sessionId,
				value: projectVotes.value,
			})
			.from(projectVotes)
			.where(inArray(projectVotes.projectSlug, slugs));

		for (const row of rows) {
			const tally = result[row.projectSlug];
			if (!tally) continue;
			if (row.value === 1) tally.likes += 1;
			if (row.value === -1) tally.dislikes += 1;
			if (row.sessionId === sessionId) {
				tally.mine = row.value === -1 || row.value === 1 ? row.value : 0;
			}
		}

		return result;
	}

	async function set(slug: string, sessionId: string, value: VoteValue) {
		if (value === 0) {
			await dbInstance
				.delete(projectVotes)
				.where(
					and(
						eq(projectVotes.projectSlug, slug),
						eq(projectVotes.sessionId, sessionId),
					),
				);
			return;
		}

		const now = new Date();
		await dbInstance
			.insert(projectVotes)
			.values({ projectSlug: slug, sessionId, value, updatedAt: now })
			.onConflictDoUpdate({
				target: [projectVotes.projectSlug, projectVotes.sessionId],
				set: { value, updatedAt: now },
			});
	}

	return { list, set };
}
