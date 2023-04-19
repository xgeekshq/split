import { Test, TestingModule } from '@nestjs/testing';
import { boardRepository } from '../boards.providers';
import { UpdateBoardServiceInterface } from '../interfaces/services/update.board.service.interface';
import { BoardRepositoryInterface } from '../repositories/board.repository.interface';
import { TeamCommunicationDtoFactory } from 'src/libs/test-utils/mocks/factories/dto/teamDto-factory';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import * as Boards from 'src/modules/boards/types';
import UpdateBoardService from './update.board.service';
import Board from '../entities/board.schema';
import { BoardFactory } from 'src/libs/test-utils/mocks/factories/board-factory.mock';
import faker from '@faker-js/faker';

describe('UpdateBoardService', () => {
	let boardService: UpdateBoardServiceInterface;
	let boardRepositoryMock: DeepMocked<BoardRepositoryInterface>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UpdateBoardService,

				{
					provide: boardRepository.provide,
					useValue: createMock<BoardRepositoryInterface>()
				}
			]
		}).compile();

		boardService = module.get(UpdateBoardService);
		boardRepositoryMock = module.get(Boards.TYPES.repositories.BoardRepository);
	});

	beforeEach(() => {
		jest.restoreAllMocks();
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(boardService).toBeDefined();
	});

	describe('updateChannelId', () => {
		it('should call the boardRepository.updatedChannelId', async () => {
			const teamsDto = TeamCommunicationDtoFactory.createMany(2);
			const userId = faker.datatype.uuid();
			const subBoards = BoardFactory.createMany(2, [
				{ isSubBoard: true, boardNumber: 1, submitedByUser: userId, submitedAt: new Date() },
				{ isSubBoard: true, boardNumber: 2 }
			]);
			const splitBoard: Board = BoardFactory.create({
				isSubBoard: false,
				dividedBoards: subBoards
			});

			boardRepositoryMock.updatedChannelId.mockResolvedValue(splitBoard);
			boardService.updateChannelId(teamsDto);

			expect(boardRepositoryMock.updatedChannelId).toBeCalledTimes(teamsDto.length);
		});
	});
});
