/* eslint-disable @typescript-eslint/no-throw-literal */
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import AuthController from '../../../src/modules/auth/controller/auth.controller';
import mockedUser from '../../../src/libs/test-utils/mocks/user/user.mock';
import { TYPES } from '../../../src/modules/auth/interfaces/types';
import LocalStrategy from '../../../src/modules/auth/strategy/local.strategy';
import {
  createUserService,
  getUserService,
  updateUserService,
} from '../../../src/modules/users/users.providers';
import LocalAuthGuard from '../../../src/libs/guards/localAuth.guard';
import { ValidateUserAuthService } from '../../../src/modules/auth/interfaces/services/validate-user.auth.service.interface';
import JwtRefreshTokenStrategy from '../../../src/modules/auth/strategy/refresh.strategy';
import AppConfigModule from '../../../src/infrastructure/config/config.module';
import { JwtRegister } from '../../../src/infrastructure/config/jwt.register';
import {
  mongooseBoardModule,
  mongooseUserModule,
} from '../../../src/infrastructure/database/mongoose.module';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../../src/libs/test-utils/mongoose.test.module';
import {
  getTokenAuthApplication,
  getTokenAuthService,
  registerAuthApplication,
  registerAuthService,
  validateUserAuthService,
} from '../../../src/modules/auth/auth.providers';
import { RegisterAuthApplication } from '../../../src/modules/auth/interfaces/applications/register.auth.application.interface';
import { uniqueViolation } from '../../../src/infrastructure/database/errors/unique.user';
import { GetTokenAuthService } from '../../../src/modules/auth/interfaces/services/get-token.auth.service.interface';

describe('AuthController', () => {
  let app: INestApplication;
  let validateAuthService: ValidateUserAuthService;
  let registerAuthApp: RegisterAuthApplication;
  let getTokenAuthSrvice: GetTokenAuthService;
  let token = '';
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AppConfigModule,
        JwtRegister,
        rootMongooseTestModule(),
        mongooseBoardModule,
        mongooseUserModule,
      ],
      controllers: [AuthController],
      providers: [
        LocalAuthGuard,
        LocalStrategy,
        JwtRefreshTokenStrategy,
        registerAuthApplication,
        registerAuthService,
        createUserService,
        getUserService,
        validateUserAuthService,
        getTokenAuthApplication,
        getTokenAuthService,
        updateUserService,
      ],
    }).compile();
    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    validateAuthService = module.get(TYPES.services.ValidateAuthService);
    getTokenAuthSrvice = module.get(TYPES.services.GetTokenAuthService);
    registerAuthApp = module.get(TYPES.applications.RegisterAuthApplication);
    await app.init();
  });

  describe('when registering', () => {
    describe('and using valid data', () => {
      it('should respond with the user data without the password', async () => {
        const res = await request(app.getHttpServer())
          .post('/auth/register')
          .send(mockedUser)
          .expect(201);
        expect(res.body.password).toBeUndefined();
      });
    });

    describe('and the user already exists', () => {
      it('should throw an error', () => {
        jest.spyOn(registerAuthApp, 'register').mockImplementation(() => {
          throw { code: uniqueViolation };
        });
        return request(app.getHttpServer())
          .post('/auth/register')
          .send(mockedUser)
          .expect(400);
      });
    });
    describe('and the user creation fail', () => {
      it('should throw an exception', async () => {
        jest.spyOn(registerAuthApp, 'register').mockImplementation(() => {
          throw new Error('Error');
        });
        await request(app.getHttpServer())
          .post('/auth/register')
          .send({ ...mockedUser, email: 'newEmail@email.com' })
          .expect(400);
      });
    });
  });

  describe('when try to login', () => {
    describe('and the credentials are valid', () => {
      it('should return the user info with tokens', async () => {
        const res = await request(app.getHttpServer())
          .post('/auth/login')
          .send({
            email: mockedUser.email,
            password: mockedUser.password,
          });

        expect(res.body.name).toBe(mockedUser.name);
        expect(res.body.email).toBe(mockedUser.email);
        expect(res.body.accessToken).toBeDefined();
        expect(res.body.refreshToken).toBeDefined();
        token = res.body.refreshToken;
      });
    });
    describe('and the credentials are invalid', () => {
      it('should throw a exception as the user was not found', () => {
        jest
          .spyOn(validateAuthService, 'validateUserWithCredentials')
          .mockReturnValueOnce(null as any);
        return request(app.getHttpServer())
          .post('/auth/login')
          .send({
            email: mockedUser.email,
            password: mockedUser.password,
          })
          .expect(401);
      });
    });
    describe('and the user is not updated', () => {
      it('should throw a exception', () => {
        jest
          .spyOn(getTokenAuthSrvice, 'getTokens')
          .mockReturnValueOnce(null as any);
        return request(app.getHttpServer())
          .post('/auth/login')
          .send({
            email: mockedUser.email,
            password: mockedUser.password,
          })
          .expect(404);
      });
    });
  });

  describe('should call the refresh method', () => {
    describe('and the header is valid', () => {
      it('should return a new access token', async () => {
        const res = await request(app.getHttpServer())
          .get('/auth/refresh')
          .set('Authorization', `Bearer ${token}`);
        expect(res.body.refreshToken).not.toEqual(token);
      });
    });
    describe('and the header is not valid', () => {
      it('should return a exception', async () => {
        jest
          .spyOn(validateAuthService, 'validateUserByRefreshToken')
          .mockReturnValueOnce(null as any);
        const res = await request(app.getHttpServer())
          .get('/auth/refresh')
          .set('Authorization', `Bearer ${token}`);

        expect(res.body.refreshToken).not.toEqual(token);
      });
    });
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });
});
