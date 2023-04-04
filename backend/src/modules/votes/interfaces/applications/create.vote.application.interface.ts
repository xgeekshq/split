export interface CreateVoteApplicationInterface {
	addVoteToCardGroup(boardId: string, cardId: string, userId: string, count: number): Promise<void>;
}
