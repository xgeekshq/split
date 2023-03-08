import { Test, TestingModule } from '@nestjs/testing';
import BoardsController from 'src/modules/boards/controller/boards.controller';
import * as Boards from 'src/modules/boards/interfaces/types';
import SocketGateway from 'src/modules/socket/gateway/socket.gateway';
import { createMock } from '@golevelup/ts-jest';
import { CreateBoardApplication } from '../applications/create.board.application';
import { GetBoardApplication } from '../applications/get.board.application';
import { UpdateBoardApplication } from '../applications/update.board.application';
import { DeleteBoardApplication } from '../applications/delete.board.application';
import { GetBoardGuard } from 'src/libs/guards/getBoardPermissions.guard';
import { BoardUserGuard } from 'src/libs/guards/boardRoles.guard';

describe('BoardsController', () => {
	let controller: BoardsController;

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
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
