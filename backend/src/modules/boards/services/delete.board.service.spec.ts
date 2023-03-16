import { Test, TestingModule } from '@nestjs/testing';
import { DeleteBoardServiceInterface } from '../interfaces/services/delete.board.service.interface';
import * as Boards from 'src/modules/boards/interfaces/types';
import * as CommunicationTypes from 'src/modules/communication/interfaces/types';
import * as Schedules from 'src/modules/schedules/interfaces/types';
import * as BoardUsers from 'src/modules/boardusers/interfaces/types';
import { createMock } from '@golevelup/ts-jest';
import { BoardRepositoryInterface } from '../repositories/board.repository.interface';
import { deleteBoardService } from '../boards.providers';
import { DeleteBoardUserServiceInterface } from 'src/modules/boardusers/interfaces/services/delete.board.user.service.interface';
import { DeleteSchedulesServiceInterface } from 'src/modules/schedules/interfaces/services/delete.schedules.service.interface';
import { ArchiveChannelServiceInterface } from 'src/modules/communication/interfaces/archive-channel.service.interface';

describe('DeleteBoardService', () => {
	let service: DeleteBoardServiceInterface;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				deleteBoardService,
				{
					provide: Boards.TYPES.repositories.BoardRepository,
					useValue: createMock<BoardRepositoryInterface>()
				},
				{
					provide: BoardUsers.TYPES.services.DeleteBoardUserService,
					useValue: createMock<DeleteBoardUserServiceInterface>()
				},
				{
					provide: Schedules.TYPES.services.DeleteSchedulesService,
					useValue: createMock<DeleteSchedulesServiceInterface>()
				},
				{
					provide: CommunicationTypes.TYPES.services.SlackArchiveChannelService,
					useValue: createMock<ArchiveChannelServiceInterface>()
				}
			]
		}).compile();
		service = module.get<DeleteBoardServiceInterface>(deleteBoardService.provide);
	});

	beforeEach(() => {
		jest.restoreAllMocks();
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
