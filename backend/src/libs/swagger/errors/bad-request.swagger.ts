import { ApiProperty } from '@nestjs/swagger';

import {
	DELETE_FAILED,
	EMAIL_DONT_MATCH,
	EMAIL_EXISTS,
	INSERT_FAILED,
	UPDATE_FAILED
} from 'libs/exceptions/messages';

export class BadRequestResponse {
	@ApiProperty({
		type: Number,
		default: 400
	})
	statusCode!: number;

	@ApiProperty({
		type: String,
		isArray: true,
		examples: [INSERT_FAILED, DELETE_FAILED, UPDATE_FAILED, EMAIL_EXISTS, EMAIL_DONT_MATCH]
	})
	message!: string[];

	@ApiProperty({ type: String, default: 'Bad Request' })
	error!: string;
}
