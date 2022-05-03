import { INestApplication, ValidationPipe } from '@nestjs/common';

import { LeanDocument, Model } from 'mongoose';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import BoardsController from '../../../src/modules/boards/controller/boards.controller';
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
  createBoardApplication,
  createBoardService,
  deleteBoardApplication,
  deleteBoardService,
  getBoardApplication,
  getBoardService,
  updateBoardApplication,
  updateBoardService,
} from '../../../src/modules/boards/boards.providers';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../../src/libs/test-utils/mongoose.test.module';
import {
  mongooseBoardModule,
  mongooseUserModule,
} from '../../../src/infrastructure/database/mongoose.module';
import mockedUser from '../../../src/libs/test-utils/mocks/user/user.mock';
import { TYPES } from '../../../src/modules/boards/interfaces/types';
import { CreateBoardApplication } from '../../../src/modules/boards/interfaces/applications/create.board.application.interface';
import { UpdateBoardApplication } from '../../../src/modules/boards/interfaces/applications/update.board.application.interface';
import { GetBoardApplication } from '../../../src/modules/boards/interfaces/applications/get.board.application.interface';
import { DeleteBoardApplication } from '../../../src/modules/boards/interfaces/applications/delete.board.application.interface';
import { ValidateUserAuthService } from '../../../src/modules/auth/interfaces/services/validate-user.auth.service.interface';

describe('BoardsController', () => {
  let app: INestApplication;
  let getTokenService: GetTokenAuthService;
  let boardModel: Model<BoardDocument>;
  let userModel: Model<UserDocument>;
  let createBoardApp: CreateBoardApplication;
  let updateBoardApp: UpdateBoardApplication;
  let getBoardApp: GetBoardApplication;
  let deleteBoardApp: DeleteBoardApplication;
  let validateAuthUserService: ValidateUserAuthService;
  let user: UserDocument;
  let board: LeanDocument<BoardDocument>;
  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        AppConfigModule,
        JwtRegister,
        rootMongooseTestModule(),
        mongooseBoardModule,
        mongooseUserModule,
      ],
      controllers: [BoardsController],
      providers: [
        JwtStrategy,
        updateUserService,
        getTokenAuthService,
        createBoardService,
        createBoardApplication,
        validateUserAuthService,
        updateBoardService,
        updateBoardApplication,
        getBoardApplication,
        getBoardService,
        deleteBoardApplication,
        deleteBoardService,
        getUserService,
      ],
    }).compile();

    app = module.createNestApplication();
    getTokenService = module.get(authTypes.TYPES.services.GetTokenAuthService);
    validateAuthUserService = module.get(
      authTypes.TYPES.services.ValidateAuthService,
    );
    createBoardApp = module.get(TYPES.applications.CreateBoardApplication);
    getBoardApp = module.get(TYPES.applications.GetBoardApplication);
    updateBoardApp = module.get(TYPES.applications.UpdateBoardApplication);
    deleteBoardApp = module.get(TYPES.applications.DeleteBoardApplication);
    boardModel = module.get<Model<BoardDocument>>('BoardModel');
    userModel = module.get<Model<UserDocument>>('UserModel');
    user = await userModel.create(mockedUser);
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('should be defined', () => {
    expect(app).toBeDefined();
  });

  describe('when I test the controller', () => {
    let accessToken = '';
    beforeAll(() => {
      const token = getTokenService.getAccessToken(user.id);
      accessToken = token.token;
    });

    describe('when I create a board', () => {
      describe('and it is correctly created', () => {
        it('should return a board', () => {
          return request(app.getHttpServer())
            .post('/boards')
            .set('Authorization', `Bearer ${accessToken}`)
            .send(mockedBoard(user.id))
            .expect(201);
        });
      });
      describe('and it is not correctly created', () => {
        it('should return an exception', async () => {
          jest.spyOn(createBoardApp, 'create').mockReturnValueOnce(null as any);
          await request(app.getHttpServer())
            .post('/boards')
            .set('Authorization', `Bearer ${accessToken}`)
            .send(mockedBoard(user.id))
            .expect(400);
        });
      });
    });

    describe('when board is created', () => {
      beforeEach(async () => {
        board = (await boardModel.create(mockedBoard(user.id))).toObject();
      });

      describe('and I update a board', () => {
        describe('and it is correctly updated', () => {
          it('should return the updated board', async () => {
            const res = await request(app.getHttpServer())
              .put(`/boards/${board._id}`)
              .set('Authorization', `Bearer ${accessToken}`)
              .send({ ...board, title: 'Updated board' })
              .expect(200);
            expect(res.body.title).toEqual('Updated board');
          });
        });
        describe('and it is not correctly updated', () => {
          it('should return an exception', () => {
            jest
              .spyOn(updateBoardApp, 'update')
              .mockReturnValueOnce(null as any);
            return request(app.getHttpServer())
              .put(`/boards/${board._id}`)
              .set('Authorization', `Bearer ${accessToken}`)
              .send({ ...board, title: 'Updated board' })
              .expect(400);
          });
        });
      });

      describe('and accessToken is invalid', () => {
        it('should return an exception', () => {
          jest
            .spyOn(validateAuthUserService, 'validateUserById')
            .mockReturnValueOnce(null as any);
          return request(app.getHttpServer())
            .put(`/boards/${board._id}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({ ...board, title: 'Updated board' })
            .expect(401);
        });
      });

      describe('and I delete a board', () => {
        describe('and it is correctly deleted', () => {
          it('should return true', () => {
            return request(app.getHttpServer())
              .delete(`/boards/${board._id}`)
              .set('Authorization', `Bearer ${accessToken}`)
              .expect(200)
              .expect('true');
          });
        });
        describe('and it is correctly deleted', () => {
          it('should return a exception', () => {
            jest
              .spyOn(deleteBoardApp, 'delete')
              .mockReturnValueOnce(false as any);
            return request(app.getHttpServer())
              .delete(`/boards/${board._id}`)
              .set('Authorization', `Bearer ${accessToken}`)
              .expect(400);
          });
        });
      });
      describe('and I get a board', () => {
        describe('and it is found', () => {
          it('should return the requested board', () => {
            return request(app.getHttpServer())
              .get(`/boards/${board._id}`)
              .set('Authorization', `Bearer ${accessToken}`)
              .expect(200);
          });
        });
        describe('and it is not found', () => {
          it('should return an exception', () => {
            jest
              .spyOn(getBoardApp, 'getBoard')
              .mockReturnValueOnce(null as any);
            return request(app.getHttpServer())
              .get(`/boards/${board._id}`)
              .set('Authorization', `Bearer ${accessToken}`)
              .expect(400);
          });
        });
      });
      describe('and I get all of my boards', () => {
        describe('and they are found', () => {
          it('should return an array with boards', async () => {
            const res = await request(app.getHttpServer())
              .get(`/boards`)
              .set('Authorization', `Bearer ${accessToken}`)
              .expect(200);
            expect(res.body.length).toBeGreaterThan(1);
          });
        });
        describe('and they are not found', () => {
          it('should return an array with zero boards', async () => {
            jest
              .spyOn(getBoardApp, 'getAllBoards')
              .mockReturnValueOnce([] as any);
            const res = await request(app.getHttpServer())
              .get(`/boards`)
              .set('Authorization', `Bearer ${accessToken}`)
              .expect(200);
            expect(res.body).toHaveLength(0);
          });
        });
      });
    });
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });
});
