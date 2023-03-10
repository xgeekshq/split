import { Test, TestingModule } from '@nestjs/testing';
import * as Boards from 'src/modules/boards/interfaces/types';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { UpdateBoardApplication } from '../applications/update.board.application';
import { BoardPhases } from 'src/libs/enum/board.phases';
import UpdateBoardServiceImpl from '../services/update.board.service';

describe('UpdateBoardApplication', () => {
	let updateBoardAppMock: UpdateBoardApplication;
	let updateBoardServiceMock: DeepMocked<UpdateBoardServiceImpl>;

	const boardPhaseDto = { boardId: '6405f9a04633b1668f71c068', phase: BoardPhases.ADDCARDS };

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UpdateBoardApplication,
				{
					provide: Boards.TYPES.services.UpdateBoardService,
					useValue: createMock<UpdateBoardServiceImpl>()
				}
			]
		}).compile();

		updateBoardAppMock = module.get<UpdateBoardApplication>(UpdateBoardApplication);
		updateBoardServiceMock = module.get(Boards.TYPES.services.UpdateBoardService);
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(updateBoardAppMock).toBeDefined();
	});

	describe('updateBoardPhase', () => {
		it('should be defined', () => {
			expect(updateBoardServiceMock.updatePhase).toBeDefined();
		});

		it('should recieve boardPhaseDto in updateBoardService and be called 1 time', async () => {
			await updateBoardAppMock.updatePhase(boardPhaseDto);
			expect(updateBoardServiceMock.updatePhase).toHaveBeenNthCalledWith(1, boardPhaseDto);
		});
	});
});
