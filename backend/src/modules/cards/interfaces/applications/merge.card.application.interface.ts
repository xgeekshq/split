export interface MergeCardApplication {
	mergeCards(boardId: string, draggedCardId: string, cardId: string): Promise<boolean>;
}
