import { Test, TestingModule } from '@nestjs/testing';
import BoardsController from 'src/modules/boards/controller/boards.controller';
import * as Boards from 'src/modules/boards/interfaces/types';
import SocketGateway from 'src/modules/socket/gateway/socket.gateway';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { CreateBoardApplication } from '../applications/create.board.application';
import { GetBoardApplication } from '../applications/get.board.application';
import { UpdateBoardApplication } from '../applications/update.board.application';
import { DeleteBoardApplication } from '../applications/delete.board.application';
import { GetBoardGuard } from 'src/libs/guards/getBoardPermissions.guard';
import { BoardUserGuard } from 'src/libs/guards/boardRoles.guard';
import { BoardPhases } from 'src/libs/enum/board.phases';

describe('BoardsController', () => {
	let controller: BoardsController;
	let updateBoardAppMock: DeepMocked<UpdateBoardApplication>;
	const boardPhaseDto = { boardId: '6405f9a04633b1668f71c068', phase: BoardPhases.ADDCARDS };

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [BoardsController],
			providers: [
				{
					provide: Boards.TYPES.applications.CreateBoardApplication,
					useValue: createMock<CreateBoardApplication>()
				},
				{
					provide: Boards.TYPES.applications.GetBoardApplication,
					useValue: createMock<GetBoardApplication>()
				},
				{
					provide: Boards.TYPES.applications.UpdateBoardApplication,
					useValue: createMock<UpdateBoardApplication>()
				},
				{
					provide: Boards.TYPES.applications.DeleteBoardApplication,
					useValue: createMock<DeleteBoardApplication>()
				},
				{
					provide: SocketGateway,
					useValue: createMock<SocketGateway>()
				}
			]
		})
			.overrideGuard(GetBoardGuard)
			.useValue({ canActivate: () => true })
			.overrideGuard(BoardUserGuard)
			.useValue({ canActivate: () => true })
			.compile();

		controller = module.get<BoardsController>(BoardsController);
		updateBoardAppMock = module.get(Boards.TYPES.applications.UpdateBoardApplication);
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	describe('updateBoardPhase', () => {
		it('should be defined', () => {
			expect(controller.updateBoardPhase).toBeDefined();
		});

		it('should call updateBoardApp', async () => {
			await controller.updateBoardPhase(boardPhaseDto);
			expect(updateBoardAppMock.updatePhase).toHaveBeenCalledTimes(1);
		});

		it('should recieve boardPhaseDto in updateBoardApp', async () => {
			await controller.updateBoardPhase(boardPhaseDto);
			expect(updateBoardAppMock.updatePhase).toBeCalledWith(boardPhaseDto);
		});
	});
});
