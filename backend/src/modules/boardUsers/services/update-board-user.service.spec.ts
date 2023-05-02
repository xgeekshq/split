import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { BOARD_USER_REPOSITORY } from '../constants';
import { BoardUserRepositoryInterface } from '../interfaces/repositories/board-user.repository.interface';
import { UpdateBoardUserServiceInterface } from '../interfaces/services/update.board.user.service.interface';
import UpdateBoardUserService from './update.board.user.service';

describe('UpdateBoardUserService', () => {
	let boardUserService: UpdateBoardUserServiceInterface;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UpdateBoardUserService,
				{
					provide: BOARD_USER_REPOSITORY,
					useValue: createMock<BoardUserRepositoryInterface>()
				}
			]
		}).compile();

		boardUserService = module.get(UpdateBoardUserService);
	});

	beforeEach(() => {
		jest.restoreAllMocks();
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(boardUserService).toBeDefined();
	});
});
