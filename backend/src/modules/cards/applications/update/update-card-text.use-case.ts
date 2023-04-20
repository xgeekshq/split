import { Inject, Injectable, Logger } from '@nestjs/common';
import { TYPES } from '../../constants';
import { CardRepositoryInterface } from '../../repository/card.repository.interface';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import UpdateCardTextUseCaseDto from '../../dto/useCase/update-card-text.use-case.dto';
import { UpdateFailedException } from 'src/libs/exceptions/updateFailedBadRequestException';
import { UPDATE_FAILED } from 'src/libs/exceptions/messages';

@Injectable()
export class UpdateCardTextUseCase implements UseCase<UpdateCardTextUseCaseDto, void> {
	constructor(
		@Inject(TYPES.repository.CardRepository)
		private readonly cardRepository: CardRepositoryInterface
	) {}

	private logger = new Logger(UpdateCardTextUseCase.name);

	async execute({
		boardId,
		cardId,
		cardItemId,
		userId,
		text,
		completionHandler
	}: UpdateCardTextUseCaseDto) {
		try {
			const board = await this.cardRepository.updateCardText(
				boardId,
				cardId,
				cardItemId,
				userId,
				text
			);

			if (!board) throw new UpdateFailedException(UPDATE_FAILED);
			completionHandler();
		} catch (e) {
			this.logger.error(e);
			throw new UpdateFailedException(UPDATE_FAILED);
		}
	}
}
