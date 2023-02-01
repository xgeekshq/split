import BoardTimerTimeLeftDto from 'src/modules/common/dtos/board-timer-time-left.dto';

export default interface UpdateBoardTimerTimeLeftService {
	updateTimeLeft(boardTimeLeftDto: BoardTimerTimeLeftDto): void;
}
