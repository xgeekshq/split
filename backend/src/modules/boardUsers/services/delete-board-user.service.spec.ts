import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { BOARD_USER_REPOSITORY } from '../constants';
import { BoardUserRepositoryInterface } from '../interfaces/repositories/board-user.repository.interface';
import { DeleteBoardUserServiceInterface } from '../interfaces/services/delete.board.user.service.interface';
import DeleteBoardUserService from './delete.board.user.service';

describe('DeleteBoardUserService', () => {
	let boardUserService: DeleteBoardUserServiceInterface;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				DeleteBoardUserService,
				{
					provide: BOARD_USER_REPOSITORY,
					useValue: createMock<BoardUserRepositoryInterface>()
				}
			]
		}).compile();

		boardUserService = module.get(DeleteBoardUserService);
	});

	beforeEach(() => {
		jest.restoreAllMocks();
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(boardUserService).toBeDefined();
	});
});
