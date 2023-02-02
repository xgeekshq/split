import BoardTimerDurationDto from 'src/libs/dto/board-timer-duration.dto';

export default interface StopBoardTimerService {
	stopTimer(boardTimerDurationDto: BoardTimerDurationDto): void;
}
