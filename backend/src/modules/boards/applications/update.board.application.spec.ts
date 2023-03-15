import { Test, TestingModule } from '@nestjs/testing';
import * as Boards from 'src/modules/boards/interfaces/types';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { BoardPhases } from 'src/libs/enum/board.phases';
import { UpdateBoardServiceInterface } from '../interfaces/services/update.board.service.interface';
import { updateBoardApplication } from '../boards.providers';
import { UpdateBoardApplicationInterface } from '../interfaces/applications/update.board.application.interface';

describe('UpdateBoardApplication', () => {
	let updateBoardApp: UpdateBoardApplicationInterface;
	let updateBoardServiceMock: DeepMocked<UpdateBoardServiceInterface>;

	const boardPhaseDto = { boardId: '6405f9a04633b1668f71c068', phase: BoardPhases.ADDCARDS };

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				updateBoardApplication,
				{
					provide: Boards.TYPES.services.UpdateBoardService,
					useValue: createMock<UpdateBoardServiceInterface>()
				}
			]
		}).compile();

		updateBoardApp = module.get<UpdateBoardApplicationInterface>(
			Boards.TYPES.applications.UpdateBoardApplication
		);
		updateBoardServiceMock = module.get(Boards.TYPES.services.UpdateBoardService);
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(updateBoardApp).toBeDefined();
	});

	describe('updateBoardPhase', () => {
		it('should recieve boardPhaseDto in updateBoardService and be called once', async () => {
			await updateBoardApp.updatePhase(boardPhaseDto);
			expect(updateBoardServiceMock.updatePhase).toHaveBeenNthCalledWith(1, boardPhaseDto);
		});
	});
});
