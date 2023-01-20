export interface DeleteBoardApplicationInterface {
	delete(boardId: string): Promise<boolean>;
}
