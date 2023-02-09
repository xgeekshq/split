import BoardTimerDto from 'src/libs/dto/board-timer.dto';
import TimeDto from 'src/libs/dto/time.dto';

export default interface BoardTimerTimeLeftDto extends BoardTimerDto {
	timeLeft: TimeDto;
}
