import { Inject, Injectable } from '@nestjs/common';
import { TeamDto } from 'src/modules/communication/dto/team.dto';
import { UpdateBoardServiceInterface } from '../interfaces/services/update.board.service.interface';
import { BoardRepositoryInterface } from '../repositories/board.repository.interface';
import { BOARD_REPOSITORY } from 'src/modules/boards/constants';

@Injectable()
export default class UpdateBoardService implements UpdateBoardServiceInterface {
	constructor(
		@Inject(BOARD_REPOSITORY)
		private readonly boardRepository: BoardRepositoryInterface
	) {}

	updateChannelId(teams: TeamDto[]) {
		Promise.all(
			teams.map((team) => this.boardRepository.updatedChannelId(team.boardId, team.channelId))
		);
	}
}
