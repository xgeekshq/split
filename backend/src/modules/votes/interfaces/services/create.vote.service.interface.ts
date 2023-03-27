export interface CreateVoteServiceInterface {
	addVoteToCard(
		boardId: string,
		cardId: string,
		userId: string,
		cardItemId: string,
		count: number,
		retryCount?: number
	): Promise<void>;

	addVoteToCardGroup(
		boardId: string,
		cardId: string,
		userId: string,
		count: number,
		retryCount?: number
	): Promise<void>;
}
