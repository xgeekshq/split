import Board from 'src/modules/boards/entities/board.schema';
import Column from 'src/modules/columns/entities/column.schema';

export default class PhaseChangeEvent {
	boardId: string;
	phase: string;
	hideCards: boolean;
	hideVotes: boolean;
	addCards: boolean;
	columns: Column[];

	constructor(board: Board) {
		this.boardId = board._id;
		this.phase = board.phase;
		this.hideCards = board.hideVotes;
		this.addCards = board.addCards;
		this.columns = board.columns;
	}
}
