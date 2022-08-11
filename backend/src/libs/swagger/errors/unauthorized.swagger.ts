import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UnauthorizedResponse {
	@ApiProperty({
		type: Number,
		default: 401
	})
	statusCode!: number;

	@ApiProperty({
		type: String,
		default: 'Unauthorized'
	})
	message!: string;

	@ApiPropertyOptional({
		type: String
	})
	error!: string;
}
