import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import SocketGateway from '../../src/modules/socket/gateway/socket.gateway';
import BoardsController from '../../src/modules/boards/controller/boards.controller';
import {
  createBoardApplication,
  createBoardService,
  deleteBoardApplication,
  deleteBoardService,
  getBoardApplication,
  getBoardService,
  updateBoardApplication,
  updateBoardService,
} from '../../src/modules/boards/boards.providers';

describe('BoardsController', () => {
  let controller: BoardsController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [BoardsController],
      providers: [
        SocketGateway,
        createBoardApplication,
        createBoardService,
        getBoardApplication,
        getBoardService,
        updateBoardApplication,
        updateBoardService,
        deleteBoardApplication,
        deleteBoardService,
        {
          provide: getModelToken('User'),
          useValue: {},
        },
        {
          provide: getModelToken('Board'),
          useValue: {},
        },
        {
          provide: getModelToken('BoardUser'),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<BoardsController>(BoardsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
