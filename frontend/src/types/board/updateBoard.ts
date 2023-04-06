import BoardType from '@/types/board/board';

export default interface UpdateBoardDto {
  board: Partial<BoardType>;
  boardPage?: boolean;
}
