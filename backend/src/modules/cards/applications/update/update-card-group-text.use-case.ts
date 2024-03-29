import { Inject, Injectable, Logger } from '@nestjs/common';
import { CARD_REPOSITORY } from '../../constants';
import { CardRepositoryInterface } from '../../repository/card.repository.interface';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import { UpdateFailedException } from 'src/libs/exceptions/updateFailedBadRequestException';
import { UPDATE_FAILED } from 'src/libs/exceptions/messages';
import UpdateCardGroupTextUseCaseDto from '../../dto/useCase/update-card-group-text.use-case.dto';

@Injectable()
export class UpdateCardGroupTextUseCase implements UseCase<UpdateCardGroupTextUseCaseDto, void> {
	constructor(
		@Inject(CARD_REPOSITORY)
		private readonly cardRepository: CardRepositoryInterface
	) {}
	private logger = new Logger(UpdateCardGroupTextUseCase.name);

	async execute({
		boardId,
		cardId,
		userId,
		text,
		completionHandler
	}: UpdateCardGroupTextUseCaseDto) {
		try {
			const board = await this.cardRepository.updateCardGroupText(boardId, cardId, userId, text);

			if (!board) throw new UpdateFailedException(UPDATE_FAILED);

			completionHandler();
		} catch (e) {
			this.logger.error(e);
			throw new UpdateFailedException(UPDATE_FAILED);
		}
	}
}
