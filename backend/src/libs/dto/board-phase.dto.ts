import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { BoardPhases } from '../enum/board.phases';

export class BoardPhaseDto {
	@ApiProperty()
	@IsMongoId()
	@IsNotEmpty()
	boardId: string;

	@ApiProperty({ type: String, enum: BoardPhases, enumName: 'Phases' })
	@IsString()
	@IsNotEmpty()
	@IsEnum(BoardPhases, { each: true })
	phase: string;
}
