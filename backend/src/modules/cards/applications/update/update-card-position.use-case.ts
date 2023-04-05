import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { TYPES } from '../../interfaces/types';
import { CardRepositoryInterface } from '../../repository/card.repository.interface';
import { GetCardServiceInterface } from '../../interfaces/services/get.card.service.interface';
import {
	CARD_NOT_FOUND,
	CARD_NOT_INSERTED,
	CARD_NOT_MOVED,
	CARD_NOT_REMOVED
} from 'src/libs/exceptions/messages';
import { UpdateFailedException } from 'src/libs/exceptions/updateFailedBadRequestException';
import UpdateCardPositionUseCaseDto from '../../dto/useCase/update-card-position.use-case.dto';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import { InsertFailedException } from 'src/libs/exceptions/insertFailedBadRequestException';
import { DeleteFailedException } from 'src/libs/exceptions/deleteFailedBadRequestException';

@Injectable()
export class UpdateCardPositionUseCase implements UseCase<UpdateCardPositionUseCaseDto, void> {
	constructor(
		@Inject(TYPES.services.GetCardService)
		private readonly cardService: GetCardServiceInterface,
		@Inject(TYPES.repository.CardRepository)
		private readonly cardRepository: CardRepositoryInterface
	) {}
	private logger = new Logger(UpdateCardPositionUseCase.name);

	async execute(updateCardPositionUseCaseDto: UpdateCardPositionUseCaseDto) {
		const { boardId, cardId } = updateCardPositionUseCaseDto;
		await this.cardRepository.startTransaction();

		try {
			const cardToMove = await this.cardService.getCardFromBoard(boardId, cardId);

			if (!cardToMove) throw new NotFoundException(CARD_NOT_FOUND);

			await this.updateCardPosition(updateCardPositionUseCaseDto, cardToMove);

			await this.cardRepository.commitTransaction();
		} catch (e) {
			this.logger.error(e);
			throw new UpdateFailedException(CARD_NOT_MOVED);
		} finally {
			await this.cardRepository.endSession();
		}
	}

	private async updateCardPosition(
		updateCardPositionUseCaseDto: UpdateCardPositionUseCaseDto,
		cardToMove
	) {
		const { boardId, cardId, targetColumnId, newPosition } = updateCardPositionUseCaseDto;
		try {
			const pullResult = await this.cardRepository.pullCard(boardId, cardId, true);

			if (pullResult.modifiedCount !== 1) throw new DeleteFailedException(CARD_NOT_REMOVED);

			const pushResult = await this.cardRepository.pushCard(
				boardId,
				targetColumnId,
				newPosition,
				cardToMove,
				true
			);

			if (!pushResult) throw new InsertFailedException(CARD_NOT_INSERTED);
		} catch {
			await this.cardRepository.abortTransaction();
			throw new InsertFailedException(CARD_NOT_MOVED);
		}
	}
}
