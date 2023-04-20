import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { DeleteBoardServiceInterface } from '../interfaces/services/delete.board.service.interface';
import * as CommunicationTypes from 'src/modules/communication/interfaces/types';
import * as Schedules from 'src/modules/schedules/interfaces/types';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { BoardRepositoryInterface } from '../repositories/board.repository.interface';
import { BadRequestException } from '@nestjs/common';
import { deleteBoardService } from '../boards.providers';
import { BoardFactory } from 'src/libs/test-utils/mocks/factories/board-factory.mock';
import { DeleteBoardUserServiceInterface } from 'src/modules/boardUsers/interfaces/services/delete.board.user.service.interface';
import { DeleteSchedulesServiceInterface } from 'src/modules/schedules/interfaces/services/delete.schedules.service.interface';
import { ArchiveChannelServiceInterface } from 'src/modules/communication/interfaces/archive-channel.service.interface';
import { BOARD_REPOSITORY } from 'src/modules/boards/constants';
import { DELETE_BOARD_USER_SERVICE } from 'src/modules/boardUsers/constants';

const boards = BoardFactory.createMany(2, [{ slackEnable: true }, { slackEnable: true }]);
const board = BoardFactory.create({
	dividedBoards: BoardFactory.createMany(2),
	slackEnable: true
});
const deleteFailedResult = {
	acknowledged: false,
	deletedCount: 0
};
const deleteSuccessfulResult = {
	acknowledged: true,
	deletedCount: faker.datatype.number()
};
const boardIdsToDelete = boards.map((board) => board._id);

describe('DeleteBoardService', () => {
	let service: DeleteBoardServiceInterface;
	let boardRepositoryMock: DeepMocked<BoardRepositoryInterface>;
	let deleteBoardUserServiceMock: DeepMocked<DeleteBoardUserServiceInterface>;
	let deleteSchedulesServiceMock: DeepMocked<DeleteSchedulesServiceInterface>;
	let archiveChannelServiceMock: DeepMocked<ArchiveChannelServiceInterface>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				deleteBoardService,
				{
					provide: BOARD_REPOSITORY,
					useValue: createMock<BoardRepositoryInterface>()
				},
				{
					provide: DELETE_BOARD_USER_SERVICE,
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
		service = module.get(deleteBoardService.provide);
		boardRepositoryMock = module.get(BOARD_REPOSITORY);
		deleteBoardUserServiceMock = module.get(DELETE_BOARD_USER_SERVICE);
		deleteSchedulesServiceMock = module.get(Schedules.TYPES.services.DeleteSchedulesService);
		archiveChannelServiceMock = module.get(
			CommunicationTypes.TYPES.services.SlackArchiveChannelService
		);
	});

	beforeEach(() => {
		jest.clearAllMocks();
		jest.restoreAllMocks();

		//Mock returns
		boardRepositoryMock.getBoard.mockResolvedValue(board);

		boardRepositoryMock.getBoardsByBoardIdsList.mockResolvedValue(boards);

		deleteBoardUserServiceMock.deleteBoardUsersByBoardList.mockResolvedValue(
			deleteSuccessfulResult
		);
		deleteSchedulesServiceMock.deleteSchedulesByBoardList.mockResolvedValue(deleteSuccessfulResult);
		boardRepositoryMock.deleteBoardsByBoardList.mockResolvedValue(deleteSuccessfulResult);

		boardRepositoryMock.getAllBoardsByTeamId.mockResolvedValue(boards);
		boardRepositoryMock.getAllBoardsByTeamId.mockResolvedValue(boards);

		//Slack Enabled
		boardRepositoryMock.getBoardPopulated.mockResolvedValue(board);
		archiveChannelServiceMock.execute.mockResolvedValue(null);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('deleteBoardBoardUsersAndSchedules', () => {
		it('should return true if deleteBoardBoardUsersAndSchedules succeded', async () => {
			boardRepositoryMock.getBoardsByBoardIdsList.mockResolvedValue(boards);
			await expect(service.deleteBoardBoardUsersAndSchedules(boardIdsToDelete)).resolves.toBe(true);
		});
		it('should throw error when deleteBoardUserService.deleteDividedBoardUsers fails', async () => {
			deleteBoardUserServiceMock.deleteBoardUsersByBoardList.mockResolvedValue(deleteFailedResult);
			await expect(
				service.deleteBoardBoardUsersAndSchedules(boardIdsToDelete)
			).rejects.toThrowError(BadRequestException);
		});
		it('should throw error when deleteSheduleService.deleteSchedulesByBoardList fails', async () => {
			deleteSchedulesServiceMock.deleteSchedulesByBoardList.mockResolvedValue(deleteFailedResult);
			await expect(
				service.deleteBoardBoardUsersAndSchedules(boardIdsToDelete)
			).rejects.toThrowError(BadRequestException);
		});
		it('should throw error if boardRepository.deleteBoardsByBoardList fails', async () => {
			boardRepositoryMock.deleteBoardsByBoardList.mockResolvedValue(deleteFailedResult);
			await expect(
				service.deleteBoardBoardUsersAndSchedules(boardIdsToDelete)
			).rejects.toThrowError(BadRequestException);
		});
	});

	describe('deleteBoardsByTeamId', () => {
		it('should return true if board deleted ', async () => {
			await expect(service.deleteBoardsByTeamId('teamId')).resolves.toBe(true);
		});

		it('should throw error when deleteBoardUserService.deleteDividedBoardUsers fails', async () => {
			deleteBoardUserServiceMock.deleteBoardUsersByBoardList.mockResolvedValue(deleteFailedResult);

			await expect(service.deleteBoardsByTeamId('boardId')).rejects.toThrowError(
				BadRequestException
			);
		});

		it('should throw error when deleteSchedulesServiceMock.deleteSchedulesByBoardList fails', async () => {
			deleteSchedulesServiceMock.deleteSchedulesByBoardList.mockResolvedValue(deleteFailedResult);

			await expect(service.deleteBoardsByTeamId('boardId')).rejects.toThrowError(
				BadRequestException
			);
		});

		it('should throw error if boardRepository.deleteBoardsByBoardList fails', async () => {
			boardRepositoryMock.deleteBoardsByBoardList.mockResolvedValue(deleteFailedResult);

			await expect(service.deleteBoardsByTeamId('boardId')).rejects.toThrowError(
				BadRequestException
			);
		});
	});
});
