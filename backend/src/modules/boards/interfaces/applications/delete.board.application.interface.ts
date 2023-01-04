export interface DeleteBoardApplicationInterface {
	delete(boardId: string, userId: string, isSAdmin: boolean): Promise<boolean>;
}
