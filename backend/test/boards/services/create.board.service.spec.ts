import { Test } from '@nestjs/testing';
import { Model } from 'mongoose';
import CreateBoardServiceImpl from '../../../src/modules/boards/services/create.board.service';
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
import mockedUser from '../../../src/libs/test-utils/mocks/user/user.mock';

describe('CreateBoardService', () => {
  let service: CreateBoardServiceImpl;
  let userModel: Model<UserDocument>;
  let user: UserDocument;
  let mockedBoardDto;
  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        mongooseBoardModule,
        mongooseUserModule,
      ],
      providers: [CreateBoardServiceImpl],
    }).compile();

    service = module.get<CreateBoardServiceImpl>(CreateBoardServiceImpl);
    userModel = module.get<Model<UserDocument>>('UserModel');
    user = await userModel.create(mockedUser);
    mockedBoardDto = mockedBoard(user.id);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('when I try to create a board', () => {
    describe('and the board is public', () => {
      it('should return the created board', async () => {
        const boardCreated = await service.create(mockedBoardDto, user.id);
        expect(boardCreated.title).toEqual(mockedBoardDto.title);
        expect(boardCreated.createdBy.toString()).toEqual(user.id);
      });
    });
    describe('and the board is not public', () => {
      it('should return the created board', async () => {
        const board = await service.create(
          {
            ...mockedBoardDto,
            password: '123',
            isPublic: false,
          },
          user.id,
        );
        expect(board.isPublic).toEqual(false);
        expect(board.password).toBeDefined();
      });
    });
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });
});
