import BoardType from './board';

export default interface UpdateBoardDto {
  board: Partial<BoardType>;
  boardPage?: boolean;
}
