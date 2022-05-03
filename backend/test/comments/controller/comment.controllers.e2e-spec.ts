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
import socketGateway from '../../../src/modules/socket/gateway/socket.gateway';
import mockedUser from '../../../src/libs/test-utils/mocks/user/user.mock';
import DeleteCommentDto from '../../../src/modules/comments/dto/delete.comment.dto';
import UpdateCardCommentDto from '../../../src/modules/comments/dto/update.comment.dto';
import CommentsController from '../../../src/modules/comments/controller/comments.controller';
import {
  createCommentApplication,
  createCommentService,
  deleteCommentApplication,
  deleteCommentService,
  updateCommentApplication,
  updateCommentService,
} from '../../../src/modules/comments/comment.providers';
import CreateCommentDto from '../../../src/modules/comments/dto/create.comment.dto';
import { CreateCommentApplication } from '../../../src/modules/comments/interfaces/applications/create.comment.application.interface';
import { DeleteCommentApplication } from '../../../src/modules/comments/interfaces/applications/delete.comment.application.interface';
import { UpdateCommentApplication } from '../../../src/modules/comments/interfaces/applications/update.comment.application.interface';
import { TYPES } from '../../../src/modules/comments/interfaces/types';

describe('CommentController', () => {
  let app: INestApplication;
  let getTokenService: GetTokenAuthService;
  let boardModel: Model<BoardDocument>;
  let userModel: Model<UserDocument>;
  let user: UserDocument;
  let board: LeanDocument<BoardDocument>;
  let createCommentApp: CreateCommentApplication;
  let updateCommentApp: UpdateCommentApplication;
  let deleteCommentApp: DeleteCommentApplication;
  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        AppConfigModule,
        JwtRegister,
        rootMongooseTestModule(),
        mongooseBoardModule,
        mongooseUserModule,
      ],
      controllers: [CommentsController],
      providers: [
        JwtStrategy,
        getTokenAuthService,
        validateUserAuthService,
        getUserService,
        socketGateway,
        updateUserService,
        createCommentService,
        createCommentApplication,
        updateCommentService,
        updateCommentApplication,
        deleteCommentService,
        deleteCommentApplication,
      ],
    }).compile();

    app = module.createNestApplication();
    getTokenService = module.get(authTypes.TYPES.services.GetTokenAuthService);
    createCommentApp = module.get(TYPES.applications.CreateCommentApplication);
    updateCommentApp = module.get(TYPES.applications.UpdateCommentApplication);
    deleteCommentApp = module.get(TYPES.applications.DeleteCommentApplication);
    boardModel = module.get<Model<BoardDocument>>('BoardModel');
    userModel = module.get<Model<UserDocument>>('UserModel');
    user = await userModel.create(mockedUser);
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('should be defined', () => {
    expect(app).toBeDefined();
    expect(createCommentApp).toBeDefined();
    expect(updateCommentApp).toBeDefined();
    expect(deleteCommentApp).toBeDefined();
  });

  describe('when I test the controller', () => {
    let accessToken = '';
    let cardId = '';
    let itemId = '';
    let commentId = '';
    beforeAll(() => {
      const token = getTokenService.getAccessToken(user.id);
      accessToken = token.token;
    });

    describe('when board is created', () => {
      beforeEach(async () => {
        board = (await boardModel.create(mockedBoard(user.id))).toObject();
        cardId = board.columns[0].cards[0]._id;
        itemId = board.columns[0].cards[0].items[0]._id;
        commentId = board.columns[0].cards[0].items[0].comments[0]._id;
      });

      describe('and I create a comment', () => {
        const createCommentDto: CreateCommentDto = {
          text: 'NewComment',
          socketId: '1',
        };
        describe('and it is correctly inserted', () => {
          it('should return the updated board', async () => {
            const res = await request(app.getHttpServer())
              .post(
                `/boards/${board._id}/card/${cardId}/items/${itemId}/comment`,
              )
              .set('Authorization', `Bearer ${accessToken}`)
              .send(createCommentDto)
              .expect(201);
            expect(res.body.columns[0].cards[0].items[0].comments).toHaveLength(
              2,
            );
          });
        });
        describe('and it fails', () => {
          it('should return an exception', async () => {
            jest
              .spyOn(createCommentApp, 'createCardItemComment')
              .mockImplementationOnce(() => null as any);
            await request(app.getHttpServer())
              .post(
                `/boards/${board._id}/card/${cardId}/items/${itemId}/comment`,
              )
              .set('Authorization', `Bearer ${accessToken}`)
              .send(createCommentDto)
              .expect(400);
          });
        });
      });

      describe('and I delete a comment', () => {
        const deleteCommentDto: DeleteCommentDto = {
          socketId: '1',
        };
        describe('and it is correctly deleted', () => {
          it('should return the board updated', async () => {
            const res = await request(app.getHttpServer())
              .delete(
                `/boards/${board._id}/card/${cardId}/items/${itemId}/comment/${commentId}`,
              )
              .set('Authorization', `Bearer ${accessToken}`)
              .send(deleteCommentDto)
              .expect(200);
            expect(res.body.columns[0].cards[0].items[0].comments).toHaveLength(
              0,
            );
          });
        });
        describe('and it is not correctly deleted', () => {
          it('should return an expection', async () => {
            jest
              .spyOn(deleteCommentApp, 'deleteCardItemComment')
              .mockResolvedValue(null as any);

            await request(app.getHttpServer())
              .delete(
                `/boards/${board._id}/card/${cardId}/items/${itemId}/comment/${commentId}`,
              )
              .set('Authorization', `Bearer ${accessToken}`)
              .send(deleteCommentDto)
              .expect(400);
          });
        });
      });

      describe('and I update a comment', () => {
        const updateCardCommentDto: UpdateCardCommentDto = {
          text: 'UpdatedComment',
          socketId: '1',
        };
        describe('and the comment is correctly updated', () => {
          it('should return the board updated', async () => {
            const res = await request(app.getHttpServer())
              .put(
                `/boards/${board._id}/card/${cardId}/items/${itemId}/comment/${commentId}`,
              )
              .set('Authorization', `Bearer ${accessToken}`)
              .send(updateCardCommentDto)
              .expect(200);

            expect(
              res.body.columns[0].cards[0].items[0].comments[0].text,
            ).toEqual('UpdatedComment');
          });
        });
        describe('and the comment is not correctly updated', () => {
          it('should return an expection', async () => {
            jest
              .spyOn(updateCommentApp, 'updateCardItemComment')
              .mockReturnValueOnce(null as any);

            await request(app.getHttpServer())
              .put(
                `/boards/${board._id}/card/${cardId}/items/${itemId}/comment/${commentId}`,
              )
              .set('Authorization', `Bearer ${accessToken}`)
              .send(updateCardCommentDto)
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
