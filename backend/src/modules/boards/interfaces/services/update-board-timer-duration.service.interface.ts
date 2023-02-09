import BoardTimerDurationDto from 'src/libs/dto/board-timer-duration.dto';

export default interface UpdateBoardTimerDurationService {
	updateDuration(boardTimerDurationDto: BoardTimerDurationDto): void;
}
