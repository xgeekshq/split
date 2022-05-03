import { Test } from '@nestjs/testing';
import { Model } from 'mongoose';
import mockedUser from '../../../src/libs/test-utils/mocks/user/user.mock';
import { BoardDocument } from '../../../src/modules/boards/schemas/board.schema';
import { mockedBoard } from '../../../src/libs/test-utils/mocks/board/board.mock';
import DeleteBoardServiceImpl from '../../../src/modules/boards/services/delete.board.service';
import { deleteBoardResponseWithoutSuccess } from '../../../src/libs/test-utils/mocks/board/delete.board.mock';
import {
  mongooseBoardModule,
  mongooseUserModule,
} from '../../../src/infrastructure/database/mongoose.module';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../../src/libs/test-utils/mongoose.test.module';
import { UserDocument } from '../../../src/modules/users/schemas/user.schema';

describe('DeleteBoardService', () => {
  let service: DeleteBoardServiceImpl;
  let userModel: Model<UserDocument>;
  let boardModel: Model<BoardDocument>;
  let board: BoardDocument;
  let user: UserDocument;
  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        mongooseBoardModule,
        mongooseUserModule,
      ],
      providers: [DeleteBoardServiceImpl],
    }).compile();

    service = module.get<DeleteBoardServiceImpl>(DeleteBoardServiceImpl);
    boardModel = module.get<Model<BoardDocument>>('BoardModel');
    userModel = module.get<Model<UserDocument>>('UserModel');
    user = await userModel.create(mockedUser);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('when I try to delete a board', () => {
    describe('and the board is correctly deleted', () => {
      it('should return the ok status', async () => {
        board = await boardModel.create(mockedBoard(user.id));
        expect(await service.delete(board.id, user.id)).toEqual(true);
      });
    });
    describe('and the board is not deleted', () => {
      it('should throw an exception', async () => {
        jest
          .spyOn(boardModel, 'deleteOne')
          .mockReturnValueOnce(deleteBoardResponseWithoutSuccess as any);
        expect(await service.delete('1', '1')).toEqual(false);
      });
    });
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });
});
