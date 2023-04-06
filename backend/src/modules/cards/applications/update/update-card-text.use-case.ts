import { Inject, Injectable } from '@nestjs/common';
import { TYPES } from '../../interfaces/types';
import { CardRepositoryInterface } from '../../repository/card.repository.interface';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import UpdateCardTextUseCaseDto from '../../dto/useCase/update-card-text.use-case.dto';
import Board from 'src/modules/boards/entities/board.schema';
import { UpdateFailedException } from 'src/libs/exceptions/updateFailedBadRequestException';
import { UPDATE_FAILED } from 'src/libs/exceptions/messages';

@Injectable()
export class UpdateCardTextUseCase implements UseCase<UpdateCardTextUseCaseDto, Board> {
	constructor(
		@Inject(TYPES.repository.CardRepository)
		private readonly cardRepository: CardRepositoryInterface
	) {}

	async execute({ boardId, cardId, cardItemId, userId, text }: UpdateCardTextUseCaseDto) {
		const board = await this.cardRepository.updateCardText(
			boardId,
			cardId,
			cardItemId,
			userId,
			text
		);

		if (!board) throw new UpdateFailedException(UPDATE_FAILED);

		return board;
	}
}
