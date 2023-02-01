import BoardTimerDurationDto from 'src/modules/common/dtos/board-timer-duration.dto';

export default interface StartBoardTimerService {
	startTimer(boardTimerDurationDto: BoardTimerDurationDto): void;
}
