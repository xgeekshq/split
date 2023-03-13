import { BadRequestException, HttpStatus } from '@nestjs/common';

export class PasswordsDontMatchException extends BadRequestException {
	private static defaultMessage = 'PASSWORDS_DO_NOT_MATCH';

	constructor(message = PasswordsDontMatchException.defaultMessage) {
		super(
			{
				statusCode: HttpStatus.BAD_REQUEST,
				message
			},
			message
		);
	}
}
