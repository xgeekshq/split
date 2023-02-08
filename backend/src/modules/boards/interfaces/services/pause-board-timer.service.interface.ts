import BoardTimerDto from 'src/libs/dto/board-timer.dto';

export default interface PauseBoardTimerService {
	pauseTimer(boartTimeLeft: BoardTimerDto): void;
}
