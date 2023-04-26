import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UPDATE_FAILED } from 'src/libs/exceptions/messages';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import Board from 'src/modules/boards/entities/board.schema';
import { COLUMN_REPOSITORY } from 'src/modules/columns/constants';
import { UpdateColumnUseCaseDto } from 'src/modules/columns/dto/useCase/update-column.use-case.dto';
import { ColumnRepositoryInterface } from 'src/modules/columns/repositories/column.repository.interface';

@Injectable()
export class UpdateColumnUseCase implements UseCase<UpdateColumnUseCaseDto, Board> {
	constructor(
		@Inject(COLUMN_REPOSITORY)
		private readonly columnRepository: ColumnRepositoryInterface
	) {}

	async execute({ boardId, columnData, completionHandler }: UpdateColumnUseCaseDto) {
		const boardWithColumnUpdated = await this.columnRepository.updateColumn(boardId, columnData);

		if (!boardWithColumnUpdated) {
			throw new BadRequestException(UPDATE_FAILED);
		}

		if (columnData.socketId) {
			completionHandler();
		}

		return boardWithColumnUpdated;
	}
}
