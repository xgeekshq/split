import { NotFoundException } from '@nestjs/common';
import { CARD_NOT_FOUND } from 'src/libs/exceptions/messages';

export class CardNotFoundException extends NotFoundException {
	private static defaultMessage = CARD_NOT_FOUND;

	constructor(message = CardNotFoundException.defaultMessage) {
		super(message);
	}
}
