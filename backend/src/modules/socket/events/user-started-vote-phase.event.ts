import { BoardPhaseDto } from 'src/libs/dto/board-phase.dto';

export default class UserStartedVoteEvent {
	boardId: string;
	phase: string;

	constructor(boardPhaseDto: BoardPhaseDto) {
		this.boardId = boardPhaseDto.boardId;
		this.phase = boardPhaseDto.phase;
	}
}
