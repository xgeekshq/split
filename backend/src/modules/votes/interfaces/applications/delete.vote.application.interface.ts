export interface DeleteVoteApplicationInterface {
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
}
