import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { AuthController } from './auth.controller';
import { UserEntity } from '../users/entity/user.entity';
import { mockedUser } from '../mocks/user.mock';
import { AuthService } from '../auth/auth.service';
import { ConfigService } from '@nestjs/config';
import * as request from 'supertest';

describe('AuthController', () => {
  let app: INestApplication;
  let userData: UserEntity;

  beforeEach(async () => {
    userData = {
      ...mockedUser,
    };

    const usersRepository = {
      create: jest.fn().mockResolvedValue(userData),
      save: jest.fn().mockReturnValue(Promise.resolve()),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        UsersService,
        AuthService,
        ConfigService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: usersRepository,
        },
      ],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  describe('when registering', () => {
    describe('and using valid data', () => {
      it('should respond with the data of the user without the password', () => {
        const expectedData = {
          ...userData,
        };
        delete expectedData.password;
        return request(app.getHttpServer())
          .post('/auth/register')
          .send({
            email: mockedUser.email,
            username: mockedUser.username,
            password: 'strongPassword',
          })
          .expect(201)
          .expect(expectedData);
      });
    });
    describe('and using invalid data', () => {
      it('should throw an error', () => {
        return request(app.getHttpServer())
          .post('/auth/register')
          .send({
            name: mockedUser.username,
          })
          .expect(400);
      });
    });
  });
});
