import { Test } from '@nestjs/testing';
import { Model } from 'mongoose';
import { BoardDocument } from '../../../src/modules/boards/schemas/board.schema';
import CreateCardServiceImpl from '../../../src/modules/cards/services/create.card.service';
import { mockedBoard } from '../../../src/libs/test-utils/mocks/board/board.mock';
import mockedUser from '../../../src/libs/test-utils/mocks/user/user.mock';
import { createMockedCardDto } from '../../../src/libs/test-utils/mocks/card/create.card.mock';
import {
  mongooseBoardModule,
  mongooseUserModule,
} from '../../../src/infrastructure/database/mongoose.module';
import {
  rootMongooseTestModule,
  closeInMongodConnection,
} from '../../../src/libs/test-utils/mongoose.test.module';
import { UserDocument } from '../../../src/modules/users/schemas/user.schema';
import { CreateCardDto } from '../../../src/modules/cards/dto/create.card.dto';

describe('CreateCardService', () => {
  let service: CreateCardServiceImpl;
  let boardModel: Model<BoardDocument>;
  let userModel: Model<UserDocument>;
  let board: BoardDocument;
  let user: UserDocument;
  let addCardDto: CreateCardDto;
  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        mongooseBoardModule,
        mongooseUserModule,
      ],
      providers: [CreateCardServiceImpl],
    }).compile();

    service = module.get<CreateCardServiceImpl>(CreateCardServiceImpl);
    boardModel = module.get<Model<BoardDocument>>('BoardModel');
    userModel = module.get<Model<UserDocument>>('UserModel');
    user = await userModel.create(mockedUser);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  beforeEach(async () => {
    board = await boardModel.create(mockedBoard(user.id));
    board.columns[0].cards.shift();
    addCardDto = createMockedCardDto(board.columns[0].id);
  });

  describe('when I create a card', () => {
    describe('and it was successfully created', () => {
      it('should return the board with the inserted card', async () => {
        const updatedBoard = await service.create(
          board.id,
          user.id,
          addCardDto.card,
          addCardDto.colIdToAdd,
        );
        expect(updatedBoard?.columns[0].cards[0].text).toEqual(
          addCardDto.card.text,
        );
        expect(updatedBoard?.columns[0].cards[0].items[0].text).toEqual(
          addCardDto.card.text,
        );
      });
    });
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });
});
