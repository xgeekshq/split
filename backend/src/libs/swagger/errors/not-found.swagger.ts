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
		default: ['NOT_FOUND']
	})
	message!: string[];

	@ApiProperty({ type: String, default: 'Not Found' })
	error!: string;
}
