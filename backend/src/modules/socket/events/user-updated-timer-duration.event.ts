import BoardTimerDurationDto from 'src/modules/common/dtos/board-timer-duration.dto';
import TimeDto from 'src/modules/common/dtos/time.dto';

export default class UserUpdatedTimerDurationEvent {
	boardId: string;
	clientId: string;
	duration: TimeDto;

	constructor(payload: BoardTimerDurationDto) {
		this.boardId = payload.boardId;
		this.clientId = payload.clientId;
		this.duration = payload.duration;
	}
}
