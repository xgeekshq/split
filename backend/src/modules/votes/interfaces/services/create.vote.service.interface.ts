export interface CreateVoteServiceInterface {
	canUserVote(boardId: string, userId: string, count: number): Promise<void>;
	incrementVoteUser(
		boardId: string,
		userId: string,
		count: number,
		withSession?: boolean
	): Promise<void>;
}
