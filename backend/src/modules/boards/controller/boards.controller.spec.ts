import { Test, TestingModule } from '@nestjs/testing';
import BoardsController from 'src/modules/boards/controller/boards.controller';
import * as Boards from 'src/modules/boards/interfaces/types';
import SocketGateway from 'src/modules/socket/gateway/socket.gateway';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { GetBoardGuard } from 'src/libs/guards/getBoardPermissions.guard';
import { BoardUserGuard } from 'src/libs/guards/boardRoles.guard';
import { BoardPhases } from 'src/libs/enum/board.phases';
import { UpdateBoardApplicationInterface } from '../interfaces/applications/update.board.application.interface';
import { UseCase } from 'src/libs/interfaces/use-case.interface';
import Board from '../entities/board.schema';
import { DuplicateBoardDto } from '../applications/duplicate-board.use-case';
import CreateBoardUseCaseDto from '../dto/useCase/create-board.use-case.dto';
import GetBoardsForDashboardDto from '../presenter/boards-paginated.presenter';
import GetAllBoardsUseCaseDto from '../dto/useCase/get-all-boards.use-case.dto';
import BoardsPaginatedPresenter from '../presenter/boards-paginated.presenter';
import GetBoardUseCaseDto from '../dto/useCase/get-board.use-case.dto';
import BoardUseCasePresenter from '../presenter/board.use-case.presenter';
import GetBoardsUseCaseDto from '../dto/useCase/get-boards.use-case.dto';
import { GetBoardServiceInterface } from '../interfaces/services/get.board.service.interface';
import { UpdateBoardDto } from '../dto/update-board.dto';

describe('BoardsController', () => {
	let controller: BoardsController;
	let updateBoardAppMock: DeepMocked<UpdateBoardApplicationInterface>;
	const boardPhaseDto = { boardId: '6405f9a04633b1668f71c068', phase: BoardPhases.ADDCARDS };

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [BoardsController],
			providers: [
				{
					provide: Boards.TYPES.applications.CreateBoardUseCase,
					useValue: createMock<UseCase<CreateBoardUseCaseDto, Board>>()
				},
				{
					provide: Boards.TYPES.applications.GetBoardsForDashboardUseCase,
					useValue: createMock<UseCase<GetBoardsForDashboardDto, BoardsPaginatedPresenter>>()
				},
				{
					provide: Boards.TYPES.applications.DuplicateBoardUseCase,
					useValue: createMock<UseCase<DuplicateBoardDto, Board>>()
				},
				{
					provide: Boards.TYPES.applications.GetAllBoardsUseCase,
					useValue: createMock<UseCase<GetAllBoardsUseCaseDto, BoardsPaginatedPresenter>>()
				},
				{
					provide: Boards.TYPES.applications.GetPersonalBoardsUseCase,
					useValue: createMock<UseCase<GetBoardsUseCaseDto, BoardsPaginatedPresenter>>()
				},
				{
					provide: Boards.TYPES.applications.GetBoardUseCase,
					useValue: createMock<UseCase<GetBoardUseCaseDto, BoardUseCasePresenter>>()
				},
				{
					provide: Boards.TYPES.applications.DeleteBoardUseCase,
					useValue: createMock<UseCase<string, boolean>>()
				},
				{
					provide: Boards.TYPES.applications.GetPersonalBoardsUseCase,
					useValue: createMock<UseCase<GetBoardsUseCaseDto, BoardsPaginatedPresenter>>()
				},
				{
					provide: Boards.TYPES.applications.GetBoardUseCase,
					useValue: createMock<UseCase<GetBoardUseCaseDto, BoardUseCasePresenter>>()
				},
				{
					provide: Boards.TYPES.applications.UpdateBoardUseCase,
					useValue: createMock<UseCase<UpdateBoardDto, Board>>()
				},
				{
					provide: Boards.TYPES.services.GetBoardService,
					useValue: createMock<GetBoardServiceInterface>()
				},
				{
					provide: Boards.TYPES.applications.UpdateBoardApplication,
					useValue: createMock<UpdateBoardApplicationInterface>()
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

		it('should recieve boardPhaseDto in updateBoardApp and be called once', async () => {
			await controller.updateBoardPhase(boardPhaseDto);
			expect(updateBoardAppMock.updatePhase).toHaveBeenNthCalledWith(1, boardPhaseDto);
		});
	});
});
