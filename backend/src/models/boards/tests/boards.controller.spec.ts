import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import SocketGateway from '../../../socket/socket.gateway';
import UsersService from '../../users/users.service';
import BoardsController from '../boards.controller';
import BoardsService from '../boards.service';

describe('BoardsController', () => {
  let controller: BoardsController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [BoardsController],
      providers: [
        BoardsService,
        UsersService,
        SocketGateway,
        {
          provide: getModelToken('User'),
          useValue: {},
        },
        {
          provide: getModelToken('Board'),
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
