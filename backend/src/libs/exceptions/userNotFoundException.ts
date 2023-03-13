import { BadRequestException, HttpStatus } from '@nestjs/common';
import { USER_NOT_FOUND } from 'src/libs/exceptions/messages';

export class UserNotFoundException extends BadRequestException {
	private static defaultMessage = USER_NOT_FOUND;

	constructor(message = UserNotFoundException.defaultMessage) {
		super(
			{
				statusCode: HttpStatus.NOT_FOUND,
				message
			},
			message
		);
	}
}
