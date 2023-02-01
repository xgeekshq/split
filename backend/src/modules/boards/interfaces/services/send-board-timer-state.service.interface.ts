import BoardTimerDto from 'src/modules/common/dtos/board-timer.dto';

export default interface SendBoardTimerStateService {
	sendBoardTimerState(boardTimerDto: BoardTimerDto): void;
}
