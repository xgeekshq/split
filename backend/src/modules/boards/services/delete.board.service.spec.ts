import { Test, TestingModule } from '@nestjs/testing';
import { DeleteBoardServiceInterface } from '../interfaces/services/delete.board.service.interface';
import * as Boards from 'src/modules/boards/interfaces/types';
import * as CommunicationTypes from 'src/modules/communication/interfaces/types';
import * as Schedules from 'src/modules/schedules/interfaces/types';
import * as BoardUsers from 'src/modules/boardusers/interfaces/types';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { BoardRepositoryInterface } from '../repositories/board.repository.interface';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { deleteBoardService } from '../boards.providers';
import { BoardFactory } from 'src/libs/test-utils/mocks/factories/board-factory.mock';
import { DeleteBoardUserServiceInterface } from 'src/modules/boardusers/interfaces/services/delete.board.user.service.interface';
import { DeleteSchedulesServiceInterface } from 'src/modules/schedules/interfaces/services/delete.schedules.service.interface';
import { ArchiveChannelServiceInterface } from 'src/modules/communication/interfaces/archive-channel.service.interface';

describe('DeleteBoardService', () => {
	let service: DeleteBoardServiceInterface;
	let boardRepositoryMock: DeepMocked<BoardRepositoryInterface>;
	let deleteBoardUserServiceMock: DeepMocked<DeleteBoardUserServiceInterface>;
	let deleteSchedulesServiceMock: DeepMocked<DeleteSchedulesServiceInterface>;
	let achiveChannelServiceMock: DeepMocked<ArchiveChannelServiceInterface>;

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
		boardRepositoryMock = module.get(Boards.TYPES.repositories.BoardRepository);
		deleteBoardUserServiceMock = module.get(BoardUsers.TYPES.services.DeleteBoardUserService);
		deleteSchedulesServiceMock = module.get(Schedules.TYPES.services.DeleteSchedulesService);
		achiveChannelServiceMock = module.get(
			CommunicationTypes.TYPES.services.SlackArchiveChannelService
		);
	});

	beforeEach(() => {
		jest.restoreAllMocks();
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('delete', () => {
		it('should return true if deleteBoardBoardUsersAndSchedules succeded', async () => {
			const board = BoardFactory.create({
				dividedBoards: BoardFactory.createMany(2),
				slackEnable: true
			});
			boardRepositoryMock.getBoard.mockResolvedValue(board);
			boardRepositoryMock.deleteBoard.mockResolvedValue(board);

			deleteSchedulesServiceMock.deleteScheduleByBoardId.mockResolvedValue(null);
			await boardRepositoryMock.deleteManySubBoards.mockResolvedValue(2);
			await deleteBoardUserServiceMock.deleteDividedBoardUsers.mockResolvedValue(2);
			await deleteBoardUserServiceMock.deleteSimpleBoardUsers.mockResolvedValue(2);

			//Slack Enabled
			await boardRepositoryMock.getBoardPopulated.mockResolvedValue(board);
			await achiveChannelServiceMock.execute.mockResolvedValue(null);

			await expect(service.delete('boardId')).resolves.toBe(true);
		});

		it('should throw notFoundException when board not found ', async () => {
			boardRepositoryMock.getBoard.mockResolvedValue(null);

			expect(async () => await service.delete('boardId')).rejects.toThrow(NotFoundException);
		});

		it('should throw error when deleteBoardBoardUsersAndSchedules fails', async () => {
			const board = BoardFactory.create({ dividedBoards: BoardFactory.createMany(2) });
			boardRepositoryMock.getBoard.mockResolvedValue(board);
			boardRepositoryMock.deleteBoard.mockResolvedValue(board);
			deleteSchedulesServiceMock.deleteScheduleByBoardId.mockResolvedValue(null);
			await boardRepositoryMock.deleteManySubBoards.mockResolvedValue(1);
			await deleteBoardUserServiceMock.deleteDividedBoardUsers.mockResolvedValue(2);

			await expect(service.delete('boardId')).rejects.toThrowError(BadRequestException);
		});
	});
});
