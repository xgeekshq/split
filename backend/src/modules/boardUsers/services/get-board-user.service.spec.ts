import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { BOARD_USER_REPOSITORY } from '../constants';
import { BoardUserRepositoryInterface } from '../interfaces/repositories/board-user.repository.interface';
import { GetBoardUserServiceInterface } from '../interfaces/services/get.board.user.service.interface';
import GetBoardUserService from './get.board.user.service';

describe('GetBoardUserService', () => {
	let boardUserService: GetBoardUserServiceInterface;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				GetBoardUserService,
				{
					provide: BOARD_USER_REPOSITORY,
					useValue: createMock<BoardUserRepositoryInterface>()
				}
			]
		}).compile();

		boardUserService = module.get(GetBoardUserService);
	});

	beforeEach(() => {
		jest.restoreAllMocks();
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(boardUserService).toBeDefined();
	});
});
