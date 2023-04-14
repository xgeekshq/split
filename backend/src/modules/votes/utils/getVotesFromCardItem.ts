export function getVotesFromCardItem(votes: string[], userId: string, count: number) {
	let votesOnCardItem = [...votes];

	const userVotes = votesOnCardItem.filter((vote) => vote.toString() === userId);

	votesOnCardItem = votesOnCardItem.filter((vote) => vote.toString() !== userId);

	userVotes.splice(0, Math.abs(count));

	return votesOnCardItem.concat(userVotes);
}
