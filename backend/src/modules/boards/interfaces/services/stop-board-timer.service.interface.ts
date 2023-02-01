import BoardTimerDurationDto from 'src/modules/common/dtos/board-timer-duration.dto';

export default interface StopBoardTimerService {
	stopTimer(boardTimerDurationDto: BoardTimerDurationDto): void;
}
