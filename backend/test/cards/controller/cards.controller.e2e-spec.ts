import { INestApplication, ValidationPipe } from '@nestjs/common';
import { LeanDocument, Model } from 'mongoose';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { mockedBoard } from '../../../src/libs/test-utils/mocks/board/board.mock';
import * as authTypes from '../../../src/modules/auth/interfaces/types';
import JwtStrategy from '../../../src/modules/auth/strategy/jwt.strategy';
import {
  getTokenAuthService,
  validateUserAuthService,
} from '../../../src/modules/auth/auth.providers';
import {
  getUserService,
  updateUserService,
} from '../../../src/modules/users/users.providers';
import { BoardDocument } from '../../../src/modules/boards/schemas/board.schema';
import { UserDocument } from '../../../src/modules/users/schemas/user.schema';
import { GetTokenAuthService } from '../../../src/modules/auth/interfaces/services/get-token.auth.service.interface';
import AppConfigModule from '../../../src/infrastructure/config/config.module';
import { JwtRegister } from '../../../src/infrastructure/config/jwt.register';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../../src/libs/test-utils/mongoose.test.module';
import {
  mongooseBoardModule,
  mongooseUserModule,
} from '../../../src/infrastructure/database/mongoose.module';
import { mockedCard } from '../../../src/libs/test-utils/mocks/card/card.mock';
import {
  createCardApplication,
  createCardService,
  deleteCardApplication,
  deleteCardService,
  getCardService,
  mergeCardApplication,
  mergeCardService,
  unmergeCardApplication,
  unmergeCardService,
  updateCardApplication,
  updateCardService,
} from '../../../src/modules/cards/cards.providers';
import CardsController from '../../../src/modules/cards/controller/cards.controller';
import { getBoardService } from '../../../src/modules/boards/boards.providers';
import socketGateway from '../../../src/modules/socket/gateway/socket.gateway';
import mockedUser from '../../../src/libs/test-utils/mocks/user/user.mock';
import { CreateCardService } from '../../../src/modules/cards/interfaces/services/create.card.service.interface';
import { DeleteCardService } from '../../../src/modules/cards/interfaces/services/delete.card.service.interface';
import { UpdateCardService } from '../../../src/modules/cards/interfaces/services/update.card.service.interface';
import { TYPES } from '../../../src/modules/cards/interfaces/types';

