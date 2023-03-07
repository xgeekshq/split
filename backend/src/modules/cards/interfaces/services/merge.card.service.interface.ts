export interface MergeCardService {
	mergeCards(boardId: string, draggedCardId: string, cardId: string): Promise<boolean>;
}
