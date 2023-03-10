export interface UnmergeCardServiceInterface {
	unmergeAndUpdatePosition(
		boardId: string,
		cardGroupId: string,
		draggedCardId: string,
		columnId: string,
		position: number
	): Promise<string>;
}
