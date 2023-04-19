import { Inject, Injectable } from '@nestjs/common';
import { TeamDto } from 'src/modules/communication/dto/team.dto';
import * as Boards from 'src/modules/boards/types';
import { UpdateBoardServiceInterface } from '../interfaces/services/update.board.service.interface';
import { BoardRepositoryInterface } from '../repositories/board.repository.interface';

@Injectable()
export default class UpdateBoardService implements UpdateBoardServiceInterface {
	constructor(
		@Inject(Boards.TYPES.repositories.BoardRepository)
		private readonly boardRepository: BoardRepositoryInterface
	) {}

	updateChannelId(teams: TeamDto[]) {
		Promise.all(
			teams.map((team) => this.boardRepository.updatedChannelId(team.boardId, team.channelId))
		);
	}
}
