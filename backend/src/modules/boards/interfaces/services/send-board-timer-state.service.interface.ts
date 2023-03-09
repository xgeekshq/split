import BoardTimerDto from 'src/libs/dto/board-timer.dto';

export default interface SendBoardTimerStateServiceInterface {
	sendBoardTimerState(boardTimerDto: BoardTimerDto): void;
}
