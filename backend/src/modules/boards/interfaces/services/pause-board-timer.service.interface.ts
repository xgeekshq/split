import BoardTimerTimeLeftDto from 'src/libs/dto/board-timer-time-left.dto';

export default interface PauseBoardTimerService {
	pauseTimer(boartTimeLeft: BoardTimerTimeLeftDto): void;
}
