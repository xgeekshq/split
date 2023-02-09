import BoardTimerDurationDto from 'src/libs/dto/board-timer-duration.dto';

export default interface StartBoardTimerService {
	startTimer(boardTimerDurationDto: BoardTimerDurationDto): void;
}
