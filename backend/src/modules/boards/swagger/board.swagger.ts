import { ApiProperty } from '@nestjs/swagger';

import BoardDto from 'modules/boards/dto/board.dto';

export class BoardResponse {
	@ApiProperty({ type: BoardDto, isArray: true })
	boards!: BoardDto[];

	@ApiProperty({
		type: Boolean,
		default: false
	})
	hasNextPage!: boolean;

	@ApiProperty({ type: Number, default: 0 })
	page!: number;
}
