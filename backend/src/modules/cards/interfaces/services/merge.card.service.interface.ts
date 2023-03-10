export interface MergeCardServiceInterface {
	mergeCards(boardId: string, draggedCardId: string, cardId: string): Promise<boolean>;
}
