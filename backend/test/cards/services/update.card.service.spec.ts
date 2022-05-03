import { Test } from '@nestjs/testing';
import { Model } from 'mongoose';
import mockedUser from '../../../src/libs/test-utils/mocks/user/user.mock';
import { BoardDocument } from '../../../src/modules/boards/schemas/board.schema';
import { mockedBoard } from '../../../src/libs/test-utils/mocks/board/board.mock';
import { getCardService } from '../../../src/modules/cards/cards.providers';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../../src/libs/test-utils/mongoose.test.module';
import {
  mongooseBoardModule,
  mongooseUserModule,
} from '../../../src/infrastructure/database/mongoose.module';
import { UserDocument } from '../../../src/modules/users/schemas/user.schema';
import UpdateCardServiceImpl from '../../../src/modules/cards/services/update.card.service';
import { getBoardService } from '../../../src/modules/boards/boards.providers';
import { cardId } from '../../../src/libs/test-utils/mocks/card/card.mock';
import { columnId } from '../../../src/libs/test-utils/mocks/column/column.mock';

describe('UpdateCardService', () => {
  let service: UpdateCardServiceImpl;
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
      providers: [UpdateCardServiceImpl, getCardService, getBoardService],
    }).compile();

    service = module.get<UpdateCardServiceImpl>(UpdateCardServiceImpl);
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

  describe('when I try to update a card', () => {
    describe('and the board is correctly updated', () => {
      it('should return the updated board', async () => {
        const updatedBoard = await service.updateCardText(
          board.id,
          board.columns[0].cards[0].id,
          board.columns[0].cards[0].items[0].id,
          user.id,
          'Card1Updated',
        );

        expect(updatedBoard?.columns[0].cards[0].text).toEqual('Card1Updated');
        expect(updatedBoard?.columns[0].cards[0].items[0].text).toEqual(
          'Card1Updated',
        );
      });
    });
  });

  describe('when I try to update the card position', () => {
    describe('and the board is correctly updated', () => {
      it('should return the update board', async () => {
        const card = board.columns[0].cards[0];
        const updatedBoard = await service.updateCardPosition(
          board.id,
          board.columns[0].cards[0].id,
          board.columns[1].id,
          0,
        );
        expect(updatedBoard?.columns[1].cards[0]).toEqual(card.toObject());
      });
    });
    describe('and the board is not correctly updated', () => {
      describe('and the card to move is not found', () => {
        it('should return null', async () => {
          expect(
            await service.updateCardPosition(
              board.id,
              cardId,
              board.columns[1].id,
              0,
            ),
          ).toEqual(null);
        });
      });
      describe('and the pull fail', () => {
        it('should return null', async () => {
          jest.spyOn(boardModel, 'updateOne').mockImplementationOnce(
            () =>
              ({
                lean: jest.fn().mockImplementationOnce(() => ({
                  session: jest
                    .fn()
                    .mockReturnValueOnce({ modifiedCount: 0 } as any),
                })),
              } as any),
          );
          expect(
            await service.updateCardPosition(
              board.id,
              cardId,
              board.columns[1].id,
              0,
            ),
          ).toEqual(null);
        });
      });
      describe('and the push fail', () => {
        it('should return null', async () => {
          expect(
            await service.updateCardPosition(
              board.id,
              board.columns[0].cards[0].id,
              columnId,
              0,
            ),
          ).toEqual(null);
        });
      });
    });
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });
});
