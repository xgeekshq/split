import { BadRequestException, HttpStatus } from '@nestjs/common';
import { UPDATE_FAILED } from './messages';

export class UpdateFailedException extends BadRequestException {
	private static defaultMessage = UPDATE_FAILED;

	constructor(message = UpdateFailedException.defaultMessage) {
		super(
			{
				statusCode: HttpStatus.BAD_REQUEST,
				message
			},
			message
		);
	}
}
