import { NotFoundException } from '@nestjs/common';
import { USER_NOT_FOUND } from 'src/libs/exceptions/messages';

export class UserNotFoundException extends NotFoundException {
	private static defaultMessage = USER_NOT_FOUND;

	constructor(message = UserNotFoundException.defaultMessage) {
		super(message);
	}
}
