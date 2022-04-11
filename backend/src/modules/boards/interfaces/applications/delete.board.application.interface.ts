export interface DeleteBoardApplicationInterface {
  delete(boardId: string, userId: string): Promise<boolean>;
}
