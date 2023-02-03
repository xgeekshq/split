import BoardTimerDto from 'src/libs/dto/board-timer.dto';

export default interface StopBoardTimerService {
	stopTimer(boardTimerDto: BoardTimerDto): void;
}
