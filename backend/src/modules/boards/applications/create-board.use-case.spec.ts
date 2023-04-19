import { Test, TestingModule } from '@nestjs/testing';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { CreateBoardUserServiceInterface } from 'src/modules/boardUsers/interfaces/services/create.board.user.service.interface';
import faker from '@faker-js/faker';
import { BoardDtoFactory } from 'src/libs/test-utils/mocks/factories/dto/boardDto-factory.mock';
import { CreateBoardServiceInterface } from '../interfaces/services/create.board.service.interface';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import CreateBoardUseCaseDto from '../dto/useCase/create-board.use-case.dto';
import Board from '../entities/board.schema';
import { CreateBoardUseCase } from './create-board.use-case';
import { CREATE_BOARD_SERVICE } from 'src/modules/boards/constants';

describe('CreateBoardUseCase', () => {
	let useCase: UseCase<CreateBoardUseCaseDto, Board>;
	let createBoardServiceMock: DeepMocked<CreateBoardServiceInterface>;

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				CreateBoardUseCase,
				{
					provide: CREATE_BOARD_SERVICE,
					useValue: createMock<CreateBoardUserServiceInterface>()
				}
			]
		}).compile();

		useCase = module.get(CreateBoardUseCase);
		createBoardServiceMock = module.get(CREATE_BOARD_SERVICE);
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(useCase).toBeDefined();
	});

	describe('execute', () => {
		it('should be called with argument of type createBoardUseCaseDto', async () => {
			const boardData = BoardDtoFactory.create();
			const userId = faker.datatype.uuid();

			await useCase.execute({ userId, boardData });

			expect(createBoardServiceMock.create).toBeCalledWith(boardData, userId);
		});
	});
});
