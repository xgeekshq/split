import BoardTimerTimeLeftDto from 'src/libs/dto/board-timer-time-left.dto';

export default interface SendBoardTimerTimeLeftService {
	sendTimeLeft(boardTimeLeftDto: BoardTimerTimeLeftDto): void;
}
