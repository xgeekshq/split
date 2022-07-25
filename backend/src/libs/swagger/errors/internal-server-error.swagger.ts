import { ApiProperty } from '@nestjs/swagger';

export class InternalServerErrorResponse {
	@ApiProperty({
		type: Number,
		default: 500
	})
	statusCode!: number;

	@ApiProperty({
		type: String,
		default: 'Internal server error'
	})
	message!: string;
}
