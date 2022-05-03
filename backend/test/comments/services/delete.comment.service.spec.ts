import { Test } from '@nestjs/testing';
import { Model } from 'mongoose';
import mockedUser from '../../../src/libs/test-utils/mocks/user/user.mock';
import { BoardDocument } from '../../../src/modules/boards/schemas/board.schema';
import { mockedBoard } from '../../../src/libs/test-utils/mocks/board/board.mock';
import {
  mongooseBoardModule,
  mongooseUserModule,
} from '../../../src/infrastructure/database/mongoose.module';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../../src/libs/test-utils/mongoose.test.module';
import { UserDocument } from '../../../src/modules/users/schemas/user.schema';
import DeleteCommentServiceImpl from '../../../src/modules/comments/services/delete.comment.service';

describe('DeleteCommentService', () => {
  let service: DeleteCommentServiceImpl;
  let boardModel: Model<BoardDocument>;
  let userModel: Model<UserDocument>;
  let board: BoardDocument;
  let user: UserDocument;
  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        mongooseBoardModule,
        mongooseUserModule,
      ],
      providers: [DeleteCommentServiceImpl],
    }).compile();

    service = module.get<DeleteCommentServiceImpl>(DeleteCommentServiceImpl);
    boardModel = module.get<Model<BoardDocument>>('BoardModel');
    userModel = module.get<Model<UserDocument>>('UserModel');
    user = await userModel.create(mockedUser);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  beforeEach(async () => {
    board = await boardModel.create(mockedBoard(user.id));
  });

  describe('when I try to delete a card', () => {
    describe('and the card is correctly deleted', () => {
      it('should return the updated board', async () => {
        const updatedBoard = await service.deleteCardItemComment(
          board.id,
          board.columns[0].cards[0].items[0].comments[0]._id,
          user.id,
        );
        expect(updatedBoard?.columns[0].cards[0].items[0].comments).toEqual([]);
      });
    });
  });
  afterAll(async () => {
    await closeInMongodConnection();
  });
});
