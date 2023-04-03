import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import BoardDto from '../board.dto';

export default class CreateBoardUseCaseDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	userId: string;

	@ApiProperty({ type: BoardDto })
	@IsNotEmpty()
	boardData: BoardDto;
}
