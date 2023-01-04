export interface CreateVoteApplicationInterface {
	addVoteToCard(
		boardId: string,
		cardId: string,
		userId: string,
		cardItemId: string,
		count: number
	): Promise<void>;

	addVoteToCardGroup(boardId: string, cardId: string, userId: string, count: number): Promise<void>;
}
