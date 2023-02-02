import { Logger } from '@nestjs/common';
import BoardTimerDurationDto from 'src/libs/dto/board-timer-duration.dto';
import TimeDto from 'src/libs/dto/time.dto';

export default class ServerStartedTimerEvent {
	private logger: Logger = new Logger(ServerStartedTimerEvent.name);

	boardId: string;
	clientId: string;
	duration: TimeDto;

	constructor(payload: BoardTimerDurationDto) {
		this.boardId = payload.boardId;
		this.clientId = payload.clientId;
		this.duration = payload.duration;

		this.logger.log(`${ServerStartedTimerEvent.name} emitted.`);
	}
}
