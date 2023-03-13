import BoardTimerDto from 'src/libs/dto/board-timer.dto';

export default interface StopBoardTimerServiceInterface {
	stopTimer(boardTimerDto: BoardTimerDto): void;
}
