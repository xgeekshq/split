import { ApiProperty } from '@nestjs/swagger';
import { FORBIDDEN } from 'src/libs/exceptions/messages';

export class ForbiddenResponse {
	@ApiProperty({
		type: Number,
		default: 403
	})
	statusCode!: number;

	@ApiProperty({
		type: String,
		isArray: true,
		default: [FORBIDDEN]
	})
	message!: string[];

	@ApiProperty({ type: String, default: 'Forbidden' })
	error!: string;
}
