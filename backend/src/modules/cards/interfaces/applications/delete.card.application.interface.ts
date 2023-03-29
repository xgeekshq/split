export interface DeleteCardApplicationInterface {
	delete(boardId: string, cardId: string): Promise<void>;

	deleteFromCardGroup(boardId: string, cardId: string, cardItemId: string): Promise<void>;
}
