export interface CreateVoteServiceInterface {
	canUserVote(boardId: string, userId: string, count: number): Promise<void>;
	incrementVoteUser(
		boardId: string,
		userId: string,
		count: number,
		withSession?: boolean
	): Promise<void>;

	// addVoteToCardGroup(
	// 	boardId: string,
	// 	cardId: string,
	// 	userId: string,
	// 	count: number,
	// 	retryCount?: number
	// ): Promise<void>;
}