describe('CardsController', () => {
  let app: INestApplication;
  let getTokenService: GetTokenAuthService;
  let createCardSrvice: CreateCardService;
  let updateCardSrvice: UpdateCardService;
  let deleteCardSrvice: DeleteCardService;
  let boardModel: Model<BoardDocument>;
  let userModel: Model<UserDocument>;
  let user: UserDocument;
  let board: LeanDocument<BoardDocument>;
  let createCardDto;
  let updateCardPositionDto;
  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        AppConfigModule,
        JwtRegister,
        rootMongooseTestModule(),
        mongooseBoardModule,
        mongooseUserModule,
      ],
      controllers: [CardsController],
      providers: [
        JwtStrategy,
        getTokenAuthService,
        createCardApplication,
        createCardService,
        validateUserAuthService,
        getUserService,
        updateCardApplication,
        updateCardService,
        getCardService,
        deleteCardService,
        deleteCardApplication,
        socketGateway,
        getBoardService,
        updateUserService,
        mergeCardApplication,
        mergeCardService,
        unmergeCardApplication,
        unmergeCardService,
      ],
    }).compile();

    app = module.createNestApplication();
    getTokenService = module.get(authTypes.TYPES.services.GetTokenAuthService);
    boardModel = module.get<Model<BoardDocument>>('BoardModel');
    userModel = module.get<Model<UserDocument>>('UserModel');
    createCardSrvice = module.get<CreateCardService>(
      TYPES.services.CreateCardService,
    );
    updateCardSrvice = module.get<UpdateCardService>(
      TYPES.services.UpdateCardService,
    );
    deleteCardSrvice = module.get<DeleteCardService>(
      TYPES.services.DeleteCardService,
    );
    user = await userModel.create(mockedUser);
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('should be defined', () => {
    expect(app).toBeDefined();
  });

  describe('when I test the controller', () => {
    let accessToken = '';
    let cardId: string;
    let itemId: string;
    beforeAll(() => {
      const token = getTokenService.getAccessToken(user.id);
      accessToken = token.token;
    });

    describe('when board is created', () => {
      beforeEach(async () => {
        board = (await boardModel.create(mockedBoard(user.id))).toObject();
        cardId = board.columns[0].cards[0]._id;
        itemId = board.columns[0].cards[0].items[0]._id;
        createCardDto = {
          card: { ...mockedCard },
          colIdToAdd: board.columns[1]._id,
          socketId: '1',
        };
        updateCardPositionDto = {
          targetColumnId: board.columns[2]._id,
          newPosition: 0,
          socketId: '1',
        };
      });

      describe('and I create a card', () => {
        describe('and it is correctly created', () => {
          it('should return the updated board', async () => {
            const res = await request(app.getHttpServer())
              .post(`/boards/${board._id}/card`)
              .set('Authorization', `Bearer ${accessToken}`)
              .send(createCardDto)
              .expect(201);
            expect(res.body.columns[1].cards).toHaveLength(1);
          });
        });
        describe('and it is not correctly inserted', () => {
          it('should return an exception', async () => {
            jest.spyOn(createCardSrvice, 'create').mockResolvedValueOnce(null);
            await request(app.getHttpServer())
              .post(`/boards/${board._id}/card`)
              .set('Authorization', `Bearer ${accessToken}`)
              .send(createCardDto)
              .expect(400);
          });
        });
      });

      describe('and I delete a card', () => {
        describe('and it is correctly deleted', () => {
          it('should return the board updated', async () => {
            const res = await request(app.getHttpServer())
              .delete(`/boards/${board._id}/card/${cardId}`)
              .set('Authorization', `Bearer ${accessToken}`)
              .send({ socketId: '1' })
              .expect(200);
            expect(res.body.columns[0].cards).toHaveLength(0);
          });
        });
        describe('and it is not correctly deleted', () => {
          it('should return an exception', async () => {
            jest.spyOn(deleteCardSrvice, 'delete').mockResolvedValueOnce(null);
            await request(app.getHttpServer())
              .delete(`/boards/${board._id}/card/${cardId}`)
              .set('Authorization', `Bearer ${accessToken}`)
              .send({ socketId: '1' })
              .expect(400);
          });
        });
      });
      describe('and I update a card', () => {
        describe('and it is correctly updated', () => {
          it('should return the board updated', async () => {
            const res = await request(app.getHttpServer())
              .put(`/boards/${board._id}/card/${cardId}/items/${itemId}`)
              .set('Authorization', `Bearer ${accessToken}`)
              .send({ text: 'CardUpdated', socketId: '1' })
              .expect(200);

            expect(res.body.columns[0].cards[0].text).toEqual('CardUpdated');
          });
        });
        describe('and it is not correctly updated', () => {
          it('should return an exception', async () => {
            jest
              .spyOn(updateCardSrvice, 'updateCardText')
              .mockResolvedValueOnce(null);
            await request(app.getHttpServer())
              .put(`/boards/${board._id}/card/${cardId}/items/${itemId}`)
              .set('Authorization', `Bearer ${accessToken}`)
              .send({ text: 'CardUpdated', socketId: '1' })
              .expect(400);
          });
        });
      });

      describe('and I update a card position', () => {
        describe('and it is correctly updated', () => {
          it('should return the board updated', async () => {
            const res = await request(app.getHttpServer())
              .put(`/boards/${board._id}/card/${cardId}/updateCardPosition`)
              .set('Authorization', `Bearer ${accessToken}`)
              .send(updateCardPositionDto)
              .expect(200);
            expect(res.body.columns[0].cards).toHaveLength(0);
            expect(res.body.columns[2].cards).toHaveLength(1);
          });
        });
        describe('and it is not correctly updated', () => {
          it('should return an exception', async () => {
            jest
              .spyOn(updateCardSrvice, 'updateCardPosition')
              .mockResolvedValueOnce(null);
            await request(app.getHttpServer())
              .put(`/boards/${board._id}/card/${cardId}/updateCardPosition`)
              .set('Authorization', `Bearer ${accessToken}`)
              .send(updateCardPositionDto)
              .expect(400);
          });
        });
      });
    });
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });
});
