export interface DeleteBoardApplication {
  delete(boardId: string, userId: string): Promise<string>;
}
