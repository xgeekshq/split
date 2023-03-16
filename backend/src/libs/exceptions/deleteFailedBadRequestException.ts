import { BadRequestException, HttpStatus } from '@nestjs/common';
import { DELETE_FAILED } from './messages';

export class DeleteFailedException extends BadRequestException {
	private static defaultMessage = DELETE_FAILED;

	constructor(message = DeleteFailedException.defaultMessage) {
		super(
			{
				statusCode: HttpStatus.BAD_REQUEST,
				message
			},
			message
		);
	}
}
