export interface MergeCardService {
	mergeCards(
		boardId: string,
		draggedCardId: string,
		cardId: string,
		userId: string
	): Promise<boolean>;
}
