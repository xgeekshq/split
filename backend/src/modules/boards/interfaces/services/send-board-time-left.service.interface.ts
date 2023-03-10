import BoardTimerTimeLeftDto from 'src/libs/dto/board-timer-time-left.dto';

export default interface SendBoardTimerTimeLeftServiceInterface {
	sendTimeLeft(boardTimeLeftDto: BoardTimerTimeLeftDto): void;
}
