import { Inject, Injectable } from '@nestjs/common';
import { TYPES } from '../../interfaces/types';
import { CardRepositoryInterface } from '../../repository/card.repository.interface';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import Board from 'src/modules/boards/entities/board.schema';
import { UpdateFailedException } from 'src/libs/exceptions/updateFailedBadRequestException';
import { UPDATE_FAILED } from 'src/libs/exceptions/messages';
import UpdateCardGroupTextUseCaseDto from '../../dto/useCase/update-card-group-text.use-case.dto';

@Injectable()
export class UpdateCardGroupTextUseCase implements UseCase<UpdateCardGroupTextUseCaseDto, Board> {
	constructor(
		@Inject(TYPES.repository.CardRepository)
		private readonly cardRepository: CardRepositoryInterface
	) {}

	async execute({ boardId, cardId, userId, text }: UpdateCardGroupTextUseCaseDto) {
		const board = await this.cardRepository.updateCardGroupText(boardId, cardId, userId, text);

		if (!board) throw new UpdateFailedException(UPDATE_FAILED);

		return board;
	}
}
