import Board from 'src/modules/boards/entities/board.schema';

export default class BoardChangeEvent {
	board: Board;

	constructor(board: Board) {
		this.board = board;
	}
}
