import { Test } from '@nestjs/testing';
import { LeanDocument, Model } from 'mongoose';
import { BoardDocument } from '../../../src/modules/boards/schemas/board.schema';
import { mockedBoard } from '../../../src/libs/test-utils/mocks/board/board.mock';
import GetBoardServiceImpl from '../../../src/modules/boards/services/get.board.service';
import {
  mongooseBoardModule,
  mongooseUserModule,
} from '../../../src/infrastructure/database/mongoose.module';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../../src/libs/test-utils/mongoose.test.module';
import { UserDocument } from '../../../src/modules/users/schemas/user.schema';
import mockedUser from '../../../src/libs/test-utils/mocks/user/user.mock';

describe('GetBoardService', () => {
  let service: GetBoardServiceImpl;
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
      providers: [GetBoardServiceImpl],
    }).compile();

    service = module.get<GetBoardServiceImpl>(GetBoardServiceImpl);
    boardModel = module.get<Model<BoardDocument>>('BoardModel');
    userModel = module.get<Model<UserDocument>>('UserModel');
    user = await userModel.create(mockedUser);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('when I try to get my boards', () => {
    describe('and the user has boards', () => {
      it('should return the boards', async () => {
        board = (await boardModel.create(mockedBoard(user.id))).toObject();
        const boards = await service.getAllBoards(user.id);
        expect(boards).toEqual([{ ...board }]);
      });
    });
  });

  describe('when I try to get a board', () => {
    describe('and the board exists', () => {
      describe('and the board is public', () => {
        it('should return the board', async () => {
          const boardFound = await service.getBoard(
            board._id.toString(),
            user.id,
          );
          expect(boardFound).toEqual(board);
        });
      });
      describe('and the board is not public', () => {
        beforeEach(async () => {
          board = (
            await boardModel.create({
              ...mockedBoard(user.id),
              isPublic: false,
            })
          ).toObject();
        });
        describe('but it was created by the userId', () => {
          it('should return the board', async () => {
            const boardFound = await service.getBoard(
              board._id.toString(),
              user.id,
            );
            expect(boardFound).toEqual(board);
          });
        });
        describe('and the board was not created by the userId', () => {
          it('should throw an exception', async () => {
            expect(await service.getBoard(board._id, '2')).toEqual(null);
          });
        });
      });
    });
  });

  describe('get board from repo', () => {
    describe('and the board is found', () => {
      it('should return the board', async () => {
        const boardFound = await service.getBoardFromRepo(board._id.toString());
        expect(boardFound).toEqual(board);
      });
    });
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });
});
