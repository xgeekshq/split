import { BadRequestException, HttpStatus } from '@nestjs/common';
import { EMAIL_EXISTS } from 'src/libs/exceptions/messages';

export class EmailExistsException extends BadRequestException {
	private static defaultMessage = EMAIL_EXISTS;

	constructor(message = EmailExistsException.defaultMessage) {
		super(
			{
				statusCode: HttpStatus.CONFLICT,
				message
			},
			message
		);
	}
}
