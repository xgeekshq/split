import { BadRequestException } from '@nestjs/common';
import { CREATE_FAILED } from './messages';

export class CreateFailedException extends BadRequestException {
	private static defaultMessage = CREATE_FAILED;

	constructor(message = CreateFailedException.defaultMessage) {
		super(message);
	}
}
