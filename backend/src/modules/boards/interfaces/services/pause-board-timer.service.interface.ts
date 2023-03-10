import BoardTimerDto from 'src/libs/dto/board-timer.dto';

export default interface PauseBoardTimerServiceInterface {
	pauseTimer(boartTimeLeft: BoardTimerDto): void;
}
