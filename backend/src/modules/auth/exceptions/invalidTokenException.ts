import { BadRequestException, HttpStatus } from '@nestjs/common';

export class InvalidTokenException extends BadRequestException {
	private static defaultMessage = 'Invalid token!';

	constructor(message = InvalidTokenException.defaultMessage) {
		super(
			{
				statusCode: HttpStatus.BAD_REQUEST,
				message
			},
			message
		);
	}
}
