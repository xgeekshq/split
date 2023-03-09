export interface MergeCardApplicationInterface {
	mergeCards(boardId: string, draggedCardId: string, cardId: string): Promise<boolean>;
}
