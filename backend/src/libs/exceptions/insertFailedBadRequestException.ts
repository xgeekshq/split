import { BadRequestException, HttpStatus } from '@nestjs/common';
import { INSERT_FAILED } from './messages';

export class InsertFailedException extends BadRequestException {
	private static defaultMessage = INSERT_FAILED;

	constructor(message = InsertFailedException.defaultMessage) {
		super(
			{
				statusCode: HttpStatus.BAD_REQUEST,
				message
			},
			message
		);
	}
}
