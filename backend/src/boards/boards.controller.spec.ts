import { Test } from '@nestjs/testing';
import BoardsController from './boards.controller';

describe('BoardsController', () => {
  let controller: BoardsController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [BoardsController],
    }).compile();

    controller = module.get<BoardsController>(BoardsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
