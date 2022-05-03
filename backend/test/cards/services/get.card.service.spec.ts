import { Test } from '@nestjs/testing';
import { Model } from 'mongoose';
import { BoardDocument } from '../../../src/modules/boards/schemas/board.schema';
import {
  boardId,
  mockedBoard,
} from '../../../src/libs/test-utils/mocks/board/board.mock';
import GetCardServiceImpl from '../../../src/modules/cards/services/get.card.service';
import { cardId } from '../../../src/libs/test-utils/mocks/card/card.mock';
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

describe('GetCardService', () => {
  let service: GetCardServiceImpl;
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
      providers: [GetCardServiceImpl],
    }).compile();

    service = module.get<GetCardServiceImpl>(GetCardServiceImpl);
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

  describe('when I try to get a card', () => {
    describe('and it is found', () => {
      it('should return the card', async () => {
        const card = board.columns[0].cards[0];
        const cardFound = await service.getCardFromBoard(board.id, card.id);
        if (cardFound) expect(cardFound).toEqual(card.toObject());
      });
    });
    describe('and it is not found', () => {
      it('should return null', async () => {
        expect(await service.getCardFromBoard(boardId, cardId)).toEqual(null);
      });
    });
  });
  afterAll(async () => {
    await closeInMongodConnection();
  });
});
