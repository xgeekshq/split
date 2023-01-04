export interface DeleteVoteServiceInterface {
	deleteVoteFromCard(
		boardId: string,
		cardId: string,
		userId: string,
		cardItemId: string,
		count: number
	): Promise<void>;

	deleteVoteFromCardGroup(
		boardId: string,
		cardId: string,
		userId: string,
		count: number
	): Promise<void>;

	decrementVoteUser(boardId: string, userId: string, count?: number | undefined): Promise<void>;
}
