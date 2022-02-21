export interface DeleteBoardService {
  delete(boardId: string, userId: string): Promise<boolean>;
}
