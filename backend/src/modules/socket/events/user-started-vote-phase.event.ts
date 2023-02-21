import BoardVotePhaseDto from 'src/libs/dto/board-vote-phase.dto';

export default class UserStartedVoteEvent {
	boardId: string;
	phase: string;

	constructor(payload: BoardVotePhaseDto) {
		this.boardId = payload.boardId;
		this.phase = payload.phase;
	}
}
