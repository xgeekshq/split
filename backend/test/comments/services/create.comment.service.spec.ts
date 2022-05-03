import { Test } from '@nestjs/testing';
import { Model } from 'mongoose';
import { BoardDocument } from '../../../src/modules/boards/schemas/board.schema';
import { mockedBoard } from '../../../src/libs/test-utils/mocks/board/board.mock';
import mockedUser from '../../../src/libs/test-utils/mocks/user/user.mock';
import {
  mongooseBoardModule,
  mongooseUserModule,
} from '../../../src/infrastructure/database/mongoose.module';
import {
  rootMongooseTestModule,
  closeInMongodConnection,
} from '../../../src/libs/test-utils/mongoose.test.module';
import { UserDocument } from '../../../src/modules/users/schemas/user.schema';
import CreateCommentServiceImpl from '../../../src/modules/comments/services/create.comment.service';

describe('CreateCommentService', () => {
  let service: CreateCommentServiceImpl;
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
      providers: [CreateCommentServiceImpl],
    }).compile();

    service = module.get<CreateCommentServiceImpl>(CreateCommentServiceImpl);
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

  describe('when I create a comment', () => {
    describe('and it was successfully created', () => {
      it('should return the board with the inserted comment', async () => {
        const updatedBoard = await service.createCardItemComment(
          board._id,
          board.columns[0].cards[0]._id,
          board.columns[0].cards[0].items[0]._id,
          user._id,
          'NewComment',
        );
        expect(
          updatedBoard?.columns[0].cards[0].items[0].comments[0].text,
        ).toEqual('NewComment');
      });
    });
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });
});
