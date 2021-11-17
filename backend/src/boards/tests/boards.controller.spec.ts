import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import UserEntity from '../../users/entity/user.entity';
import { UsersService } from '../../users/users.service';
import { BoardsController } from '../boards.controller';
import { BoardsService } from '../boards.service';
import BoardEntity from '../entity/board.entity';

describe('BoardsController', () => {
  let controller: BoardsController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [BoardsController],
      providers: [
        BoardsService,
        UsersService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {},
        },
        {
          provide: getRepositoryToken(BoardEntity),
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
