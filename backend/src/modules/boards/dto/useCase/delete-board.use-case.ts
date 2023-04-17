import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export default class DeleteBoardUseCaseDto {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	boardId: string;

	completionHandler: (deletedBoards: string[]) => void;
}
