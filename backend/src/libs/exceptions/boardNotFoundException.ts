import { NotFoundException } from '@nestjs/common';
import { BOARD_NOT_FOUND } from 'src/libs/exceptions/messages';

export class BoardNotFoundException extends NotFoundException {
	private static defaultMessage = BOARD_NOT_FOUND;

	constructor(message = BoardNotFoundException.defaultMessage) {
		super(message);
	}
}
