import { Logger } from '@nestjs/common';
import BoardTimerDurationDto from 'src/libs/dto/board-timer-duration.dto';
import TimeDto from 'src/libs/dto/time.dto';

export default class ServerStoppedTimerEvent {
	private logger: Logger = new Logger(ServerStoppedTimerEvent.name);

	boardId: string;
	clientId: string;
	duration: TimeDto;

	constructor(payload: BoardTimerDurationDto) {
		this.boardId = payload.boardId;
		this.clientId = payload.clientId;
		this.duration = payload.duration;

		this.logger.log(`${ServerStoppedTimerEvent.name} emitted.`);
	}
}
