import { ApiProperty } from '@nestjs/swagger';

export class BadRequest {
	@ApiProperty({
		type: Number,
		default: 400
	})
	statusCode!: number;

	@ApiProperty({
		type: String,
		isArray: true
	})
	message!: string[];

	@ApiProperty({ type: String, default: 'Bad Request' })
	error!: string;
}
