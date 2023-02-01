import BoardTimerDto from 'src/modules/common/dtos/board-timer.dto';
import TimeDto from 'src/modules/common/dtos/time.dto';

export default interface BoardTimerTimeLeftDto extends BoardTimerDto {
	timeLeft: TimeDto;
}
