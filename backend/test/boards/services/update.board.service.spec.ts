import { Test } from '@nestjs/testing';
import { LeanDocument, Model } from 'mongoose';
import mockedUser from '../../../src/libs/test-utils/mocks/user/user.mock';
import { BoardDocument } from '../../../src/modules/boards/schemas/board.schema';
import { mockedBoard } from '../../../src/libs/test-utils/mocks/board/board.mock';
import UpdateBoardServiceImpl from '../../../src/modules/boards/services/update.board.service';
import { UserDocument } from '../../../src/modules/users/schemas/user.schema';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../../src/libs/test-utils/mongoose.test.module';
import {
  mongooseBoardModule,
  mongooseUserModule,
} from '../../../src/infrastructure/database/mongoose.module';

describe('DeleteBoardService', () => {
  let service: UpdateBoardServiceImpl;
  let boardModel: Model<BoardDocument>;
  let userModel: Model<UserDocument>;
  let board: LeanDocument<BoardDocument>;
  let user: UserDocument;
  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        mongooseBoardModule,
        mongooseUserModule,
      ],
      providers: [UpdateBoardServiceImpl],
    }).compile();

    service = module.get<UpdateBoardServiceImpl>(UpdateBoardServiceImpl);
    boardModel = module.get<Model<BoardDocument>>('BoardModel');
    userModel = module.get<Model<UserDocument>>('UserModel');
    user = await userModel.create(mockedUser);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  beforeEach(async () => {
    board = (await boardModel.create(mockedBoard(user.id))).toObject();
  });

  describe('when I try to update a board', () => {
    describe('and the board is correctly updated', () => {
      it('should return the updated board', async () => {
        const boardUpdated = await service.update(
          user.id,
          board._id.toString(),
          {
            ...board,
            title: 'Test board updated',
            socketId: '1',
          },
        );
        expect(boardUpdated).toEqual({
          ...board,
          title: 'Test board updated',
        });
      });
    });
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });
});
