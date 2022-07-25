import { ApiProperty } from '@nestjs/swagger';

export class NotFound {
	@ApiProperty({
		type: Number,
		default: 404
	})
	statusCode!: number;

	@ApiProperty({
		type: String,
		isArray: true,
		examples: ['NOT_FOUND', 'BOARDS_NOT_FOUND', 'BOARD_NOT_FOUND', 'USER_NOT_FOUND']
	})
	message!: string[];

	@ApiProperty({ type: String, default: 'Not Found' })
	error!: string;
}
