import BoardTimerDurationDto from 'src/libs/dto/board-timer-duration.dto';

export default interface UpdateBoardTimerDurationServiceInterface {
	updateDuration(boardTimerDurationDto: BoardTimerDurationDto): void;
}
