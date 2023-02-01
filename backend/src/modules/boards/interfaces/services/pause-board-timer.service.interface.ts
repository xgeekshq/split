import BoardTimerTimeLeftDto from 'src/modules/common/dtos/board-timer-time-left.dto';

export default interface PauseBoardTimerService {
	pauseTimer(boartTimeLeft: BoardTimerTimeLeftDto): void;
}
