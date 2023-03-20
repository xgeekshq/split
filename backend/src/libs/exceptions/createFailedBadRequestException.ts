import { BadRequestException, HttpStatus } from '@nestjs/common';
import { CREATE_FAILED } from './messages';

export class CreateFailedException extends BadRequestException {
	private static defaultMessage = CREATE_FAILED;

	constructor(message = CreateFailedException.defaultMessage) {
		super(
			{
				statusCode: HttpStatus.BAD_REQUEST,
				message
			},
			message
		);
	}
}
