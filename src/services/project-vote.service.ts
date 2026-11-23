import {
	createProjectVoteRepository,
	type VoteTally,
	type VoteValue,
} from "#/repositories/project-vote.repository";

export type { VoteTally, VoteValue };

export function createProjectVoteService() {
	const repo = createProjectVoteRepository();

	async function list(slugs: string[], sessionId: string) {
		return repo.list(slugs, sessionId);
	}

	async function set(slug: string, sessionId: string, value: VoteValue) {
		await repo.set(slug, sessionId, value);
		return repo.list([slug], sessionId);
	}

	return { list, set };
}
