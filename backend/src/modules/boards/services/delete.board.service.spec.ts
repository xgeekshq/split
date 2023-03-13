import { Test, TestingModule } from '@nestjs/testing';
import { deleteBoardService } from '../boards.providers';
import { DeleteBoardServiceInterface } from '../interfaces/services/delete.board.service.interface';
import * as Boards from 'src/modules/boards/interfaces/types';
import * as CommunicationTypes from 'src/modules/communication/interfaces/types';
import * as Schedules from 'src/modules/schedules/interfaces/types';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { BoardRepositoryInterface } from '../repositories/board.repository.interface';
import { NotFoundException } from '@nestjs/common';

describe('DeleteBoardService', () => {
	let service: DeleteBoardServiceInterface;
	let boardRepositoryMock: DeepMocked<BoardRepositoryInterface>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				deleteBoardService,
				{
					provide: Boards.TYPES.repositories.BoardRepository,
					useValue: createMock<BoardRepositoryInterface>()
				},
				{
					provide: Boards.TYPES.repositories.BoardUserRepository,
					useValue: {}
				},
				{
					provide: Schedules.TYPES.services.DeleteSchedulesService,
					useValue: {}
				},
				{
					provide: CommunicationTypes.TYPES.services.SlackArchiveChannelService,
					useValue: {}
				}
			]
		}).compile();
		service = module.get<DeleteBoardServiceInterface>(deleteBoardService.provide);
		boardRepositoryMock = module.get(Boards.TYPES.repositories.BoardRepository);
	});

	beforeEach(() => {
		jest.restoreAllMocks();
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('delete', () => {
		it('should throw notFoundException when board not found ', async () => {
			boardRepositoryMock.getBoard.mockResolvedValue(null);

			expect(async () => await service.delete('boardId')).rejects.toThrow(NotFoundException);
		});
	});
});
