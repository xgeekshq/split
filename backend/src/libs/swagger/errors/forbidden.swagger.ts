import { ApiProperty } from '@nestjs/swagger';

export class Forbidden {
	@ApiProperty({
		type: Number,
		default: 403
	})
	statusCode!: number;

	@ApiProperty({
		type: String,
		isArray: true,
		default: ['FORBIDDEN']
	})
	message!: string[];

	@ApiProperty({ type: String, default: 'Forbidden' })
	error!: string;
}
