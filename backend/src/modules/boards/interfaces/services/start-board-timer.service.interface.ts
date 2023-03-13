import BoardTimerDurationDto from 'src/libs/dto/board-timer-duration.dto';

export default interface StartBoardTimerServiceInterface {
	startTimer(boardTimerDurationDto: BoardTimerDurationDto): void;
}
