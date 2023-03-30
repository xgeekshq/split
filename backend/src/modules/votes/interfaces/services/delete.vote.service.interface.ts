export interface DeleteVoteServiceInterface {
	deleteVoteFromCard(
		boardId: string,
		cardId: string,
		userId: string,
		cardItemId: string,
		count: number,
		retryCount?: number
	): Promise<void>;

	deleteVoteFromCardGroup(
		boardId: string,
		cardId: string,
		userId: string,
		count: number,
		retryCount?: number
	): Promise<void>;

	decrementVoteUser(
		boardId: string,
		userId: string,
		count?: number | undefined,
		withSession?: boolean
	): Promise<void>;
}
